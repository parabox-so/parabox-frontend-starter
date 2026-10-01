const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function capture() {
  const screenshotsDir = path.resolve(__dirname, '../../parabox-setup/products/podclip/evidence/screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  console.log('📸 Navigating to http://localhost:3002...');
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });

  const desktopPath = path.join(screenshotsDir, '01_podclip_hero_desktop.png');
  await page.screenshot({ path: desktopPath, fullPage: false });
  console.log(`✅ Saved: ${desktopPath}`);

  // Click specimen #2 to show real-time waveform update
  const buttons = await page.$$('button:has-text("VIRAL")');
  if (buttons.length > 0) {
    await buttons[0].click();
    await page.waitForTimeout(300);
  }

  const studioPath = path.join(screenshotsDir, '02_podclip_studio_interactive.png');
  await page.screenshot({ path: studioPath, fullPage: false });
  console.log(`✅ Saved: ${studioPath}`);

  // Mobile
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
  const mobilePath = path.join(screenshotsDir, '03_podclip_mobile_375px.png');
  await page.screenshot({ path: mobilePath, fullPage: false });
  console.log(`✅ Saved: ${mobilePath}`);

  await browser.close();
}

capture().catch(console.error);
