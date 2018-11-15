import * as Types from './types';
import { GeoMapHere } from './geo-map-here';

export class GeoMapDirectionServiceHere
  implements Types.GeoMapDirectionServiceImplementation {
  private platform: H.service.Platform;
  private api: Types.HereApi;
  private mapImplementation: GeoMapHere;

  private lines: H.map.Polyline[] = [];

  public static create(init: {
    api: Types.HereApi;
    platform: H.service.Platform;
    map: Types.GeoMapImplementation;
  }): GeoMapDirectionServiceHere {
    return new GeoMapDirectionServiceHere(init);
  }

  private constructor(init: {
    api: Types.HereApi;
    platform: H.service.Platform;
    map: Types.GeoMapImplementation;
  }) {
    this.platform = init.platform;
    this.api = init.api;
    this.mapImplementation = init.map as GeoMapHere;
  }

  public async paintRoute(
    from: Types.GeoPoint,
    to: Types.GeoPoint
  ): Promise<Types.GeoMapDirectionResult> {
    return new Promise<Types.GeoMapDirectionResult>((resolve, reject) => {
      const directionsService = this.platform.getRoutingService();

      const config = {
        mode: 'fastest;car',
        waypoint0: `geo!${from.lat},${from.lng}`,
        waypoint1: `geo!${to.lat},${to.lng}`,
        representation: 'display',
        routingParameters: 'display'
      };

      directionsService.calculateRoute(
        config,
        (result: H.service.ServiceResult) => {
          if (!result.response || !result.response.route) {
            return reject(new Error('No response'));
          }

          const [route] = result.response.route;

          const path = route.shape.reduce(
            (p: [number, number, any], point: string) => [
              ...p,
              ...point.split(',').map(c => parseFloat(c)),
              undefined
            ],
            []
          );

          const lineBackground = new H.map.Polyline(
            new H.geo.LineString(path),
            {
              style: {
                lineWidth: 6,
                strokeColor: 'rgb(255, 255, 255)'
              }
            }
          );
          this.lines.push(lineBackground);

          const lineForegroud = new H.map.Polyline(new H.geo.LineString(path), {
            style: {
              lineWidth: 4,
              strokeColor: 'rgb(44, 72, 161)'
            }
          });
          this.lines.push(lineForegroud);

          this.mapImplementation.map.addObject(lineBackground);
          this.mapImplementation.map.addObject(lineForegroud);

          resolve({
            start: {
              lat: route.waypoint[0].mappedPosition.latitude,
              lng: route.waypoint[0].mappedPosition.longitude
            },
            end: {
              lat: route.waypoint[1].mappedPosition.latitude,
              lng: route.waypoint[1].mappedPosition.longitude
            }
          });
        },
        (error: Error) => {
          reject(error);
        }
      );
    });
  }

  public async clear(): Promise<void> {
    while (this.lines.length) {
      const line = this.lines.pop();
      this.mapImplementation.map.removeObject(line);
    }
  }
}
