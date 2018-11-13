import * as Constants from './constants';
import * as Types from '../types';
import * as Util from './util';
import { createGoogleMap } from './create-google-map';
import { createHereMap } from './create-here-map';

const VIEWPORT = { top: 0, right: 0, bottom: 0, left: 300 };

const BOUNDS = {
  north: Constants.S2_HAM.lat,
  east: Constants.S2_HAM.lng,
  south: 0,
  west: 0
};

export const Tests = {
  basicHere: async () => {
    const hereMap = await createHereMap();
  },

  basicGoogle: async () => {
    const gmap = await createGoogleMap();
    await gmap.phase(Types.GeoMapPhase.Layouted);
  },

  zoomGoogle: async (zoom = 10) => {
    const gmap = await createGoogleMap();
    gmap.setZoom(zoom);
    return gmap.getZoom();
  },

  zoomHere: async (zoom = 10) => {
    const hmap = await createHereMap();
    await hmap.setZoom(zoom);
    return hmap.getZoom();
  },

  zoomSameHere: async (zoom = 5) => {
    const hmap = await createHereMap({}, { zoom, center: Constants.S2_HAM });
    await hmap.setZoom(zoom);
    const result = await hmap.getZoom();
    return result;
  },

  typeGoogle: async (type: Types.GeoMapType = Types.GeoMapType.Hybrid) => {
    const gmap = await createGoogleMap();
    gmap.setType(type);
    return gmap.getType();
  },

  typeHere: async (type: Types.GeoMapType = Types.GeoMapType.Hybrid) => {
    const hmap = await createHereMap({}, { zoom: 2, center: Constants.S2_HAM });
    hmap.setType(type);
    return hmap.getType();
  },

  styledPOIMarkerWork: async (
    icon: string = Constants.ICON,
    center = Constants.S2_HAM
  ) => {
    const gmap = await createGoogleMap({}, { zoom: 10, center });

    return await gmap.createMarker({
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="31" height="45">
        <g fill="none" fill-rule="evenodd" stroke="#FFF" transform="translate(1 1)">
          <path fill="#000" d="M29 14.5c0 2.73-1.624 6.903-4.499 12.18a114.552 114.552 0 0 1-2.573 4.466 168.504 168.504 0 0 1-4.827 7.5 165.582 165.582 0 0 1-2.196 3.148l-.405.558-.405-.558a165.582 165.582 0 0 1-2.196-3.148 168.504 168.504 0 0 1-4.827-7.5A114.552 114.552 0 0 1 4.5 26.681C1.624 21.403 0 17.23 0 14.5 0 6.524 6.524 0 14.5 0S29 6.524 29 14.5z"/>
          <polygon points="20.5 24.5 15.5 24.5 15.5 19.5 12.5 19.5 12.5 24.5 7.5 24.5 7.5 5.5 20.5 5.5"/>
          <polygon points="15.5 10.5 17.5 10.5 17.5 8.5 15.5 8.5"/>
          <polygon points="10.5 10.5 12.5 10.5 12.5 8.5 10.5 8.5"/>
          <polygon points="15.5 16.5 17.5 16.5 17.5 14.5 15.5 14.5"/>
          <polygon points="10.5 16.5 12.5 16.5 12.5 14.5 10.5 14.5"/>
        </g>
      </svg>`,
      position: center
    });
  },

  styledPOIMarkerAudi: async (
    icon: string = Constants.ICON,
    center = Constants.S2_HAM
  ) => {
    const gmap = await createGoogleMap({}, { zoom: 10, center });

    return await gmap.createMarker({
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="31" height="45">
        <g fill="none" fill-rule="evenodd" stroke="#FFF">
          <path fill="#000" d="M30 15.5c0 2.73-1.624 6.903-4.499 12.18a114.552 114.552 0 0 1-2.573 4.466 168.504 168.504 0 0 1-4.827 7.5 165.582 165.582 0 0 1-2.196 3.148l-.405.558-.405-.558a165.582 165.582 0 0 1-2.196-3.148 168.504 168.504 0 0 1-4.827-7.5A114.552 114.552 0 0 1 5.5 27.681C2.624 22.403 1 18.23 1 15.5 1 7.524 7.524 1 15.5 1S30 7.524 30 15.5z"/>
          <g stroke-linecap="round">
            <path d="M11.806 14.943a3.278 3.278 0 1 1-6.556 0 3.278 3.278 0 0 1 6.556 0z"/>
            <path d="M16.462 14.943a3.278 3.278 0 1 1-6.557 0 3.278 3.278 0 0 1 6.557 0z"/>
            <path d="M17.84 18.22a3.278 3.278 0 1 1 0-6.556 3.278 3.278 0 0 1 0 6.557z"/>
            <path d="M25.773 14.943a3.278 3.278 0 1 1-6.556 0 3.278 3.278 0 0 1 6.556 0z"/>
          </g>
        </g>
      </svg>`,
      position: center
    });
  },

  styledPOILastDestination: async (
    icon: string = Constants.ICON,
    center = Constants.S2_HAM
  ) => {
    const gmap = await createGoogleMap({}, { zoom: 10, center });

    return await gmap.createMarker({
      icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="38" height="51">
      <defs>
        <path id="b" d="M28 14c0-7.732-6.268-14-14-14S0 6.268 0 14s14 27 14 27 14-19.268 14-27z"/>
        <filter id="a" width="157.1%" height="139%" x="-28.6%" y="-14.6%" filterUnits="objectBoundingBox">
          <feMorphology in="SourceAlpha" operator="dilate" radius="1" result="shadowSpreadOuter1"/>
          <feOffset dy="2" in="shadowSpreadOuter1" result="shadowOffsetOuter1"/>
          <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="2"/>
          <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"/>
          <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
        </filter>
      </defs>
      <g fill="none" fill-rule="evenodd">
        <g fill="#000" transform="translate(5 3)">
          <use filter="url(#a)" xlink:href="#b"/>
          <path stroke="#000" d="M28.5 14c0 2.736-1.618 6.9-4.48 12.162a113.78 113.78 0 0 1-2.592 4.496A167.454 167.454 0 0 1 16.6 38.15a164.435 164.435 0 0 1-2.197 3.144L14 41.85l-.404-.557A164.435 164.435 0 0 1 11.4 38.15a167.454 167.454 0 0 1-4.828-7.492 113.78 113.78 0 0 1-2.591-4.496C1.118 20.9-.5 16.736-.5 14-.5 5.992 5.992-.5 14-.5S28.5 5.992 28.5 14z"/>
        </g>
        <path stroke="#FFF" d="M12.426 20.667a7 7 0 1 0-.576-4.681m4.494 0h-5.461v-5.461"/>
      </g>
    </svg>`,
      position: center
    });
  },

  styledPOIMarkerDefault: async (
    icon: string = Constants.ICON,
    center = Constants.S2_HAM
  ) => {
    const gmap = await createGoogleMap({}, { zoom: 10, center });

    return await gmap.createMarker({
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="31" height="45">
        <g fill="#000" fill-rule="evenodd" stroke="#FFF">
          <path d="M30 15.5c0 2.736-1.618 6.9-4.48 12.162a113.78 113.78 0 0 1-2.592 4.496A167.454 167.454 0 0 1 18.1 39.65a164.435 164.435 0 0 1-2.197 3.144l-.404.557-.404-.557A164.435 164.435 0 0 1 12.9 39.65a167.454 167.454 0 0 1-4.828-7.492 113.78 113.78 0 0 1-2.591-4.496C2.618 22.4 1 18.236 1 15.5 1 7.492 7.492 1 15.5 1S30 7.492 30 15.5z"/>
          <path d="M22.5 15.5a7 7 0 1 0-14 0 7 7 0 0 0 14 0z"/>
        </g>
      </svg>`,
      position: center
    });
  },

  styledPOIMarkerHome: async (
    icon: string = Constants.ICON,
    center = Constants.S2_HAM
  ) => {
    const gmap = await createGoogleMap({}, { zoom: 10, center });

    return await gmap.createMarker({
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="31" height="45">
        <g fill="none" fill-rule="evenodd" stroke="#FFF" transform="translate(1 1)">
          <path fill="#000" d="M29 14.5c0 2.73-1.624 6.903-4.499 12.18a114.552 114.552 0 0 1-2.573 4.466 168.504 168.504 0 0 1-4.827 7.5 165.582 165.582 0 0 1-2.196 3.148l-.405.558-.405-.558a165.582 165.582 0 0 1-2.196-3.148 168.504 168.504 0 0 1-4.827-7.5A114.552 114.552 0 0 1 4.5 26.681C1.624 21.403 0 17.23 0 14.5 0 6.524 6.524 0 14.5 0S29 6.524 29 14.5z"/>
          <path d="M7.5 11v6.5a2 2 0 0 0 2 2h12V11"/>
          <polyline points="24 13 14.5 5.5 5 13"/>
        </g>
      </svg>`,
      position: center
    });
  },

  styledPOIMarkerFavorite: async (
    icon: string = Constants.ICON,
    center = Constants.S2_HAM
  ) => {
    const gmap = await createGoogleMap({}, { zoom: 10, center });

    return await gmap.createMarker({
      icon: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="31" height="45">
        <defs>
          <polygon id="a" points="14.5 5.5 17.281 11.135 23.5 12.039 19 16.425 20.062 22.619 14.5 19.695 8.938 22.619 10 16.425 5.5 12.039 11.719 11.135"/>
        </defs>
        <g fill="none" fill-rule="evenodd">
          <path fill="#000" stroke="#FFF" d="M30 15.5c0 2.736-1.618 6.9-4.48 12.162a113.78 113.78 0 0 1-2.592 4.496A167.454 167.454 0 0 1 18.1 39.65a164.435 164.435 0 0 1-2.197 3.144l-.404.557-.404-.557A164.435 164.435 0 0 1 12.9 39.65a167.454 167.454 0 0 1-4.828-7.492 113.78 113.78 0 0 1-2.591-4.496C2.618 22.4 1 18.236 1 15.5 1 7.492 7.492 1 15.5 1S30 7.492 30 15.5z"/>
          <g transform="translate(1 1)">
            <use fill="#000" stroke="#000" xlink:href="#a"/>
            <use stroke="#FFF" xlink:href="#a"/>
          </g>
        </g>
      </svg>`,
      position: center
    });
  },

  styledPOIMarkerCar: async (
    icon: string = Constants.ICON,
    center = Constants.S2_HAM
  ) => {
    const gmap = await createGoogleMap({}, { zoom: 10, center });

    return await gmap.createMarker({
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="31" height="45">
        <g fill="none" fill-rule="evenodd" stroke="#FFF" transform="translate(1 1)">
          <path fill="#000" d="M29 14.5c0 2.73-1.624 6.903-4.499 12.18a114.552 114.552 0 0 1-2.573 4.466 168.504 168.504 0 0 1-4.827 7.5 165.582 165.582 0 0 1-2.196 3.148l-.405.558-.405-.558a165.582 165.582 0 0 1-2.196-3.148 168.504 168.504 0 0 1-4.827-7.5A114.552 114.552 0 0 1 4.5 26.681C1.624 21.403 0 17.23 0 14.5 0 6.524 6.524 0 14.5 0S29 6.524 29 14.5z"/>
          <polygon points="5.031 8.516 6.812 8.516 7.347 8.516"/>
          <path d="M4.688 11.646s.734.193 1.644.45c.775.22 1.096.412 1.264 1.19.21.98.495 1.382-.927 1.108-1.422-.273-2.227-.513-2.227-.513M24.016 8.547H21.69M24.312 11.646s-.734.193-1.644.45c-.775.22-1.096.412-1.264 1.19-.21.98-.495 1.382.927 1.108 1.422-.273 2.227-.513 2.227-.513"/>
          <path d="M21.5 17.578v2.047h2.12c.477 0 .934-.382.943-.859v-4.164c0-3.299-.613-3.645-.613-3.645L22.668 10s-.703-.719-1.394-2.215C20.68 6.5 19.415 6.5 19.415 6.5h-9.83s-1.265 0-1.859 1.285C7.035 9.281 6.332 10 6.332 10l-1.244.93s-.051.034-.073.057c-.129.131-.577.792-.577 3.615v4.164c.008.477.465.86.942.86H7.5v-2.048h14z"/>
          <polygon points="17.917 12.875 19.211 13.738 17.953 15.5 11.143 15.5 9.793 13.738 11.143 12.875"/>
          <path d="M22.29 9.531H6.71"/>
        </g>
      </svg>`,
      position: center
    });
  },

  styledMarkerGoogle: async (
    icon: string = Constants.ICON,
    center = Constants.S2_HAM
  ) => {
    const gmap = await createGoogleMap({}, { zoom: 18, center });

    return await gmap.createMarker({
      icon: `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path fill="#4783DA" d="M30 60c16.569 0 30-13.431 30-30C60 13.431 46.569 0 30 0 13.431 0 0 13.431 0 30c0 16.569 13.431 30 30 30z" opacity=".15"/><circle cx="30" cy="30" r="8.5" fill="#3275D2" stroke="#FFF" stroke-width="3"/></g></svg>`,
      position: center
    });
  },

  markerGoogle: async (
    icon: string = Constants.ICON,
    center = Constants.S2_HAM
  ) => {
    const gmap = await createGoogleMap({}, { zoom: 10, center });
    await gmap.phase(Types.GeoMapPhase.Layouted);

    return await gmap.createMarker({
      icon,
      position: center
    });
  },

  markerHere: async (
    icon: string = Constants.ICON,
    center = Constants.S2_HAM
  ) => {
    const hmap = await createHereMap({}, { zoom: 10, center });

    return await hmap.createMarker({
      icon,
      position: center
    });
  },

  languageHere: async (language = 'en') => {
    return createHereMap({ language }, { center: Constants.S2_HAM, zoom: 4 });
  },

  languageGoogle: async (language = 'en') => {
    return createGoogleMap({ language }, { center: Constants.S2_HAM, zoom: 4 });
  },

  centerHere: async (
    { lat, lng }: { lat: number; lng: number } = { lat: 0, lng: 0 }
  ) => {
    const hmap = await createHereMap({}, { center: Constants.S2_HAM, zoom: 5 });
    await hmap.setCenter({
      lat,
      lng
    });
    return hmap.getCenter();
  },

  centerGoogle: async (
    { lat, lng }: { lat: number; lng: number } = { lat: 0, lng: 0 }
  ) => {
    const gmap = await createGoogleMap(
      {},
      { center: Constants.S2_HAM, zoom: 5 }
    );
    await gmap.setCenter({
      lat,
      lng
    });
    return gmap.getCenter();
  },

  viewportHere: async (viewport: Types.GeoMapViewport = VIEWPORT) => {
    const hmap = await createHereMap(
      { viewport },
      { center: Constants.S2_HAM, zoom: 5 }
    );

    const el = document.querySelector(
      `[data-map="${Types.GeoMapProvider.Here}"]`
    ) as HTMLElement;

    Util.paintViewport({ viewport, container: el });

    return await hmap.createMarker({
      icon: Constants.ICON,
      position: Constants.S2_HAM
    });
  },

  viewportGoogle: async (viewport: Types.GeoMapViewport = VIEWPORT) => {
    const gmap = await createGoogleMap(
      { viewport },
      { center: Constants.S2_HAM, zoom: 5 }
    );

    const el = document.querySelector(
      `[data-map="${Types.GeoMapProvider.Google}"]`
    ) as HTMLElement;

    Util.paintViewport({ viewport, container: el });

    return await gmap.createMarker({
      icon: Constants.ICON,
      position: Constants.S2_HAM
    });
  },

  boundsHere: async (
    viewport: Types.GeoMapViewport = VIEWPORT,
    bounds: Types.GeoBounds = BOUNDS
  ) => {
    const hmap = await createHereMap(
      { viewport: { top: 0, right: 0, bottom: 0, left: 300 } },
      { center: { lat: 0, lng: 0 }, zoom: 5 }
    );

    hmap.createMarker({
      position: { lat: bounds.north, lng: bounds.east },
      icon: Constants.ICON
    });
    hmap.createMarker({
      position: { lat: bounds.south, lng: bounds.west },
      icon: Constants.ICON
    });

    await hmap.setViewBounds(bounds);
  },

  boundsGoogle: async (
    viewport: Types.GeoMapViewport = VIEWPORT,
    bounds: Types.GeoBounds = BOUNDS
  ) => {
    const googleMap = await createGoogleMap(
      { viewport },
      { center: { lat: 0, lng: 0 }, zoom: 5 }
    );

    googleMap.createMarker({
      position: { lat: bounds.north, lng: bounds.east },
      icon: Constants.ICON
    });

    googleMap.createMarker({
      position: { lat: bounds.south, lng: bounds.west },
      icon: Constants.ICON
    });

    await googleMap.setViewBounds(bounds);
  },

  routeGoogle: async () => {
    const googleMap = await createGoogleMap(
      {},
      { center: Constants.S2_FRA, zoom: 5 }
    );

    // tslint:disable-next-line:no-any
    const map = ((googleMap as any).implementation as { map: google.maps.Map })
      .map;

    const directionsService = new google.maps.DirectionsService();

    const config = {
      origin: Constants.S2_HAM,
      destination: Constants.S2_MUC,
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(config, results => {
      const [route] = results.routes;

      const path = route.legs.reduce(
        (p, leg) => leg.steps.reduce((ps, s) => [...ps, ...s.path], p),
        []
      );

      const lineBackground = new google.maps.Polyline({
        path,
        strokeColor: 'rgb(51, 121, 195)',
        strokeOpacity: 1.0,
        strokeWeight: 8
      });

      const lineForegroud = new google.maps.Polyline({
        path,
        strokeColor: 'rgb(0, 179, 253)',
        strokeOpacity: 1.0,
        strokeWeight: 5
      });

      lineBackground.setMap(map);
      lineForegroud.setMap(map);

      googleMap.createMarker({
        position: config.origin,
        icon: Constants.ORIGIN_ICON
      });

      googleMap.createMarker({
        position: config.destination,
        icon: Constants.TARGET_ICON
      });
    });
  },

  routeHere: async () => {
    const hereMap = await createHereMap(
      {},
      { center: Constants.S2_FRA, zoom: 5 }
    );

    // tslint:disable-next-line:no-any
    const map = ((hereMap as any).implementation as { map: H.Map }).map;

    // tslint:disable-next-line:no-any
    const platform = ((hereMap as any).implementation as {
      platform: H.service.Platform;
    }).platform;

    const directionsService = platform.getRoutingService();

    const origin = Constants.S2_HAM;
    const destination = Constants.S2_MUC;

    const config = {
      mode: 'fastest;car',
      waypoint0: `geo!${origin.lat},${origin.lng}`,
      waypoint1: `geo!${destination.lat},${destination.lng}`,
      representation: 'display',
      routingParameters: 'display'
    };

    directionsService.calculateRoute(
      config,
      (result: H.service.ServiceResult) => {
        if (!result.response || !result.response.route) {
          return;
        }

        const [route] = result.response.route;

        const path = route.shape.reduce(
          // tslint:disable-next-line:no-any
          (p: [number, number, any], point: string) => [
            ...p,
            ...point.split(',').map(c => parseFloat(c)),
            undefined
          ],
          []
        );

        const lineBackground = new H.map.Polyline(new H.geo.LineString(path), {
          style: {
            lineWidth: 6,
            strokeColor: 'rgb(255, 255, 255)'
          }
        });

        const lineForegroud = new H.map.Polyline(new H.geo.LineString(path), {
          style: {
            lineWidth: 4,
            strokeColor: 'rgb(44, 72, 161)'
          }
        });

        map.addObject(lineBackground);
        map.addObject(lineForegroud);

        hereMap.createMarker({
          position: origin,
          icon: Constants.ORIGIN_ICON
        });

        hereMap.createMarker({
          position: destination,
          icon: Constants.TARGET_ICON
        });
      },
      (error: Error) => {
        console.error(error);
      }
    );
  },

  layerGoogle: async (layer: Types.GeoLayer = Types.GeoLayer.None) => {
    const googleMap = await createGoogleMap(
      {},
      { center: Constants.S2_HAM, zoom: 13, layer }
    );
    await googleMap.phase(Types.GeoMapPhase.Layouted);
  },

  layerHere: (layer: Types.GeoLayer = Types.GeoLayer.None) => {
    return createHereMap({}, { center: Constants.S2_HAM, zoom: 13, layer });
  },

  circleGoogle: async () => {
    const map = await createGoogleMap(
      {},
      { center: Constants.S2_HAM, zoom: 13 }
    );
    map.createGeoCircle({ position: Constants.S2_HAM, radius: 100 });
  },

  circleHere: async () => {
    const map = await createHereMap({}, { center: Constants.S2_HAM, zoom: 13 });
    map.createGeoCircle({ position: Constants.S2_HAM, radius: 100 });
  },

  eventGoogle: async (id: string) => {
    const data = { clicked: 0 };
    const map = await createGoogleMap(
      {},
      { center: Constants.S2_HAM, zoom: 13 }
    );

    map.addEventListener(Types.GeoEvent.Click, () => {
      data.clicked++;
      Util.dump(data);
    });
  },

  eventHere: async (id: string) => {
    const data = { clicked: 0 };
    const map = await createHereMap({}, { center: Constants.S2_HAM, zoom: 13 });

    map.addEventListener(Types.GeoEvent.Click, () => {
      data.clicked++;
      Util.dump(data);
    });
  },

  eventPayloadGoogle: async (input?: { lat: number; lng: number }) => {
    const center = input || { lat: 1, lng: 1 };
    const map = await createGoogleMap({}, { center, zoom: 13 });
    map.addEventListener(Types.GeoEvent.Click, e => Util.dump(e));
  },

  eventPayloadHere: async (input?: { lat: number; lng: number }) => {
    const center = input || { lat: 1, lng: 1 };
    const map = await createHereMap({}, { center, zoom: 13 });
    map.addEventListener(Types.GeoEvent.Click, e => Util.dump(e));
  },

  geocodeHere: async (
    center: { lat: number; lng: number } = Constants.S2_FRA
  ) => {
    const map = await createHereMap({}, { center, zoom: 17 });
    map.addEventListener(Types.GeoEvent.Click, async e => {
      if (!e) {
        return;
      }

      const results = await map.reverseGeocode(e.position);

      if (results.type === Types.ResultType.Success) {
        Util.dump(results.payload[0]);
      }
    });
  },

  geocodeGoogle: async (
    center: { lat: number; lng: number } = Constants.S2_FRA
  ) => {
    const map = await createGoogleMap({}, { center, zoom: 17 });
    map.addEventListener(Types.GeoEvent.Click, async e => {
      if (!e) {
        return;
      }

      const result = await map.reverseGeocode(e.position);

      if (result.type === Types.ResultType.Success) {
        Util.dump(result.payload[0]);
      }
    });
  },

  searchHere: async (term: string = 'Hamburg') => {
    const center = Constants.S2_HAM;
    const map = await createHereMap({}, { center, zoom: 15 });
    const results = await map.search(term, center);

    if (results.type === Types.ResultType.Success) {
      Util.dump(results.payload);
    }
  },

  searchGoogle: async (term: string = 'Hamburg') => {
    const center = Constants.S2_HAM;
    const map = await createGoogleMap({}, { center, zoom: 15 });
    const results = await map.search(term, center);

    if (results.type === Types.ResultType.Success) {
      Util.dump(results.payload);
    }
  },

  getGoogle: async (term: string = 'Hamburg') => {
    const center = Constants.S2_HAM;
    const map = await createGoogleMap({}, { center, zoom: 15 });
    const results = await map.search(term, center);

    if (
      results.type !== Types.ResultType.Success ||
      results.payload.length === 0
    ) {
      return;
    }

    const details = await map.getPlace(results.payload[0].id);

    if (details.type === Types.ResultType.Success) {
      Util.dump(details.payload);
    }
  },

  getHere: async (term: string = 'Hamburg') => {
    const center = Constants.S2_HAM;
    const map = await createHereMap({}, { center, zoom: 15 });
    const results = await map.search(term, center);

    if (
      results.type !== Types.ResultType.Success ||
      results.payload.length === 0
    ) {
      return;
    }

    const details = await map.getPlace(results.payload[0].id);

    if (details.type === Types.ResultType.Success) {
      Util.dump(details.payload);
    }
  },

  getAllWayDownFromReverseGeocode: async () => {
    const center = Constants.S2_HAM;
    const map = await createHereMap({}, { center, zoom: 15 });
    const geocodeResult = await map.reverseGeocode(center);
    if (
      geocodeResult.type !== Types.ResultType.Success ||
      geocodeResult.payload.length === 0
    ) {
      throw new Error('Expected success from reverse geocode');
    }
    const firstResult = geocodeResult.payload[0];

    const placeResult = await map.getPlace(firstResult.id);
    if (placeResult.type !== Types.ResultType.Success) {
      throw new Error('Expected success from getPlace');
    }
    Util.dump(placeResult.payload);
  }
};
