import * as QueryString from 'query-string';
import * as Result from '../result';
import * as Types from '../types';
import * as uuid from 'uuid';

const GOOGLE_MAP_CALLBACK_ID = `g${uuid
  .v4()
  .split('-')
  .join('')}`;

let memoizedGoogleMapResult: Types.LoadGoogleMapResult;

export function loadGoogleMapApi(
  result: Types.LoadGoogleMapResult,
  config: Types.LoadGoogleMapConfig,
  context: Types.LoadMapContext
): Promise<Types.LoadGoogleMapResult> {
  return new Promise(resolve => {
    // tslint:disable-next-line:no-any
    const win = (context.window as any) as Window & { google: typeof google };

    const params: { [key: string]: string | null } = {
      callback: GOOGLE_MAP_CALLBACK_ID,
      language: config.language || 'en',
      region: config.region || null,
      libraries: 'places,geometry'
    };

    if (
      isAuthType<Types.GoogleMapApiKeyAuth>(
        config.auth,
        Types.GoogleMapAuthType.ApiKey
      )
    ) {
      params.key = config.auth.apiKey;
    } else if (
      isAuthType<Types.GoogleMapClientIdAuth>(
        config.auth,
        Types.GoogleMapAuthType.ClientId
      )
    ) {
      params.client = config.auth.clientId;
      params.channel = config.auth.channel || null;
    } else {
      // tslint:disable-next-line:no-console
      console.warn(`Could not configure Google Maps authentication.`);
    }

    const url = `https://maps.googleapis.com/maps/api/js?${QueryString.stringify(
      params
    )}`;
    const previous = win.document.querySelector(
      `[data-map-provider=${Types.GeoMapProvider.Google}]`
    );

    if (previous && memoizedGoogleMapResult) {
      return resolve(memoizedGoogleMapResult);
    }

    memoizedGoogleMapResult = result;

    const script = win.document.createElement('script');
    script.src = url;
    script.setAttribute('data-map-provider', Types.GeoMapProvider.Google);

    win.document.body.appendChild(script);

    // tslint:disable-next-line:no-any
    (win as any)[GOOGLE_MAP_CALLBACK_ID] = () => {
      Result.toSuccess(
        result.result,
        context.init ? context.init() : win.google.maps
      );
      resolve(result);
    };
  });
}

function isAuthType<T extends Types.GoogleMapAuth>(
  auth: Types.GoogleMapAuth,
  type: Types.GoogleMapAuthType
): auth is T {
  if (type === Types.GoogleMapAuthType.ApiKey) {
    return auth.hasOwnProperty('apiKey');
  }

  if (type === Types.GoogleMapAuthType.ClientId) {
    return auth.hasOwnProperty('clientId');
  }

  return false;
}
