"use strict";

// Anzeige & Lesen: Einbindung auf allen Navigationsseiten, eigener Speicherschlüssel und reine Ableitungsfunktionen.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const wurzel = path.join(__dirname, "..");
const al = require("../js/anzeige-lesen.js");

function htmlDateien(ordner, liste) {
  fs.readdirSync(ordner, { withFileTypes: true }).forEach((eintrag) => {
    if (["docs", "node_modules", ".git", "tests"].includes(eintrag.name)) return;
    const voll = path.join(ordner, eintrag.name);
    if (eintrag.isDirectory()) htmlDateien(voll, liste);
    else if (eintrag.name.endsWith(".html")) liste.push(voll);
  });
  return liste;
}

test("Jede Seite mit navigation.js lädt anzeige-lesen.js direkt danach, mit passendem Pfad", () => {
  const seiten = htmlDateien(wurzel, []).filter((d) => /js\/navigation\.js"/.test(fs.readFileSync(d, "utf8")));
  assert.equal(seiten.length, 47, "erwartet: 47 Seiten mit Navigation");
  seiten.forEach((datei) => {
    const zeilen = fs.readFileSync(datei, "utf8").split("\n");
    const i = zeilen.findIndex((z) => /js\/navigation\.js"/.test(z));
    const praefix = zeilen[i].match(/src="((?:\.\.\/)*)js\/navigation\.js"/)[1];
    assert.ok(zeilen[i + 1].includes('src="' + praefix + 'js/anzeige-lesen.js"'), path.relative(wurzel, datei));
    assert.equal(zeilen.filter((z) => z.includes("anzeige-lesen.js")).length, 1, "genau einmal: " + path.relative(wurzel, datei));
    const tiefe = path.relative(wurzel, path.dirname(datei)).split(path.sep).filter(Boolean).length;
    assert.equal(praefix, "../".repeat(tiefe), "Pfadtiefe: " + path.relative(wurzel, datei));
  });
});

test("Speicherschlüssel ist der Verwaltung-Schlüssel, nicht der IT-Schlüssel", () => {
  assert.equal(al.KEY, "verwaltung-ausbildung.anzeige.v1");
  const quelle = fs.readFileSync(path.join(wurzel, "js/anzeige-lesen.js"), "utf8");
  assert.equal(quelle.includes("it-ausbildung"), false);
  assert.equal(/localStorage\.clear\(/.test(quelle), false);
});

test("Textgröße wird auf 80 bis 150 Prozent in Zehnerschritten begrenzt", () => {
  assert.equal(al.clampText(100), 100);
  assert.equal(al.clampText(20), 80);
  assert.equal(al.clampText(500), 150);
  assert.equal(al.clampText(124), 120);
  assert.equal(al.clampText("abc"), 100);
  assert.equal(al.clampText(NaN), 100);
});

test("Gespeicherte Werte werden bereinigt, unbekannte Darstellung fällt auf hell", () => {
  assert.deepEqual(al.normalisiere(null), al.defaults);
  const n = al.normalisiere({ text: 140, spacing: 1, theme: "pink", ruhig: "ja" });
  assert.equal(n.text, 140);
  assert.equal(n.spacing, true);
  assert.equal(n.theme, "hell");
  assert.equal(n.ruhig, true);
  assert.equal(al.normalisiere({ theme: "kontrast" }).theme, "kontrast");
  assert.equal(al.normalisiere({ theme: "dunkel" }).theme, "dunkel");
});

test("Ableitung: Skalierung, Abstand, Darstellung und ruhige Ansicht (Nutzerwahl oder Systemvorgabe)", () => {
  const d = al.ableiten({ text: 130, spacing: true, theme: "dunkel", ruhig: false }, false);
  assert.deepEqual(d, { scale: "1.3", theme: "dunkel", mehrAbstand: true, ruhig: false });
  assert.equal(al.ableiten(al.defaults, true).ruhig, true, "prefers-reduced-motion schaltet ruhig ein");
  assert.equal(al.ableiten({ text: 100, spacing: false, theme: "hell", ruhig: true }, false).ruhig, true);
  assert.equal(al.ableiten(al.defaults, false).ruhig, false);
});

test("Die Stilregeln für die Klassen und Themes sind in styles.css vorhanden", () => {
  const css = fs.readFileSync(path.join(wurzel, "css/styles.css"), "utf8");
  assert.match(css, /html\[data-theme="dunkel"\]/);
  assert.match(css, /html\[data-theme="kontrast"\]/);
  assert.match(css, /html\.mehr-abstand/);
  assert.match(css, /html\.ruhige-ansicht/);
  assert.match(css, /--text-scale/);
});

test("Rathaus-Flächen nutzen Theme-Variablen statt fester Weißflächen", () => {
  const css = fs.readFileSync(path.join(wurzel, "css/rathaus.css"), "utf8");
  assert.equal(/\.rathaus-option\s*\{[^}]*background: #fff;/.test(css), false);
  assert.match(css, /\.rathaus-form textarea\s*\{[^}]*background: var\(--farbe-flaeche\)/);
});
