import { GeoMapPlacesService } from '../geo-map-places-service';

// tslint:disable:max-classes-per-file
// tslint:disable:no-any

export const createHMock = (): any => {
  class NormalMap {}
  class SatteliteMap {}
  class TerrainMap {}

  const Rect = jest
    .fn()
    .mockImplementation(
      (top: number, left: number, bottom: number, right: number) => ({
        getTop(): number {
          return top;
        },
        getRight(): number {
          return right;
        },
        getBottom(): number {
          return bottom;
        },
        getLeft(): number {
          return left;
        },
        containsLatLng(lat: number, lng: number): boolean {
          return lat <= top && lat >= bottom && lng <= right && lng >= left;
        }
      })
    );

  const Anchor = jest.fn().mockImplementation(() => {
    let ix: any;
    let iy: any;

    return {
      x: ix,
      y: iy,
      set(x: number, y: number): void {
        ix = x;
        iy = y;
      }
    };
  });

  const Icon = jest.fn().mockImplementation(() => {
    return {
      addEventListener(name: string, cb: () => void): void {
        cb();
      },
      getAnchor(): any {
        return new Anchor();
      },
      getState(): number {
        return 1;
      },
      getSize(): { h: number; w: number } {
        return { h: 32, w: 32 };
      }
    };
  });

  Icon.prototype.State = {
    ERROR: -1,
    LOADING: 0,
    READY: 1
  };

  const Marker = jest.fn().mockImplementation(() => {
    let icon: any;

    return {
      getIcon(): any {
        return icon;
      },
      setIcon(i: any): void {
        icon = i;
      }
    };
  });

  const HereMockMap = jest
    .fn()
    .mockImplementation((el, baseLayer: H.map.layer.TileLayer, init = {}) => {
      const listeners = new Map();
      const handlers = new Map();

      let zoom = init.zoom || 0;
      let center = init.center;

      const fire = (eventName: string, e?: Event) => {
        const hs = handlers.get(eventName) || [];
        hs.forEach((h: any) => h(e));
      };

      return {
        addEventListener(eventName: string, handler: () => void): void {
          if (!listeners.has(eventName)) {
            const listener = (e: any) => fire(eventName, e);
            listeners.set(eventName, listener);
            el.addEventListener(hereToDomEvent(eventName), listener);
            handlers.set(eventName, [handler]);
            return;
          }

          const previous = handlers.get(eventName) || [];
          handlers.set(eventName, [...previous, handler]);
        },
        addObject(): void {
          /** */
        },
        removeObject(): void {
          /** */
        },
        getBaseLayer(): H.map.layer.TileLayer {
          return baseLayer;
        },
        setCenter(c: any): void {
          center = c;
          fire('mapviewchange');
          fire('mapviewchangeend');
        },
        // tslint:disable-next-line:no-any
        setBaseLayer(b: any): void {
          baseLayer = b;
          // Does not fire for setBaseLayer
          // fire('mapviewchangeend')
        },
        getCenter(): any {
          return center;
        },
        getZoom(): any {
          return zoom;
        },
        setZoom(z: number): void {
          zoom = z;
          fire('mapviewchange');
          fire('mapviewchangeend');
        },
        screenToGeo(x: number, y: number): any {
          return { lat: y, lng: x };
        },
        getViewBounds(): any {
          return new Rect(1, -1, -1, 1);
        }
      };
    });

  const MapEvents = jest.fn().mockImplementation(() => {
    return {};
  });

  const Behavior = jest.fn().mockImplementation(() => {
    return {};
  });

  const Platform = jest.fn().mockImplementation(() => {
    return {
      createDefaultLayers: jest.fn().mockImplementation(() => {
        return {
          normal: {
            map: NormalMap
          },
          satellite: {
            map: SatteliteMap
          },
          terrain: {
            map: TerrainMap
          }
        };
      })
    };
  });

  return {
    geo: {
      Rect
    },
    Map: HereMockMap,
    mapevents: {
      Behavior,
      MapEvents
    },
    map: {
      Icon,
      Marker
    },
    service: {
      Platform
    }
  };
};

function hereToDomEvent(input: string): string | undefined {
  switch (input) {
    case 'tap':
      return 'click';
    default:
      return input;
  }
}
