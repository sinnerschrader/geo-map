import * as Fs from 'fs';
import * as TestEntry from '../src/test/integration-tests';
import * as Types from '../src/types';
import * as Util from '../src/test/util';
import * as Constants from '../src/test/constants';

beforeAll(async () => {
  if (!Fs.existsSync('./screenshots')) {
    Fs.mkdirSync('./screenshots');
  }

  page.setUserAgent(Constants.USER_AGENT);

  page.on('console', e => {
    if (e.text().startsWith('[HMR]') || e.text().startsWith('[WDS]')) {
      return;
    }
    console.log(e);
  });
});

beforeEach(async () => {
  await page.setViewport({ width: 800, height: 600 });
});

test('GeoMap with Google', async () => {
  await page.goto(`http://localhost:1338/?integration=true`);
  await page.evaluate(() => TestEntry.Tests.basicGoogle());

  // Check if the Google Maps copyright notice is found
  await page.screenshot({ path: './screenshots/basic-google.png' });
  await expect(page).toMatch(/Map data ©\d{4}/);
});

test('Zoom with Google', async () => {
  await page.goto(`http://localhost:1338/?integration=true`);

  const input = 1;
  const actual = await page.evaluate(
    factor => TestEntry.Tests.zoomGoogle(factor),
    input
  );

  await page.screenshot({ path: './screenshots/zoom-google.png' });
  await expect(actual).toBe(1);
});

test('Type with Google', async () => {
  await page.goto(`http://localhost:1338/?integration=true`);

  const input = Types.GeoMapType.Hybrid;
  const actual = await page.evaluate(
    type => TestEntry.Tests.typeGoogle(type),
    input
  );

  await page.screenshot({ path: './screenshots/type-google.png' });
  await expect(actual).toBe(input);
});

test('Marker with Google has red marker at center', async () => {
  if (process.env.CI) {
    console.warn(
      'Marker with Google has red marker at center disabled due to flakiness'
    );
    return;
  }

  await page.goto(`http://localhost:1338/?integration=true`);
  await page.evaluate(() => TestEntry.Tests.markerGoogle());

  const screenshot = await page.screenshot({
    path: './screenshots/marker-google.png'
  });
  const parsed = await Util.parsePng(screenshot);
  expect(parsed.getPixel(parsed.width / 2, parsed.height / 2)).toEqual([
    255,
    0,
    0,
    255
  ]);
});

test('Viewport with Google has red marker at offset center', async () => {
  const offset = 300;

  await page.goto(`http://localhost:1338/?integration=true`);
  await page.evaluate(
    left =>
      TestEntry.Tests.viewportGoogle({ top: 0, right: 0, bottom: 0, left }),
    offset
  );

  const screenshot = await page.screenshot({
    path: './screenshots/viewport-google.png'
  });
  const parsed = await Util.parsePng(screenshot);

  expect(parsed.getPixel(parsed.width / 2, parsed.height / 2)).not.toEqual([
    255,
    0,
    0,
    255
  ]);
  expect(
    parsed.getPixel(parsed.width / 2 - offset / 2, parsed.height / 2)
  ).toEqual([255, 0, 0, 255]);
});

test('Traffic Layer with Google changes display', async () => {
  await page.goto(`http://localhost:1338/?integration=true`);

  await page.evaluate(
    layer => TestEntry.Tests.layerGoogle(layer),
    Types.GeoLayer.None
  );
  const before = await page.screenshot({
    path: './screenshots/layer-traffic-google-before.png'
  });

  await page.evaluate(
    layer => TestEntry.Tests.layerGoogle(layer),
    Types.GeoLayer.Traffic
  );
  const after = await page.screenshot({
    path: './screenshots/layer-traffic-google-after.png'
  });

  expect(before).not.toEqual(after);
});

test('Click events with Google trigger call on event handler', async () => {
  await page.goto(`http://localhost:1338/?integration=true`);
  await page.evaluate(() => TestEntry.Tests.eventGoogle('click-id'));
  await page.click('[data-map="Google"]');
  await page.waitForSelector('[data-dump="data-dump"]');

  const data = JSON.parse(
    String(
      await page.evaluate(
        () => document.querySelector('[data-dump="data-dump"]').textContent
      )
    )
  );
  expect(data.clicked).toBe(1);
});

test('Click events with Google carry appropriate lat/lng data', async () => {
  const center = { lat: 10, lng: 7.5 };

  await page.goto(`http://localhost:1338/?integration=true`);
  await page.evaluate(
    input => TestEntry.Tests.eventPayloadGoogle(input),
    center
  );
  await page.mouse.click(400, 300); // click on center
  await page.waitForSelector('[data-dump="data-dump"]');

  const { position } = JSON.parse(
    String(
      await page.evaluate(
        () => document.querySelector('[data-dump="data-dump"]').textContent
      )
    )
  );

  expect(position.lat).toBeCloseTo(center.lat);
  expect(position.lng).toBeCloseTo(center.lng);
});

test('Geocoding works as expected', async () => {
  await page.goto(`http://localhost:1338/?integration=true`);
  await page.evaluate(
    input => TestEntry.Tests.geocodeGoogle(input),
    Constants.S2_BER
  );
  await page.mouse.click(400, 300); // click on center
  await page.waitForSelector('[data-dump="data-dump"]');

  const data = JSON.parse(
    String(
      await page.evaluate(
        () => document.querySelector('[data-dump="data-dump"]').textContent
      )
    )
  );

  expect(data).toEqual(
    expect.objectContaining({
      provider: Types.GeoMapProvider.Google,
      formattedAddress: 'Boxhagener Str. 76, 10245 Berlin, Germany',
      address: expect.objectContaining({
        country: 'Germany',
        postalCode: '10245',
        locality: 'Berlin',
        route: 'Boxhagener Straße',
        streetNumber: '76'
      })
    })
  );
});

test('Search works as expected', async () => {
  await page.goto(`http://localhost:1338/?integration=true`);
  await page.evaluate(() => TestEntry.Tests.searchGoogle());

  const data = JSON.parse(
    String(
      await page.evaluate(
        () => document.querySelector('[data-dump="data-dump"]').textContent
      )
    )
  );

  expect(data).toContainEqual(
    expect.objectContaining({
      name: expect.stringContaining('Hamburg')
    })
  );
});

test('getPlace works as expected', async () => {
  await page.goto(`http://localhost:1338/?integration=true`);
  await page.evaluate(() => TestEntry.Tests.getGoogle());

  const data = JSON.parse(
    String(
      await page.evaluate(
        () => document.querySelector('[data-dump="data-dump"]').textContent
      )
    )
  );

  expect(data).toEqual(
    expect.objectContaining({
      name: expect.stringContaining('Hamburg')
    })
  );
});
