"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const hb = require("../js/rathaus-hochbetrieb.js");
const luca = require("../js/rathaus-kern.js");

const wurzel = path.join(__dirname, "..");
const lies = (datei) => fs.readFileSync(path.join(wurzel, datei), "utf8");

const MUSTERSATZ = "Noelle Kranz besucht die Berufsschule in den drei Wochen weiter. Für diese Zeit erfolgt keine Einteilung in die Dienststelle statt des Unterrichts.";
const UMGEKEHRT = "Noelle Kranz erhält eine Freistellung von der Berufsschule und muss drei Wochen nicht zum Unterricht.";
const WIDERSPRUCH = "Noelle Kranz besucht die Berufsschule weiter. Trotzdem wird sie in der Dienststelle eingeteilt und arbeitet dort.";
const AUSFALL = "Noelle Kranz soll die Berufsschule ausfallen lassen und in der Dienststelle arbeiten, wegen Hochbetrieb.";
const NUR_ERSTE_WOCHE = "Noelle Kranz besucht die Berufsschule nur die erste Woche weiter, danach fällt sie aus.";
const ALTER_FALLE = "Noelle Kranz ist über 18, deshalb gibt es keine Freistellung mehr für die Berufsschule.";

test("Entscheidung B ist richtig, A, C und D sind falsch", () => {
  assert.equal(hb.bewerteEntscheidung("B").richtig, true);
  ["A", "C", "D"].forEach((id) => assert.equal(hb.bewerteEntscheidung(id).richtig, false, id));
  assert.equal(hb.bewerteEntscheidung("X").bekannt, false);
});

test("Pflichtgrund bbig15, Stützgrund bbig14-4, zwei Fallen", () => {
  assert.equal(hb.bewerteBegruendung(["bbig15"]).reicht, true);
  assert.equal(hb.bewerteBegruendung(["bbig15", "bbig14-4"]).reicht, true);
  assert.equal(hb.bewerteBegruendung(["bbig14-4"]).reicht, false);
  assert.equal(hb.bewerteBegruendung(["bbig15", "falle-hochbetrieb"]).hatFalle, true);
  assert.equal(hb.bewerteBegruendung(["bbig15", "falle-alter"]).reicht, false);
  assert.equal(hb.bewerteBegruendung([]).reicht, false);
  assert.equal(hb.bewerteBegruendung(["gibt-es-nicht"]).reicht, false);
});

test("Der geforderte Satz besteht", () => {
  const bewertet = hb.bewerteAntwort(MUSTERSATZ);
  assert.equal(bewertet.ok, true, bewertet.hinweise.join(" | "));
  const ergebnis = hb.auswertung({ entscheidung: "B", gruende: ["bbig15"], antwort: MUSTERSATZ });
  assert.equal(ergebnis.bestanden, true);
  assert.equal(ergebnis.darfAbschliessen, true);
});

test("Der Mustertext der Lehrkraft besteht die eigene Bewertung", () => {
  const bewertet = hb.bewerteAntwort(hb.lehrkraftLoesung().mustertext);
  assert.equal(bewertet.ok, true, bewertet.hinweise.join(" | "));
});

test("Widerspruch, umgekehrte Freistellung und leere Antwort scheitern", () => {
  assert.equal(hb.bewerteAntwort(WIDERSPRUCH).ok, false);
  assert.equal(hb.bewerteAntwort(UMGEKEHRT).ok, false);
  assert.equal(hb.bewerteAntwort("").ok, false);
  assert.equal(hb.bewerteAntwort("   ").ok, false);
  assert.equal(hb.bewerteAntwort(undefined).ok, false);
  [WIDERSPRUCH, UMGEKEHRT, ""].forEach((antwort) => {
    const e = hb.auswertung({ entscheidung: "B", gruende: ["bbig15"], antwort });
    assert.equal(e.bestanden, false);
    assert.equal(e.darfAbschliessen, false);
  });
});

test("Besuch ohne Aussage zur Einteilung besteht nicht, vollständige Antworten bestehen", () => {
  const nurBesuch = "Noelle Kranz geht in den nächsten drei Wochen weiter zur Berufsschule und nimmt am Unterricht teil.";
  const nurFrei = "Noelle Kranz wird für die Berufsschule freigestellt und besucht den Unterricht.";
  const freistellung = "Noelle Kranz wird in den drei Wochen sachlich für die Berufsschule freigestellt, ohne Arbeitseinsatz statt des Unterrichts.";
  const andererWeg = "Noelle Kranz geht weiter zur Berufsschule. Sie wird in dieser Zeit nicht in der Dienststelle eingeteilt.";
  assert.equal(hb.bewerteAntwort(nurBesuch).ok, false);
  assert.equal(hb.bewerteAntwort(nurFrei).ok, false);
  assert.match(hb.bewerteAntwort(nurBesuch).hinweise.join(" "), /Einteilung|Dienststelle/);
  assert.equal(hb.auswertung({ entscheidung: "B", gruende: ["bbig15"], antwort: nurBesuch }).bestanden, false);
  [MUSTERSATZ, freistellung, andererWeg].forEach((satz) => {
    const b = hb.bewerteAntwort(satz);
    assert.equal(b.ok, true, satz + " :: " + b.hinweise.join(" | "));
  });
});

test("Ausfall, nur erste Woche und Altersfalle in der Antwort scheitern", () => {
  assert.equal(hb.bewerteAntwort(AUSFALL).ok, false);
  assert.equal(hb.bewerteAntwort(NUR_ERSTE_WOCHE).ok, false);
  assert.equal(hb.bewerteAntwort(ALTER_FALLE).ok, false);
});

test("Falsche Entscheidungen und Fallen verhindern das Bestehen", () => {
  ["A", "C", "D", ""].forEach((entscheidung) => {
    const e = hb.auswertung({ entscheidung, gruende: ["bbig15"], antwort: MUSTERSATZ });
    assert.equal(e.bestanden, false, "Entscheidung " + entscheidung);
  });
  const mitFalle = hb.auswertung({ entscheidung: "B", gruende: ["bbig15", "falle-hochbetrieb"], antwort: MUSTERSATZ });
  assert.equal(mitFalle.bestanden, false);
});

test("Ohne gelesene Akte darf der Vorgang nicht abgeschlossen werden", () => {
  const roh = { entscheidung: "B", gruende: ["bbig15"], antwort: MUSTERSATZ, akteGelesen: false };
  const ohne = hb.nachPruefung(roh);
  assert.equal(ohne.letzteAuswertung.darfAbschliessen, false);
  const mit = hb.nachPruefung(Object.assign({}, roh, { akteGelesen: true, versuche: 2 }));
  assert.equal(mit.letzteAuswertung.darfAbschliessen, true);
  assert.equal(mit.versuche, 3);
  assert.equal(mit.abgeschlossen, false);
  assert.equal(mit.letzteAuswertung.bewertungsstand, hb.BEWERTUNGSSTAND);
});

test("Eigener Speicherschlüssel, alter Schlüssel und Bewertungsstand von Luca unverändert", () => {
  assert.equal(hb.SPEICHERSCHLUESSEL, "verwaltung-ausbildung.rathaus.hochbetrieb.v1");
  assert.equal(luca.BEWERTUNGSSTAND, "2026-11-01-brief2");
  assert.notEqual(hb.BEWERTUNGSSTAND, luca.BEWERTUNGSSTAND);
  const ui = lies("js/rathaus-ui.js");
  assert.match(ui, /var KEY = "verwaltung-ausbildung\.rathaus\.v1";/);
  assert.match(ui, /var KEY_HOCHBETRIEB = "verwaltung-ausbildung\.rathaus\.hochbetrieb\.v1";/);
});

test("Gespeicherter Stand mit anderem Bewertungsstand wird verworfen, Eingaben bleiben", () => {
  const alt = {
    entscheidung: "B", gruende: ["bbig15"], antwort: MUSTERSATZ,
    abgeschlossen: true, bewertungsstand: "alt", letzteAuswertung: { bestanden: true, bewertungsstand: "alt" }
  };
  const kopie = JSON.stringify(alt);
  const b = hb.bereinigeGespeichert(alt);
  assert.equal(b.abgeschlossen, false);
  assert.equal(b.letzteAuswertung, null);
  assert.equal(b.verworfen, true);
  assert.equal(b.antwort, MUSTERSATZ);
  assert.equal(JSON.stringify(alt), kopie);
  const frisch = hb.bereinigeGespeichert({ abgeschlossen: true, bewertungsstand: hb.BEWERTUNGSSTAND, letzteAuswertung: { bewertungsstand: hb.BEWERTUNGSSTAND } });
  assert.equal(frisch.abgeschlossen, true);
  assert.equal(hb.bereinigeGespeichert(null).verworfen, true);
});

test("Alte grüne Auswertung des Vorgangs wird verworfen, Entwurf bleibt, Luca-Stand unverändert", () => {
  assert.equal(hb.BEWERTUNGSSTAND, "2026-11-01-hochbetrieb2");
  assert.equal(luca.BEWERTUNGSSTAND, "2026-11-01-brief2");
  const alt = {
    entscheidung: "B", gruende: ["bbig15"], antwort: "Noelle Kranz geht in den nächsten drei Wochen weiter zur Berufsschule und nimmt am Unterricht teil.",
    abgeschlossen: true, bewertungsstand: "2026-11-01-hochbetrieb1",
    letzteAuswertung: { bestanden: true, darfAbschliessen: true, bewertungsstand: "2026-11-01-hochbetrieb1" }
  };
  const b = hb.bereinigeGespeichert(alt);
  assert.equal(b.letzteAuswertung, null);
  assert.equal(b.abgeschlossen, false);
  assert.equal(b.verworfen, true);
  assert.equal(b.antwort, alt.antwort);
  assert.equal(b.entscheidung, "B");
});

test("Hilfe verrät in keiner Stufe den Mustertext und nennt Richtung statt Lösung", () => {
  const muster = hb.lehrkraftLoesung().mustertext;
  [0, 1, 2, 3].forEach((n) => assert.equal(hb.hilfe(n).includes(muster), false));
  assert.equal(hb.hilfe(0), "");
  assert.equal(hb.hilfeWechsel(3, "mehr"), 3);
  assert.equal(hb.hilfeWechsel(1, "weniger"), 0);
  assert.equal(hb.hilfeWechsel(3, "einklappen"), 0);
});

test("Nutzertexte enthalten keine interne Id, keine Pfade und keine Lösung", () => {
  const nutzer = JSON.stringify({
    katalog: hb.katalog(),
    erklaerung: hb.gesetzesErklaerung(),
    hilfe: [1, 2, 3].map(hb.hilfe),
    fall: Object.assign({}, hb.fallDaten(), { id: undefined })
  });
  assert.equal(nutzer.includes("/home/starnet"), false);
  assert.equal(nutzer.includes("berufsschule-hochbetrieb"), false);
  assert.equal(nutzer.includes(hb.BEWERTUNGSSTAND), false);
  assert.equal(nutzer.includes(hb.lehrkraftLoesung().mustertext), false);
  const ui = lies("js/rathaus-ui.js");
  assert.equal(ui.includes("berufsschule-hochbetrieb"), false);
  assert.equal(ui.includes("/home/starnet"), false);
  assert.equal(ui.includes(hb.BEWERTUNGSSTAND), false);
});

test("Die Antwortmöglichkeiten nennen keine Lösung und sind in Ruhe lesbar", () => {
  const k = hb.katalog();
  assert.equal(k.entscheidungen.length, 4);
  assert.equal(k.gruende.length, 4);
  k.entscheidungen.concat(k.gruende).forEach((e) => {
    assert.equal(/\b(richtig|falsch|falle|musterlösung)\b/i.test(e.text), false, e.text);
  });
});

test("Die Karte B, die richtige Entscheidung, bleibt von Luca getrennt", () => {
  assert.equal(luca.bewerteEntscheidung("B").richtig, true);
  assert.equal(luca.fallDaten().person.name, "Luca Berger");
  assert.equal(hb.fallDaten().person.name, "Noelle Kranz");
  assert.equal(hb.fallDaten().person.alter, 19);
  assert.equal(luca.bewerteAntwort(MUSTERSATZ).ok, false, "Noelles Satz gilt nicht als Antwort im ersten Vorgang");
});

test("Rechtsquelle: nur BBiG, mit Rechtsstand, ohne verbindliche Aussage", () => {
  const l = hb.lehrkraftLoesung();
  assert.equal(l.rechtsstand, "01.11.2026");
  assert.equal(l.pflichtgrund, "bbig15");
  assert.deepEqual(l.stuetzendeGruende, ["bbig14-4"]);
  assert.deepEqual(l.fallen.sort(), ["falle-alter", "falle-hochbetrieb"]);
  assert.match(l.unsicherheit, /keine Rechtsberatung/);
  assert.match(l.unsicherheit, /nicht verbindlich/);
  assert.ok(l.quellen.every((q) => /nichtamtlich/.test(q)));
});

test("Oberfläche: zweiter Vorgang ist erreichbar, ohne Navigation oder Hash zu erweitern", () => {
  const ui = lies("js/rathaus-ui.js");
  const html = lies("module/rathaus.html");
  assert.match(html, /rathaus-hochbetrieb\.js/);
  assert.ok(html.indexOf("rathaus-hochbetrieb.js") < html.indexOf("rathaus-ui.js"));
  assert.match(ui, /wechsleFall\(/);
  assert.match(ui, /window\.RATHAUS_HOCHBETRIEB/);
  const nav = require("../js/rathaus-navigation.js");
  // Das Personalamt bekommt keine weiteren Ansichten; neu sind nur die zwei Bürgerbüro-Ansichten.
  assert.deepEqual(nav.HASH_ANSICHTEN, ["stadt", "personal", "post", "akte", "vorgang", "nachschlagen", "buerger", "buerger-karte"]);
  assert.equal(nav.ANSICHTEN.length, 9);
});

test("Oberfläche: Reset löscht nur den Speicher des aktiven Vorgangs", () => {
  const ui = lies("js/rathaus-ui.js");
  assert.match(ui, /removeItem\(schluessel\(\)\)/);
  assert.equal(/removeItem\(KEY\)/.test(ui), false);
  assert.equal(/removeItem\(KEY_HOCHBETRIEB\)/.test(ui), false);
  assert.match(ui, /state\.hilfeStufe = 0;/);
});

test("Oberfläche: aktiverFall ist optional, fehlt gleich Luca", () => {
  const ui = lies("js/rathaus-ui.js");
  assert.match(ui, /alt && alt\.aktiverFall === "noelle" \? "noelle" : "luca"/);
  assert.match(ui, /var aktiverFall = "luca";/);
});

test("Quelldateien bleiben lokal: kein fetch, keine externen Adressen", () => {
  ["js/rathaus-hochbetrieb.js", "js/rathaus-ui.js", "module/rathaus.html"].forEach((datei) => {
    const text = lies(datei);
    assert.equal(/fetch\s*\(/.test(text), false, datei);
    assert.equal(/XMLHttpRequest/.test(text), false, datei);
    assert.equal(/src\s*=\s*["']https?:/i.test(text), false, datei);
  });
});
