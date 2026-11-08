"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const wurzel = path.join(__dirname, "..");
const dual = require("../js/lf1-dual.js");
const fortschritt = fs.readFileSync(path.join(wurzel, "js/fortschritt.js"), "utf8");

// Unabhängige Soll-Zuordnung für die LF1-A-Aufgaben. Nicht aus den Modulen abgeleitet.
const SCHLUESSEL = {
  a1: "a", a2: "b", a3: "c", a4: "a", a5: "c",
  k1: "b", k2: "a", k3: "c", k4: "b"
};

function fortschrittsSchluessel() {
  const eintrag = fortschritt.match(/"lf1-dual"\s*:\s*\{([^}]*)\}/);
  assert.ok(eintrag, "fortschritt.js enthält einen Schlüssel für lf1-dual");
  const paare = [...eintrag[1].matchAll(/([a-z][a-z0-9]*)\s*:\s*"([abc])"/g)];
  return Object.fromEntries(paare.map(([, id, wert]) => [id, wert]));
}

test("LF1-A-Aufgaben sind vollständig und besitzen jeweils einen auswählbaren, unabhängigen Schlüsselwert", () => {
  const ids = dual.FRAGEN.map((frage) => frage.id).sort();
  assert.deepStrictEqual(ids, Object.keys(SCHLUESSEL).sort(), "Fragen und Soll-Schlüssel müssen dieselbe ID-Menge haben");

  dual.FRAGEN.forEach((frage) => {
    assert.ok(frage.options.some((option) => option.value === SCHLUESSEL[frage.id]), `${frage.id}: Soll-Antwort ist auswählbar`);
  });
});

test("plattformweiter Fortschrittsschlüssel stimmt mit dem unabhängigen LF1-A-Soll überein", () => {
  assert.deepStrictEqual(fortschrittsSchluessel(), SCHLUESSEL);
});
