import * as Result from './result';
import * as Types from './types';

interface HerePlace {
  name: string;
  placeId: string;
  view: string;
  location: {
    position: [number, number];
    address: {
      city?: string;
      country?: string;
      countryCode?: string;
      county?: string;
      district?: string;
      house?: string;
      postalCode?: string;
      state?: string;
      street?: string;
      text: string;
    };
    access: HerePlaceAccess[];
  };
  categories: HerePlaceCategory[];
  icon: string;
  media: {
    images: Images;
    reviews: Ratings;
    ratings: Ratings;
  };
  related: Related;
  report: {
    title: string;
    href: string;
    type: string;
  };
}

interface HerePlaceCategory {
  id: string;
  title: string;
  href: string;
  type: string;
  system?: string;
  icon: string;
}

export interface HerePlaceAccess {
  position: number[];
  accessType: string;
}

export interface Images {
  available: number;
  next: string;
  items: ImagesItem[];
}

export interface ImagesItem {
  src: string;
  id: string;
  href: string;
  type: string;
  date: string;
  supports: string[];
  user: {
    id: string;
    name: string;
  };
  via: {
    href: string;
    type: string;
  };
  supplier: HerePlaceCategory;
  attribution: string;
}

export interface Ratings {
  available: number;
  items: RatingsItem[];
}

export interface RatingsItem {
  count: number;
  average: number;
  via: {
    href: string;
    type: string;
  };
  supplier: HerePlaceCategory;
  attribution: string;
}

export interface Related {
  recommended: {
    title: string;
    href: string;
    type: string;
  };
  'public-transport': {
    title: string;
    href: string;
    type: string;
  };
}

interface HereError {
  status: number;
  message: string;
}

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
      const service = this.platform.getGeocodingService();

      service.geocode(
        {
          locationid: id,
          responseattributes: 'matchType,matchCode,parsedRequest',
          locationattributes:
            'address,mapReference,mapView,addressDetails,streetDetails,additionalData,adminIds,linkInfo,adminInfo,timeZone,addressNamesBilingual,related.nearByAddress',
          addressattributes:
            'country,state,county,city,district,subdistrict,street,houseNumber,postalCode,addressLines,additionalData'
        },
        payload => {
          if (!payload.Response) {
            return resolve(Result.createFailure(new Error('TODO: error')));
          }
          if (payload.Response.View.length === 0) {
            return resolve(Result.createFailure(new Error('TODO: no result')));
          }
          if (payload.Response.View[0].Result.length === 0) {
            return resolve(Result.createFailure(new Error('TODO: no result')));
          }

          const location = payload.Response.View[0].Result[0].Location;

          this.getPlaceFromGeocodingData(
            location.Address.Label,
            location.DisplayPosition.Latitude,
            location.DisplayPosition.Longitude
          )
            .then(place => {
              resolve(
                Result.createSuccess({
                  provider: Types.GeoMapProvider.Here,
                  id,
                  name: place.title,
                  formattedAddress: location.Address.Label,
                  address: {
                    country: (location.Address.AdditionalData as any)[
                      'CountryName'
                    ],
                    countryCode: location.Address.Country,
                    county: location.Address.County,
                    district: location.Address.District,
                    state: location.Address.State,
                    postalCode: location.Address.PostalCode,
                    locality: location.Address.City,
                    route: location.Address.Street,
                    streetNumber: location.Address.HouseNumber
                  },
                  location: {
                    lat: location.DisplayPosition.Latitude,
                    lng: location.DisplayPosition.Longitude
                  },
                  permanentlyClosed: false
                })
              );
            })
            .catch(err => resolve(Result.createFailure(err)));
        },
        serviceError => resolve(Result.createFailure(serviceError))
      );
    });
  }

  private async getPlaceFromGeocodingData(
    address: string,
    lat: number,
    lng: number
  ): Promise<H.service.ServiceResult> {
    return new Promise<H.service.ServiceResult>((resolve, reject) => {
      const service = this.platform.getPlacesService();

      const point = [lat, lng].join(',');
      service.request(
        'browse' as any,
        { at: point },
        response => {
          if (
            !response.results ||
            !response.results.items ||
            response.results.items.length === 0
          ) {
            return reject(new Error('Invalid search result'));
          }
          resolve(response.results.items[0]);
        },
        serviceError => reject(serviceError)
      );
    });
  }

  public search(
    needle: string,
    center: Types.GeoPoint,
    radius?: number
  ): Promise<Types.Result<Types.GeoMapPlace[]>> {
    return new Promise(resolve => {
      const service = this.platform.getPlacesService();

      const point = [center.lat, center.lng].join(',');

      const params =
        typeof radius !== 'undefined'
          ? { in: `${point};r=${radius}` }
          : { at: point };

      service.search(
        { q: needle, tf: 'plain', ...params },
        response => {
          const { results } = response;

          if (typeof results === 'undefined' || !Array.isArray(results.items)) {
            resolve(Result.createSuccess([]));
            return;
          }

          const locationPromises = Promise.all(
            results.items.map(item => {
              return this.getLocationFromPlaceData(
                item.vicinity,
                item.position[0],
                item.position[1]
              );
            })
          );
          locationPromises
            .then(locations => {
              const places = results.items.map((item, index) => {
                const location = locations[index];
                return {
                  provider: Types.GeoMapProvider.Here,
                  id: location.Response.View[0].Result[0].Location.LocationId,
                  name: item.title,
                  formattedAddress: item.vicinity,
                  location: {
                    lat: item.position[0],
                    lng: item.position[1]
                  }
                };
              });

              resolve(Result.createSuccess(places));
            })
            .catch(err => {
              resolve(Result.createFailure(err));
            });
        },
        serviceError => resolve(Result.createFailure(serviceError))
      );
    });
  }

  private async getLocationFromPlaceData(
    query: string,
    lat: number,
    lng: number
  ): Promise<H.service.ServiceResult> {
    return new Promise<H.service.ServiceResult>((resolve, reject) => {
      const service = this.platform.getGeocodingService();

      service.geocode(
        {
          searchtext: query,
          prox: `${lat},${lng}`,
          responseattributes: 'matchType,matchCode,parsedRequest',
          locationattributes:
            'address,mapReference,mapView,addressDetails,streetDetails,additionalData,adminIds,linkInfo,adminInfo,timeZone,addressNamesBilingual,related.nearByAddress',
          addressattributes:
            'country,state,county,city,district,subdistrict,street,houseNumber,postalCode,addressLines,additionalData'
        },
        payload => {
          if (!payload.Response) {
            return resolve(Result.createFailure(new Error('TODO: error')));
          }
          if (payload.Response.View.length === 0) {
            return resolve(Result.createFailure(new Error('TODO: no result')));
          }
          if (payload.Response.View[0].Result.length === 0) {
            return resolve(Result.createFailure(new Error('TODO: no result')));
          }
          resolve(payload);
        },
        serviceError => reject(serviceError)
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
