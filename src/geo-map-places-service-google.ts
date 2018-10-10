import * as Types from './types';
import { GeoMap } from './geo-map';
import { GeoMapPlacesResult } from './geo-map-places-service';

export class GeoMapPlacesServiceGoogle
  implements Types.GeoMapPlacesServiceImplementation {
  private api: Types.GoogleApi;
  private map: GeoMap;

  public static create(init: {
    api: Types.GoogleApi;
    map: GeoMap;
  }): GeoMapPlacesServiceGoogle {
    return new GeoMapPlacesServiceGoogle(init);
  }

  private constructor(init: { api: Types.GoogleApi; map: GeoMap }) {
    this.api = init.api;
    this.map = init.map;
  }

  public async get(placeId: string): Promise<Types.Result<Types.GeoPlace>> {
    return new Promise<Types.Result<Types.GeoPlace>>(resolve => {
      const container = document.createElement('div');
      const service = new this.api.places.PlacesService(container);

      service.getDetails({ placeId }, result => {
        // TODO: transform to facade result
      });
    });
  }

  public async search(
    needle: string
  ): Promise<Types.Result<GeoMapPlacesResult[]>> {
    const container = document.createElement('div');
    const service = new this.api.places.PlacesService(container);

    const request: google.maps.places.FindPlaceFromQueryRequest = {
      query: needle,
      fields: ['formatted_address', 'name', 'place_id', 'geometry'],
      locationBias: {
        center: await this.map.getCenter(),
        radius: 50000
      }
    };

    return new Promise<Types.Result<GeoMapPlacesResult[]>>(resolve => {
      try {
        service.findPlaceFromQuery(request, (results, status) => {
          if (status === this.api.places.PlacesServiceStatus.OK) {
            return resolve({
              type: Types.ResultType.Success,
              payload: results.map(result => this.convertResult(result))
            });
          } else if (
            // empty result cases
            status === this.api.places.PlacesServiceStatus.ZERO_RESULTS ||
            status === this.api.places.PlacesServiceStatus.NOT_FOUND
          ) {
            return resolve({
              type: Types.ResultType.Success,
              payload: []
            });
          }
          return resolve({
            type: Types.ResultType.Failure,
            error: new Error('Query status ' + status)
          });
        });
      } catch (error) {
        return resolve({
          type: Types.ResultType.Failure,
          error
        });
      }
    });
  }

  private convertResult(
    result: google.maps.places.PlaceResult
  ): GeoMapPlacesResult {
    return {
      name: result.name,
      placeId: result.place_id,
      location: result.geometry.location.toJSON()
    };
  }
}
