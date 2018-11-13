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
          locationattributes:
            'address,-mapView,additionalData,mapReference,adminIds',
          mode: 'retrieveAddresses',
          prox: `${location.lat},${location.lng},0`,
          jsonattributes: '1',
          responseattributes: 'ps,mq,mt,mc,pr'
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
  const address = herePlace.location.address;

  return {
    provider: Types.GeoMapProvider.Here,
    id: herePlace.location.locationId,
    formattedAddress: herePlace.location.address.label,
    address: {
      country: address.country,
      countryCode: undefined,
      county: address.county,
      district: address.district,
      state: address.state,
      postalCode: address.postalCode,
      locality: address.city,
      route: address.street,
      streetNumber: address.houseNumber
    }
  };
}
