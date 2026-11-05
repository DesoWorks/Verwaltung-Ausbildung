'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const B = require('../js/rathaus-b03.js');
const nav = require('../js/rathaus-navigation.js');
function gut() {
  const e = B.normalisiere({});
  for (const [f, k] of Object.entries(B.katalog())) {
    if (k.art === 'einzel') e[f] = k.optionen.find(o => o.richtig).id;
    else if (k.art === 'mehrfach') e[f] = k.optionen.filter(o => o.richtig).map(o => o.id);
    else for (const o of k.optionen) e[f][o.id] = o.erwartet;
  }
  return e;
}
test('B03 leer ist offen, vollständig richtig ist abschließbar', () => {
  assert.equal(B.auswertung({}).darfAbschliessen, false);
  assert.ok(Object.values(B.auswertung({}).bereiche).every(b => b.status === 'offen'));
  assert.equal(B.auswertung(gut()).darfAbschliessen, true);
});
for (const [f, k] of Object.entries(B.katalog())) {
  test('B03 Pflichtfeld fehlt: ' + f, () => {
    const e = gut(); delete e[f]; assert.equal(B.auswertung(e).darfAbschliessen, false);
  });
  test('B03 unbekannter Feldwert: ' + f, () => {
    const e = gut(); e[f] = k.art === 'mehrfach' ? [...e[f], 'unbekannt'] : k.art === 'status' ? { ...e[f], unbekannt: 'vorhanden-stimmt' } : 'unbekannt';
    assert.equal(B.auswertung(e).darfAbschliessen, false);
    const saved = B.bereinigeGespeichert({ fallId: 'b03', bewertungsstand: B.BEWERTUNGSSTAND, eingaben: e, letzteAuswertung: B.auswertung(gut()), abgeschlossen: true });
    assert.equal(saved.abgeschlossen, false); assert.equal(saved.verworfen, true);
  });
  if (k.art !== 'status') for (const o of k.optionen.filter(o => !o.richtig && !o.optional)) {
    test('B03 falsche Alternative sperrt: ' + f + '/' + o.id, () => {
      const e = gut(); e[f] = k.art === 'mehrfach' ? [...e[f], o.id] : o.id;
      assert.equal(B.auswertung(e).darfAbschliessen, false);
      assert.ok(B.auswertung(e).sperren.length);
    });
  }
}
test('B03 einzelne Datenzeile falsch oder unbeantwortet sperrt', () => {
  for (const o of B.katalog().daten.optionen) {
    for (const wert of ['fehlt', 'widerspruch', null]) {
      const e = gut(); if (wert) e.daten[o.id] = wert; else delete e.daten[o.id];
      assert.equal(B.auswertung(e).darfAbschliessen, false);
    }
  }
});
test('B03 digitaler Antwortbaustein ist zulässig und optional', () => {
  const e = gut(); e.bausteine.push('digital-alternative'); assert.equal(B.auswertung(e).darfAbschliessen, true);
});
test('B03 Freitext wird nicht bewertet und entwertet gespeicherte Auswertung', () => {
  const e = gut(), a = B.auswertung(e); e.freitext = 'beliebige Behauptung';
  assert.equal(B.auswertung(e).freitext.automatischGeprueft, false);
  assert.equal(B.bereinigeGespeichert({ fallId: 'b03', bewertungsstand: B.BEWERTUNGSSTAND, eingaben: e, letzteAuswertung: a, abgeschlossen: true }).abgeschlossen, false);
});
test('B03 defekte/alte/manipulierte Speicherstände übernehmen keinen Abschluss', () => {
  assert.equal(B.bereinigeGespeichert('{defekt').abgeschlossen, false);
  const obj = { fallId: 'b03', bewertungsstand: B.BEWERTUNGSSTAND, eingaben: gut(), letzteAuswertung: B.auswertung(gut()), abgeschlossen: true };
  assert.equal(B.bereinigeGespeichert(obj).abgeschlossen, true);
  obj.bewertungsstand = 'alt'; assert.equal(B.bereinigeGespeichert(obj).abgeschlossen, false);
  obj.bewertungsstand = B.BEWERTUNGSSTAND; obj.eingaben.regeln.push('unbekannt');
  assert.equal(B.bereinigeGespeichert(obj).abgeschlossen, false);
});
test('B03 eigener Schlüssel und hierarchische Navigation', () => {
  assert.notEqual(B.SPEICHER_SCHLUESSEL, require('../js/rathaus-b02.js').SPEICHER_SCHLUESSEL);
  assert.equal(nav.brotkrumen('buerger', 'fall-b03').at(-1).label, 'Fall B03');
  assert.equal(nav.rueckziel('buerger', 'fall-b03').modus, 'uebersicht');
  assert.deepEqual(nav.buergerUnternavigation('buerger', 'fall-b03').filter(e => e.aktuell).map(e => e.label), ['Fall B03']);
});
