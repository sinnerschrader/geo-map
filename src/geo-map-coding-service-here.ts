import * as Result from './result';
import * as Types from './types';
import * as HereTypes from './here-types';

export class GeoMapCodingServiceHere
  implements Types.GeoMapCodingServiceImplementation {
  private platform: H.service.Platform;

  public static create(init: {
    api: Types.HereApi;
    platform: H.service.Platform;
  }): GeoMapCodingServiceHere {
    return new GeoMapCodingServiceHere(init);
  }

  private constructor(init: {
    api: Types.HereApi;
    platform: H.service.Platform;
  }) {
    this.platform = init.platform;
  }

  public async reverse(
    location: Types.GeoPoint
  ): Promise<Types.Result<Types.GeoMapPlaceDetails[]>> {
    return new Promise<Types.Result<Types.GeoMapPlaceDetails[]>>(resolve => {
      const service = this.platform.getGeocodingService();

      service.reverseGeocode(
        {
          pos: `${location.lat},${location.lng},0`,
          locationattributes: 'ar',
          mode: 'retrieveAddresses',
          prox: `${location.lat},${location.lng},0`,
          jsonattributes: '1'
        },
        serviceResult => {
          if (!serviceResult.response) {
            resolve(Result.createFailure(new Error(serviceResult.details)));
          }

          // tslint:disable-next-line
          const response = (serviceResult.response as any) as {
            view: { result: HereTypes.Place[] }[];
          };
          const container = response.view[0];

          if (!container) {
            return resolve(Result.createSuccess([]));
          }

          resolve(
            Result.createSuccess(
              container.result
                .map(herePlaceToGeoPlace)
                .filter(place => typeof place.id === 'string')
            )
          );
        },
        serviceError => resolve(Result.createFailure(serviceError))
      );
    });
  }
}

function herePlaceToGeoPlace(
  herePlace: HereTypes.Place
): Types.GeoMapPlaceDetails {
  return {
    provider: Types.GeoMapProvider.Here,
    id: herePlace.location.mapReference.addressId,
    formattedAddress: herePlace.location.address.label,
    address: {
      country: herePlace.location.address.country,
      locality: herePlace.location.address.city,
      route: herePlace.location.address.street,
      streetNumber: herePlace.location.address.houseNumber,
      postalCode: herePlace.location.address.postalCode
    }
  };
}
