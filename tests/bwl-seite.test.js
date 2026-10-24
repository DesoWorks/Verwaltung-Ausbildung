"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const lies = (p) => fs.readFileSync(path.join(root, p), "utf8");

test("Seite lädt nur lokale Dateien (offline nutzbar)", () => {
  for (const datei of ["module/werkzeuge/bwl-werkstatt.html", "js/bwl-werkstatt-ui.js", "css/bwl-werkstatt.css"]) {
    const src = lies(datei);
    assert.doesNotMatch(src, /(src|href)\s*=\s*["']https?:\/\//i, datei + ": externe Adresse");
    assert.doesNotMatch(src, /@import|url\(\s*["']?https?:/i, datei + ": externer Import");
    assert.doesNotMatch(src, /fetch\(|XMLHttpRequest|localStorage|sessionStorage/, datei + ": Netzwerk oder Speicher");
  }
});

test("Alle eingebundenen Skripte und Stile der Seite existieren", () => {
  const html = lies("module/werkzeuge/bwl-werkstatt.html");
  const refs = [...html.matchAll(/(?:src|href)="((?:\.\.\/)+[^"#?]+)"/g)].map((m) => m[1]);
  assert.ok(refs.length >= 6);
  for (const ref of refs) {
    const ziel = path.resolve(root, "module/werkzeuge", ref);
    assert.ok(fs.existsSync(ziel), "fehlt: " + ref);
  }
});

test("Werkzeug ist im Katalog registriert und verweist auf eine vorhandene Seite", () => {
  const ctx = { window: {}, document: { addEventListener() {}, readyState: "complete" } };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(lies("js/module-daten.js"), ctx);
  const daten = ctx.window;
  const liste = Object.values(daten).find((v) => Array.isArray(v) && v.some((e) => e && e.id === "werkzeug-bwl-werkstatt"));
  assert.ok(liste, "Eintrag nicht gefunden");
  const eintrag = liste.find((e) => e.id === "werkzeug-bwl-werkstatt");
  assert.equal(eintrag.page, "werkzeug-bwl-werkstatt");
  assert.ok(fs.existsSync(path.join(root, eintrag.datei)));
  assert.ok(fs.existsSync(path.join(root, eintrag.lektion)));
});

test("Seite kennzeichnet sich als Testfassung ohne Fachfreigabe", () => {
  const html = lies("module/werkzeuge/bwl-werkstatt.html");
  assert.match(html, /Testfassung/);
  assert.match(html, /nicht fachlich freigegeben/);
  assert.match(html, /<html lang="de">/);
});

test("Jedes Eingabefeld der Seite hat ein Label", () => {
  const html = lies("module/werkzeuge/bwl-werkstatt.html");
  const ids = [...html.matchAll(/<input[^>]*type="text"[^>]*id="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(ids.length >= 8);
  for (const id of ids) assert.match(html, new RegExp('for="' + id + '"'), "Label fehlt: " + id);
});
