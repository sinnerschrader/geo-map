# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.14.0](https://github.com/marionebl/geo-map/compare/v1.13.1...v1.14.0) (2020-10-14)


### Features

* Add support for channel in ApiKey auth type ([d281fa1](https://github.com/marionebl/geo-map/commit/d281fa187e2aa0c5975ffc923ee899cd2d58c27f))


### Bug Fixes

* add missing dependencies for node-canvas ([ec1b793](https://github.com/marionebl/geo-map/commit/ec1b793242e4a0a4b8c4117874e891dcab6ef693))
* Correct express type version ([28bf3b4](https://github.com/marionebl/geo-map/commit/28bf3b43fe0f6fd0468edc50c8b99531700034ca))
* update dependency @types/googlemaps to v3.37.6 ([#233](https://github.com/marionebl/geo-map/issues/233)) ([06778f5](https://github.com/marionebl/geo-map/commit/06778f50cb01125384f8d0cd2be0733a84aa7dea))
* update dependency @types/googlemaps to v3.37.7 ([#260](https://github.com/marionebl/geo-map/issues/260)) ([0efe498](https://github.com/marionebl/geo-map/commit/0efe498128b0aa85137220cb6912602346d1f027))
* update dependency @types/heremaps to v3.0.15 ([#246](https://github.com/marionebl/geo-map/issues/246)) ([684c3f9](https://github.com/marionebl/geo-map/commit/684c3f97017db7cae66697866fba8913e2703d1d))
* update dependency tslib to v1.14.1 ([ac7a1dd](https://github.com/marionebl/geo-map/commit/ac7a1ddc445f7021824d55798e949f81e0a7c11a))

### [1.13.1](https://github.com/marionebl/geo-map/compare/v1.13.0...v1.13.1) (2019-09-11)



## [1.13.0](https://github.com/marionebl/geo-map/compare/v1.12.4...v1.13.0) (2019-07-26)


### Bug Fixes

* update dependency @types/googlemaps to v3.30.20 ([#209](https://github.com/marionebl/geo-map/issues/209)) ([f280f51](https://github.com/marionebl/geo-map/commit/f280f51))
* update dependency @types/googlemaps to v3.36.0 ([#219](https://github.com/marionebl/geo-map/issues/219)) ([028b1bc](https://github.com/marionebl/geo-map/commit/028b1bc))
* update dependency @types/googlemaps to v3.36.1 ([#222](https://github.com/marionebl/geo-map/issues/222)) ([fc82768](https://github.com/marionebl/geo-map/commit/fc82768))
* update dependency @types/googlemaps to v3.36.2 ([#223](https://github.com/marionebl/geo-map/issues/223)) ([73fdb1c](https://github.com/marionebl/geo-map/commit/73fdb1c))


### Features

* retrieve GeoBounds from geocoder & center using GeoBounds ([#247](https://github.com/marionebl/geo-map/issues/247)) ([63a370e](https://github.com/marionebl/geo-map/commit/63a370e))



### [1.12.4](https://github.com/marionebl/geo-map/compare/v1.12.3...v1.12.4) (2019-05-07)


### Bug Fixes

* zoom limitations not recognized ([caae0e1](https://github.com/marionebl/geo-map/commit/caae0e1))



## [1.12.3](https://github.com/marionebl/geo-map/compare/v1.12.2...v1.12.3) (2019-04-26)


### Bug Fixes

* fix here address country mapping in reverse geocoding result ([#182](https://github.com/marionebl/geo-map/issues/182)) ([9d2d1b1](https://github.com/marionebl/geo-map/commit/9d2d1b1))
* google marker not visible in IE11 ([63675b3](https://github.com/marionebl/geo-map/commit/63675b3))



## [1.12.2](https://github.com/marionebl/geo-map/compare/v1.12.1...v1.12.2) (2019-04-17)



## [1.12.1](https://github.com/marionebl/geo-map/compare/v1.12.0...v1.12.1) (2019-04-17)



# [1.12.0](https://github.com/marionebl/geo-map/compare/v1.11.0...v1.12.0) (2019-04-17)


### Features

* add here places service language support ([#179](https://github.com/marionebl/geo-map/issues/179)) ([8899c16](https://github.com/marionebl/geo-map/commit/8899c16))



# [1.11.0](https://github.com/marionebl/geo-map/compare/v1.10.0...v1.11.0) (2019-04-04)


### Features

* support marker click events ([c9669da](https://github.com/marionebl/geo-map/commit/c9669da))



<a name="1.10.0"></a>
# [1.10.0](https://github.com/marionebl/geo-map/compare/v1.9.1...v1.10.0) (2019-03-25)


### Bug Fixes

* avoid pull flatmap-stream ([f826026](https://github.com/marionebl/geo-map/commit/f826026))
* force merge on versions >= 1.2.1 to avoid prototype pollution bugs ([9e15eeb](https://github.com/marionebl/geo-map/commit/9e15eeb))
* Handle empty route results [#94](https://github.com/marionebl/geo-map/issues/94) ([4015b48](https://github.com/marionebl/geo-map/commit/4015b48))
* return here places after empty resolve ([#131](https://github.com/marionebl/geo-map/issues/131)) ([b312598](https://github.com/marionebl/geo-map/commit/b312598))
* split error check in two for different error messages ([068938e](https://github.com/marionebl/geo-map/commit/068938e))
* update dependency [@types](https://github.com/types)/heremaps to v3.0.13 ([#140](https://github.com/marionebl/geo-map/issues/140)) ([c3c5ee7](https://github.com/marionebl/geo-map/commit/c3c5ee7))
* update dependency [@types](https://github.com/types)/query-string to v6.2.0 ([#122](https://github.com/marionebl/geo-map/issues/122)) ([719ff3d](https://github.com/marionebl/geo-map/commit/719ff3d))


### Features

* add more configuration options to here map ([f687360](https://github.com/marionebl/geo-map/commit/f687360))
* allow to set the minimal zoom for the google map ([63566fc](https://github.com/marionebl/geo-map/commit/63566fc))



<a name="1.9.1"></a>
## [1.9.1](https://github.com/marionebl/geo-map/compare/v1.9.0...v1.9.1) (2018-11-19)


### Bug Fixes

* clearing of routes ([#93](https://github.com/marionebl/geo-map/issues/93)) ([307021f](https://github.com/marionebl/geo-map/commit/307021f))



<a name="1.9.0"></a>
# [1.9.0](https://github.com/marionebl/geo-map/compare/v1.8.0...v1.9.0) (2018-11-16)


### Features

* clear drawings on the map ([10bf88a](https://github.com/marionebl/geo-map/commit/10bf88a))



<a name="1.8.0"></a>
# [1.8.0](https://github.com/marionebl/geo-map/compare/v1.7.2...v1.8.0) (2018-11-15)


### Bug Fixes

* move build time type deps to dependencies ([09a3be5](https://github.com/marionebl/geo-map/commit/09a3be5))


### Features

* abstract painting of routes on the map ([f983449](https://github.com/marionebl/geo-map/commit/f983449))
* return combined location/place object from here api ([5d6a631](https://github.com/marionebl/geo-map/commit/5d6a631))



<a name="1.5.0"></a>
# [1.5.0](https://github.com/marionebl/geo-map/compare/v1.4.0...v1.5.0) (2018-10-16)


### Features

* fetch more address details ([cd902b2](https://github.com/marionebl/geo-map/commit/cd902b2))



<a name="1.4.0"></a>
# [1.4.0](https://github.com/marionebl/geo-map/compare/v1.3.1...v1.4.0) (2018-10-15)


### Features

* transform place details for google api ([#40](https://github.com/marionebl/geo-map/issues/40)) ([eb369eb](https://github.com/marionebl/geo-map/commit/eb369eb))



<a name="1.3.1"></a>
## [1.3.1](https://github.com/marionebl/geo-map/compare/v1.3.0...v1.3.1) (2018-10-15)


### Bug Fixes

* load geometry library ([#39](https://github.com/marionebl/geo-map/issues/39)) ([1432e63](https://github.com/marionebl/geo-map/commit/1432e63))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/marionebl/geo-map/compare/v1.2.0...v1.3.0) (2018-10-12)


### Features

* add distance calculation ([#37](https://github.com/marionebl/geo-map/issues/37)) ([72637c6](https://github.com/marionebl/geo-map/commit/72637c6))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/marionebl/geo-map/compare/v1.1.0...v1.2.0) (2018-10-10)


### Features

* remove mobx as dependency ([#28](https://github.com/marionebl/geo-map/issues/28)) ([15a1478](https://github.com/marionebl/geo-map/commit/15a1478))
* use text search instead of place-query ([#27](https://github.com/marionebl/geo-map/issues/27)) ([138bf4a](https://github.com/marionebl/geo-map/commit/138bf4a))



<a name="1.1.0"></a>
# 1.1.0 (2018-10-10)


### Bug Fixes

* update dependency mobx to v4.5.0 ([#18](https://github.com/marionebl/geo-map/issues/18)) ([7158932](https://github.com/marionebl/geo-map/commit/7158932))
* update dependency mobx to v5 ([#23](https://github.com/marionebl/geo-map/issues/23)) ([d033c81](https://github.com/marionebl/geo-map/commit/d033c81))
* update dependency tslib to v1.9.3 ([#19](https://github.com/marionebl/geo-map/issues/19)) ([6a95471](https://github.com/marionebl/geo-map/commit/6a95471))


### Features

* add places search api ([#12](https://github.com/marionebl/geo-map/issues/12)) ([2b178da](https://github.com/marionebl/geo-map/commit/2b178da))
* add public search api ([#21](https://github.com/marionebl/geo-map/issues/21)) ([1f03849](https://github.com/marionebl/geo-map/commit/1f03849))
* strip internals ([958a0ae](https://github.com/marionebl/geo-map/commit/958a0ae))
