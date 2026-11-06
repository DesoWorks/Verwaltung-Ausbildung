'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const B = require('../js/rathaus-b04.js');
const nav = require('../js/rathaus-navigation.js');
const bb = require('../js/rathaus-buergerbuero.js');
function gut() {
  const e = B.normalisiere({});
  for (const [f, k] of Object.entries(B.katalog())) {
    if (k.art === 'einzel') e[f] = k.optionen.find(o => o.richtig).id;
    else if (k.art === 'mehrfach') e[f] = k.optionen.filter(o => o.richtig).map(o => o.id);
    else for (const o of k.optionen) e[f][o.id] = o.erwartet;
  }
  return e;
}
test('B04 Kennungen und Speicherschlüssel', () => {
  assert.equal(B.FALL_ID, 'b04');
  assert.equal(B.SPEICHER_SCHLUESSEL, 'verwaltung-ausbildung.rathaus.buergerbuero.b04.v1');
  assert.equal(B.BEWERTUNGSSTAND, 'b04-2026-11-05-r1');
  for (const alt of ['b01', 'b02', 'b03']) {
    try { assert.notEqual(B.SPEICHER_SCHLUESSEL, require('../js/rathaus-' + alt + '.js').SPEICHER_SCHLUESSEL); } catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; }
  }
  assert.notEqual(B.SPEICHER_SCHLUESSEL, bb.SPEICHER_SCHLUESSEL);
});
test('B04 leer ist offen, vollständig richtig ist abschließbar', () => {
  assert.equal(B.auswertung({}).darfAbschliessen, false);
  assert.ok(Object.values(B.auswertung({}).bereiche).every(b => b.status === 'offen'));
  assert.equal(B.auswertung(gut()).darfAbschliessen, true);
});
test('B04 Antwortwerte sind über alle Fragen hinweg eindeutig', () => {
  const alle = [];
  for (const k of Object.values(B.katalog())) if (k.art !== 'status') k.optionen.forEach(o => alle.push(o.id));
  assert.equal(new Set(alle).size, alle.length);
});
test('B04 jedes Pflichtfeld ist im Bereichsplan genau einmal enthalten', () => {
  const felder = B.BEREICHE.flatMap(b => b.felder).sort();
  assert.deepEqual(felder, Object.keys(B.katalog()).sort());
});
for (const [f, k] of Object.entries(B.katalog())) {
  test('B04 Pflichtfeld fehlt: ' + f, () => {
    const e = gut(); delete e[f]; assert.equal(B.auswertung(e).darfAbschliessen, false);
  });
  test('B04 unbekannter Feldwert: ' + f, () => {
    const e = gut(); e[f] = k.art === 'mehrfach' ? [...e[f], 'unbekannt'] : k.art === 'status' ? { ...e[f], unbekannt: 'vorhanden-stimmt' } : 'unbekannt';
    assert.equal(B.auswertung(e).darfAbschliessen, false);
    const saved = B.bereinigeGespeichert({ fallId: 'b04', bewertungsstand: B.BEWERTUNGSSTAND, eingaben: e, letzteAuswertung: B.auswertung(gut()), abgeschlossen: true });
    assert.equal(saved.abgeschlossen, false); assert.equal(saved.verworfen, true);
  });
  if (k.art !== 'status') for (const o of k.optionen.filter(o => !o.richtig)) {
    test('B04 falsche Alternative sperrt: ' + f + '/' + o.id, () => {
      const e = gut(); e[f] = k.art === 'mehrfach' ? [...e[f], o.id] : o.id;
      assert.equal(B.auswertung(e).darfAbschliessen, false);
      assert.ok(B.auswertung(e).sperren.length);
    });
  }
}
test('B04 einzelne Datenzeile falsch oder unbeantwortet sperrt', () => {
  for (const o of B.katalog().daten.optionen) {
    for (const wert of ['fehlt', 'widerspruch', null]) {
      const e = gut(); if (wert) e.daten[o.id] = wert; else delete e.daten[o.id];
      assert.equal(B.auswertung(e).darfAbschliessen, false);
    }
  }
});
test('B04 fachliche Sperren: Gebühr, verratene Sperre, Anschrift, unechter Eintrag', () => {
  const faelle = [['gebuehr', 'geb-wie-bescheinigung'], ['dritte', 'dri-sperre'], ['dritte', 'dri-anschrift'], ['dritte', 'dri-nicht-gemeldet'],
    ['naechster', 'nae-eingetragen'], ['wirkung', 'wirk-keine-behoerde'], ['dauer', 'dauer-unbefristet'], ['entscheidung', 'ent-ablehnen'], ['entscheidung', 'ent-ohne-tatsachen']];
  for (const [f, id] of faelle) {
    const e = gut(); e[f] = id;
    assert.equal(B.auswertung(e).darfAbschliessen, false, f + '/' + id);
  }
});
test('B04 Rechtsstand: einzige richtige Grundlage ist § 51 Abs. 1 BMG, unentgeltlich, zwei Jahre', () => {
  const k = B.katalog();
  const r = (f) => k[f].optionen.filter(o => o.richtig);
  assert.equal(r('grundlage').length, 1); assert.ok(r('grundlage')[0].text.includes('§ 51 Abs. 1 BMG'));
  assert.ok(r('gebuehr')[0].text.startsWith('Unentgeltlich'));
  assert.ok(r('dauer')[0].text.includes('zwei Jahre'));
  const ref = B.nachschlagen().themen.map(t => t.titel + ' ' + t.text).join(' ');
  assert.ok(ref.includes('§ 51 Abs. 2 BMG') && ref.includes('§ 51 Abs. 4 BMG'));
});
test('B04 nennt nirgends erfundene Beträge und behauptet keine Behördensperre', () => {
  const text = JSON.stringify([B.nachschlagen(), B.lehrkraft(), B.fallDaten()]);
  assert.ok(!/\d+\s*(Euro|€)/.test(text));
  assert.ok(!/(dürfen|darf) (keine|jede) Behörde/i.test(B.lehrkraft().musterantwort));
  assert.ok(B.lehrkraft().musterantwort.includes('nicht zu'));
});
test('B04 Freitext wird nicht bewertet und entwertet gespeicherte Auswertung', () => {
  const e = gut(), a = B.auswertung(e); e.freitext = 'beliebige Behauptung';
  assert.equal(B.auswertung(e).freitext.automatischGeprueft, false);
  assert.equal(B.bereinigeGespeichert({ fallId: 'b04', bewertungsstand: B.BEWERTUNGSSTAND, eingaben: e, letzteAuswertung: a, abgeschlossen: true }).abgeschlossen, false);
});
test('B04 defekte/alte/fremde Speicherstände übernehmen keinen Abschluss', () => {
  assert.equal(B.bereinigeGespeichert('{defekt').abgeschlossen, false);
  const obj = { fallId: 'b04', bewertungsstand: B.BEWERTUNGSSTAND, eingaben: gut(), letzteAuswertung: B.auswertung(gut()), abgeschlossen: true };
  assert.equal(B.bereinigeGespeichert(obj).abgeschlossen, true);
  assert.equal(B.bereinigeGespeichert({ ...obj, bewertungsstand: 'alt' }).abgeschlossen, false);
  assert.equal(B.bereinigeGespeichert({ ...obj, fallId: 'b03' }).abgeschlossen, false);
  const m = JSON.parse(JSON.stringify(obj)); m.eingaben.bausteine.push('unbekannt');
  assert.equal(B.bereinigeGespeichert(m).abgeschlossen, false);
});
test('B04 Reset-Text nennt nur B04', () => {
  const t = B.resetText();
  assert.ok(t.startsWith('Nur B04'));
  assert.ok(t.includes('bleiben unverändert'));
});
test('B04 Fallliste und hierarchische Navigation', () => {
  const eintrag = bb.fallListe().find(f => f.id === 'b04');
  assert.equal(eintrag.startbar, true);
  assert.equal(eintrag.titel, 'Auskunftssperre im Melderegister');
  assert.equal(nav.brotkrumen('buerger', 'fall-b04').at(-1).label, 'B04');
  assert.equal(nav.rueckziel('buerger', 'fall-b04').modus, 'uebersicht');
  assert.deepEqual(nav.buergerUnternavigation('buerger', 'fall-b04').filter(e => e.aktuell).map(e => e.label), ['B04']);
  assert.deepEqual(nav.aemter().map(a => a.titel), ['Bürgerbüro', 'Ordnungsamt', 'Personalamt', 'Stadtkasse']);
  assert.deepEqual(nav.aemter().filter(a => a.benutzbar).map(a => a.titel), ['Bürgerbüro', 'Personalamt']);
});
test('B04 Rückmeldung benennt betroffene Aufgabe, ohne Sollwert zu verraten', () => {
  const e = gut(); e.gebuehr = 'geb-pauschale';
  const text = B.auswertung(e).bereiche.einordnung.hinweise.join(' ');
  assert.ok(text.includes(B.katalog().gebuehr.frage));
  assert.ok(!text.includes('unentgeltlich'));
});
