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

test("lf1-rathaus liegt nur unter Unterricht in Lernfeld 1 als Lektion", () => {
  const lektion = bereich("unterricht").eintraege.find((e) => e.id === "lf1-rathaus");
  assert.ok(lektion);
  assert.strictEqual(lektion.rolle, "lektion");
  assert.strictEqual(lektion.lernfeld, "lf1");
  assert.strictEqual(lektion.datei, "module/rathaus.html#vorgang");
  assert.ok(!ids(bereich("praxiswelten")).includes("lf1-rathaus"));
  assert.ok(!ids(bereich("werkzeuge")).includes("lf1-rathaus"));
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

test("jede Seite mit navigation.js lädt plattform-navigation.js davor, ohne Module", () => {
  const seiten = ["index.html", "glossar.html"].concat(
    fs.readdirSync(path.join(wurzel, "module")).filter((f) => f.endsWith(".html")).map((f) => "module/" + f)
  );
  seiten.forEach((seite) => {
    const html = lies(seite);
    const nav = html.search(/<script src="(\.\.\/)?js\/navigation\.js"><\/script>/);
    const plattformPos = html.search(/<script src="(\.\.\/)?js\/plattform-navigation\.js"><\/script>/);
    assert.ok(nav !== -1, seite + ": navigation.js fehlt");
    assert.ok(plattformPos !== -1 && plattformPos < nav, seite + ": plattform-navigation.js fehlt oder steht zu spät");
    assert.ok(!/type="module"/.test(html), seite + ": Script-Modul");
  });
});
