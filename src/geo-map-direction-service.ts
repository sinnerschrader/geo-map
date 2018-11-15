import * as Types from './types';
import { GeoMapDirectionServiceGoogle } from './geo-map-direction-service-google';
import { GeoMapDirectionServiceHere } from './geo-map-direction-service-here';

export type GeoMapDirectionServiceCreateInit =
  | GeoMapDirectionServiceInitGoogle
  | GeoMapDirectionServiceInitHere;

export interface GeoMapDirectionServiceInitGoogle {
  api: Types.GoogleApi;
  type: Types.GeoMapProvider.Google;
  map: Types.GeoMapImplementation;
}

export interface GeoMapDirectionServiceInitHere {
  api: Types.HereApi;
  platform: H.service.Platform;
  type: Types.GeoMapProvider.Here;
  map: Types.GeoMapImplementation;
}

export interface GeoMapDirectionServiceInit {
  type: Types.GeoMapProvider;
  implementation: Types.GeoMapDirectionServiceImplementation;
}

export class GeoMapDirectionService {
  private implementation: Types.GeoMapDirectionServiceImplementation;

  public static create(
    init: GeoMapDirectionServiceCreateInit
  ): GeoMapDirectionService {
    if (init.type === Types.GeoMapProvider.Here) {
      const hereApi = init.api as Types.HereApi;

      return new GeoMapDirectionService({
        type: init.type,
        implementation: GeoMapDirectionServiceHere.create({
          api: hereApi,
          platform: init.platform,
          map: init.map
        })
      });
    }

    const googleApi = init.api as Types.GoogleApi;

    return new GeoMapDirectionService({
      type: init.type,
      implementation: GeoMapDirectionServiceGoogle.create({
        api: googleApi,
        map: init.map
      })
    });
  }

  private constructor(init: GeoMapDirectionServiceInit) {
    this.implementation = init.implementation;
  }

  public async paintRoute(
    from: Types.GeoPoint,
    to: Types.GeoPoint
  ): Promise<Types.GeoMapDirectionResult> {
    return this.implementation.paintRoute(from, to);
  }
}
