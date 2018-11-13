import { GeoMap } from './geo-map';
import * as Test from './test';
import * as Types from './types';

const auth = {
  clientId: Test.Constants.GOOGLE_MAP_CLIENT_ID,
  channel: Test.Constants.GOOGLE_MAP_CHANNEL
};

test('Google geo map exposes expected provider', async () => {
  const googleMap = GeoMap.create({
    config: {
      provider: Types.GeoMapProvider.Google,
      auth
    }
  });

  expect(googleMap.provider).toBe(Types.GeoMapProvider.Google);
});

test('HERE geo map exposes expected provider', async () => {
  const googleMap = GeoMap.create({
    config: {
      provider: Types.GeoMapProvider.Here,
      appCode: Test.Constants.HERE_APP_CODE,
      appId: Test.Constants.HERE_APP_ID
    }
  });

  expect(googleMap.provider).toBe(Types.GeoMapProvider.Here);
});

test('faulty geo map fails loading', async () => {
  const faultyMap = GeoMap.create({
    config: {
      provider: 'Algolia' as Types.GeoMapProvider.Here,
      appCode: Test.Constants.HERE_APP_CODE,
      appId: Test.Constants.HERE_APP_ID
    }
  });

  const loadResult = await faultyMap.load();
  expect(loadResult.result.type).toBe(Types.ResultType.Failure);
});

// TODO: Check if we can reestablish support in JSDOM
// currently fails with "The Google Maps JavaScript API does not support this browser".
test.skip('Google geo map loads automatically when mounting', async () => {
  const window = Test.createWindow();
  const loaded = jest.fn();

  const googleMap = GeoMap.create({
    config: {
      provider: Types.GeoMapProvider.Google,
      auth
    },
    context: {
      window,
      loaded
    }
  });

  const el = Test.ensureElement(Types.GeoMapProvider.Google, { window });
  await googleMap.mount(el, { center: Test.Constants.S2_HAM });

  expect(loaded).toHaveBeenCalledTimes(1);
});

test('HERE geo map loads automatically when mounting', async () => {
  const window = Test.createWindow();
  const loaded = jest.fn();

  const hereMap = GeoMap.create({
    config: {
      provider: Types.GeoMapProvider.Here,
      appCode: Test.Constants.HERE_APP_CODE,
      appId: Test.Constants.HERE_APP_ID
    },
    context: {
      window,
      changed: async () => {
        /** */
      },
      init: () => Test.createHMock(),
      loaded
    }
  });

  const el = Test.ensureElement(Types.GeoMapProvider.Google, { window });
  await hereMap.mount(el, { center: Test.Constants.S2_HAM });

  expect(loaded).toHaveBeenCalledTimes(1);
});

test('Geo map exposes getLayer', async () => {
  const window = Test.createWindow();
  const el = Test.ensureElement(Types.GeoMapProvider.Custom, { window });
  const expected = Types.GeoLayer.Traffic;

  const mock = await Test.createMockMapImplementation({
    getLayer: jest.fn().mockImplementation(() => expected)
  });

  const map = GeoMap.from(mock);
  await map.mount(el, { center: Test.Constants.S2_HAM });

  expect(await map.getLayer()).toBe(expected);
  expect(mock.getLayer).toHaveBeenCalledTimes(1);
});

test('Geo map exposes setLayer', async () => {
  const window = Test.createWindow();
  const el = Test.ensureElement(Types.GeoMapProvider.Custom, { window });
  const expected = Types.GeoLayer.Transit;

  const mock = await Test.createMockMapImplementation({ setLayer: jest.fn() });

  const map = GeoMap.from(mock);
  await map.mount(el, { center: Test.Constants.S2_HAM });
  await map.setLayer(expected);

  expect(mock.setLayer).toHaveBeenCalledWith(expected);
});

// TODO: Check if we can reestablish support in JSDOM
// currently fails with "The Google Maps JavaScript API does not support this browser".
test.skip('Geo createMarker triggers change event with Google', async () => {
  const googleMap = await Test.createGoogleMap();
  const onChange = jest.fn();

  googleMap.addEventListener(Types.GeoEvent.Changed, onChange);

  await googleMap.createMarker({
    icon: '',
    position: Test.Constants.S2_HAM
  });

  expect(onChange).toHaveBeenCalledTimes(1);
});

test('Geo createMarker triggers change event with HERE', async () => {
  const hereMap = await Test.createHereMap();
  const onChange = jest.fn();

  hereMap.addEventListener(Types.GeoEvent.Changed, onChange);

  await hereMap.createMarker({
    icon: '',
    position: Test.Constants.S2_HAM
  });

  expect(onChange).toHaveBeenCalledTimes(1);
});

// TODO: Check if we can reestablish support in JSDOM
// currently fails with "The Google Maps JavaScript API does not support this browser".
test.skip('GeoMarker.remove triggers change event with Google', async () => {
  const googleMap = await Test.createGoogleMap();
  const onChange = jest.fn();

  const marker = await googleMap.createMarker({
    icon: '',
    position: Test.Constants.S2_HAM
  });

  googleMap.addEventListener(Types.GeoEvent.Changed, onChange);

  await marker.remove();
  expect(onChange).toHaveBeenCalledTimes(1);
});

test('GeoMarker.remove triggers change event with HERE', async () => {
  const hereMap = await Test.createHereMap();
  const onChange = jest.fn();

  const marker = await hereMap.createMarker({
    icon: '',
    position: Test.Constants.S2_HAM
  });

  hereMap.addEventListener(Types.GeoEvent.Changed, onChange);

  await marker.remove();
  expect(onChange).toHaveBeenCalledTimes(1);
});
