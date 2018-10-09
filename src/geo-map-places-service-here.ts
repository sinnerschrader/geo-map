import * as Result from './result';
import * as Types from './types';

export class GeoMapPlacesServiceHere
  implements Types.GeoMapPlacesServiceImplementation {
  private platform: H.service.Platform;

  public static create(init: {
    api: Types.HereApi;
    platform: H.service.Platform;
  }): GeoMapPlacesServiceHere {
    return new GeoMapPlacesServiceHere(init);
  }

  private constructor(init: {
    api: Types.HereApi;
    platform: H.service.Platform;
  }) {
    this.platform = init.platform;
  }

  public async get(id: string): Promise<Types.Result<Types.GeoPlace>> {
    return new Promise<Types.Result<Types.GeoPlace>>(resolve => {
      const service = this.platform.getPlacesService();

      // tslint:disable-line:no-any
      service.request(
        ('places/lookup' as any) as H.service.PlacesService.EntryPoint,
        { id, source: 'pvid' },
        result => {
          // TODO: transform to facade result
        },
        serviceError => resolve(Result.createFailure(serviceError))
      );
    });
  }

  // todo: any
  public async search(needle: string): Promise<any> {
    throw new Error('Unimplemented');
  }
}
