import * as Types from './types';
import { GeoMapPlacesServiceHere } from './geo-map-places-service-here';
import { GeoMapPlacesServiceGoogle } from './geo-map-places-service-google';
import { GeoMap } from './geo-map';

export type GeoMapPlacesServiceCreateInit =
  | GeoMapPlacesServiceInitGoogle
  | GeoMapPlacesServiceInitHere;

export interface GeoMapPlacesServiceInitGoogle {
  api: Types.GoogleApi;
  type: Types.GeoMapProvider.Google;
}

export interface GeoMapPlacesServiceInitHere {
  api: Types.HereApi;
  platform: H.service.Platform;
  type: Types.GeoMapProvider.Here;
}

export interface GeoMapPlacesServiceInit {
  type: Types.GeoMapProvider;
  implementation: Types.GeoMapPlacesServiceImplementation;
}

export class GeoMapPlacesService {
  private implementation: Types.GeoMapPlacesServiceImplementation;

  public static create(
    init: GeoMapPlacesServiceCreateInit
  ): GeoMapPlacesService {
    if (init.type === Types.GeoMapProvider.Here) {
      const hereApi = init.api as Types.HereApi;

      return new GeoMapPlacesService({
        type: init.type,
        implementation: GeoMapPlacesServiceHere.create({
          api: hereApi,
          platform: init.platform
        })
      });
    }

    const googleApi = init.api as Types.GoogleApi;

    return new GeoMapPlacesService({
      type: init.type,
      implementation: GeoMapPlacesServiceGoogle.create({
        api: googleApi
      })
    });
  }

  private constructor(init: GeoMapPlacesServiceInit) {
    this.implementation = init.implementation;
  }

  public async get(
    id: string
  ): Promise<Types.Result<Types.GeoMapPlaceDetails>> {
    return this.implementation.get(id);
  }

  public async search(
    needle: string,
    center: Types.GeoPoint,
    radius: number
  ): Promise<Types.Result<Types.GeoMapPlace[]>> {
    return this.implementation.search(needle, center, radius);
  }
}
