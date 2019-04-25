// tslint:disable:max-classes-per-file
// tslint:disable:no-any

export const createGoogleMock = (): any => {
  class GoogleMockProjection {
    public fromContainerPixelToLatLng(pixel: { x: number; y: number }): any {
      return {
        lat: () => pixel.x / 10,
        lng: () => pixel.y / 10
      };
    }
    public fromLatLngToContainerPixel(latlng: {
      lat(): number;
      lng(): number;
    }): any {
      return {
        x: latlng.lng() * 10,
        y: latlng.lat() * 10
      };
    }
  }

  class GoogleMockOverlayView {
    public onAdd(): void {
      /** */
    }
    public setMap(): void {
      this.onAdd();
    }
    public getProjection(): GoogleMockProjection {
      return new GoogleMockProjection();
    }
  }

  class GoogleMockLatLng {
    public lat: () => number;
    public lng: () => number;

    public constructor(lat: number, lng: number) {
      this.lat = () => lat;
      this.lng = () => lng;
    }
  }

  class GoogleMockLatLngBounds {
    private north: number;
    private east: number;
    private south: number;
    private west: number;

    public constructor(sw: any, ne: any) {
      this.north = ne.lat();
      this.east = ne.lng();
      this.south = sw.lat();
      this.west = sw.lng();
    }

    public toJSON(): any {
      return {
        north: this.north,
        east: this.east,
        south: this.south,
        west: this.west
      };
    }

    public contains(point: { lat: number; lng: number }): boolean {
      return (
        point.lat <= this.north &&
        point.lat >= this.south &&
        point.lng <= this.west &&
        point.lng >= this.east
      );
    }
  }

  class GoogleMockLayer {
    public setMap(): void {
      /** */
    }
  }

  class GoogleMockPoint {}

  class GoogleMockMarker {
    public setMap(): void {
      /** */
    }
  }

  class GoogleMockSize {
    /** */
  }

  class GoogleMockMap {
    private el: HTMLElement;

    private listeners: Map<string, (e: any) => void> = new Map();
    private handlers: Map<string, ((e: any) => void)[]> = new Map();

    private center: { lat: number; lng: number };
    private zoom: number;
    private mapTypeId: string;

    public constructor(el: any, init: any) {
      this.el = el;
      this.center = init.center;
      this.zoom = init.zoom;
      this.mapTypeId = init.mapTypeId;
    }

    private fire(eventName: string, e?: Event): void {
      (this.handlers.get(eventName) || []).forEach(h => h(e));
    }

    public addListener(eventName: string, handler: () => void): void {
      if (!this.listeners.has(eventName)) {
        const listener = (e: any) => this.fire(eventName, e);
        this.listeners.set(eventName, listener);
        this.el.addEventListener(eventName, listener);
        this.handlers.set(eventName, [handler]);
        return;
      }

      const previous = this.handlers.get(eventName) || [];
      this.handlers.set(eventName, [...previous, handler]);
    }

    public setCenter(point: any): void {
      this.center = point;
      this.fire('center_changed');
    }

    public getCenter(): { lat(): number; lng(): number } {
      return {
        lat:
          typeof this.center.lat === 'function'
            ? this.center.lat
            : () => this.center.lat,
        lng:
          typeof this.center.lng === 'function'
            ? this.center.lng
            : () => this.center.lng
      };
    }

    public setZoom(zoom: number): void {
      this.zoom = zoom;
      this.fire('zoom_changed');
    }

    public getZoom(): number {
      return this.zoom;
    }

    public getMapTypeId(): string {
      return this.mapTypeId;
    }

    public setMapTypeId(mapTypeId: string): void {
      this.mapTypeId = mapTypeId;
      this.fire('maptypeid_changed');
    }

    public getBounds(): GoogleMockLatLngBounds {
      return new GoogleMockLatLngBounds(
        new GoogleMockLatLng(-1, 1),
        new GoogleMockLatLng(1, -1)
      );
    }
  }

  return {
    event: {
      addListenerOnce(map: any, event: string, cb: () => void) {
        setTimeout(() => cb(), 100);
      }
    },
    LatLng: GoogleMockLatLng,
    LatLngBounds: GoogleMockLatLngBounds,
    Map: GoogleMockMap,
    OverlayView: GoogleMockOverlayView,
    MapTypeId: {
      ROADMAP: 'ROADMAP'
    },
    TransitLayer: GoogleMockLayer,
    TrafficLayer: GoogleMockLayer,
    Point: GoogleMockPoint,
    Marker: GoogleMockMarker,
    Size: GoogleMockSize
  };
};
