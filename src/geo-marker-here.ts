import * as Result from './result';
import * as Types from './types';
import { GeoMapHere } from './geo-map-here';

export class GeoMarkerHere implements Types.GeoMarkerImplementation {
  private implementation: GeoMapHere;

  // private context: Types.GeoMapContext | undefined;
  private iconMarkup: string;
  private icon: H.map.Icon;
  private marker: H.map.Marker;

  private anchor: Types.GeoMarkerAnchor = {
    vertical: Types.GeoMarkerOrientation.Middle,
    horizontal: Types.GeoMarkerOrientation.Middle
  };

  public static create(
    config: Types.GeoMarkerConfig,
    context: Types.HereMarkerContext
  ): GeoMarkerHere {
    return new GeoMarkerHere(config, context);
  }

  private constructor(
    config: Types.GeoMarkerConfig,
    context: Types.HereMarkerContext
  ) {
    this.implementation = context.mapImplementation as GeoMapHere;

    this.marker = new this.implementation.api.map.Marker(config.position);

    if (config.anchor) {
      this.anchor = config.anchor;
    }

    this.setIcon(config.icon);
    this.implementation.map.addObject(this.marker);

    this.implementation.markers.push(this);
    this.implementation.fire(Types.GeoEvent.Changed);
  }

  public async getIcon(): Promise<string> {
    return this.iconMarkup;
  }

  public setIcon(icon: string): Promise<Types.Result<void>> {
    return new Promise(resolve => {
      this.iconMarkup = icon;
      this.icon = new this.implementation.api.map.Icon(icon);
      this.marker.setIcon(this.icon);

      // tslint:disable-next-line:no-any
      const IconState = ((this.implementation.api.map.Icon
        .prototype as any) as typeof H.map.Icon).State;

      const onChange = () => {
        const result = Result.createResult();

        if (this.icon.getState() === IconState.READY) {
          const size = this.icon.getSize();
          const anchor = this.icon.getAnchor();
          const wRatio = getOrientationRatio(this.anchor.horizontal);
          const hRatio = getOrientationRatio(this.anchor.vertical);
          anchor.set(size.w * wRatio, size.h * hRatio);
          Result.toSuccess(result, {});
        }

        if (this.icon.getState() === IconState.ERROR) {
          Result.toFailure(result, new Error(`Failed loading marker icon`));
        }

        resolve(result);
        this.icon.removeEventListener('statechange', onChange);
      };

      this.icon.addEventListener('statechange', onChange);
    });
  }

  public async setPosition(position: Types.GeoPoint): Promise<void> {
    this.marker.setPosition(position);
  }

  public async getPosition(): Promise<Types.GeoPoint> {
    const position = this.marker.getPosition();
    return {
      lat: position.lat,
      lng: position.lng
    };
  }

  public bindEvent(
    event: Types.GeoEvent,
    handler: () => void
  ): Types.GeoEventHandlerDisposer {
    const hereEventName = event === Types.GeoEvent.Click ? 'tap' : event;
    const hereHandler = (event: H.util.Event) => {
      event.stopPropagation();
      event.preventDefault();

      handler();
    };

    this.marker.addEventListener(hereEventName, hereHandler);

    return () => this.marker.removeEventListener(hereEventName, hereHandler);
  }

  public async remove(): Promise<void> {
    this.implementation.map.removeObject(this.marker);
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
