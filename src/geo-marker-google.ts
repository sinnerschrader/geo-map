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

    this.marker = new this.implementation.api.Marker({
      position: config.position,
      map: this.implementation.map,
      icon: this.getIconConfig()
    });

    this.implementation.markers.push(this);
    this.implementation.fire(Types.GeoEvent.Changed);
  }

  public async getIcon(): Promise<string> {
    return this.iconMarkup;
  }

  public async setIcon(icon: string): Promise<Types.Result<void>> {
    this.iconMarkup = icon;

    this.marker.setIcon(this.getIconConfig());

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

  private getIconConfig() {
    const size = this.getIconSize();
    const config = {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
        this.iconMarkup
      )}`
    };

    if (size) {
      Object.assign(config, {
        anchor: this.getAnchorPoint(size),
        scaledSize: new this.implementation.api.Size(size.width, size.height)
      });
    }

    return config;
  }

  private getIconSize(): void | { width: number; height: number } {
    const dom = new DOMParser().parseFromString(
      this.iconMarkup,
      'application/xml'
    );
    let height: number = NaN;
    let width: number = NaN;

    if (!dom.documentElement || !dom.documentElement.attributes) {
      return;
    }

    Array.from(dom.documentElement.attributes).forEach(attr => {
      switch (attr.name.toLowerCase()) {
        case 'height':
          height = parseInt(attr.value, 10);
          break;
        case 'width':
          width = parseInt(attr.value, 10);
          break;
      }
    });

    if (!isNaN(height) && !isNaN(width)) {
      return { height, width };
    }
  }

  private getAnchorPoint(size: {
    width: number;
    height: number;
  }): void | google.maps.Point {
    if (typeof window !== 'undefined') {
      return new this.implementation.api.Point(
        size.width * getOrientationRatio(this.anchor.horizontal),
        size.height * getOrientationRatio(this.anchor.vertical)
      );
    }
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
