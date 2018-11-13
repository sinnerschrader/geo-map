import * as Test from './test';
import * as Types from './types';

// TODO: Check if we can reestablish support in JSDOM
// currently fails with "The Google Maps JavaScript API does not support this browser".
test.skip('Google map search result', async () => {
  const googlePlaces = await Test.createGooglePlacesImplementation({
    mock: false,
    mount: { center: Test.Constants.S2_HAM, type: Types.GeoMapType.Hybrid }
  });

  const result = await googlePlaces.service.search(
    'sinnerschrader',
    Test.Constants.S2_HAM,
    50000
  );

  expect(result).toEqual(
    expect.objectContaining({
      type: Types.ResultType.Success,
      payload: expect.arrayContaining([
        expect.objectContaining({
          name: expect.stringContaining('SinnerSchrader')
        })
      ])
    })
  );
});
