import { GeoMarkerGoogle } from './geo-marker-google';
import { GeoMapPhases } from './geo-map-phases';
import { GeoRectGoogle } from './geo-rect-google';
import { loadMapApi } from './load-map-api';
import * as Types from './types';

export interface GeoMapGoogleInit {
  context?: Types.GeoMapContext;
  config: Types.LoadGoogleMapConfig;
}

const DEFAULT_VIEWPORT = { top: 0, right: 0, bottom: 0, left: 0 };

export class GeoMapGoogle implements Types.GeoMapImplementation {
  public api: Types.GoogleApi;
  public map: google.maps.Map;
  public markers: GeoMarkerGoogle[] = [];

  private layer: [
    Types.GeoLayer,
    google.maps.TrafficLayer | google.maps.TransitLayer | undefined
  ] = [Types.GeoLayer.None, undefined];
  private loadResult: Promise<Types.LoadGoogleMapResult>;
  private context: Types.GeoMapContext;
  private config: Types.LoadGoogleMapConfig;
  private phases: GeoMapPhases = new GeoMapPhases();

  private handlers: Map<Types.GeoEvent, Types.GeoEventHandler[]> = new Map();

  public constructor(init: GeoMapGoogleInit) {
    this.context = init.context || { window };
    this.config = init.config;
    this.phases.resolve(Types.GeoMapPhase.Pristine);
  }

  public fire(eventName: Types.GeoEvent): void {
    const handlers = this.handlers.get(eventName) || [];
    handlers.forEach(h => h());
  }

  public async load(): Promise<Types.LoadGoogleMapResult> {
    this.phases.resolve(Types.GeoMapPhase.Loading);

    const load = this.context.load ? this.context.load : loadMapApi;

    this.loadResult = this.loadResult || load(this.config, this.context);
    const mapResult = await this.loadResult;

    if (mapResult.result.type === Types.ResultType.Success) {
      this.api = mapResult.result.payload;
    }

    this.phases.resolve(Types.GeoMapPhase.Loaded);
    return mapResult;
  }

  public async mount(
    el: HTMLElement,
    mountInit: Types.GeoMapMountInit
  ): Promise<void> {
    this.phases.resolve(Types.GeoMapPhase.Mounting);

    this.map = new this.api.Map(el, {
      center: mountInit.center,
      zoom: mountInit.zoom || 1,
      minZoom: this.config.minZoom,
      maxZoom: this.config.maxZoom,
      mapTypeId: typeToGoogleMapTypeId(
        mountInit.type || Types.GeoMapType.Roadmap,
        this.api
      ),
      disableDefaultUI: true
    });

    if (mountInit.layer) {
      this.setLayer(mountInit.layer);
    }

    this.phases.resolve(Types.GeoMapPhase.Mounted);
    this.phases.resolve(Types.GeoMapPhase.Layouting);

    await this.setCenter(mountInit.center);

    // Disable default POI click handling
    this.map.addListener('click', e => e.placeId && e.stop());

    await (this.context.loaded
      ? this.context.loaded(this.map, { api: this.api, context: this.context })
      : googleMapLoaded(this.map, { api: this.api, context: this.context }));

    this.api.event.addListenerOnce(this.map, 'tilesloaded', () => {
      this.phases.resolve(Types.GeoMapPhase.Layouted);
    });

    return;
  }

  public async phase(phase: Types.GeoMapPhase): Promise<void> {
    return this.phases.get(phase);
  }

  public async getCenter(): Promise<Types.GeoPoint> {
    const { viewport = DEFAULT_VIEWPORT } = this.config;
    await this.phase(Types.GeoMapPhase.Mounted);
    const projection = await getProjection(this.map, this.api);
    const apparentCenter = this.map.getCenter();
    const apparentPoint = projection.fromLatLngToContainerPixel(apparentCenter);
    apparentPoint.x += Math.abs(viewport.left - viewport.right) / 2;
    apparentPoint.y += Math.abs(viewport.top - viewport.bottom) / 2;

    const center = projection.fromContainerPixelToLatLng(apparentPoint);

    return {
      lat: center.lat(),
      lng: center.lng()
    };
  }

  public async setCenter(center: Types.GeoPoint): Promise<void> {
    const { viewport = DEFAULT_VIEWPORT } = this.config;
    await this.phase(Types.GeoMapPhase.Mounted);
    const projection = await getProjection(this.map, this.api);
    const latlng = new this.api.LatLng(center.lat, center.lng);
    const apparentPoint = projection.fromLatLngToContainerPixel(latlng);

    apparentPoint.x -= Math.abs(viewport.left - viewport.right) / 2;
    apparentPoint.y -= Math.abs(viewport.top - viewport.bottom) / 2;

    this.map.setCenter(projection.fromContainerPixelToLatLng(apparentPoint));
  }

  public async getMarkers(): Promise<GeoMarkerGoogle[]> {
    return this.markers;
  }

  public async getLayer(): Promise<Types.GeoLayer> {
    return this.layer[0];
  }

  public async setLayer(layer: Types.GeoLayer): Promise<void> {
    await this.phase(Types.GeoMapPhase.Mounted);
    const [current, googleLayer] = this.layer;

    if (current === layer) {
      return;
    }

    if (googleLayer) {
      googleLayer.setMap(null);
    }

    switch (layer) {
      case Types.GeoLayer.Traffic:
        this.layer = [layer, new this.api.TrafficLayer()];
        break;
      case Types.GeoLayer.Transit:
        this.layer = [layer, new this.api.TransitLayer()];
        break;
      case Types.GeoLayer.None:
      default:
        this.layer = [layer, undefined];
    }

    const [, newLayer] = this.layer;

    if (newLayer) {
      newLayer.setMap(this.map);
    }

    this.fire(Types.GeoEvent.Changed);
  }

  public async getType(): Promise<Types.GeoMapType> {
    await this.phase(Types.GeoMapPhase.Mounted);

    switch (this.map.getMapTypeId()) {
      case this.api.MapTypeId.HYBRID:
        return Types.GeoMapType.Hybrid;
      case this.api.MapTypeId.ROADMAP:
        return Types.GeoMapType.Roadmap;
      default:
        return Types.GeoMapType.Unknown;
    }
  }

  public async setType(type: Types.GeoMapType): Promise<void> {
    await this.phase(Types.GeoMapPhase.Mounted);
    this.map.setMapTypeId(typeToGoogleMapTypeId(type, this.api));
    this.fire(Types.GeoEvent.Changed);
  }

  public async getViewBounds(): Promise<Types.GeoBounds> {
    await this.phase(Types.GeoMapPhase.Mounted);
    const bounds = this.map.getBounds() as google.maps.LatLngBounds;
    const rect = GeoRectGoogle.from(bounds, { mapImplementation: this });
    return rect.getBounds();
  }

  public async setViewBounds(bounds: Types.GeoBounds): Promise<void> {
    await this.phase(Types.GeoMapPhase.Mounted);
    const rect = GeoRectGoogle.create(bounds, { mapImplementation: this });
    this.map.fitBounds(rect.toBounds(), this.config.viewport);
    this.fire(Types.GeoEvent.Changed);
  }

  public async setViewport(viewport: Types.GeoMapViewport): Promise<void> {
    const center = await this.getCenter();
    this.config.viewport = viewport;
    await this.setCenter(center);
    this.fire(Types.GeoEvent.Changed);
  }

  public async getZoom(): Promise<number> {
    await this.phase(Types.GeoMapPhase.Mounted);
    return this.map.getZoom();
  }

  public async setZoom(factor: number): Promise<void> {
    if (this.config.maxZoom && factor > this.config.maxZoom) {
      return;
    }
    if (this.config.minZoom && factor < this.config.minZoom) {
      return;
    }

    await this.phase(Types.GeoMapPhase.Mounted);
    this.map.setZoom(factor);
  }

  public async addEventListener(
    eventName: Types.GeoEvent.Click,
    handler: Types.GeoEventHandler<Types.GeoClickPayload>
  ): Promise<void>;
  public async addEventListener(
    eventName: Types.GeoEvent.Changed,
    handler: Types.GeoEventHandler<void>
  ): Promise<void>;
  public async addEventListener(
    eventName: Types.GeoEvent,
    handler: Types.GeoEventHandler
  ): Promise<void> {
    const previous = this.handlers.get(eventName) || [];
    this.handlers.set(eventName, [...previous, handler]);

    await this.phase(Types.GeoMapPhase.Mounted);
    const googleEventName = geoToGoogleEvent(eventName);

    if (eventName === 'changed') {
      this.map.addListener('bounds_changed', handler);
      this.map.addListener('zoom_changed', handler);
      this.map.addListener('center_changed', handler);
      this.map.addListener('maptypeid_changed', handler);
      return;
    }

    if (!googleEventName) {
      return;
    }

    // tslint:disable-next-line:no-any
    this.map.addListener(googleEventName, (e: any) => {
      if (eventName === Types.GeoEvent.Click) {
        const position = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        };

        handler({ position });
        return;
      }

      handler();
    });
  }

  public async coversLocation(point: Types.GeoPoint): Promise<boolean> {
    const rect = GeoRectGoogle.create(await this.getViewBounds(), {
      mapImplementation: this
    });
    return rect.coversLocation(point);
  }
}

function googleMapLoaded(
  map: google.maps.Map,
  { api }: { api: typeof google.maps; context: Types.GeoMapContext }
): Promise<void> {
  return new Promise(resolve =>
    api.event.addListenerOnce(map, 'idle', () => resolve())
  );
}

function typeToGoogleMapTypeId(
  type: Types.GeoMapType,
  api: typeof google.maps
): google.maps.MapTypeId {
  switch (type) {
    case Types.GeoMapType.Hybrid:
      return api.MapTypeId.HYBRID;
    case Types.GeoMapType.Roadmap:
    default:
      return api.MapTypeId.ROADMAP;
  }
}

function getProjection(
  map: google.maps.Map,
  api: Types.GoogleApi
): Promise<google.maps.MapCanvasProjection> {
  return new Promise((resolve, reject) => {
    try {
      const overlayView = new api.OverlayView();
      overlayView.draw = () => {
        /** */
      };
      overlayView.onAdd = () => resolve(overlayView.getProjection());
      overlayView.setMap(map);
    } catch (err) {
      reject(err);
    }
  });
}

function geoToGoogleEvent(input: Types.GeoEvent): string | undefined {
  switch (input) {
    case Types.GeoEvent.Click:
      return 'click';
    case Types.GeoEvent.Changed:
      return 'idle';
    case Types.GeoEvent.Loaded:
      return 'tilesloaded';
    default:
      return;
  }
}
