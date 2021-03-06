export interface Place {
  /**
   * Indicates the relevance of the results found;
   * the higher the score the more relevant the alternative.
   * The score is a normalized value between 0 and 1.
   */
  relevance: number;
  /**
   * Distance between the identified location object and the specified client position in meters.
   * Only provided if a proximity was specified in the request (parameter prox).
   * For areas like admin or landmark areas the distance is defined as the distance
   * between the input coordinate and the boundary of the area.
   * If the area covers the input coordinate the distance will be negative.
   */
  distance: number;
  /**
   * Direction of the location object seen from the specified client position measured
   * clockwise in degrees starting with 0 at true north.
   * Currently only provided for Reverse Geocode mode=retrieveAreas results.
   * It is the direction from the specified client position to the center of the area.
   */
  direction?: number;
  /**
   * The most detailed address field that matches the geocoding or reverse geocoding query.
   */
  matchLevel:
    | 'country'
    | 'state'
    | 'county'
    | 'city'
    | 'district'
    | 'street'
    | 'intersection'
    | 'houseNumber'
    | 'postalCode'
    | 'landmark';
  /**
   * Detailed information about the match quality on the attribute level.
   * MatchQuality is always 1.0 for reverse geocode results.
   */
  matchQuality: {
    country: number;
    state: number;
    county: number;
    city: number;
    district: number;
    subdistrict: number;
    street: number;
    houseNumber: number;
    postalCode: number;
  };

  /**
   * Quality of the location match.
   * - pointAddress Location matches exactly as Point Address.
   * - interpolated Location was interpolated.
   * With gen<3 address results from reverse geocoding always have MatchType interpolated;
   * only with gen>=3 reverse geocoding returns Point Address results with MatchType pointAddress.
   */
  matchType: 'pointAddress' | 'interpolated';

  /**
   * Code indicating how well the result matches the request.
   */
  matchCode: 'exact' | 'ambiguous' | 'upHierarchy' | 'ambiguousUpHierarchy';

  /** The location that was found.  */
  location: {
    locationId: string;
    locationType: LocationType;
    name: string;
    displayPosition: LatLng;
    navigationPosition: LatLng;
    mapView: { bottomRight: LatLng; topLeft: LatLng };
    address: {
      /** Assembled address value for displaying purposes. */
      label: string;
      /** ISO 3166-alpha-3 country code */
      country: Country;
      /**
       * Includes the first subdivision level below the country.
       * Where commonly used, this is a state code such as CA for California.
       */
      state: string;
      /** Includes the second subdivision level below the country.
       * Use of this field is optional if a second subdivision level is not available.
       */
      county: string;
      /* Refers to the locality of the address. */
      city: string;
      /*
       * Includes the subdivision level below the city.
       * Use of this field is optional if a second subdivision level is not available.
       */
      district: string;
      /*
       * Includes the subdivision level below the district.
       * This field is currently only used for India results.
       * In India, it is typical to use the names of areas below district level in addressing.
       */
      subdistrict: string;
      /* Refers to the street name. */
      street: string;
      /* House number. Depending on regional characteristics, can also be house name. */
      houseNumber: string;
      /* Postal code */
      postalCode: string;
      /* Building name. Building names are currently only supported for Hong Kong addresses. */
      building: string;
      /* additional data key value map */
      additionalData?: { key: string; value: string }[];
    };
    /*  References to a network link and admin areas of the location object. */
    mapReference: {
      referenceId: string;
      mapVersion: string;
      mapReleaseDate: string;
      mapId: string;
      spot: number;
      sideOfStreet: 'left' | 'right' | 'neither';
      countryId: string;
      stateId: string;
      cityId: string;
      districtId: string;
      buildingId: string;
      addressId: string;
    };
  };
}

export type LocationType =
  | 'area'
  | 'address'
  | 'trail'
  | 'park'
  | 'lake'
  | 'mountainPeak'
  | 'volcano'
  | 'river'
  | 'golfCourse'
  | 'industrialComplex'
  | 'island'
  | 'woodland'
  | 'cemetery'
  | 'canalWaterChannel'
  | 'bayHarbor'
  | 'airport'
  | 'hospital'
  | 'sportsComplex'
  | 'shoppingCentre'
  | 'universityCollege'
  | 'nativeAmericanReservation'
  | 'railroad'
  | 'militaryBase'
  | 'parkingLot'
  | 'parkingGarage'
  | 'animalPark'
  | 'beach'
  | 'distanceMarker';

interface LatLng {
  latitude: number;
  longitude: number;
}

export interface GeocoderLatLng {
  Latitude: number;
  Longitude: number;
}

export interface GeocoderLatLngBounds {
  BottomRight: GeocoderLatLng;
  TopLeft: GeocoderLatLng;
}

export type Country =
  | 'ABW'
  | 'AFG'
  | 'AGO'
  | 'AIA'
  | 'ALA'
  | 'ALB'
  | 'AND'
  | 'ARE'
  | 'ARG'
  | 'ARM'
  | 'ASM'
  | 'ATA'
  | 'ATF'
  | 'ATG'
  | 'AUS'
  | 'AUT'
  | 'AZE'
  | 'BDI'
  | 'BEL'
  | 'BEN'
  | 'BES'
  | 'BFA'
  | 'BGD'
  | 'BGR'
  | 'BHR'
  | 'BHS'
  | 'BIH'
  | 'BLM'
  | 'BLR'
  | 'BLZ'
  | 'BMU'
  | 'BOL'
  | 'BRA'
  | 'BRB'
  | 'BRN'
  | 'BTN'
  | 'BVT'
  | 'BWA'
  | 'CAF'
  | 'CAN'
  | 'CCK'
  | 'CHE'
  | 'CHL'
  | 'CHN'
  | 'CIV'
  | 'CMR'
  | 'COD'
  | 'COG'
  | 'COK'
  | 'COL'
  | 'COM'
  | 'CPV'
  | 'CRI'
  | 'CUB'
  | 'CUW'
  | 'CXR'
  | 'CYM'
  | 'CYP'
  | 'CZE'
  | 'DEU'
  | 'DJI'
  | 'DMA'
  | 'DNK'
  | 'DOM'
  | 'DZA'
  | 'ECU'
  | 'EGY'
  | 'ERI'
  | 'ESH'
  | 'ESP'
  | 'EST'
  | 'ETH'
  | 'FIN'
  | 'FJI'
  | 'FLK'
  | 'FRA'
  | 'FRO'
  | 'FSM'
  | 'GAB'
  | 'GBR'
  | 'GEO'
  | 'GGY'
  | 'GHA'
  | 'GIB'
  | 'GIN'
  | 'GLP'
  | 'GMB'
  | 'GNB'
  | 'GNQ'
  | 'GRC'
  | 'GRD'
  | 'GRL'
  | 'GTM'
  | 'GUF'
  | 'GUM'
  | 'GUY'
  | 'HKG'
  | 'HMD'
  | 'HND'
  | 'HRV'
  | 'HTI'
  | 'HUN'
  | 'IDN'
  | 'IMN'
  | 'IND'
  | 'IOT'
  | 'IRL'
  | 'IRN'
  | 'IRQ'
  | 'ISL'
  | 'ISR'
  | 'ITA'
  | 'JAM'
  | 'JEY'
  | 'JOR'
  | 'JPN'
  | 'KAZ'
  | 'KEN'
  | 'KGZ'
  | 'KHM'
  | 'KIR'
  | 'KNA'
  | 'KOR'
  | 'KWT'
  | 'LAO'
  | 'LBN'
  | 'LBR'
  | 'LBY'
  | 'LCA'
  | 'LIE'
  | 'LKA'
  | 'LSO'
  | 'LTU'
  | 'LUX'
  | 'LVA'
  | 'MAC'
  | 'MAF'
  | 'MAR'
  | 'MCO'
  | 'MDA'
  | 'MDG'
  | 'MDV'
  | 'MEX'
  | 'MHL'
  | 'MKD'
  | 'MLI'
  | 'MLT'
  | 'MMR'
  | 'MNE'
  | 'MNG'
  | 'MNP'
  | 'MOZ'
  | 'MRT'
  | 'MSR'
  | 'MTQ'
  | 'MUS'
  | 'MWI'
  | 'MYS'
  | 'MYT'
  | 'NAM'
  | 'NCL'
  | 'NER'
  | 'NFK'
  | 'NGA'
  | 'NIC'
  | 'NIU'
  | 'NLD'
  | 'NOR'
  | 'NPL'
  | 'NRU'
  | 'NZL'
  | 'OMN'
  | 'PAK'
  | 'PAN'
  | 'PCN'
  | 'PER'
  | 'PHL'
  | 'PLW'
  | 'PNG'
  | 'POL'
  | 'PRI'
  | 'PRK'
  | 'PRT'
  | 'PRY'
  | 'PSE'
  | 'PYF'
  | 'QAT'
  | 'REU'
  | 'ROU'
  | 'RUS'
  | 'RWA'
  | 'SAU'
  | 'SDN'
  | 'SEN'
  | 'SGP'
  | 'SGS'
  | 'SHN'
  | 'SJM'
  | 'SLB'
  | 'SLE'
  | 'SLV'
  | 'SMR'
  | 'SOM'
  | 'SPM'
  | 'SRB'
  | 'SSD'
  | 'STP'
  | 'SUR'
  | 'SVK'
  | 'SVN'
  | 'SWE'
  | 'SWZ'
  | 'SXM'
  | 'SYC'
  | 'SYR'
  | 'TCA'
  | 'TCD'
  | 'TGO'
  | 'THA'
  | 'TJK'
  | 'TKL'
  | 'TKM'
  | 'TLS'
  | 'TON'
  | 'TTO'
  | 'TUN'
  | 'TUR'
  | 'TUV'
  | 'TWN'
  | 'TZA'
  | 'UGA'
  | 'UKR'
  | 'UMI'
  | 'URY'
  | 'USA'
  | 'UZB'
  | 'VAT'
  | 'VCT'
  | 'VEN'
  | 'VGB'
  | 'VIR'
  | 'VNM'
  | 'VUT'
  | 'WLF'
  | 'WSM'
  | 'YEM'
  | 'ZAF'
  | 'ZMB'
  | 'ZWE';
