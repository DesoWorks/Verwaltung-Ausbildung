'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const V = require('../js/lf1-vertrag.js');

const html = fs.readFileSync(path.join(__dirname, '..', 'module', 'lf1-vertrag.html'), 'utf8');

function sollZustand() {
  const s = V.neuerZustand();
  V.MAIN_IDS.forEach((id) => V.setAntwort(s, id, V.SOLL[id]));
  return s;
}

test('leerer Zustand und HTML ohne Lösungstext', () => {
  const s = V.neuerZustand();
  assert.strictEqual(s.submitted, false);
  assert.strictEqual(s.lcSubmitted, false);
  assert.strictEqual(s.hilfe, 0);
  assert.strictEqual(s.mastered, false);
  assert.ok(V.MAIN_IDS.every((id) => s.answers[id] === null));
  assert.doesNotMatch(html, /Lösung|richtig|data-soll|checked/i);
  assert.match(html, /data-page="lf1-vertrag"/);
  assert.match(html, /data-base="\.\.\/"/);
});

test('fehlende Antwort ergibt keinen Score', () => {
  const s = sollZustand();
  s.answers.materials = null;
  const r = V.auswerten(s);
  assert.strictEqual(r.status, 'fehlend');
  assert.strictEqual(r.score, null);
  assert.strictEqual(s.submitted, false);
});

test('Sollwerte ergeben 6/6', () => {
  const s = sollZustand();
  const r = V.auswerten(s);
  assert.strictEqual(r.score, 6);
  assert.deepStrictEqual(r.flags, []);
  assert.strictEqual(s.complete, true);
});

test('Umkehrung ergibt 0/6 mit allen Flags', () => {
  const s = V.neuerZustand();
  V.MAIN_IDS.forEach((id) => V.setAntwort(s, id, V.SOLL[id] === 'fits' ? 'clarify' : 'fits'));
  const r = V.auswerten(s);
  assert.strictEqual(r.score, 0);
  assert.strictEqual(r.flags.length, 6);
});

test('nur probation falsch ergibt 5/6 und ein Flag', () => {
  const s = sollZustand();
  V.setAntwort(s, 'probation', 'fits');
  const r = V.auswerten(s);
  assert.strictEqual(r.score, 5);
  assert.deepStrictEqual(r.flags, ['probation_range_missed']);
  assert.strictEqual(s.complete, false);
});

test('Kontrolle 3/3 bestanden, falsche Kontrolle nicht bestanden', () => {
  const s = sollZustand();
  V.auswerten(s);
  V.LC_IDS.forEach((id) => V.setKontrolle(s, id, V.LC_SOLL[id]));
  const ok = V.kontrolleAuswerten(s);
  assert.strictEqual(ok.score, 3);
  assert.strictEqual(ok.passed, true);
  assert.strictEqual(s.mastered, true);

  V.setKontrolle(s, 'lc_probation', 'five');
  const schlecht = V.kontrolleAuswerten(s);
  assert.strictEqual(schlecht.passed, false);
  assert.deepStrictEqual(schlecht.flags, ['lc_probation_missed']);
  assert.strictEqual(s.mastered, false);
});

test('Änderung nach Auswertung löscht die Bewertung, Auswahl bleibt', () => {
  const s = sollZustand();
  V.auswerten(s);
  V.setAntwort(s, 'duration', 'clarify');
  assert.strictEqual(s.submitted, false);
  assert.deepStrictEqual(s.flags, []);
  assert.strictEqual(s.score, null);
  assert.strictEqual(s.complete, false);
  assert.strictEqual(s.mastered, false);
  assert.strictEqual(s.answers.duration, 'clarify');
  assert.strictEqual(s.answers.probation, 'clarify');
});

test('Hilfen maximal 2, Neu beginnen setzt sie zurück, Texte ohne Sollwert', () => {
  const s = V.neuerZustand();
  assert.ok(V.hilfeAnfordern(s));
  assert.ok(V.hilfeAnfordern(s));
  assert.strictEqual(V.hilfeAnfordern(s), null);
  assert.strictEqual(s.hilfe, 2);
  V.HILFEN.forEach((t) => assert.doesNotMatch(t, /fits|clarify|passt zum|muss geklärt/i));
  V.neuBeginnen(s);
  assert.strictEqual(s.hilfe, 0);
  assert.ok(V.MAIN_IDS.every((id) => s.answers[id] === null));
});

test('Pflichtsätze stehen im HTML, nicht in den Optionsbeschriftungen', () => {
  assert.match(html, /§ 4 Absatz 5 BBiG/);
  assert.match(html, /§ 8 BBiG ist nicht Gegenstand dieser Übung/);
  const labels = html.match(/<label>[\s\S]*?<\/label>/g) || [];
  assert.ok(labels.length >= 6);
  labels.forEach((l) => assert.doesNotMatch(l, /§ 4|§ 8|Gegenstand/));
});
