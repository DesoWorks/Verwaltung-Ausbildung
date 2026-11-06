"use strict";
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const p = require('../js/plattform-navigation.js');
const n = require('../js/rathaus-navigation.js');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

test('Mehrere Praxiswelten erscheinen alphabetisch ohne Katalogmutation oder Lernfortschritt', () => {
  const einstieg = ['Zukunft', 'Archiv', 'Rathaus'].map((titel, i) => ({ id: String(i), titel, beschreibung: 'Erklärung ' + titel, datei: 'module/' + i + '.html', status: 'verfuegbar' }));
  const before = JSON.stringify(einstieg);
  const worlds = p.bereiche({ einstieg }).find(b => b.id === 'praxiswelten').eintraege;
  assert.deepEqual(worlds.map(x => x.titel), ['Archiv', 'Rathaus', 'Zukunft']);
  assert.equal(JSON.stringify(einstieg), before);
  assert.ok(worlds.every(x => x.zaehltFortschritt === false && x.beschreibung === 'Erklärung ' + x.titel));
});
test('Deutsche natürliche Sortierung verändert Quellliste nicht', () => {
  const source = [{ titel: 'Werkzeug 10' }, { titel: 'Änderung' }, { titel: 'Werkzeug 2' }];
  assert.deepEqual(p.sortiereNachTitel(source).map(x => x.titel), ['Änderung', 'Werkzeug 2', 'Werkzeug 10']);
  assert.equal(source[0].titel, 'Werkzeug 10');
});
test('Ämter alphabetisch, geplante Ämter nicht startbar', () => {
  assert.deepEqual(n.aemter().map(x => x.titel), ['Bürgerbüro', 'Ordnungsamt', 'Personalamt', 'Stadtkasse']);
  assert.ok(n.bereichsMenue('stadt').filter(x => !x.benutzbar).every(x => x.ansicht === null));
});
test('Kompakte Fallübersicht benennt B01 und B02 getrennt', () => {
  for (const [modus, label] of [['fall', 'B01'], ['fall-b02', 'B02']]) {
    const view = n.fallUebersicht('buerger', modus);
    assert.equal(view.amt, 'Bürgerbüro');
    assert.equal(view.aktuellLabel, label);
    assert.deepEqual(n.rueckziel('buerger', modus), { ansicht: 'buerger', modus: 'uebersicht', label: 'Zurück zum Bürgerbüro' });
  }
  assert.equal(n.fallUebersicht('stadt'), null);
});
test('Lehrkraftbedienung außerhalb Lernhauptinhalt und keine statische Amtsknopfleiste', () => {
  const html = read('module/rathaus.html');
  assert.ok(html.indexOf('</main>') < html.indexOf('id="rathaus-lehrkraftbereich"'));
  assert.ok(html.indexOf('id="rathaus-lehrkraftbereich"') < html.indexOf('id="lehrkraft-schalter"'));
  assert.doesNotMatch(html, /data-ansicht=/);
});
test('Plattform rendert alle Praxiswelten und benennt die Startsektion', () => {
  assert.match(read('js/navigation.js'), /praxisEintraege\.forEach/);
  assert.doesNotMatch(read('js/navigation.js'), /bereich\("praxiswelten"\)\.eintraege\[0\]/);
  assert.match(read('js/startseite.js'), /"Praxiswelten"/);
});
