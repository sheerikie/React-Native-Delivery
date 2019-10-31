import wd from 'wd';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
const PORT = 4723;
const config = {
  platformName: 'Android',
  deviceName: 'emulator-5554',
  app: 'https://exp-shell-app-assets.s3.us-west-1.amazonaws.com/android/%40sheerikie/Quatrix-7787b9b44dd9413b8c00ede3bf18d393-signed.apk' // relative to root of project
};
const driver = wd.promiseChainRemote('localhost', PORT);

beforeAll(async () => {
  await driver.init(config);
  await driver.sleep(2000); // wait for app to load
})
//view test
test('appium renders', async () => {
  expect(await driver.hasElementByAccessibilityId('testview')).toBe(true);
  expect(await driver.hasElementByAccessibilityId('notthere')).toBe(false);
});
//button test
test('appium button click', async () => {
    expect(await driver.hasElementByAccessibilityId('button')).toBe(true);
    await driver.elementByAccessibilityId('button')
      .click()
      .click();
  
    const counter = await driver.elementByAccessibilityId('counter').text();
    expect(counter).toBe('2');
  });
  //input test
  test('appium text input', async () => {
    const TEXT = 'hello this is appium';
    await driver.elementByAccessibilityId('textinput')
      .type(TEXT);
  
    const resultText = await driver.elementByAccessibilityId('text').text();
  
    expect(resultText).toBe(TEXT)
  });