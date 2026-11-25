import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

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
  assert.match(worker, /portal-cache-v431/);
  const cacheVersion = worker.match(/portal-cache-v(\d+)/)?.[1];
  assert.ok(cacheVersion, "service worker cache version must be declared");
  assert.match(html, new RegExp("service-worker\\.js\\?v=" + cacheVersion));
  assert.match(worker, /\.\/pwa-install\.js/);
  assert.match(worker, /\.\/icons\/icon-192\.png/);
});

test("install prompt is shown, invoked, and dismissed after acceptance", async () => {
  const handlers = {};
  function element() {
    const events = {};
    return {
      hidden: true,
      textContent: "",
      addEventListener(type, callback) { events[type] = callback; },
      fire(type, event) { return events[type]?.(event); }
    };
  }
  const card = element(), button = element(), close = element();
  const help = element(), status = element();
  const nodes = { pwaInstallCard: card, pwaInstallButton: button, pwaInstallClose: close,
    pwaInstallHelp: help, pwaInstallStatus: status };
  const window = {
    navigator: { userAgent: "Android" },
    matchMedia: () => ({ matches: false }),
    addEventListener(type, callback) { handlers[type] = callback; }
  };
  const document = { getElementById(id) { return nodes[id] || null; } };
  vm.runInNewContext(read("pwa-install.js"), { window, document });
  let prevented = false;
  handlers.beforeinstallprompt({ preventDefault() { prevented = true; },
    prompt: () => Promise.resolve(), userChoice: Promise.resolve({ outcome: "accepted" }) });
  assert.equal(prevented, true);
  assert.equal(card.hidden, false);
  await button.fire("click");
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(card.hidden, true, "accepted installation should close the prompt card");
  handlers.appinstalled();
  assert.match(status.textContent, /установлен/i);
});
