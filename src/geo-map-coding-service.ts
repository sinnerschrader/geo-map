import * as Types from './types';
import { GeoMapCodingServiceHere } from './geo-map-coding-service-here';
import { GeoMapCodingServiceGoogle } from './geo-map-coding-service-google';

export type GeoMapCodingServiceCreateInit =
  | GeoMapCodingServiceCreateInitGoogle
  | GeoMapCodingServiceCreateInitHere;

export interface GeoMapCodingServiceCreateInitGoogle {
  api: Types.GoogleApi;
  type: Types.GeoMapProvider.Google;
}

export interface GeoMapCodingServiceCreateInitHere {
  api: Types.HereApi;
  platform: H.service.Platform;
  type: Types.GeoMapProvider.Here;
}

export interface GeoMapCodingServiceInit {
  type: Types.GeoMapProvider;
  implementation: Types.GeoMapCodingServiceImplementation;
}

export class GeoMapCodingService {
  private implementation: Types.GeoMapCodingServiceImplementation;

  public static create(
    init: GeoMapCodingServiceCreateInit
  ): GeoMapCodingService {
    if (init.type === Types.GeoMapProvider.Here) {
      const hereApi = init.api as Types.HereApi;

      return new GeoMapCodingService({
        type: init.type,
        implementation: GeoMapCodingServiceHere.create({
          api: hereApi,
          platform: init.platform
        })
      });
    }

    const googleApi = init.api as Types.GoogleApi;

    return new GeoMapCodingService({
      type: init.type,
      implementation: GeoMapCodingServiceGoogle.create({ api: googleApi })
    });
  }

  private constructor(init: GeoMapCodingServiceInit) {
    this.implementation = init.implementation;
  }

  public async reverse(
    location: Types.GeoPoint
  ): Promise<Types.Result<Types.GeoMapPlaceDetails[]>> {
    return this.implementation.reverse(location);
  }
}
