import * as Result from './result';
import * as Types from './types';

export class GeoMapPlacesServiceHere
  implements Types.GeoMapPlacesServiceImplementation {
  private platform: H.service.Platform;
  private api: Types.HereApi;

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
    this.api = init.api;
  }

  public async get(
    id: string
  ): Promise<Types.Result<Types.GeoMapPlaceDetails>> {
    return new Promise<Types.Result<Types.GeoMapPlaceDetails>>(resolve => {
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

  public async search(
    needle: string,
    center: Types.GeoPoint,
    radius: number
  ): Promise<Types.Result<Types.GeoMapPlace[]>> {
    throw new Error('Method not implemented.');
  }

  public distanceBetween(
    from: Types.GeoPoint,
    to: Types.GeoPoint,
    radius?: number
  ): number {
    return new this.api.geo.Point(from.lat, from.lng).distance(
      new this.api.geo.Point(to.lat, to.lng)
    );
  }
}
