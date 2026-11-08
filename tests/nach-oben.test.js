"use strict";

// Nach oben: reine Funktionen, Einbindung auf allen Navigationsseiten, CSS-Grundregeln, Offline-Zusagen.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const wurzel = path.join(__dirname, "..");
const no = require("../js/nach-oben.js");

function htmlDateien(ordner, liste) {
  fs.readdirSync(ordner, { withFileTypes: true }).forEach((eintrag) => {
    if (["docs", "node_modules", ".git", "tests"].includes(eintrag.name)) return;
    const voll = path.join(ordner, eintrag.name);
    if (eintrag.isDirectory()) htmlDateien(voll, liste);
    else if (eintrag.name.endsWith(".html")) liste.push(voll);
  });
  return liste;
}

test("Schwelle und Sichtbarkeit: erst ab 300 Pixeln", () => {
  assert.equal(no.SCHWELLE, 300);
  assert.equal(no.sichtbar(0, no.SCHWELLE), false);
  assert.equal(no.sichtbar(299, no.SCHWELLE), false);
  assert.equal(no.sichtbar(300, no.SCHWELLE), true);
  assert.equal(no.sichtbar(1200, no.SCHWELLE), true);
  assert.equal(no.sichtbar(299), false);
  assert.equal(no.sichtbar(300), true);
  assert.equal(no.sichtbar(NaN, 300), false);
  assert.equal(no.sichtbar(undefined, 300), false);
});

test("Scrollverhalten folgt reduzierter Bewegung, Ziel ist der Hauptinhalt", () => {
  assert.equal(no.verhalten(true), "auto");
  assert.equal(no.verhalten(false), "smooth");
  assert.equal(no.zielId(), "hauptinhalt");
});

test("Knopf bleibt verborgen, solange der Inhaltsanfang noch nicht hinter dem Fenster liegt", () => {
  assert.equal(no.angekommen(80, 80), true);
  assert.equal(no.angekommen(426, 426), true);
  assert.equal(no.angekommen(500, 426), false);
  assert.equal(no.zeigen(299, 80), false);
  assert.equal(no.zeigen(350, 426), false, "hoher Kopf: 350 px sind noch vor dem Inhalt");
  assert.equal(no.zeigen(400, 120), true);
  assert.equal(no.zeigen(800, 426), true);
  assert.equal(no.zeigen(426, 426), false, "am Inhaltsanfang verschwindet der Knopf, auch über 300 px");
});

test("Jede Seite mit navigation.js lädt nach-oben.js direkt nach anzeige-lesen.js, genau einmal", () => {
  const seiten = htmlDateien(wurzel, []).filter((d) => /js\/navigation\.js"/.test(fs.readFileSync(d, "utf8")));
  assert.equal(seiten.length, 48, "erwartet: 48 Seiten mit Navigation");
  seiten.forEach((datei) => {
    const zeilen = fs.readFileSync(datei, "utf8").split("\n");
    const i = zeilen.findIndex((z) => z.includes("anzeige-lesen.js"));
    assert.ok(i >= 0, "anzeige-lesen.js fehlt: " + path.relative(wurzel, datei));
    const praefix = zeilen[i].match(/src="((?:\.\.\/)*)js\/anzeige-lesen\.js"/)[1];
    assert.ok(zeilen[i + 1].includes('src="' + praefix + 'js/nach-oben.js"'), path.relative(wurzel, datei));
    assert.equal(zeilen.filter((z) => z.includes("nach-oben.js")).length, 1, "genau einmal: " + path.relative(wurzel, datei));
  });
});

test("CSS: fester Knopf, verborgen über [hidden], unter Dialogen, Fade nur über opacity", () => {
  const css = fs.readFileSync(path.join(wurzel, "css", "styles.css"), "utf8");
  const start = css.indexOf("/* Nach oben:");
  assert.ok(start >= 0, "CSS-Block fehlt");
  const block = css.slice(start);
  assert.ok(/\.nach-oben\s*\{[^}]*position:\s*fixed/.test(block));
  assert.ok(block.includes(".nach-oben[hidden]"));
  assert.ok(/z-index:\s*30/.test(block));
  assert.ok(/min-height:\s*44px/.test(block));
  assert.ok(!/animation|@keyframes/.test(block), "keine Keyframe-Animation");
  assert.ok(!/transition:[^;]*transform/.test(block), "transform gehört dem Ausweichen und wird nicht animiert");
  assert.ok(!/scale\(|bounce/.test(block), "kein Zoom und kein Bounce");
  assert.ok(/max-width:\s*560px/.test(block) && /max-height:\s*520px/.test(block));
});

test("CSS: Fade-in und Fade-out je 200 ms nur über opacity, unsichtbar ohne Klicks", () => {
  const css = fs.readFileSync(path.join(wurzel, "css", "styles.css"), "utf8");
  const block = css.slice(css.indexOf("/* Nach oben:"));
  const basis = block.match(/\.nach-oben\s*\{[^}]*\}/)[0];
  assert.ok(/opacity:\s*0/.test(basis) && /visibility:\s*hidden/.test(basis) && /pointer-events:\s*none/.test(basis));
  assert.ok(/transition:\s*opacity 200ms/.test(basis), "Fade-out 200 ms");
  const sichtbar = block.match(/\.nach-oben\.ist-sichtbar\s*\{[^}]*\}/)[0];
  assert.ok(/opacity:\s*1/.test(sichtbar) && /visibility:\s*visible/.test(sichtbar) && /pointer-events:\s*auto/.test(sichtbar));
  assert.ok(/transition:\s*opacity 200ms/.test(sichtbar), "Fade-in 200 ms");
  assert.equal(no.FADE_MS, 200);
});

test("CSS: reduzierte Bewegung schaltet den Fade ab", () => {
  const css = fs.readFileSync(path.join(wurzel, "css", "styles.css"), "utf8");
  const block = css.slice(css.indexOf("/* Nach oben:"));
  assert.ok(/html\.ruhige-ansicht \.nach-oben[^{]*\{[^}]*transition:\s*none/.test(block));
  assert.ok(/html\.bewegung-reduziert \.nach-oben[^{]*\{[^}]*transition:\s*none/.test(block));
  assert.ok(/@media \(prefers-reduced-motion: reduce\)\s*\{[^}]*\.nach-oben[^}]*transition:\s*none/.test(block));
});

test("Zustandswechsel: Einblenden, Ausblenden erst per Fade, schnelles Hin und Her", () => {
  assert.deepEqual(no.plan("verborgen", true, false), { zustand: "sichtbar", aktion: "einblenden" });
  assert.deepEqual(no.plan("sichtbar", true, false), { zustand: "sichtbar", aktion: "nichts" });
  assert.deepEqual(no.plan("sichtbar", false, false), { zustand: "ausblendend", aktion: "ausblenden" });
  assert.deepEqual(no.plan("ausblendend", false, false), { zustand: "ausblendend", aktion: "nichts" }, "kein zweiter Timer");
  assert.deepEqual(no.plan("ausblendend", true, false), { zustand: "sichtbar", aktion: "abbrechen" }, "Wiedereinblenden bricht den Ausblend-Timer ab");
  assert.deepEqual(no.plan("verborgen", false, false), { zustand: "verborgen", aktion: "nichts" });
  // Schnelles Auf und Ab endet immer in einem klaren Zustand.
  let z = "verborgen";
  [true, false, true, false, false, true, true, false].forEach((soll) => { z = no.plan(z, soll, false).zustand; });
  assert.equal(z, "ausblendend");
  z = no.plan(z, true, false).zustand;
  assert.equal(z, "sichtbar");
});

test("Reduzierte Bewegung: sofort verborgen, ohne Ausblendphase", () => {
  assert.deepEqual(no.plan("sichtbar", false, true), { zustand: "verborgen", aktion: "verbergen" });
  assert.deepEqual(no.plan("verborgen", true, true), { zustand: "sichtbar", aktion: "einblenden" });
});

test("nach-oben.js: hidden erst nach dem Ausblenden, Timer wird abgebrochen, Reflow vor dem Einblenden", () => {
  const js = fs.readFileSync(path.join(wurzel, "js", "nach-oben.js"), "utf8");
  assert.ok(/clearTimeout/.test(js) && /setTimeout/.test(js));
  assert.ok(/offsetWidth/.test(js), "Reflow-Grenze vor dem Einblenden");
  assert.ok(/tabindex/.test(js) && /aria-hidden/.test(js));
  assert.ok(!/style\.transition|style\.opacity/.test(js), "Fade liegt im CSS");
});

test("nach-oben.js nutzt weder Speicher noch Netzwerk", () => {
  const js = fs.readFileSync(path.join(wurzel, "js", "nach-oben.js"), "utf8");
  assert.ok(!/localStorage|sessionStorage/.test(js));
  assert.ok(!/\bfetch\b|XMLHttpRequest|WebSocket/.test(js));
});
