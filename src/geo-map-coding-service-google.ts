import * as Result from './result';
import * as Types from './types';

export class GeoMapCodingServiceGoogle
  implements Types.GeoMapCodingServiceImplementation {
  private api: Types.GoogleApi;

  public static create(init: {
    api: Types.GoogleApi;
  }): GeoMapCodingServiceGoogle {
    return new GeoMapCodingServiceGoogle(init);
  }

  private constructor(init: { api: Types.GoogleApi }) {
    this.api = init.api;
  }

  public async reverse(
    location: Types.GeoPoint
  ): Promise<Types.Result<Types.GeoMapPlaceDetails[]>> {
    return new Promise<Types.Result<Types.GeoMapPlaceDetails[]>>(resolve => {
      const coder = new this.api.Geocoder();

      coder.geocode({ location }, (results, status) => {
        if (status !== google.maps.GeocoderStatus.OK) {
          return resolve(
            Result.createFailure(new Error(`Geocoding failed: ${status}`))
          );
        }

        resolve(Result.createSuccess(results.map(googleToGeoPlace)));
      });
    });
  }
}

function googleToGeoPlace(
  result: google.maps.GeocoderResult
): Types.GeoMapPlaceDetails {
  const byType = (type: AddressComponentType) =>
    getAddressComponentByType(result, type);

  return {
    provider: Types.GeoMapProvider.Google,
    id: result.place_id,
    formattedAddress: result.formatted_address,
    address: {
      country: byType('country'),
      postalCode: byType('postal_code'),
      locality: byType('locality'),
      route: byType('route'),
      streetNumber: byType('street_number')
    }
  };
}

type AddressComponentType =
  | 'street_number'
  | 'route'
  | 'political'
  | 'sublocality'
  | 'sublocality_level_1'
  | 'locality'
  | 'administrative_area_level_2'
  | 'administrative_area_level_1'
  | 'country'
  | 'postal_code';

function getAddressComponentByType(
  result: google.maps.GeocoderResult,
  type: AddressComponentType
): string | undefined {
  const match = result.address_components.find(c => c.types.indexOf(type) > -1);

  if (!match) {
    return;
  }

  return match.long_name;
}
