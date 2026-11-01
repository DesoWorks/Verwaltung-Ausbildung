"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const kern = require("../js/rathaus-kern.js");

const PASSENDE_ANTWORT = "Guten Tag, Herr Holm. Luca Berger wird am Dienstag für die Berufsschule freigestellt. Er kommt nicht in die Dienststelle.";
const AUSFALL_ANTWORT = "Luca soll die Berufsschule ausfallen lassen und stattdessen den Tag in der Dienststelle am Schalter arbeiten.";
const WINDOWS_FALSCHE_RICHTUNG = "Guten Tag Herr Holm, leider ist es uns rechtlich nicht möglich, Luca von der Berufsschule freizustellen und in die Firma zu beordern. Luca wird zur Berufsschule gehen. Mit freundlichen Grüßen Frau Holtz";
const UMGEKEHRTE_FREISTELLUNG = "Luca Berger erhält eine Freistellung von der Berufsschule und muss an diesem Tag nicht zum Unterricht.";

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

test("Fall bleibt fiktiv und nennt öffentliche Rechtsquellen", () => {
  const fall = kern.fallDaten();
  assert.equal(fall.person.name, "Luca Berger");
  assert.equal(fall.person.alter, 17);
  assert.equal(fall.person.stunden, 8);
  assert.equal(fall.quellen.some(function (quelle) {
    return quelle.includes("BBiG");
  }), true);
});

test("Nutzeransichten enthalten keine internen Angaben", () => {
  const loesung = kern.lehrkraftLoesung();
  const sichtbar = [].concat(kern.fallDaten().quellen, loesung.quellen, [loesung.unsicherheit]).join(" | ");
  ["/home/starnet", "unterrichtsmaterial", "VPS", "Scan", "nicht vollständig ausgewertet", "LS04"].forEach(function (verboten) {
    assert.equal(sichtbar.includes(verboten), false, verboten);
  });
  ["BBiG", "JArbSchG", "KMK", "01.11.2026", "gesetze-im-internet.de"].forEach(function (pflicht) {
    assert.equal(sichtbar.includes(pflicht), true, pflicht);
  });
  assert.match(loesung.unsicherheit, /vorläufig|Vorläufige/i);
  assert.match(loesung.unsicherheit, /nicht verbindlich/);
  assert.match(loesung.unsicherheit, /keine Rechtsberatung/);
  assert.match(loesung.unsicherheit, /Länderregeln/);
  const ui = fs.readFileSync(path.join(__dirname, "../js/rathaus-ui.js"), "utf8");
  assert.equal(ui.includes("berufsschule-statt-dienststelle"), false);
  assert.equal(/fall\.id/.test(ui), false, "Die Fallkennung wird nicht gerendert");
  assert.equal(/fallId/.test(ui), false);
  assert.match(ui, /Nur lokaler Test\. Keine echte Rollenprüfung\. Nicht produktiv\. Keine Schülerdaten\./);
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

function alteAbschlussLogik(zustand) {
  const ergebnis = kern.auswertung({
    entscheidung: zustand.entscheidung,
    gruende: zustand.gruende,
    antwort: zustand.antwort
  });
  let abgeschlossen = zustand.abgeschlossen;
  if (!ergebnis.bestanden) abgeschlossen = false;
  return { abgeschlossen: abgeschlossen, letzteAuswertung: ergebnis };
}

test("Regression: neue bestandene Auswertung hebt einen früheren Abschluss auf", () => {
  const vorher = {
    abgeschlossen: true,
    akteGelesen: true,
    entscheidung: "B",
    gruende: ["bbig15"],
    antwort: PASSENDE_ANTWORT,
    versuche: 2
  };
  const alt = alteAbschlussLogik(vorher);
  assert.equal(alt.letzteAuswertung.bestanden, true);
  assert.equal(alt.abgeschlossen, true, "Die Nachstellung von 024f82c muss den alten Fehler noch zeigen");

  const neu = kern.nachPruefung(vorher);
  assert.equal(neu.letzteAuswertung.bestanden, true);
  assert.equal(neu.letzteAuswertung.darfAbschliessen, true);
  assert.equal(neu.abgeschlossen, false);
  assert.equal(neu.versuche, 3);
  assert.equal(vorher.abgeschlossen, true, "Der Ausgangszustand darf nicht verändert werden");
});

test("Regression: neue nicht bestandene Auswertung lässt den Abschluss ebenfalls fallen", () => {
  const neu = kern.nachPruefung({
    abgeschlossen: true,
    akteGelesen: true,
    entscheidung: "A",
    gruende: ["bbig15"],
    antwort: PASSENDE_ANTWORT,
    versuche: 1
  });
  assert.equal(neu.letzteAuswertung.bestanden, false);
  assert.equal(neu.abgeschlossen, false);
});

test("Regression: ohne gelesene Akte bleibt der Vorgang offen", () => {
  const neu = kern.nachPruefung({
    abgeschlossen: true,
    akteGelesen: false,
    entscheidung: "B",
    gruende: ["bbig15"],
    antwort: PASSENDE_ANTWORT,
    versuche: 4
  });
  assert.equal(neu.letzteAuswertung.bestanden, false);
  assert.equal(neu.letzteAuswertung.darfAbschliessen, false);
  assert.equal(neu.abgeschlossen, false);
  assert.match(neu.letzteAuswertung.hinweise[0], /Ausbildungsakte/);
});

test("Oberfläche übernimmt den zurückgesetzten Abschluss", () => {
  const ui = fs.readFileSync(path.join(__dirname, "../js/rathaus-ui.js"), "utf8");
  const start = ui.indexOf('pruefen.addEventListener("click"');
  const ende = ui.indexOf('fokus("auswertung-titel")', start);
  const handler = ui.slice(start, ende);
  assert.notEqual(start, -1);
  assert.match(handler, /kern\.nachPruefung\(state\)/);
  assert.match(handler, /state\.abgeschlossen\s*=\s*naechster\.abgeschlossen/);
  assert.equal(/if\s*\(\s*!state\.letzteAuswertung\.bestanden\s*\)\s*state\.abgeschlossen/.test(handler), false);
});

test("Regression: Windows-Satz mit Freistellung von der Berufsschule besteht nicht", () => {
  const bewertet = kern.bewerteAntwort(WINDOWS_FALSCHE_RICHTUNG);
  assert.equal(
    bewertet.ok,
    false,
    "Der Satz dreht die Richtung: von der Berufsschule statt von der Arbeit."
  );
  const ergebnis = kern.auswertung({
    entscheidung: "B",
    gruende: ["bbig15"],
    antwort: WINDOWS_FALSCHE_RICHTUNG
  });
  assert.equal(ergebnis.bestanden, false);
  assert.equal(ergebnis.darfAbschliessen, false);
  assert.equal(kern.bewerteAntwort(UMGEKEHRTE_FREISTELLUNG).ok, false);
});

test("Richtige Formulierungen der Freistellung bestehen weiterhin", () => {
  const varianten = [
    PASSENDE_ANTWORT,
    "Luca Berger wird von der Arbeit freigestellt, damit er die Berufsschule besuchen kann. Er kommt nicht in die Dienststelle.",
    "Wir stellen Luca für den Berufsschultag frei. Er geht zur Berufsschule und nicht in die Dienststelle."
  ];
  varianten.forEach(function (text) {
    const bewertet = kern.bewerteAntwort(text);
    assert.equal(bewertet.ok, true, text + " -> " + bewertet.hinweise.join(" | "));
  });
});

test("Umgekehrte Richtung wird erklärt, ohne den Mustertext zu nennen", () => {
  const hinweise = kern.bewerteAntwort(WINDOWS_FALSCHE_RICHTUNG).hinweise.join(" ");
  assert.match(hinweise, /dreht die Richtung/);
  assert.equal(hinweise.includes(kern.lehrkraftLoesung().mustertext), false);
});

test("Nur zur Berufsschule gehen reicht nicht", () => {
  const text = "Guten Tag, Herr Holm. Luca wird am Dienstag zur Berufsschule gehen und kommt nicht in die Dienststelle.";
  assert.equal(kern.bewerteAntwort(text).ok, false);
});

test("Akte spricht einfach, Fachbegriff abbedingen steht im Glossar", () => {
  const fall = kern.fallDaten();
  assert.equal(fall.akte.vertrag.includes("abbedungen"), false);
  const katalog = kern.katalog();
  assert.equal(katalog.begriffe.some(function (eintrag) {
    return eintrag.begriff === "abbedingen" && /Vertrag/.test(eintrag.erklaerung);
  }), true);
  const vertragFalle = katalog.gruende.find(function (g) { return g.id === "falle-vertrag"; });
  assert.match(vertragFalle.text, /abbedungen/);
  assert.match(vertragFalle.text, /Abbedingen heißt/);
});

test("Entscheidungen B und D sind in sachlicher Sprache formuliert", () => {
  const entscheidungen = kern.katalog().entscheidungen;
  ["B", "D"].forEach(function (id) {
    const text = entscheidungen.find(function (e) { return e.id === id; }).text;
    assert.equal(/einteilen/.test(text), false, id);
    assert.equal(/Schalter machen/.test(text), false, id);
  });
});

test("Auswahltexte der Gründe verraten die Folge nicht", () => {
  const gruende = kern.katalog().gruende;
  gruende.forEach(function (g) {
    assert.equal(/mehr als fünf/.test(g.text), false, g.id);
    assert.equal(/gilt die Freistellung für den Tag/.test(g.text), false, g.id);
    assert.equal(/nicht zu beschäftigen/.test(g.text), false, g.id);
  });
  const text = function (id) { return gruende.find(function (g) { return g.id === id; }).text; };
  assert.equal(text("bbig15"), "BBiG § 15: Freistellung für den Berufsschulunterricht.");
  assert.equal(text("jarbschg9"), "JArbSchG § 9: Schutz von Jugendlichen beim Berufsschulbesuch.");
  kern.bewerteBegruendung([]).hinweise.concat(kern.bewerteBegruendung(["falle-mangel"]).hinweise).forEach(function (h) {
    assert.equal(/mehr als fünf/.test(h), false);
  });
});

test("Gesetzeserklärung erklärt Begriffe ohne Lösung", () => {
  const erklaerung = kern.gesetzesErklaerung();
  const alles = JSON.stringify(erklaerung);
  assert.match(alles, /Freistellung/);
  assert.match(alles, /Unterrichtsstunde/);
  assert.match(alles, /einmal in der Woche/);
  assert.equal(/mehr als fünf/.test(alles), false);
  assert.equal(/Entscheidung B/.test(alles), false);
  assert.equal(alles.includes(kern.lehrkraftLoesung().mustertext), false);
});

test("Oberfläche zeigt die Gesetzeserklärung einklappbar und geschlossen", () => {
  const ui = fs.readFileSync(path.join(__dirname, "../js/rathaus-ui.js"), "utf8");
  assert.match(ui, /gesetzesErklaerung\(\)/);
  assert.match(ui, /el\("details", "rathaus-begriffe rathaus-gesetze"\)/);
  assert.equal(/erklaerDetails\.open\s*=\s*true/.test(ui), false);
});

test("Hilfestufen lassen sich zurückschalten und einklappen", () => {
  assert.equal(kern.hilfeWechsel(2, "weniger"), 1);
  assert.equal(kern.hilfeWechsel(1, "weniger"), 0);
  assert.equal(kern.hilfeWechsel(0, "weniger"), 0);
  assert.equal(kern.hilfeWechsel(3, "einklappen"), 0);
  assert.equal(kern.hilfeWechsel(3, "mehr"), 3);
  assert.equal(kern.hilfeWechsel(0, "mehr"), 1);
  assert.equal(kern.hilfeWechsel(7, "halten"), 3);
});

test("Stufe 0 zeigt keinen Hilfetext, Stufe 3 keinen Mustertext", () => {
  assert.equal(kern.hilfe(0), "");
  assert.notEqual(kern.hilfe(1), "");
  assert.equal(kern.hilfe(3).includes(kern.lehrkraftLoesung().mustertext), false);
});

test("Oberfläche bietet drei Hilfeknöpfe und hält aria-expanded passend", () => {
  const ui = fs.readFileSync(path.join(__dirname, "../js/rathaus-ui.js"), "utf8");
  assert.match(ui, /"Mehr Hilfe"/);
  assert.match(ui, /"Weniger Hilfe"/);
  assert.match(ui, /"Hilfe einklappen"/);
  assert.match(ui, /aria-expanded", state\.hilfeStufe > 0/);
  assert.match(ui, /hilfeBereich\.hidden = state\.hilfeStufe <= 0/);
  assert.match(ui, /state\.hilfeStufe = 0;/, "Zurücksetzen setzt die Hilfestufe auf 0");
});

test("Rückmeldung nennt, was trägt, und einen nächsten Blick, ohne Mustertext", () => {
  const muster = kern.lehrkraftLoesung().mustertext;
  const teil = kern.auswertung({ entscheidung: "B", gruende: ["bbig15"], antwort: "kurz" });
  assert.equal(teil.bestanden, false);
  assert.ok(teil.traegt.some(function (t) { return /Entscheidung passt/.test(t); }));
  assert.ok(teil.naechsterBlick.length > 0);

  const gedreht = kern.auswertung({ entscheidung: "B", gruende: ["bbig15"], antwort: WINDOWS_FALSCHE_RICHTUNG });
  assert.ok(gedreht.naechsterBlick.some(function (t) { return /Richtung/.test(t) && /verwechselst/.test(t); }));

  const gut = kern.auswertung({ entscheidung: "B", gruende: ["bbig15"], antwort: PASSENDE_ANTWORT });
  assert.equal(gut.bestanden, true);
  assert.equal(gut.traegt.length, 3);

  [teil, gedreht, gut].forEach(function (e) {
    const alles = JSON.stringify([e.hinweise, e.traegt, e.naechsterBlick]);
    assert.equal(alles.includes(muster), false);
    assert.equal(alles.includes("Mira Holtz"), false);
  });
});

test("Mehrere Versuche bleiben möglich, der Abschluss fällt weiter", () => {
  const eins = kern.nachPruefung({ akteGelesen: true, entscheidung: "A", gruende: [], antwort: "", versuche: 0, abgeschlossen: true });
  assert.equal(eins.versuche, 1);
  assert.equal(eins.abgeschlossen, false);
  const zwei = kern.nachPruefung({ akteGelesen: true, entscheidung: "B", gruende: ["bbig15"], antwort: PASSENDE_ANTWORT, versuche: eins.versuche, abgeschlossen: true });
  assert.equal(zwei.versuche, 2);
  assert.equal(zwei.abgeschlossen, false);
  assert.equal(zwei.letzteAuswertung.darfAbschliessen, true);
});

test("Oberfläche zeigt, was passt, und den nächsten Blick", () => {
  const ui = fs.readFileSync(path.join(__dirname, "../js/rathaus-ui.js"), "utf8");
  assert.match(ui, /Das passt schon/);
  assert.match(ui, /Dein nächster Blick/);
});
