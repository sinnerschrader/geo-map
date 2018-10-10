import * as Types from './types';
import { GeoMap } from './geo-map';
import { ResultType } from './types';

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

  public async get(
    placeId: string
  ): Promise<Types.Result<Types.GeoMapPlaceDetails>> {
    return new Promise<Types.Result<Types.GeoMapPlaceDetails>>(resolve => {
      const container = document.createElement('div');
      const service = new this.api.places.PlacesService(container);

      service.getDetails({ placeId }, result => {
        // TODO: transform to facade result
      });
    });
  }

  public async search(
    needle: string
  ): Promise<Types.Result<Types.GeoMapPlace[]>> {
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

    return new Promise<Types.Result<Types.GeoMapPlace[]>>(resolve => {
      try {
        service.findPlaceFromQuery(request, (results, status) => {
          if (status === this.api.places.PlacesServiceStatus.OK) {
            return resolve({
              type: Types.ResultType.Success,
              payload: results.map(result => this.convertResult(result))
            });
          } else if (
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
  ): Types.GeoMapPlace {
    return {
      provider: Types.GeoMapProvider.Google,
      id: result.place_id,
      name: result.name,
      formattedAddress: result.formatted_address,
      location: result.geometry.location.toJSON()
    };
  }
}
