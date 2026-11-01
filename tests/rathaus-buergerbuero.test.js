'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const B = require('../js/rathaus-buergerbuero.js');

function gut() {
  return {
    anliegen: 'zuzug',
    einzug: 'datum-09-11',
    weitereWohnung: 'keine',
    dokumente: { ausweis: 'passt', mietvertrag: 'kein-ersatz', bestaetigung: 'fehlt', merkmal: 'fehlt' },
    regeln: ['bmg17', 'bmg19', 'bmg23', 'ortskarte'],
    fallen: [],
    vorbereitung: 'mitteilung-klaerung',
    bausteine: ['anliegen', 'nachweis-fehlt', 'mitteilung-aufgenommen', 'naechster-schritt', 'nicht-abgeschlossen'],
    freitext: ''
  };
}

test('Erfolgsweg: drei Bereiche richtig und Abschluss erlaubt', () => {
  const a = B.auswertung(gut());
  assert.strictEqual(a.bereiche.unterlagen.status, 'richtig');
  assert.strictEqual(a.bereiche.vorbereitung.status, 'richtig');
  assert.strictEqual(a.bereiche.antwort.status, 'richtig');
  assert.strictEqual(a.bestanden, true);
  assert.strictEqual(a.darfAbschliessen, true);
  assert.strictEqual(a.fallId, 'b01');
  assert.strictEqual(a.bewertungsstand, 'b01-2026-11-01');
  assert.ok(a.eingabeVersion.length > 0);
});

test('leere Eingabe: alles offen, kein Wurf', () => {
  [undefined, null, {}, 'x', 5].forEach((e) => {
    const a = B.auswertung(e);
    assert.strictEqual(a.bereiche.unterlagen.status, 'offen');
    assert.strictEqual(a.bereiche.vorbereitung.status, 'offen');
    assert.strictEqual(a.bereiche.antwort.status, 'offen');
    assert.strictEqual(a.bestanden, false);
    assert.strictEqual(a.darfAbschliessen, false);
  });
});

test('Mietvertrag als ausreichender Nachweis sperrt trotz guter Antwort', () => {
  const e = gut();
  e.dokumente.mietvertrag = 'passt';
  const a = B.auswertung(e);
  assert.strictEqual(a.bereiche.unterlagen.status, 'falsch');
  assert.strictEqual(a.bereiche.antwort.status, 'richtig');
  assert.strictEqual(a.darfAbschliessen, false);
  assert.ok(a.sperren.length > 0);
});

test('Ablehnung und Erledigt-Eintrag sperren', () => {
  ['abgelehnt', 'erledigt'].forEach((v) => {
    const e = gut();
    e.vorbereitung = v;
    const a = B.auswertung(e);
    assert.strictEqual(a.bereiche.vorbereitung.status, 'falsch');
    assert.strictEqual(a.darfAbschliessen, false);
    assert.ok(a.sperren.length > 0);
  });
});

test('Baustein anmeldung-abgeschlossen sperrt, verbotener Baustein sticht richtige', () => {
  const e = gut();
  e.bausteine.push('anmeldung-abgeschlossen');
  const a = B.auswertung(e);
  assert.strictEqual(a.bereiche.antwort.status, 'falsch');
  assert.strictEqual(a.darfAbschliessen, false);
  assert.ok(a.sperren.length > 0);
  const e2 = gut();
  e2.bausteine.push('gebuehr');
  assert.strictEqual(B.auswertung(e2).bereiche.antwort.status, 'falsch');
});

test('alle Bausteine ausgewählt besteht nicht', () => {
  const e = gut();
  e.bausteine = B.katalog().bausteine.optionen.map((o) => o.id);
  const a = B.auswertung(e);
  assert.strictEqual(a.bereiche.antwort.status, 'falsch');
  assert.strictEqual(a.bestanden, false);
});

test('fehlende Pflichtbausteine und ungültige Werte', () => {
  const e = gut();
  e.bausteine = ['anliegen'];
  assert.strictEqual(B.auswertung(e).bereiche.antwort.status, 'unvollstaendig');
  const e2 = gut();
  e2.bausteine = ['gibt-es-nicht'];
  assert.strictEqual(B.auswertung(e2).bereiche.antwort.status, 'ungueltig');
});

test('Freitext wird nie automatisch als richtig geprüft', () => {
  const e = gut();
  e.freitext = 'Mein eigener Entwurf';
  const a = B.auswertung(e);
  assert.deepStrictEqual(a.freitext, { text: 'Mein eigener Entwurf', automatischGeprueft: false });
  const e2 = gut();
  e2.freitext = 'ganz anderer Text';
  assert.notStrictEqual(B.auswertung(e2).eingabeVersion, a.eingabeVersion);
  assert.strictEqual(B.auswertung(e2).darfAbschliessen, true);
  assert.strictEqual(B.auswertung(e2).bereiche.antwort.status, 'richtig');
  assert.strictEqual(B.auswertung(e2).freitext.automatischGeprueft, false);
});

test('Gespeicherter Abschluss mit anderem Freitext wird verworfen, passender bleibt', () => {
  const alt = gut();
  alt.freitext = 'erster Entwurf';
  const a = B.auswertung(alt);
  const geaendert = gut();
  geaendert.freitext = 'zweiter Entwurf';
  const verworfen = B.bereinigeGespeichert({ fallId: 'b01', bewertungsstand: B.BEWERTUNGSSTAND, eingaben: geaendert, letzteAuswertung: a, abgeschlossen: true });
  assert.strictEqual(verworfen.letzteAuswertung, null);
  assert.strictEqual(verworfen.abgeschlossen, false);
  assert.strictEqual(verworfen.eingaben.freitext, 'zweiter Entwurf');
  const passt = B.bereinigeGespeichert({ fallId: 'b01', bewertungsstand: B.BEWERTUNGSSTAND, eingaben: alt, letzteAuswertung: a, abgeschlossen: true });
  assert.ok(passt.letzteAuswertung);
  assert.strictEqual(passt.abgeschlossen, true);
  // Widersprüchlicher Freitext sperrt die strukturierte Bewertung nicht automatisch.
  geaendert.freitext = 'Die Anmeldung ist erledigt.';
  assert.strictEqual(B.auswertung(geaendert).darfAbschliessen, true);
});

test('Gespeichertes mit abweichendem Bewertungsstand oder fremdem Fall wird verworfen', () => {
  const basis = { fallId: 'b01', bewertungsstand: 'alt', eingaben: gut(), letzteAuswertung: { bestanden: true }, abgeschlossen: true, bestanden: true };
  const r = B.bereinigeGespeichert(JSON.stringify(basis));
  assert.strictEqual(r.verworfen, true);
  assert.strictEqual(r.letzteAuswertung, null);
  assert.strictEqual(r.abgeschlossen, false);
  assert.strictEqual(r.eingaben.anliegen, 'zuzug');
  const fremd = B.bereinigeGespeichert({ ...basis, fallId: 'b02', bewertungsstand: B.BEWERTUNGSSTAND });
  assert.strictEqual(fremd.verworfen, true);
  assert.strictEqual(fremd.abgeschlossen, false);
  const kaputt = B.bereinigeGespeichert('{nicht json');
  assert.strictEqual(kaputt.verworfen, true);
  assert.strictEqual(kaputt.abgeschlossen, false);
  const arr = B.bereinigeGespeichert('[1]');
  assert.strictEqual(arr.verworfen, true);
});

test('Gültiger Speicherstand bleibt, Abschluss wird neu geprüft', () => {
  const ok = B.bereinigeGespeichert({ fallId: 'b01', bewertungsstand: B.BEWERTUNGSSTAND, eingaben: gut(), letzteAuswertung: {}, abgeschlossen: true });
  assert.strictEqual(ok.verworfen, false);
  assert.strictEqual(ok.abgeschlossen, true);
  const e = gut();
  e.vorbereitung = 'erledigt';
  const nein = B.bereinigeGespeichert({ fallId: 'b01', bewertungsstand: B.BEWERTUNGSSTAND, eingaben: e, letzteAuswertung: {}, abgeschlossen: true });
  assert.strictEqual(nein.abgeschlossen, false);
});

test('B02 und B03 sind nicht startbar, B01 schon', () => {
  const liste = B.fallListe();
  assert.strictEqual(liste.find((f) => f.id === 'b01').startbar, true);
  assert.strictEqual(liste.find((f) => f.id === 'b02').startbar, false);
  assert.strictEqual(liste.find((f) => f.id === 'b03').startbar, false);
});

test('Hilfe: drei Stufen, Stufe 0 leer, kein Musterbrief, keine Auswahl-ID', () => {
  assert.strictEqual(B.hilfe(0), '');
  const ids = B.katalog().bausteine.optionen.map((o) => o.id).concat(['mitteilung-klaerung']);
  [1, 2, 3].forEach((s) => {
    const t = B.hilfe(s);
    assert.ok(t.length > 20);
    assert.ok(!/Musterbrief|Samira|Antwort C/i.test(t));
    ids.forEach((id) => assert.ok(!t.includes(id), id));
  });
  assert.ok(!B.hilfe(3).includes('Ich habe verstanden'));
});

test('Lehrkraft: getrennte Teile, Warnung, Musterantwort behauptet keine Ausführung', () => {
  const l = B.lehrkraft();
  ['warnung', 'sachverhalt', 'lernziele', 'typischeFehler', 'musterantwort', 'kriterien', 'quellen'].forEach((k) => assert.ok(l[k], k));
  assert.match(l.warnung, /keine Zugriffssicherung/);
  assert.match(l.musterantwort, /noch nicht abgeschlossen/);
  assert.ok(!/erledigt/.test(l.musterantwort));
});

test('Nachschlagekarte ohne Fallnamen, Musterbrief und Lösungshinweis', () => {
  const text = JSON.stringify(B.nachschlagen());
  assert.ok(!/Samira|Yilmaz|Musterbrief|wähle Antwort/i.test(text));
  assert.match(text, /quellen\/bmg-b01-2026-11-01\.md/);
  assert.match(text, /Übungsannahme/);
  assert.strictEqual(B.nachschlagen().themen.length, 5);
});

test('Fallstammdaten sind fest und enthalten die Übungsannahme', () => {
  const d = B.fallDaten();
  assert.strictEqual(d.person.name, 'Samira Yilmaz');
  assert.strictEqual(d.person.alter, 22);
  assert.strictEqual(d.einzug, '09.11.2026');
  assert.strictEqual(d.vorsprache, '12.11.2026');
  assert.match(d.uebungsannahme, /keine geprüfte Landesnorm|keine geprüfte Landesnorm/);
  assert.match(d.hinweis, /nicht abgeschlossen/);
});

test('Reset-Text nennt B01 und Samira Yilmaz und schont andere Ämter', () => {
  const t = B.resetText();
  assert.match(t, /B01/);
  assert.match(t, /Samira Yilmaz/);
  assert.match(t, /Luca/);
  assert.match(t, /Noelle/);
});

test('Datei enthält keinen Netz-, DOM- oder Speicherzugriff', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'rathaus-buergerbuero.js'), 'utf8');
  assert.ok(!/fetch\s*\(/.test(src));
  assert.ok(!/XMLHttpRequest|localStorage|sessionStorage|document\./.test(src));
});

test('Speicher-Schlüssel gehört nur zum Bürgerbüro B01', () => {
  assert.strictEqual(B.SPEICHER_SCHLUESSEL, 'verwaltung-ausbildung.rathaus.buergerbuero.b01.v1');
  assert.ok(!/luca|noelle|personalamt/i.test(B.SPEICHER_SCHLUESSEL));
  const kern = fs.readFileSync(path.join(__dirname, '..', 'js', 'rathaus-kern.js'), 'utf8');
  assert.ok(!kern.includes(B.SPEICHER_SCHLUESSEL));
});
