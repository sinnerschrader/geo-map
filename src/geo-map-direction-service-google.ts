import * as Types from './types';
import { GeoMapGoogle } from './geo-map-google';
import { GeoMapDirectionResult } from './types';

export class GeoMapDirectionServiceGoogle
  implements Types.GeoMapDirectionServiceImplementation {
  private readonly implementation: GeoMapGoogle;
  private readonly api: Types.GoogleApi;

  public static create(init: {
    api: Types.GoogleApi;
    map: Types.GeoMapImplementation;
  }): GeoMapDirectionServiceGoogle {
    return new GeoMapDirectionServiceGoogle(init);
  }

  private constructor(init: {
    api: Types.GoogleApi;
    map: Types.GeoMapImplementation;
  }) {
    this.api = init.api;
    this.implementation = init.map as GeoMapGoogle;
  }

  public async paintRoute(
    from: Types.GeoPoint,
    to: Types.GeoPoint
  ): Promise<GeoMapDirectionResult> {
    return new Promise<GeoMapDirectionResult>(resolve => {
      const directionsService = new google.maps.DirectionsService();

      const config = {
        origin: from,
        destination: to,
        travelMode: google.maps.TravelMode.DRIVING
      };

      directionsService.route(config, results => {
        const [route] = results.routes;

        const path = route.legs.reduce(
          (p, leg) => leg.steps.reduce((ps, s) => [...ps, ...s.path], p),
          []
        );

        const lineBackground = new google.maps.Polyline({
          path,
          strokeColor: 'rgb(51, 121, 195)',
          strokeOpacity: 1.0,
          strokeWeight: 8
        });

        const lineForegroud = new google.maps.Polyline({
          path,
          strokeColor: 'rgb(0, 179, 253)',
          strokeOpacity: 1.0,
          strokeWeight: 5
        });

        lineBackground.setMap(this.implementation.map);
        lineForegroud.setMap(this.implementation.map);

        resolve({
          start: route.legs[0].start_location.toJSON(),
          end: route.legs[route.legs.length - 1].end_location.toJSON()
        });
      });
    });
  }
}
