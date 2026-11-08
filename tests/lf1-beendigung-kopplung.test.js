'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const V = require('../js/lf1-beendigung.js');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'module', 'lf1-beendigung.html'), 'utf8');
const katalog = fs.readFileSync(path.join(root, 'js', 'module-daten.js'), 'utf8');

function optionenAusHtml() {
  return [...html.matchAll(/<input\b[^>]*type="radio"[^>]*>/g)].map(([tag]) => ({
    name: (tag.match(/\bname="([^"]+)"/) || [])[1],
    value: (tag.match(/\bvalue="([^"]+)"/) || [])[1]
  }));
}

function textOhneMarkup(htmlText) {
  return htmlText.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

test('alle vorgegebenen Sollwerte sind als Radio-Optionen auswählbar', () => {
  const options = optionenAusHtml();
  for (const [id, soll] of Object.entries(V.SOLL)) {
    assert.equal(options.filter((o) => o.name === id && o.value === soll).length, 1,
      `${id}=${soll} muss genau einmal als auswählbare Option vorkommen`);
  }
});

test('eine auswählbare falsche Antwort wird von auswerten nicht als richtig akzeptiert', () => {
  const id = 'c1';
  const falsch = optionenAusHtml().find((o) => o.name === id && o.value !== V.SOLL[id]);
  assert.ok(falsch, `${id} hat eine falsche Auswahl für den Gegencheck`);
  const zustand = V.neuerZustand();
  for (const frage of V.MAIN) V.setAntwort(zustand, frage, V.SOLL[frage]);
  V.setAntwort(zustand, id, falsch.value);
  const result = V.auswerten(zustand);
  assert.equal(result.alleRichtig, false);
  assert.deepEqual(result.falsch, [id]);
  assert.deepEqual(result.richtig, V.MAIN.filter((frage) => frage !== id));
});

test('Hilfen und Falltext markieren keine Lösung vor dem Auswerten-Knopf', () => {
  const hilfen = Object.values(V._hilfen).flat().join(' ');
  const fallStart = html.indexOf('<section aria-labelledby="fall">');
  const buttonEnd = html.indexOf('</button>', html.indexOf('data-aktion="auswerten"'));
  assert.ok(fallStart >= 0 && buttonEnd > fallStart, 'Fallbereich und Auswerten-Knopf sind vorhanden');
  const fallVorAuswertung = textOhneMarkup(html.slice(fallStart, buttonEnd));
  const ausdruecklicheLoesungsmarkierung = /\b(?:richtig|richtige|lösung|antwort)\s+(?:ist|lautet)\s+(?:klaeren|passen|passt|ohne|vier|unwirksam)\b/i;
  assert.doesNotMatch(hilfen, ausdruecklicheLoesungsmarkierung, 'Hilfen sollen die Antwort nicht als Lösung ausgeben');
  assert.doesNotMatch(fallVorAuswertung, ausdruecklicheLoesungsmarkierung,
    'Aufgabentext darf vor dem Knopf keine Antwort als richtig markieren');
  assert.match(fallVorAuswertung, /vier Wochen/i, '„vier Wochen“ darf als Sachverhalt im Falltext vorkommen');
});

test('Lerntext zu Freistellung und Schriftform steht vor den Aufgaben', () => {
  const aufgabenStart = html.indexOf('<section aria-labelledby="fall">');
  assert.ok(aufgabenStart > 0, 'Fallabschnitt ist vorhanden');
  const vorAufgaben = textOhneMarkup(html.slice(0, aufgabenStart));
  assert.match(vorAufgaben, /Freistellung/i);
  assert.match(vorAufgaben, /schriftlich/i);
  assert.match(vorAufgaben, /Das musst du vorher wissen/i);
});

test('Katalog führt die vorhandene LF1-C-Seite direkt nach LF1-Vertrag', () => {
  const vertragPos = katalog.indexOf('id: "lf1-vertrag"');
  const beendigungPos = katalog.indexOf('id: "lf1-beendigung"');
  assert.ok(vertragPos >= 0 && beendigungPos > vertragPos, 'lf1-beendigung folgt im Katalog auf lf1-vertrag');
  const zwischen = katalog.slice(vertragPos, beendigungPos);
  assert.equal((zwischen.match(/id: "lf1-/g) || []).length, 1,
    'zwischen LF1-Vertrag und LF1-C darf kein weiterer LF1-Katalogeintrag liegen');
  assert.match(katalog.slice(beendigungPos, beendigungPos + 500), /datei: "module\/lf1-beendigung\.html"/);
  assert.equal(fs.existsSync(path.join(root, 'module', 'lf1-beendigung.html')), true,
    'die im Katalog referenzierte Lektion existiert');
});
