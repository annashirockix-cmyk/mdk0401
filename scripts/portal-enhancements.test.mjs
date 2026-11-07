import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("four existing training tools are grouped under one laboratory hub", () => {
  const html = read("index.html");
  const hub = read("laboratory.js");
  for (const route of ["laboratory", "gcode-lab", "materials-lab", "metrology-trainer", "machining-lab"]) {
    assert.match(html, new RegExp('href="#/' + route + '"'));
  }
  for (const file of ["laboratory.js", "pdf-viewer.js"]) {
    assert.match(html, new RegExp('src="./' + file.replace(".", "\\.") + '\\?v='));
    assert.ok(read("service-worker.js").includes("./" + file));
  }
  assert.match(hub, /window\.renderLaboratoryHub/);
});

test("personal cabinet provides login, grades, portfolio and achievements", () => {
  const html = read("index.html");
  const hub = read("laboratory.js");
  for (const route of ["profile", "account", "grades", "portfolio", "achievements"]) {
    assert.ok(html.includes('href="#/' + route + '"'));
    assert.ok(hub.includes("#/" + route));
  }
  assert.match(html, /drawerCabinet/);
});

test("shop includes an expanded offline avatar and font collection", () => {
  const shop = read("shop.js");
  const avatarIds = [...shop.matchAll(/\{ id: "av\d+"/g)].length;
  const fontIds = [...shop.matchAll(/id: "font-/g)].length;
  assert.ok(avatarIds >= 16, "expected at least 16 avatar choices");
  assert.ok(fontIds >= 20, "expected at least 20 font choices");
  for (const theme of ["aurora", "ruby", "steel", "amber", "blueprint", "emerald"]) {
    assert.ok(shop.includes('id: "' + theme + '"'));
  }
  assert.match(shop, /data:image\/svg\+xml/);
});

test("workbook figures are selected by relevant topics and all referenced files exist", () => {
  const workbook = read("workbooks.js");
  assert.match(workbook, /editorial&&Array\.isArray\(editorial\.images\)/);
  assert.doesNotMatch(workbook, /meme-cat\.jpg/);
  const imageNames = [...workbook.matchAll(/add\("(fig-[^"]+\.png)"/g)].map((m) => m[1]);
  assert.ok(imageNames.length > 0);
  for (const image of imageNames) {
    assert.ok(fs.existsSync(path.join(root, "assets", "images", image)), "missing workbook image: " + image);
  }
});

test("local PDF resources have a same-site viewer and valid source files", () => {
  const workbook = read("workbooks.js");
  const viewer = read("pdf-viewer.js");
  const pdfPaths = [...workbook.matchAll(/href="(materials\/reference\/[^"]+\.pdf)"/g)].map((m) => m[1]);
  assert.ok(pdfPaths.length >= 5);
  for (const pdf of pdfPaths) {
    assert.ok(fs.existsSync(path.join(root, pdf)), "missing PDF resource: " + pdf);
  }
  assert.match(viewer, /new URL\(link\.href/);
  assert.match(viewer, /iframe/);
});
