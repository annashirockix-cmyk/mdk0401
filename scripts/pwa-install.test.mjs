import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const root = new URL("../", import.meta.url);
const read = (name) => fs.readFileSync(new URL(name, root), "utf8");

test("portal exposes a standards-based install prompt and mobile home-screen guidance", () => {
  const html = read("index.html");
  const script = read("pwa-install.js");
  const manifest = JSON.parse(read("manifest.json"));
  const worker = read("service-worker.js");
  assert.match(html, /rel="manifest" href="\.\/manifest\.json"/);
  assert.match(html, /apple-mobile-web-app-capable/);
  assert.match(html, /pwaInstallCard/);
  assert.match(html, /pwa-install\.js\?v=1/);
  assert.match(script, /beforeinstallprompt/);
  assert.match(script, /appinstalled/);
  assert.match(script, /На экран Домой/);
  assert.match(script, /display-mode: standalone/);
  assert.equal(manifest.display, "standalone");
  assert.deepEqual(manifest.display_override, ["standalone", "minimal-ui"]);
  assert.ok(manifest.icons.some((icon) => icon.src === "icons/icon-192.png"));
  assert.ok(manifest.icons.some((icon) => icon.src === "icons/icon-512.png"));
  assert.match(worker, /portal-cache-v425/);
  assert.match(worker, /\.\/pwa-install\.js/);
  assert.match(worker, /\.\/icons\/icon-192\.png/);
});
