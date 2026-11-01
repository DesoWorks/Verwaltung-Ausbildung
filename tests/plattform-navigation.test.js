"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const plattform = require("../js/plattform-navigation.js");

const wurzel = path.join(__dirname, "..");
const lies = (datei) => fs.readFileSync(path.join(wurzel, datei), "utf8");

global.window = global;
require("../js/module-daten.js");
const daten = () => ({ einstieg: global.MODULE_EINSTIEG, module: global.MODULE_DATEN, tools: global.MODULE_TOOLS });
const bereich = (id) => plattform.bereiche(daten()).find((b) => b.id === id);
const ids = (b) => b.eintraege.map((e) => e.id);

test("vier Bereiche in fester Reihenfolge mit exakten Labels", () => {
  const b = plattform.bereiche(daten());
  assert.deepStrictEqual(b.map((x) => x.id), ["themen", "praxiswelten", "unterricht", "werkzeuge"]);
  assert.deepStrictEqual(b.map((x) => x.label), ["Themenübersicht", "Praxiswelten", "Unterricht", "Werkzeuge und Glossar"]);
});

test("Virtuelles Rathaus liegt nur unter Praxiswelten und ist keine Lektion", () => {
  const praxis = bereich("praxiswelten");
  assert.deepStrictEqual(ids(praxis), ["rathaus-einstieg"]);
  const eintrag = praxis.eintraege[0];
  assert.strictEqual(eintrag.titel, "Virtuelles Rathaus");
  assert.strictEqual(eintrag.datei, "module/rathaus.html#stadt");
  assert.strictEqual(eintrag.zaehltFortschritt, false);
  assert.strictEqual(eintrag.rolle, "praxiswelt");
  ["themen", "unterricht", "werkzeuge"].forEach((id) => {
    assert.ok(!ids(bereich(id)).includes("rathaus-einstieg"), id);
  });
});

function findeFeld(knoten, id) {
  if (!knoten || typeof knoten !== "object") return null;
  if (knoten.id === id && Array.isArray(knoten.unterthemen)) return knoten;
  for (const wert of Object.values(knoten)) {
    const treffer = findeFeld(wert, id);
    if (treffer) return treffer;
  }
  return null;
}

test("Der Lernfeld-1-Verweis auf das Rathaus ist in keinem Bereich mehr vorhanden", () => {
  const titel = "Virtuelles Rathaus: Berufsschule oder Dienststelle";
  plattform.bereiche(daten()).forEach((b) => {
    assert.ok(!ids(b).includes("lf1-rathaus"), b.id);
    assert.ok(!b.eintraege.some((e) => e.titel === titel), b.id);
  });
  const roh = JSON.stringify(daten());
  assert.ok(!roh.includes("lf1-rathaus"));
  assert.ok(!roh.includes(titel));
  assert.ok(!JSON.stringify(global.MODULE_EINSTIEG).includes("lf1-rathaus"));
});

test("Lernfeld 1 hat genau die acht Lektionen in fester Reihenfolge", () => {
  const feld = findeFeld(global.MODULE_DATEN, "lf1");
  assert.ok(feld);
  assert.deepStrictEqual(feld.unterthemen.map((u) => u.id), [
    "lf1-rolle", "lf1-rechte", "lf1-betrieb", "lf1-ziele",
    "lf1-aufbau", "lf1-fortbildung", "lf1-praesentation", "lf1-lernziel"
  ]);
});

test("Werkzeuge enthalten alle Tool-ids und das Glossar", () => {
  const werkzeuge = ids(bereich("werkzeuge"));
  global.MODULE_TOOLS.forEach((t) => assert.ok(werkzeuge.includes(t.id), t.id));
  assert.ok(werkzeuge.includes("glossary"));
});

test("bereiche() verändert die übergebenen Daten nicht", () => {
  const vorher = JSON.stringify(daten());
  plattform.bereiche(daten());
  assert.strictEqual(JSON.stringify(daten()), vorher);
});

test("fortschritt.js kennt weder die Praxiswelt noch die Rathaus-Lektion", () => {
  const text = lies("js/fortschritt.js");
  assert.ok(!text.includes("rathaus-einstieg"));
  assert.ok(!text.includes("lf1-rathaus"));
});

test("navigation.js nutzt bereiche, setzt data-nav-bereich und zählt Praxiswelten nicht", () => {
  const text = lies("js/navigation.js");
  assert.ok(text.includes("PLATTFORM_NAVIGATION.bereiche("));
  assert.ok(text.includes("data-nav-bereich"));
  assert.ok(text.includes('entry.zaehltFortschritt !== false) a.setAttribute("data-progress-id"'));
  assert.ok(text.includes("zaehltFortschritt: entryData.zaehltFortschritt"));
  assert.ok(!/<button|createElement\("button"\)[^;]*nav-bereich/.test(text.split("function bereichKopf")[1].split("}")[0]));
});

test("startseite.js setzt für den Einstieg kein data-progress-id", () => {
  const text = lies("js/startseite.js");
  const eintrag = text.split("function makeEntry")[1].split("function init")[0];
  assert.ok(!eintrag.includes("data-progress-id"));
});

function htmlSeiten(ordner, liste) {
  fs.readdirSync(ordner, { withFileTypes: true }).forEach((eintrag) => {
    if (eintrag.name === ".git" || eintrag.name === "node_modules") return;
    const voll = path.join(ordner, eintrag.name);
    if (eintrag.isDirectory()) htmlSeiten(voll, liste);
    else if (eintrag.name.endsWith(".html")) liste.push(path.relative(wurzel, voll));
  });
  return liste;
}

test("jede Seite mit navigation.js lädt plattform-navigation.js davor, ohne Module", () => {
  const seiten = htmlSeiten(wurzel, []).filter((seite) => /js\/navigation\.js/.test(lies(seite)));
  assert.ok(seiten.some((seite) => seite.includes("werkzeuge/")), "Werkzeugseiten fehlen in der Prüfung");
  seiten.forEach((seite) => {
    const html = lies(seite);
    const nav = html.search(/<script src="(?:\.\.\/)*js\/navigation\.js"><\/script>/);
    const plattformPos = html.search(/<script src="(?:\.\.\/)*js\/plattform-navigation\.js"><\/script>/);
    assert.ok(nav !== -1, seite + ": navigation.js fehlt");
    assert.ok(plattformPos !== -1 && plattformPos < nav, seite + ": plattform-navigation.js fehlt oder steht zu spät");
    assert.ok(!/type="module"/.test(html), seite + ": Script-Modul");
  });
});
