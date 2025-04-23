const puppeteer = require('puppeteer-core');

// Get the Node.js environment
const nodeEnv = process.env.NODE_ENV || 'development';
console.log(`Running in ${nodeEnv} mode`);

(async () => {
  try {
    const wsEndpoint = await getBrowser();
    console.log(`Browser launched with WebSocket endpoint: ${wsEndpoint}`);
    setInterval(() => {
      testBrowser(wsEndpoint)
        .then(() => {
          console.log('Browser is alive!');
        })
        .catch((error) => {
          console.error('Error testing browser:', error);
        });
    }, 10000);
  } catch (error) {
    console.error('Error launching browser:', error);
  }
})();

async function getBrowser() {
  console.log('Launching a new browser instance');
  const isLocal = nodeEnv === 'local';
  const browser = await puppeteer.launch({
    headless: true,
    debuggingPort: 9222,
    ...(isLocal ? {
      channel: 'chrome',
    } : {
      executablePath: '/usr/bin/chromium-browser',
    })
  });
  return browser.wsEndpoint();
}

async function testBrowser(wsEnpoint) {
  await puppeteer.connect({
    browserWSEndpoint: wsEnpoint,
  });
}
