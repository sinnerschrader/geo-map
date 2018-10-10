import * as Test from './test';
import * as Types from './types';
import * as simulant from 'jsdom-simulant';

test('GOOGLE map search result', async () => {
  const googlePlaces = await Test.createGoogleMapPlacesImplementation({
    mock: false,
    mount: { center: Test.Constants.S2_HAM, type: Types.GeoMapType.Hybrid }
  });

  const result = await googlePlaces.map.search(
    'sinnerschrader',
    Test.Constants.S2_HAM,
    50000
  );
  expect(result.type).toBe(Types.ResultType.Success);

  const payload = (result as Types.SuccessResult<Types.GeoMapPlace[]>).payload;
  expect(payload).toHaveLength(2);
});
