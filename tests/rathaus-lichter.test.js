'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('../js/rathaus-lichter.js');

const einzel = { art: 'einzel', optionen: [
  { id: 'a', richtig: true }, { id: 'b', richtig: false }, { id: 'c', richtig: false }
] };
const mehrfach = { art: 'mehrfach', optionen: [
  { id: 'a', richtig: true }, { id: 'b', richtig: true }, { id: 'c', richtig: false }
] };
const zustaende = (e) => Object.fromEntries(e.optionen.map((o) => [o.id, o.zustand]));

test('vollständig richtiger Block ist grün, Rest neutral', () => {
  const e = L.klassifiziere(mehrfach, ['a', 'b']);
  assert.equal(e.block, 'richtig');
  assert.deepEqual(zustaende(e), { a: 'richtig-gewaehlt', b: 'richtig-gewaehlt', c: 'neutral' });
});

test('falsch ausgewählte Einzelantwort: Fehler, richtige Antwort als fehlend', () => {
  const e = L.klassifiziere(einzel, 'b');
  assert.equal(e.block, 'fehler');
  assert.deepEqual(zustaende(e), { a: 'fehlt', b: 'falsch-gewaehlt', c: 'neutral' });
});

test('richtige, aber fehlende Antwort', () => {
  const e = L.klassifiziere(mehrfach, ['a']);
  assert.equal(e.block, 'fehler');
  assert.deepEqual(zustaende(e), { a: 'richtig-gewaehlt', b: 'fehlt', c: 'neutral' });
});

test('Mix aus richtigen und falschen Antworten', () => {
  const e = L.klassifiziere(mehrfach, ['a', 'c']);
  assert.deepEqual(zustaende(e), { a: 'richtig-gewaehlt', b: 'fehlt', c: 'falsch-gewaehlt' });
  assert.equal(e.block, 'fehler');
});

test('nicht ausgewählte falsche Antworten bleiben neutral', () => {
  assert.equal(zustaende(L.klassifiziere(mehrfach, []))['c'], 'neutral');
});

test('mehrere Blöcke werden unabhängig bewertet', () => {
  assert.equal(L.klassifiziere(einzel, 'a').block, 'richtig');
  assert.equal(L.klassifiziere(mehrfach, ['a']).block, 'fehler');
});

test('Veraltung nur am geänderten Fingerprint', () => {
  const snap = { f1: ['a', 'b'], f2: 'a' };
  assert.equal(L.gleicheFingerprints(['a', 'b'], snap.f1), true);
  assert.equal(L.gleicheFingerprints(['a'], snap.f1), false);
  assert.equal(L.gleicheFingerprints('a', snap.f2), true);
});

test('erneute Auswertung: neuer Snapshot passt wieder', () => {
  const alt = ['a'];
  const neu = ['a', 'b'];
  assert.equal(L.gleicheFingerprints(neu, alt), false);
  assert.equal(L.gleicheFingerprints(neu, neu.slice()), true);
});

test('Reload-Filter behält nur zur Antwort passende Snapshots', () => {
  const stand = { f1: ['a'], f2: 'b', f3: 'x' };
  const antworten = { f1: ['a'], f2: 'c' };
  assert.deepEqual(L.filtereStand(stand, antworten), { f1: ['a'] });
  assert.deepEqual(L.filtereStand(undefined, antworten), {});
});

test('Reset: leerer Stand liefert keine Einträge', () => {
  assert.deepEqual(L.filtereStand({}, { f1: 'a' }), {});
});

test('vor der Auswertung (kein Snapshot) keine Texte und Klassen', () => {
  const klassen = new Set();
  const container = {
    classList: { add: (...c) => c.forEach((x) => klassen.add(x)), remove: (...c) => c.forEach((x) => klassen.delete(x)) },
    querySelectorAll: () => []
  };
  L.zeigeFeld(container, einzel, 'b', undefined);
  assert.equal(klassen.size, 0);
});

test('Freitext bleibt unbewertet', () => {
  const e = L.klassifiziere({ art: 'freitext', optionen: [] }, 'irgendwas');
  assert.equal(e.bewertbar, false);
  assert.equal(e.block, 'unbewertet');
});

test('Luca-Gründe: pflicht false fehlt nicht, Falle gewählt ist falsch', () => {
  const feld = { art: 'mehrfach', optionen: [
    { id: 'p', pflicht: true }, { id: 'n', pflicht: false }, { id: 'f', falle: true }
  ] };
  const ohne = zustaende(L.klassifiziere(feld, ['p']));
  assert.equal(ohne.n, 'neutral');
  assert.equal(ohne.f, 'neutral');
  assert.equal(zustaende(L.klassifiziere(feld, []))['p'], 'fehlt');
  assert.equal(zustaende(L.klassifiziere(feld, ['p', 'f']))['f'], 'falsch-gewaehlt');
});

test('B01-Baustein erforderlich/verboten', () => {
  const feld = { art: 'mehrfach', optionen: [
    { id: 'e', erforderlich: true }, { id: 'v', verboten: true }, { id: 'o' }
  ] };
  const z = zustaende(L.klassifiziere(feld, ['v', 'o']));
  assert.deepEqual(z, { e: 'fehlt', v: 'falsch-gewaehlt', o: 'neutral' });
  assert.equal(L.klassifiziere(feld, ['e', 'o']).block, 'richtig');
});

test('Statuszeile: erwarteter Status', () => {
  const feld = { art: 'status', status: [{ id: 'ok' }, { id: 'fehlt' }], optionen: [
    { id: 'ausweis', erwartet: 'ok' }
  ] };
  const e = L.klassifiziere(feld, { ausweis: 'fehlt' });
  assert.equal(e.block, 'fehler');
  assert.deepEqual(e.zeilen[0].optionen.map((o) => o.zustand), ['fehlt', 'falsch-gewaehlt']);
  assert.equal(L.klassifiziere(feld, { ausweis: 'ok' }).block, 'richtig');
});

test('Feld ohne Richtig-Flags wird nicht erfunden bewertet', () => {
  const e = L.klassifiziere({ art: 'einzel', optionen: [{ id: 'a' }, { id: 'b' }] }, 'a');
  assert.equal(e.bewertbar, false);
});
