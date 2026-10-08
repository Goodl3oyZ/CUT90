import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function generateScreenshots() {
  const outputDir = path.join(process.cwd(), 'docs', 'screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const baseUrl = process.env.BASE_URL || 'http://localhost:3333';

  // Helper to capture light and dark at specified viewport
  async function capture(urlPath: string, name: string) {
    const fullUrl = `${baseUrl}${urlPath}`;

    // Mobile 360px Light
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto(fullUrl, { waitUntil: 'networkidle' }).catch(() => { });
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    await page.screenshot({ path: path.join(outputDir, `${name}-mobile-light.png`) });

    // Mobile 360px Dark
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.screenshot({ path: path.join(outputDir, `${name}-mobile-dark.png`) });

    // Desktop 1280px Light
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    await page.screenshot({ path: path.join(outputDir, `${name}-desktop-light.png`) });

    // Desktop 1280px Dark
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.screenshot({ path: path.join(outputDir, `${name}-desktop-dark.png`) });
  }

  console.log('Capturing screenshots for documentation...');
  try {
    await capture('/login', 'login');
    await capture('/help', 'help');
  } catch (err) {
    console.error('Error taking screenshots:', err);
  } finally {
    await browser.close();
  }
}

generateScreenshots();
