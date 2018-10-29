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

  public search(
    needle: string,
    center: Types.GeoPoint,
    radius?: number
  ): Promise<Types.Result<Types.GeoMapPlace[]>> {
    return new Promise((resolve, reject) => {
      const service = this.platform.getPlacesService();

      const point = [center.lat, center.lng].join(',');

      const params =
        typeof radius !== 'undefined'
          ? { in: `${point};r=${radius}` }
          : { at: point };

      service.request(
        this.api.service.PlacesService.EntryPoint.SEARCH,
        { q: needle, ...params },
        response => {
          const { results } = response;

          if (typeof results === 'undefined' || !Array.isArray(results.items)) {
            resolve(Result.createSuccess([]));
          }

          const places = results.items.map(item => ({
            provider: Types.GeoMapProvider.Here,
            id: item.id,
            name: item.title,
            formattedAddress: item.vicinity,
            location: {
              lat: item.position[0],
              lng: item.position[1]
            }
          }));

          resolve(Result.createSuccess(places));
        },
        serviceError => resolve(Result.createFailure(serviceError))
      );
    });
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
