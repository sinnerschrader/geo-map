import { ensureElement } from './ensure-element';
import * as Constants from './constants';
import * as GeoMap from '../geo-map';
import * as Types from '../types';
import { DOMContext } from '../types';

export async function createGoogleMap(opts: {
  config?: Partial<Types.GeoMapConfig>;
  mountInit?: Types.GeoMapMountInit;
  context: DOMContext;
}): Promise<GeoMap.GeoMap> {
  const provider = Types.GeoMapProvider.Google;

  const googleMap = GeoMap.GeoMap.create({
    config: {
      browserCtx: opts.context,
      provider,
      auth: {
        apiKey: Constants.GOOGLE_MAP_API
        // clientId: Constants.GOOGLE_MAP_CLIENT_ID,
        // channel: Constants.GOOGLE_MAP_CHANNEL
      },
      language: opts.config ? opts.config.language : undefined,
      viewport: opts.config ? opts.config.viewport : undefined
    },
    context: {
      browserCtx: opts.context
    }
  });

  const el = ensureElement(provider, opts.context);
  await googleMap.mount(el, opts.mountInit || { center: Constants.S2_HAM });
  return googleMap;
}
