import * as Types from './types';

export class GeoMapPlacesServiceGoogle
  implements Types.GeoMapPlacesServiceImplementation {
  private api: Types.GoogleApi;

  public static create(init: {
    api: Types.GoogleApi;
  }): GeoMapPlacesServiceGoogle {
    return new GeoMapPlacesServiceGoogle(init);
  }

  private constructor(init: { api: Types.GoogleApi }) {
    this.api = init.api;
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

  // todo: any
  public async search(needle: string): Promise<any> {
    return new Promise(resolve => {
      resolve();
    });
  }
}
