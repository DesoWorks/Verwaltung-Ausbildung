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
  assert.equal(seiten.length, 45, "erwartet: 45 Seiten mit Navigation");
  seiten.forEach((datei) => {
    const zeilen = fs.readFileSync(datei, "utf8").split("\n");
    const i = zeilen.findIndex((z) => z.includes("anzeige-lesen.js"));
    assert.ok(i >= 0, "anzeige-lesen.js fehlt: " + path.relative(wurzel, datei));
    const praefix = zeilen[i].match(/src="((?:\.\.\/)*)js\/anzeige-lesen\.js"/)[1];
    assert.ok(zeilen[i + 1].includes('src="' + praefix + 'js/nach-oben.js"'), path.relative(wurzel, datei));
    assert.equal(zeilen.filter((z) => z.includes("nach-oben.js")).length, 1, "genau einmal: " + path.relative(wurzel, datei));
  });
});

test("CSS: fester Knopf, verborgen über [hidden], unter Dialogen, ohne Animation", () => {
  const css = fs.readFileSync(path.join(wurzel, "css", "styles.css"), "utf8");
  const start = css.indexOf("/* Nach oben:");
  assert.ok(start >= 0, "CSS-Block fehlt");
  const block = css.slice(start);
  assert.ok(/\.nach-oben\s*\{[^}]*position:\s*fixed/.test(block));
  assert.ok(block.includes(".nach-oben[hidden]"));
  assert.ok(/z-index:\s*30/.test(block));
  assert.ok(/min-height:\s*44px/.test(block));
  assert.ok(!/transition|animation/.test(block), "keine eigene Animation");
  assert.ok(/max-width:\s*560px/.test(block) && /max-height:\s*520px/.test(block));
});

test("nach-oben.js nutzt weder Speicher noch Netzwerk", () => {
  const js = fs.readFileSync(path.join(wurzel, "js", "nach-oben.js"), "utf8");
  assert.ok(!/localStorage|sessionStorage/.test(js));
  assert.ok(!/\bfetch\b|XMLHttpRequest|WebSocket/.test(js));
});
