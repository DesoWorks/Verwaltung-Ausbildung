"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const kern = require("../js/rathaus-kern.js");

const PASSENDE_ANTWORT = "Guten Tag, Herr Holm. Luca Berger wird am Dienstag für die Berufsschule freigestellt. Er kommt nicht in die Dienststelle.";
const AUSFALL_ANTWORT = "Luca soll die Berufsschule ausfallen lassen und stattdessen den Tag in der Dienststelle am Schalter arbeiten.";

test("Entscheidung B ist richtig, A ist falsch", () => {
  assert.equal(kern.bewerteEntscheidung("B").richtig, true);
  assert.equal(kern.bewerteEntscheidung("A").richtig, false);
  assert.equal(kern.bewerteEntscheidung("C").richtig, false);
  assert.equal(kern.bewerteEntscheidung("D").richtig, false);
});

test("B plus § 15 ohne Fallen plus passende Antwort besteht", () => {
  const ergebnis = kern.auswertung({
    entscheidung: "B",
    gruende: ["bbig15"],
    antwort: PASSENDE_ANTWORT
  });
  assert.equal(ergebnis.bestanden, true);
  assert.equal(ergebnis.darfAbschliessen, true);
});

test("Entscheidung A besteht nicht", () => {
  const ergebnis = kern.auswertung({
    entscheidung: "A",
    gruende: ["bbig15", "jarbschg9"],
    antwort: PASSENDE_ANTWORT
  });
  assert.equal(ergebnis.bestanden, false);
  assert.equal(ergebnis.darfAbschliessen, false);
});

test("Falle verhindert das Bestehen", () => {
  const ergebnis = kern.auswertung({
    entscheidung: "B",
    gruende: ["bbig15", "falle-mangel"],
    antwort: PASSENDE_ANTWORT
  });
  assert.equal(ergebnis.bestanden, false);
  assert.equal(kern.bewerteBegruendung(["falle-vertrag"]).hatFalle, true);
});

test("Leere Antwort besteht nicht", () => {
  const ergebnis = kern.auswertung({
    entscheidung: "B",
    gruende: ["bbig15"],
    antwort: "   "
  });
  assert.equal(ergebnis.bestanden, false);
  assert.equal(kern.bewerteAntwort("").ok, false);
});

test("Antwort, die die Schule ausfallen lässt, besteht nicht", () => {
  const ergebnis = kern.auswertung({
    entscheidung: "B",
    gruende: ["bbig15"],
    antwort: AUSFALL_ANTWORT
  });
  assert.equal(ergebnis.bestanden, false);
  assert.equal(kern.bewerteAntwort(AUSFALL_ANTWORT).ok, false);
});

test("Hilfe verrät in Stufe 3 keinen Mustertext", () => {
  const loesung = kern.lehrkraftLoesung();
  assert.equal(kern.hilfe(1).includes(loesung.mustertext), false);
  assert.equal(kern.hilfe(3).includes(loesung.mustertext), false);
  assert.match(kern.hilfe(3), /Freistell/i);
  assert.equal(loesung.rechtsstand, "01.11.2026");
  assert.match(loesung.unsicherheit, /keine Rechtsberatung/i);
});

test("Fall bleibt fiktiv und nennt die fehlenden PDFs", () => {
  const fall = kern.fallDaten();
  assert.equal(fall.person.name, "Luca Berger");
  assert.equal(fall.person.alter, 17);
  assert.equal(fall.person.stunden, 8);
  assert.equal(fall.quellen.some(function (quelle) {
    return quelle.includes("LS04");
  }), true);
});

test("Oberfläche zieht keine externen Skripte und ruft kein fetch auf", () => {
  const wurzel = path.join(__dirname, "..");
  const dateien = [
    "module/rathaus.html",
    "js/rathaus-ui.js",
    "js/rathaus-kern.js",
    "css/rathaus.css"
  ];
  dateien.forEach(function (datei) {
    const text = fs.readFileSync(path.join(wurzel, datei), "utf8");
    assert.equal(/fetch\s*\(/.test(text), false, datei + " enthält fetch");
    assert.equal(/XMLHttpRequest/.test(text), false, datei + " enthält XMLHttpRequest");
    assert.equal(/src\s*=\s*["']https?:/i.test(text), false, datei + " lädt extern");
    assert.equal(/href\s*=\s*["']https?:/i.test(text), false, datei + " verlinkt extern");
  });
});
