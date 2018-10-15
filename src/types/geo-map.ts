import * as Types from '.';

export enum GeoMapProvider {
  Google = 'Google',
  Here = 'Here',
  Custom = 'Custom'
}

export type LoadMapConfig = LoadGoogleMapConfig | LoadHereMapConfig;

export type LoadGoogleMapConfig =
  | LoadGoogleMapConfigBase<GoogleMapApiKeyAuth>
  | LoadGoogleMapConfigBase<GoogleMapClientIdAuth>;

export type GoogleMapAuth = GoogleMapApiKeyAuth | GoogleMapClientIdAuth;

export enum GoogleMapAuthType {
  ApiKey = 'ApiKey',
  ClientId = 'ClientId'
}

export interface GoogleMapApiKeyAuth {
  apiKey: string;
}

export interface GoogleMapClientIdAuth {
  clientId: string;
  channel?: string;
}

export interface LoadGoogleMapConfigBase<T = undefined> {
  language?: string;
  region?: string;
  provider: GeoMapProvider.Google;
  viewport?: GeoMapViewport;
  auth: T;
}

export interface LoadGoogleMapConfigDefault extends LoadGoogleMapConfigBase {
  apiKey: string;
}

export interface LoadHereMapConfig {
  appCode: string;
  appId: string;
  language?: string;
  provider: GeoMapProvider.Here;
  region?: string;
  viewport?: GeoMapViewport;
}

export interface GeoMapViewport {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type LoadMapResult =
  | LoadGoogleMapResult
  | LoadHereMapResult
  | LoadCustomMapResult;

export interface LoadGoogleMapResult {
  result: Types.Result<typeof google.maps>;
  readonly provider: GeoMapProvider.Google;
}

export interface LoadHereMapResult {
  result: Types.Result<typeof H>;
  readonly provider: GeoMapProvider.Here;
}

export interface LoadCustomMapResult {
  // tslint:disable-next-line:no-any
  result: Types.Result<any>;
  readonly provider: GeoMapProvider.Custom;
}

export interface LoadMapContext {
  window: Window;
  init?(): GeoMapApi;
}

export type GeoMapInit = GoogleGeoMapInit | HereGeoMapInit | CustomGeoMapInit;

export type GeoMapConfig = LoadGoogleMapConfig | LoadHereMapConfig;

export interface GoogleGeoMapInit {
  implementation: GeoMapImplementation;
  provider: GeoMapProvider.Google;
}

export interface HereGeoMapInit {
  implementation: GeoMapImplementation;
  provider: GeoMapProvider.Here;
}

export interface CustomGeoMapInit {
  implementation: GeoMapImplementation;
  provider: GeoMapProvider.Custom;
}

export interface GeoMapImplementation {
  load(): Promise<LoadMapResult>;
  mount(el: HTMLElement, mountInit: GeoMapMountInit): Promise<void>;
  phase(phase: GeoMapPhase): Promise<void>;
  getCenter(): Promise<GeoPoint>;
  setCenter(center: GeoPoint): Promise<void>;
  getLayer(): Promise<GeoLayer>;
  setLayer(layer: GeoLayer): Promise<void>;
  getMarkers(): Promise<GeoMarkerImplementation[]>;
  getType(): Promise<GeoMapType>;
  setType(type: GeoMapType): Promise<void>;
  setViewport(viewport: GeoMapViewport): Promise<void>;
  getViewBounds(): Promise<GeoBounds>;
  setViewBounds(bounds: GeoBounds): Promise<void>;
  getZoom(): Promise<number>;
  setZoom(zoomFactor: number): Promise<void>;

  addEventListener(
    eventName: Types.GeoEvent.Click,
    handler: Types.GeoEventHandler<Types.GeoClickPayload>
  ): Promise<void>;
  addEventListener(
    eventName: Types.GeoEvent.Changed,
    handler: Types.GeoEventHandler<void>
  ): Promise<void>;
  addEventListener(
    name: GeoEvent,
    handler: Types.GeoEventHandler
  ): Promise<void>;

  coversLocation(point: Types.GeoPoint): Promise<boolean>;
}

export enum PlaceType {
  Unknown = 0x0,
  Removed = 0x1,
  Car = 0x2,
  Favorit = 0x4,
  LastUsed = 0x8
}

export interface PlaceInit {
  type?: PlaceType;
  readonly id?: string;
}

export interface Place {
  type: PlaceType;
  readonly id: string;
  equal(oth: Place): boolean;
}

export type GoogleApi = typeof google.maps;
export type HereApi = typeof H;

export type GoogleMap = google.maps.Map;
export type HereMap = H.Map;

export type GeoMapApi = GoogleApi | HereApi;

export interface GeoMapContext extends LoadMapContext {
  changed?(geoMapApi: google.maps.Map | H.Map): Promise<void>;
  // tslint:disable-next-line:no-any
  load?(config: GeoMapConfig, ctx?: GeoMapContext): Promise<any>;
  loaded?(
    geoMapApi: google.maps.Map | H.Map,
    ctx: { api: GeoMapApi; context: GeoMapContext }
  ): Promise<void>;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface GeoMapMountInit {
  center: GeoPoint;
  type?: GeoMapType;
  layer?: GeoLayer;
  zoom?: number;
}

export enum GeoMapType {
  Roadmap = 'Roadmap',
  Hybrid = 'Hybrid',
  Unknown = 'Unknown'
}

export enum GeoLayer {
  Transit = 'Transit',
  Traffic = 'Traffic',
  None = 'None'
}

export interface GeoMarkerImplementation {
  getIcon(): Promise<string>;
  setIcon(svg: string): Promise<Types.Result<void>>;
  getPosition(): Promise<Types.GeoPoint>;
  setPosition(position: GeoPoint): Promise<void>;
  remove(): Promise<void>;
}

export interface GeoMarkerInit {
  provider: GeoMapProvider;
  implementation: GeoMarkerImplementation;
}

export enum GeoMarkerOrientation {
  Start,
  Middle,
  End
}

export interface GeoMarkerAnchor {
  vertical: GeoMarkerOrientation;
  horizontal: GeoMarkerOrientation;
}

export interface GeoMarkerConfig {
  anchor?: GeoMarkerAnchor;
  position: GeoPoint;
  icon: string;
}

export interface GeoMarkerCreateInit extends GeoMarkerConfig {
  provider: GeoMapProvider;
  mapImplementation: GeoMapImplementation;
  context?: GeoMapContext;
}

export interface HereMarkerContext {
  mapImplementation: GeoMapImplementation;
  context?: GeoMapContext;
}

export interface GoogleMarkerContext {
  mapImplementation: GeoMapImplementation;
  context?: GeoMapContext;
}

export type GeoMarkerContext = HereMarkerContext | GoogleMarkerContext;

export enum HerePixelDensity {
  Default = 72,
  HighRes = 320,
  UltraHighRes = 500
}
export enum HereLanguage {
  ar = 'ara',
  eu = 'baq',
  ca = 'cat',
  zh = 'chi',
  cs = 'cze',
  da = 'dan',
  nl = 'dut',
  en = 'eng',
  fi = 'fin',
  fr = 'fre',
  de = 'ger',
  ga = 'gle',
  el = 'gre',
  he = 'heb',
  hi = 'hin',
  id = 'ind',
  it = 'ita',
  no = 'nor',
  fa = 'per',
  pl = 'pol',
  pt = 'por',
  ru = 'rus',
  si = 'sin',
  es = 'spa',
  sw = 'swe',
  th = 'tha',
  tr = 'tur',
  uk = 'ukr',
  ur = 'urd',
  vi = 'vie',
  cy = 'wel',
  Multiple = 'mul'
}

export interface GeoBounds {
  north: number;
  east: number;
  south: number;
  west: number;
}

export interface GeoRectInit {
  implementation: GeoRectImplementation;
  provider: GeoMapProvider;
}

export interface GeoRectCreateInit<T extends GeoMapProvider = GeoMapProvider>
  extends GeoBounds {
  provider: T;
}

export interface GeoRectImplementation {
  getBounds(): Promise<GeoBounds>;
  coversLocation(point: Types.GeoPoint): Promise<boolean>;
}

export interface RectContext {
  mapImplementation: GeoMapImplementation;
}

export interface CircleContext {
  mapImplementation: GeoMapImplementation;
}

export interface GoogleRectContext {
  api: GoogleApi;
}

export interface HereRectContext {
  api: HereApi;
}

export enum GeoMapPhase {
  Pristine = 'pristine',
  Loading = 'loading',
  Loaded = 'loaded',
  Mounting = 'mounting',
  Mounted = 'mounted',
  Layouting = 'layouting',
  Layouted = 'layouted'
}

export interface GeoCircleImplementation {
  getBounds(): Promise<GeoBounds>;
}

export interface GeoCircleInit {
  provider: GeoMapProvider;
  implementation: GeoCircleImplementation;
}

export interface GeoCircleCreateInit {
  provider: GeoMapProvider;
  /** LatLng position of the circle's center */
  position: GeoPoint;
  /** Radius of the circle in meters */
  radius: number;
}

export interface GeoCircleConfig {
  /** LatLng position of the circle's center */
  position: GeoPoint;
  /** Radius of the circle in meters */
  radius: number;
}

export enum GeoEvent {
  Click = 'click',
  Changed = 'changed',
  Loaded = 'tilesloaded'
}

// tslint:disable-next-line:no-empty-interface
export type GeoEventPayload = GeoClickPayload;

export interface GeoClickPayload {
  position: {
    lat: number;
    lng: number;
  };
}

// tslint:disable-next-line:no-any
export type GeoEventHandler<T extends GeoEventPayload | void = any> = (
  e?: T
) => void;

export interface GeoMapCodingServiceImplementation {
  reverse(point: GeoPoint): Promise<Types.Result<GeoMapPlaceDetails[]>>;
}

export interface GeoMapPlacesServiceImplementation {
  get(id: string): Promise<Types.Result<GeoMapPlaceDetails>>;

  search(
    needle: string,
    center: Types.GeoPoint,
    radius: number
  ): Promise<Types.Result<GeoMapPlace[]>>;

  distanceBetween(
    from: Types.GeoPoint,
    to: Types.GeoPoint,
    radius?: number
  ): number;
}

export interface GeoMapPlaceDetails {
  readonly provider: Types.GeoMapProvider;
  readonly id: string;
  readonly name?: string;
  readonly formattedAddress: string;
  readonly address: {
    readonly country?: string;
    readonly postalCode?: string;
    readonly locality?: string;
    readonly route?: string;
    readonly streetNumber?: string;
  };
}

export interface GeoMapPlace {
  readonly provider: Types.GeoMapProvider;
  readonly name: string;
  readonly id: string;
  readonly formattedAddress: string;
  readonly location: {
    readonly lat: number;
    readonly lng: number;
  };
}
