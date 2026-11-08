'use strict';
const test = require('node:test');
const assert = require('node:assert');
const K = require('../js/lf1-beendigung.js');

const SOLL = { c1: 'klaeren', c2: 'passt', c3: 'klaeren', c4: 'klaeren' };
const LC = { lc_frist: 'ohne', lc_wechsel: 'vier', lc_zwei: 'unwirksam' };

function alleMain(z) { Object.keys(SOLL).forEach((k) => K.setAntwort(z, k, SOLL[k])); return z; }

test('Sollwerte der vier Aufgaben und der Lernkontrolle', () => {
  assert.deepStrictEqual(Object.assign({}, K.SOLL), Object.assign({}, SOLL, LC));
});

test('richtige Antworten werden akzeptiert', () => {
  const z = alleMain(K.neuerZustand());
  const r = K.auswerten(z);
  assert.strictEqual(r.alleRichtig, true);
  assert.strictEqual(z.submitted, true);
});

test('falsche Antwort wird nicht akzeptiert', () => {
  const z = alleMain(K.neuerZustand());
  K.setAntwort(z, 'c2', 'klaeren');
  const r = K.auswerten(z);
  assert.strictEqual(r.alleRichtig, false);
  assert.deepStrictEqual(r.falsch, ['c2']);
  assert.ok(r.fehler[0].text.length > 0);
});

test('vor auswerten kein Flag, unvollständig setzt es nicht', () => {
  const z = K.neuerZustand();
  assert.strictEqual(z.submitted, false);
  assert.strictEqual(z.kontrolleSubmitted, false);
  K.setAntwort(z, 'c1', 'klaeren');
  const r = K.auswerten(z);
  assert.strictEqual(z.submitted, false);
  assert.strictEqual(r.fehlend.length, 3);
});

test('Lernkontrolle erst nach kontrolleAuswerten', () => {
  const z = K.neuerZustand();
  Object.keys(LC).forEach((k) => K.setKontrolle(z, k, LC[k]));
  assert.strictEqual(z.kontrolleSubmitted, false);
  assert.strictEqual(K.kontrolleAuswerten(z).alleRichtig, true);
  assert.strictEqual(z.kontrolleSubmitted, true);
  K.setKontrolle(z, 'lc_zwei', 'wirksam');
  assert.strictEqual(z.kontrolleSubmitted, false);
});

test('Änderung einer Antwort löscht submitted', () => {
  const z = alleMain(K.neuerZustand());
  K.auswerten(z);
  assert.strictEqual(z.submitted, true);
  K.setAntwort(z, 'c3', 'passt');
  assert.strictEqual(z.submitted, false);
});

test('ungültige Werte werden ignoriert', () => {
  const z = K.neuerZustand();
  K.setAntwort(z, 'c1', 'vielleicht');
  K.setAntwort(z, 'xx', 'passt');
  assert.deepStrictEqual(z.antworten, {});
});

test('Hilfen enthalten kein Sollwort', () => {
  const verboten = /klaeren|passt|ohne|vier|unwirksam/i;
  Object.keys(K._hilfen).forEach((id) => {
    K._hilfen[id].forEach((t) => assert.ok(!verboten.test(t), id + ': ' + t));
  });
  const z = K.neuerZustand();
  for (let i = 0; i < 5; i++) {
    K.MAIN.concat(K.LC).forEach((id) => assert.ok(!verboten.test(K.hilfeAnfordern(z, id))));
  }
});

test('neuBeginnen liefert leeren Zustand', () => {
  const z = K.neuBeginnen();
  assert.deepStrictEqual(z, K.neuerZustand());
});
