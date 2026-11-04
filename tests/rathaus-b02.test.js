"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const b2 = require("../js/rathaus-b02.js");
const bb = require("../js/rathaus-buergerbuero.js");

const SOLL = {
  anliegen: "eigene-meldebescheinigung",
  angaben: { familienname: "vorhanden-stimmt", vorname: "vorhanden-stimmt", geburtsdatum: "vorhanden-stimmt", anschrift: "vorhanden-stimmt" },
  identitaet: "abgleich-passt",
  umfang: "einfach-abs1",
  regeln: ["antrag-eigene-person", "bmg18", "umfang-nach-antrag", "schriftliche-gebuehr-pruefen"],
  aussagen: "keine",
  vorbereitung: "ausstellung-vorbereiten",
  bausteine: ["anliegen", "vorbereitung", "nur-umfang", "gebuehr-pruefen", "uebung"],
  freitext: ""
};
const kopie = (o) => JSON.parse(JSON.stringify(o));
const speicher = (eingaben, extra) => JSON.stringify(Object.assign({
  fallId: b2.FALL_ID, bewertungsstand: b2.BEWERTUNGSSTAND, eingaben, letzteAuswertung: null, abgeschlossen: false
}, extra || {}));

test("B02: eigener Speicherschlüssel, getrennt von B01", () => {
  assert.notEqual(b2.SPEICHER_SCHLUESSEL, bb.SPEICHER_SCHLUESSEL);
  assert.ok(b2.SPEICHER_SCHLUESSEL.includes("b02"));
});

test("B02: leere Eingabe ist offen, nicht falsch, und sperrt den Abschluss", () => {
  const a = b2.auswertung({});
  assert.equal(a.bestanden, false);
  assert.equal(a.darfAbschliessen, false);
  b2.BEREICHE.forEach((b) => assert.equal(a.bereiche[b.key].status, "offen", b.key));
});

test("B02: vollständige richtige Antwort besteht", () => {
  const a = b2.auswertung(kopie(SOLL));
  assert.equal(a.bestanden, true);
  assert.equal(a.darfAbschliessen, true);
  assert.deepEqual(a.sperren, []);
  b2.BEREICHE.forEach((b) => assert.equal(a.bereiche[b.key].status, "richtig", b.key));
});

test("B02: Freitext allein besteht nie, Freitext zur Sollantwort ändert nichts am Ergebnis", () => {
  const nurText = b2.auswertung({ freitext: "Meldebescheinigung nach § 18 BMG, einfach, schriftlich, Gebühr prüfen" });
  assert.equal(nurText.bestanden, false);
  const mit = kopie(SOLL); mit.freitext = "beliebiger Text";
  assert.equal(b2.auswertung(mit).bestanden, true);
  const falschMitText = kopie(SOLL); falschMitText.umfang = "erweitert"; falschMitText.freitext = "bmg18 einfach Antrag";
  assert.equal(b2.auswertung(falschMitText).bestanden, false);
});

test("B02: jeder falsche Einzelwert sperrt und unterscheidet sich von unbeantwortet", () => {
  const falsch = kopie(SOLL); falsch.anliegen = "anmeldung";
  const a = b2.auswertung(falsch);
  assert.equal(a.darfAbschliessen, false);
  assert.equal(a.bereiche.anliegen.status, "falsch");
  const leer = kopie(SOLL); leer.anliegen = "";
  assert.equal(b2.auswertung(leer).bereiche.anliegen.status, "offen");
});

test("B02: unbeantwortete Aussagen-Einfachauswahl ist nicht 'keine', explizite Wahl besteht", () => {
  const offen = kopie(SOLL); offen.aussagen = null;
  const a = b2.auswertung(offen);
  assert.equal(a.darfAbschliessen, false);
  assert.notEqual(a.bereiche.regeln.status, "richtig");
  assert.equal(b2.auswertung(kopie(SOLL)).bereiche.regeln.status, "richtig");
});

test("B02: fehlende Regel, fehlender Baustein und Angabe 'fehlt' sperren", () => {
  const r = kopie(SOLL); r.regeln = r.regeln.slice(1);
  assert.equal(b2.auswertung(r).darfAbschliessen, false);
  const b = kopie(SOLL); b.bausteine = b.bausteine.filter((x) => x !== "nur-umfang");
  assert.equal(b2.auswertung(b).darfAbschliessen, false);
  const f = kopie(SOLL); f.angaben.geburtsdatum = "fehlt";
  assert.equal(b2.auswertung(f).darfAbschliessen, false);
});

test("B02: unbekannte Werte in Roheingaben sperren, auch wenn die Normalisierung sie entfernt", () => {
  const x = kopie(SOLL); x.regeln.push("erfundene-regel");
  assert.equal(b2.auswertung(x).darfAbschliessen, false);
  const y = kopie(SOLL); y.angaben.geburtsdatum = "erfundener-status";
  assert.equal(b2.auswertung(y).darfAbschliessen, false);
});

test("B02: Eingabeversion ändert sich mit jeder Antwort und mit dem Freitext (Auswertung veraltet dann)", () => {
  const v = b2.eingabeVersion(kopie(SOLL));
  const g = kopie(SOLL); g.umfang = "erweitert";
  assert.notEqual(b2.eingabeVersion(g), v);
  const t = kopie(SOLL); t.freitext = "anderer Text";
  assert.notEqual(b2.eingabeVersion(t), v);
});

test("B02: gespeicherter bestanden-Abschluss mit manipuliertem Inhalt wird gesperrt", () => {
  const manip = kopie(SOLL); manip.regeln.push("erfundene-regel");
  const alt = b2.auswertung(kopie(SOLL));
  const s = b2.bereinigeGespeichert(speicher(manip, { letzteAuswertung: alt, abgeschlossen: true }));
  assert.equal(s.abgeschlossen, false);
  assert.equal(s.letzteAuswertung, null);
  assert.equal(s.verworfen, true);
});

test("B02: unbekannter Statuskey mit alter korrekter eingabeVersion bleibt gesperrt", () => {
  const manip = kopie(SOLL); manip.angaben.geburtsdatum = "erfundener-status";
  const alt = b2.auswertung(kopie(SOLL));
  const s = b2.bereinigeGespeichert(speicher(manip, { letzteAuswertung: alt, abgeschlossen: true }));
  assert.equal(s.abgeschlossen, false);
  assert.equal(s.letzteAuswertung, null);
  assert.equal(s.verworfen, true);
});

test("B02: gültiger Abschluss bleibt nach dem Laden erhalten", () => {
  const a = b2.auswertung(kopie(SOLL));
  const s = b2.bereinigeGespeichert(speicher(kopie(SOLL), { letzteAuswertung: a, abgeschlossen: true }));
  assert.equal(s.abgeschlossen, true);
  assert.equal(s.verworfen, false);
});

test("B02: abgeschlossen ohne Auswertung, kaputtes JSON, fremder Fall und alter Bewertungsstand werden nicht übernommen", () => {
  assert.equal(b2.bereinigeGespeichert(speicher(kopie(SOLL), { abgeschlossen: true })).abgeschlossen, false);
  assert.equal(b2.bereinigeGespeichert("{kaputt").abgeschlossen, false);
  const fremd = JSON.parse(speicher(kopie(SOLL))); fremd.fallId = "b01";
  assert.equal(b2.bereinigeGespeichert(JSON.stringify(fremd)).abgeschlossen, false);
  const a = b2.auswertung(kopie(SOLL));
  const alt = JSON.parse(speicher(kopie(SOLL), { letzteAuswertung: a, abgeschlossen: true }));
  alt.bewertungsstand = "b02-alt";
  assert.equal(b2.bereinigeGespeichert(JSON.stringify(alt)).abgeschlossen, false);
});

test("B02: Hilfe in drei Stufen ohne fertige Antwort, Lehrkraft fallbezogen, Quelle benannt", () => {
  assert.equal(b2.hilfe(0), "");
  [1, 2, 3].forEach((s) => {
    const t = b2.hilfe(s);
    assert.ok(t.length > 20);
    assert.ok(!t.includes("einfach-abs1"));
  });
  const l = b2.lehrkraft();
  assert.ok(l.musterantwort.length > 50);
  assert.ok(l.kriterien.length >= 3);
  assert.ok(JSON.stringify(l).includes("§ 18"));
  assert.ok(b2.nachschlagen().themen.length >= 3);
});

test("B02: keine Gebührenbeträge und keine echte Bescheinigung in Fall- und Lehrkrafttexten", () => {
  const alles = JSON.stringify([b2.fallDaten(), b2.lehrkraft(), b2.nachschlagen(), b2.katalog()]);
  assert.ok(!/\d+\s*(€|Euro|EUR)/.test(alles), "Gebührenbetrag gefunden");
  assert.ok(/Übung/.test(alles));
});

test("B01 unverändert: vierte Option, leer vs. falsch", () => {
  const k = bb.katalog();
  assert.equal(bb.auswertung({}).darfAbschliessen, false);
  assert.ok(JSON.stringify(k).includes("Keine dieser Aussagen trifft zu"));
});

test("B02-Speicher berührt B01 nicht: unterschiedliche Normalisierung, getrennte Versionen", () => {
  assert.notEqual(b2.BEWERTUNGSSTAND, bb.BEWERTUNGSSTAND);
  assert.equal(b2.bereinigeGespeichert(JSON.stringify({ fallId: "b01" })).abgeschlossen, false);
});
