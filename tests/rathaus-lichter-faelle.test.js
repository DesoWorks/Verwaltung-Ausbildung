'use strict';
// Rückmeldelichter gegen die echten, fachlich geprüften Fallkataloge (B01–B04, Luca, Noelle).
// Richtige Antworten stammen ausschließlich aus den Flags im Katalog, nie aus Text oder Position.
const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('../js/rathaus-lichter.js');
const b01 = require('../js/rathaus-buergerbuero.js');
const b02 = require('../js/rathaus-b02.js');
const b03 = require('../js/rathaus-b03.js');
const b04 = require('../js/rathaus-b04.js');
const luca = require('../js/rathaus-kern.js');
const noelle = require('../js/rathaus-hochbetrieb.js');

const faelle = { B01: b01, B02: b02, B03: b03, B04: b04 };

function bewertbar(felder) {
  return Object.keys(felder).filter((k) => L.klassifiziere(felder[k], leer(felder[k])).bewertbar);
}
function leer(feld) {
  if (feld.art === 'status') return {};
  return feld.art === 'mehrfach' ? [] : '';
}

// Alle Optionen, die laut Katalog gewählt sein müssen.
function richtigeAntwort(feld) {
  const o = feld.optionen;
  if (feld.art === 'status') {
    const a = {};
    o.forEach((z) => { a[z.id] = z.erwartet; });
    return a;
  }
  const ids = o.filter((x) => x.richtig === true || x.erforderlich === true || x.pflicht === true).map((x) => x.id);
  return feld.art === 'mehrfach' ? ids : ids[0] || '';
}

Object.keys(faelle).forEach((name) => {
  const f = faelle[name];
  test(name + ': Felder kommen aus dem Katalog und sind teils bewertbar', () => {
    const felder = f.lichtFelder();
    assert.ok(Object.keys(felder).length > 0);
    assert.ok(bewertbar(felder).length > 0);
  });

  test(name + ': vor der Auswertung kein Lichtstand, Antworten ohne Lösung', () => {
    const antworten = f.lichtAntworten({});
    assert.ok(Object.keys(antworten).length > 0);
    assert.equal(JSON.stringify(antworten).includes('richtig'), false);
  });

  test(name + ': korrekt beantwortete Blöcke sind grün, unbeantwortete fehlerhaft', () => {
    const felder = f.lichtFelder();
    bewertbar(felder).forEach((key) => {
      const feld = felder[key];
      assert.equal(L.klassifiziere(feld, richtigeAntwort(feld)).block, 'richtig', name + ' ' + key);
      assert.equal(L.klassifiziere(feld, leer(feld)).block, 'fehler', name + ' ' + key + ' leer');
    });
  });
});

test('B01: Dokumentzeilen sind eigene Blöcke', () => {
  const felder = b01.lichtFelder();
  assert.ok(Object.keys(felder).some((k) => k.indexOf('dokumente.') === 0));
});

test('B02–B04: Reload behält nur Lichter, die zur gespeicherten Antwort passen', () => {
  [b02, b03, b04].forEach((f) => {
    const felder = f.lichtFelder();
    const key = bewertbar(felder).find((k) => felder[k].art === 'einzel');
    assert.ok(key, 'Einzelblock vorhanden');
    const eingaben = {};
    eingaben[key] = felder[key].optionen[0].id;
    const stand = f.lichtAntworten(eingaben);
    const roh = { fallId: f.FALL_ID, bewertungsstand: f.BEWERTUNGSSTAND, eingaben: eingaben, letzteAuswertung: null, abgeschlossen: false, lichtStand: stand };
    assert.equal(f.bereinigeGespeichert(roh).lichtStand[key], eingaben[key]);
    const geaendert = Object.assign({}, roh, { eingaben: { [key]: felder[key].optionen[1].id } });
    assert.equal(f.bereinigeGespeichert(geaendert).lichtStand[key], undefined);
  });
});

test('B02–B04: abweichende Gesamtauswertung verwirft Eingaben nicht als beschädigt', () => {
  [b02, b03, b04].forEach((f) => {
    const eingaben = f.normalisiere({});
    const a = f.auswertung(eingaben);
    const roh = { fallId: f.FALL_ID, bewertungsstand: f.BEWERTUNGSSTAND, eingaben: eingaben,
      letzteAuswertung: Object.assign({}, a, { eingabeVersion: 'abweichend' }), abgeschlossen: true, lichtStand: {} };
    const r = f.bereinigeGespeichert(roh);
    assert.equal(r.verworfen, false);
    assert.equal(r.letzteAuswertung, null);
    assert.equal(r.abgeschlossen, false);
  });
});

[['Luca', luca], ['Noelle', noelle]].forEach(([name, k]) => {
  test(name + ': Entscheidung einzeln, Gründe mehrfach, Brief nicht markiert', () => {
    const kat = k.lichtKatalog();
    assert.deepEqual(Object.keys(kat).sort(), ['entscheidung', 'gruende']);
    assert.equal(L.klassifiziere(kat.entscheidung, 'B').block, 'richtig');
    assert.equal(L.klassifiziere(kat.entscheidung, 'A').block, 'fehler');
    const nurPflicht = L.klassifiziere(kat.gruende, ['bbig15']);
    assert.equal(nurPflicht.block, 'richtig');
    assert.equal(nurPflicht.optionen.filter((o) => o.zustand === 'fehlt').length, 0);
    assert.equal(L.klassifiziere(kat.gruende, []).optionen.find((o) => o.id === 'bbig15').zustand, 'fehlt');
    assert.equal(k.lichtAntworten({ antwort: 'x' }).antwort, undefined);
  });

  test(name + ': Reload-Filter und Reset', () => {
    const roh = { entscheidung: 'B', gruende: ['bbig15'], bewertungsstand: k.BEWERTUNGSSTAND,
      lichtStand: { entscheidung: 'B', gruende: ['bbig14-4'] } };
    assert.deepEqual(k.bereinigeGespeichert(roh).lichtStand, { entscheidung: 'B' });
    assert.deepEqual(k.bereinigeGespeichert({ entscheidung: 'B' }).lichtStand, {});
  });

  test(name + ': alter Bewertungsstand verwirft auch die Lichter', () => {
    const roh = { entscheidung: 'B', gruende: ['bbig15'], bewertungsstand: 'alt-stand',
      lichtStand: { entscheidung: 'B', gruende: ['bbig15'] }, abgeschlossen: true };
    const bereinigt = k.bereinigeGespeichert(roh);
    assert.equal(bereinigt.verworfen, true);
    assert.equal(bereinigt.letzteAuswertung, null);
    assert.equal(bereinigt.abgeschlossen, false);
    assert.deepEqual(bereinigt.lichtStand, {});
  });
});
