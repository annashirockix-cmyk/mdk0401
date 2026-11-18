import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
try {
  const response = await page.goto(process.env.PORTAL_NAV_AUDIT_URL || "http://127.0.0.1:4173/", { waitUntil: "domcontentloaded", timeout: 45000 });
  assert.ok(response && response.ok(), `Portal did not load: ${response?.status()}`);
  await page.evaluate(() => document.getElementById("loginOverlay")?.remove());
  const menuButton = page.locator("#burgerBtn");
  await menuButton.click();
  await page.waitForFunction(() => document.getElementById("drawer")?.classList.contains("open"));
  assert.equal(await menuButton.getAttribute("aria-expanded"), "true");
  assert.equal(await menuButton.getAttribute("aria-label"), "Закрыть навигацию");
  assert.equal(await page.locator("body").evaluate(el => el.style.overflow), "hidden");
  assert.equal(await page.locator("#drawerSearch").evaluate(el => el === document.activeElement), true);

  const lastLink = page.locator("#drawer a.drawer-item").last();
  await lastLink.focus();
  await page.keyboard.press("Tab");
  assert.equal(await page.locator("#drawerClose").evaluate(el => el === document.activeElement), true, "Tab must wrap to the first drawer control");
  await page.keyboard.press("Shift+Tab");
  assert.equal(await lastLink.evaluate(el => el === document.activeElement), true, "Shift+Tab must wrap to the last drawer control");

  const search = page.locator("#drawerSearch");
  await search.fill("профиль");
  await page.keyboard.press("Escape");
  assert.equal(await search.inputValue(), "", "first Escape clears the search");
  assert.equal(await page.locator("#drawer").evaluate(el => el.classList.contains("open")), true, "first Escape keeps the drawer open");
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#drawer").evaluate(el => el.classList.contains("open")), false, "second Escape closes the drawer");
  assert.equal(await page.locator("body").evaluate(el => el.style.overflow), "", "closing restores the page scroll state");
  assert.equal(await menuButton.getAttribute("aria-expanded"), "false");
  assert.equal(await menuButton.evaluate(el => el === document.activeElement), true, "focus returns to the menu trigger");

  await menuButton.click();
  await page.locator("#drawerCabinet > summary").click();
  await page.locator('#drawer a[href="#/profile"]').click();
  assert.equal(await page.locator("#drawer").evaluate(el => el.classList.contains("open")), false);
  assert.equal(await page.locator("#app").evaluate(el => el === document.activeElement), true, "navigation moves focus to main content");
  console.log("Portal navigation browser audit passed: mobile drawer, focus loop, Escape, scroll lock and route focus.");
} finally {
  await browser.close();
}
