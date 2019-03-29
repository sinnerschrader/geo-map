import * as Result from './result';
import * as Types from './types';
import { GeoMapGoogle } from './geo-map-google';

export class GeoMarkerGoogle implements Types.GeoMarkerImplementation {
  private readonly implementation: GeoMapGoogle;
  private iconMarkup: string;
  private marker: google.maps.Marker;

  private anchor: Types.GeoMarkerAnchor = {
    vertical: Types.GeoMarkerOrientation.Middle,
    horizontal: Types.GeoMarkerOrientation.Middle
  };

  public static create(
    config: Types.GeoMarkerConfig,
    context: Types.GoogleMarkerContext
  ): GeoMarkerGoogle {
    return new GeoMarkerGoogle(config, context);
  }

  private constructor(
    config: Types.GeoMarkerConfig,
    context: Types.GoogleMarkerContext
  ) {
    this.implementation = context.mapImplementation as GeoMapGoogle;
    this.iconMarkup = config.icon;

    if (config.anchor) {
      this.anchor = config.anchor;
    }

    const iconAnchor = getAnchor(this.anchor, config.icon);

    this.marker = new this.implementation.api.Marker({
      position: config.position,
      map: this.implementation.map,
      icon: {
        anchor: iconAnchor
          ? new this.implementation.api.Point(iconAnchor.x, iconAnchor.y)
          : undefined,
        url: `data:image/svg+xml;utf-8,${encodeURIComponent(config.icon)}`
      }
    });

    this.implementation.markers.push(this);
    this.implementation.fire(Types.GeoEvent.Changed);
  }

  public async getIcon(): Promise<string> {
    return this.iconMarkup;
  }

  public async setIcon(icon: string): Promise<Types.Result<void>> {
    this.iconMarkup = icon;

    this.marker.setIcon({
      anchor: new this.implementation.api.Point(16, 16),
      url: `data:image/svg+xml;utf-8,${encodeURIComponent(icon)}`
    });

    return Result.createSuccess();
  }

  public async setPosition(position: Types.GeoPoint): Promise<void> {
    this.marker.setPosition(position);
  }

  public async getPosition(): Promise<Types.GeoPoint> {
    const position = this.marker.getPosition();
    return {
      lat: position.lat(),
      lng: position.lng()
    };
  }

  public bindEvent(
    event: Types.GeoEvent,
    handler: () => void
  ): Types.GeoEventHandlerDisposer {
    const listener = this.marker.addListener(event, () => handler());

    return () => listener.remove();
  }

  public async remove(): Promise<void> {
    this.marker.setMap(null);
    this.implementation.markers.splice(
      this.implementation.markers.indexOf(this)
    );
    this.implementation.fire(Types.GeoEvent.Changed);
  }
}

function getOrientationRatio(orientation: Types.GeoMarkerOrientation): number {
  switch (orientation) {
    case Types.GeoMarkerOrientation.Start:
      return 0;
    case Types.GeoMarkerOrientation.End:
      return 1;
    case Types.GeoMarkerOrientation.Middle:
    default:
      return 0.5;
  }
}

function getAnchor(
  anchor: Types.GeoMarkerAnchor,
  icon: string
): { x: number; y: number } | undefined {
  if (typeof window === 'undefined') {
    return;
  }

  const wRatio = getOrientationRatio(anchor.horizontal);
  const hRatio = getOrientationRatio(anchor.vertical);
  const parser = new DOMParser();

  const doc = parser.parseFromString(icon, 'image/svg+xml');
  const rootElement = doc.documentElement;

  if (!rootElement) {
    return;
  }

  const width = parseInt(rootElement.getAttribute('width')!, 10);
  const height = parseInt(rootElement.getAttribute('height')!, 10);
  return { x: wRatio * width, y: hRatio * height };
}
