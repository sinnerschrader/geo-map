import * as Fs from 'fs';
import * as TestEntry from '../src/test/integration-tests';
import * as Types from '../src/types';
import * as Util from '../src/test/util';
import * as Constants from '../src/test/constants';

beforeAll(() => {
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

test('GeoMap with HERE', async () => {
  await page.goto(`http://localhost:1338/?integration=true`);

  await page.evaluate(() => TestEntry.Tests.basicHere());

  await page.screenshot({ path: './screenshots/basic-here.png' });
  await expect(page).toMatch(/^© \d{4}.\d{4} HERE/);
});

test('Zoom with Here', async () => {
  await page.goto(`http://localhost:1338/?integration=true`);

  const input = 1;
  const actual = await page.evaluate(
    factor => TestEntry.Tests.zoomHere(factor),
    input
  );

  await page.screenshot({ path: './screenshots/zoom-here.png' });
  expect(actual).toBe(1);
});

test('Repeated zoom factor with Here', async () => {
  const repeated = 2;

  await page.goto(`http://localhost:1338/?integration=true`);
  const actual = await page.evaluate(
    zoom => TestEntry.Tests.zoomSameHere(zoom),
    repeated
  );

  await page.screenshot({ path: './screenshots/repeated-zoom-here.png' });
  expect(actual).toBe(repeated);
});

test('Type with Here', async () => {
  await page.goto(`http://localhost:1338/?integration=true`);

  const input = Types.GeoMapType.Hybrid;
  const actual = await page.evaluate(
    type => TestEntry.Tests.typeHere(type),
    input
  );

  await page.screenshot({ path: './screenshots/type-here.png' });
  expect(actual).toBe(Types.GeoMapType.Hybrid);
});

test('Marker with HERE has red marker at center', async () => {
  await page.goto(`http://localhost:1338/?integration=true`);
  await page.evaluate(() => TestEntry.Tests.markerHere());

  const screenshot = await page.screenshot({
    path: './screenshots/marker-here.png'
  });
  const parsed = await Util.parsePng(screenshot);
  expect(parsed.getPixel(parsed.width / 2, parsed.height / 2)).toEqual([
    255,
    0,
    0,
    255
  ]);
});

test('Viewport with HERE has red marker at offset center', async () => {
  const offset = 300;

  await page.goto(`http://localhost:1338/?integration=true`);
  await page.evaluate(
    (left: number) =>
      TestEntry.Tests.viewportHere({ top: 0, right: 0, bottom: 0, left }),
    offset
  );

  const screenshot = await page.screenshot({
    path: './screenshots/viewport-here.png'
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

test('Traffic Layer with HERE changes display', async () => {
  await page.goto(`http://localhost:1338/?integration=true`);

  await page.evaluate(
    (layer: Types.GeoLayer) => TestEntry.Tests.layerHere(layer),
    Types.GeoLayer.None
  );
  const before = await page.screenshot({
    path: './screenshots/layer-traffic-here-before.png'
  });

  await page.evaluate(
    (layer: Types.GeoLayer) => TestEntry.Tests.layerHere(layer),
    Types.GeoLayer.Traffic
  );
  const after = await page.screenshot({
    path: './screenshots/layer-traffic-here-after.png'
  });

  expect(before).not.toEqual(after);
});

test('Click events with HERE trigger call on event handler', async () => {
  await page.goto(`http://localhost:1338/?integration=true`);
  await page.evaluate(() => TestEntry.Tests.eventHere('click-id'));
  await page.click('[data-map="Here"]');
  const data = JSON.parse(
    String(
      await page.evaluate(
        () => document.querySelector('[data-dump="data-dump"]').textContent
      )
    )
  );
  expect(data.clicked).toBe(1);
});

test('Click events with HERE carry appropriate lat/lng data', async () => {
  const center = { lat: 7.5, lng: 10 };

  await page.goto(`http://localhost:1338/?integration=true`);
  await page.evaluate(input => TestEntry.Tests.eventPayloadHere(input), center);
  await page.mouse.click(400, 300); // click on center
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
    input => TestEntry.Tests.geocodeHere(input),
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
      provider: Types.GeoMapProvider.Here,
      formattedAddress: 'Boxhagener Straße 75, 10245 Berlin, Deutschland',
      address: expect.objectContaining({
        country: 'DEU',
        postalCode: '10245',
        locality: 'Berlin',
        route: 'Boxhagener Straße',
        streetNumber: '75'
      })
    })
  );
});

test('Search works as expected', async () => {
  await page.goto(`http://localhost:1338/?integration=true`);
  await page.evaluate(() => TestEntry.Tests.searchHere());

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
  await page.evaluate(() => TestEntry.Tests.getHere());

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
