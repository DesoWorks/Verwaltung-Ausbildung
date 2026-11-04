'use strict';
const test = require('node:test');
const assert = require('node:assert');
const B = require('../js/rathaus-buergerbuero.js');

const DOK_RICHTIG = { ausweis: 'passt', mietvertrag: 'kein-ersatz', bestaetigung: 'fehlt', merkmal: 'fehlt' };

function gut() {
  return {
    anliegen: 'zuzug',
    einzug: 'datum-09-11',
    weitereWohnung: 'keine',
    dokumente: Object.assign({}, DOK_RICHTIG),
    regeln: ['bmg17', 'bmg19', 'bmg23', 'ortskarte'],
    fallen: 'keine',
    vorbereitung: 'mitteilung-klaerung',
    bausteine: ['anliegen', 'nachweis-fehlt', 'mitteilung-aufgenommen', 'naechster-schritt', 'nicht-abgeschlossen'],
    freitext: ''
  };
}

function st(e, key) { return B.auswertung(e).bereiche[key].status; }

test('Regression B01: nur die vier richtigen Dokumente machen Unterlagen richtig', () => {
  const a = B.auswertung({ dokumente: Object.assign({}, DOK_RICHTIG) });
  assert.strictEqual(a.bereiche.unterlagen.status, 'richtig');
  assert.strictEqual(a.darfAbschliessen, false);
  assert.ok(!/unvollst|fehlen noch Angaben bei den Unterlagen/i.test(JSON.stringify(a.bereiche.unterlagen)));
  assert.strictEqual(a.bereiche.anliegen.status, 'offen');
  assert.strictEqual(a.bereiche.regeln.status, 'offen');
});

test('Unterlagen: unvollständig, falsch, richtig', () => {
  const e = { dokumente: { ausweis: 'passt', mietvertrag: 'kein-ersatz' } };
  assert.strictEqual(st(e, 'unterlagen'), 'unvollstaendig');
  const f = { dokumente: Object.assign({}, DOK_RICHTIG, { mietvertrag: 'passt' }) };
  const a = B.auswertung(f);
  assert.strictEqual(a.bereiche.unterlagen.status, 'falsch');
  assert.ok(a.sperren.length > 0);
  ['ausweis', 'bestaetigung', 'merkmal'].forEach((id) => {
    const g = { dokumente: Object.assign({}, DOK_RICHTIG, { [id]: 'unklar' }) };
    assert.strictEqual(st(g, 'unterlagen'), 'falsch', id);
  });
});

test('Falsche Rückmeldung verrät die Lösung nicht', () => {
  const korrekt = ['liegt vor und passt', 'ersetzt aber den Nachweis nicht', 'liegt nicht vor', 'Der Ausweis liegt vor', 'ist kein ausreichender Nachweis'];
  const falsch = B.auswertung({
    anliegen: 'abmeldung', einzug: 'vertragsbeginn', weitereWohnung: 'weitere',
    dokumente: Object.assign({}, DOK_RICHTIG, { ausweis: 'fehlt', mietvertrag: 'passt' }),
    regeln: ['bmg17', 'bmg19', 'bmg23', 'ortskarte'], fallen: 'gebuehr',
    vorbereitung: 'abgelehnt', bausteine: ['gebuehr', 'anliegen']
  });
  Object.keys(falsch.bereiche).forEach((k) => {
    assert.strictEqual(falsch.bereiche[k].status, 'falsch', k);
  });
  const text = JSON.stringify([falsch.bereiche, falsch.sperren]);
  korrekt.forEach((s) => assert.ok(!text.includes(s), s));
  ['Anmeldung nach einem Zuzug', 'mitteilung-klaerung', 'datum-09-11', 'kein-ersatz', 'passt'].forEach((s) => {
    assert.ok(!text.includes(s), s);
  });
});

test('Anliegen: offen, unvollständig, falsch, richtig', () => {
  assert.strictEqual(st({}, 'anliegen'), 'offen');
  assert.strictEqual(st({ anliegen: 'zuzug' }, 'anliegen'), 'unvollstaendig');
  assert.strictEqual(st({ anliegen: 'zuzug', einzug: 'vertragsbeginn', weitereWohnung: 'keine' }, 'anliegen'), 'falsch');
  assert.strictEqual(st({ anliegen: 'abmeldung', einzug: 'datum-09-11', weitereWohnung: 'keine' }, 'anliegen'), 'falsch');
  assert.strictEqual(st({ anliegen: 'zuzug', einzug: 'datum-09-11', weitereWohnung: 'weitere' }, 'anliegen'), 'falsch');
  assert.strictEqual(st(gut(), 'anliegen'), 'richtig');
});

test('Regeln: offen, unvollständig, falsch durch Falle, richtig', () => {
  assert.strictEqual(st({}, 'regeln'), 'offen');
  assert.strictEqual(st({ regeln: ['bmg17', 'bmg19'] }, 'regeln'), 'unvollstaendig');
  const e = gut();
  e.fallen = 'abmeldung-pflicht';
  const a = B.auswertung(e);
  assert.strictEqual(a.bereiche.regeln.status, 'falsch');
  assert.strictEqual(a.darfAbschliessen, false);
  assert.strictEqual(st(gut(), 'regeln'), 'richtig');
});

test('Die Auswertung nennt den offenen Abschnitt', () => {
  const e = gut();
  e.regeln = ['bmg17'];
  const a = B.auswertung(e);
  assert.strictEqual(a.bereiche.unterlagen.status, 'richtig');
  assert.strictEqual(a.bereiche.regeln.status, 'unvollstaendig');
  assert.ok(a.bereiche.regeln.hinweise.join(' ').includes('Regeln'));
  assert.strictEqual(a.darfAbschliessen, false);
});

test('Vollständiger Erfolgsweg und verbotener Baustein', () => {
  const a = B.auswertung(gut());
  Object.keys(a.bereiche).forEach((k) => assert.strictEqual(a.bereiche[k].status, 'richtig', k));
  assert.strictEqual(a.darfAbschliessen, true);
  const e = gut();
  e.bausteine.push('anmeldung-abgeschlossen');
  assert.strictEqual(B.auswertung(e).darfAbschliessen, false);
  const f = gut();
  f.freitext = 'Eigener Text';
  assert.strictEqual(B.auswertung(f).darfAbschliessen, true);
});

test('Bewertungsstand angehoben: alte Auswertung ungültig, Eingaben bleiben', () => {
  assert.notStrictEqual(B.BEWERTUNGSSTAND, 'b01-2026-11-01');
  const e = gut();
  e.freitext = 'bleibt';
  const alt = { fallId: 'b01', bewertungsstand: 'b01-2026-11-01', eingaben: e, letzteAuswertung: { eingabeVersion: B.eingabeVersion(e) }, abgeschlossen: true };
  const s = B.bereinigeGespeichert(JSON.stringify(alt));
  assert.strictEqual(s.letzteAuswertung, null);
  assert.strictEqual(s.abgeschlossen, false);
  assert.deepStrictEqual(s.eingaben.dokumente, DOK_RICHTIG);
  assert.strictEqual(s.eingaben.freitext, 'bleibt');
});

test('Regeln/Fallen: Einfachauswahl, vierte Option ausdrücklich richtig', () => {
  const k = B.katalog().fallen;
  assert.strictEqual(k.art, 'einzel');
  assert.deepStrictEqual(k.optionen.filter((o) => o.richtig).map((o) => o.id), ['keine']);
  assert.strictEqual(k.optionen[3].text, 'Keine dieser Aussagen trifft zu.');
  assert.strictEqual(st(gut(), 'regeln'), 'richtig');
});

test('Regeln/Fallen: fehlende Antwort ist nie richtig', () => {
  const e = gut();
  delete e.fallen;
  const a = B.auswertung(e);
  assert.strictEqual(a.bereiche.regeln.status, 'unvollstaendig');
  assert.strictEqual(a.darfAbschliessen, false);
  assert.ok(/nicht beantwortet/.test(a.bereiche.regeln.hinweise.join(' ')));
  assert.strictEqual(st({ fallen: 'keine' }, 'regeln'), 'unvollstaendig');
  assert.strictEqual(st({ fallen: null }, 'regeln'), 'offen');
});

test('Regeln/Fallen: jede falsche Aussage ist falsch und sperrt', () => {
  ['abmeldung-pflicht', 'gebuehr', 'ablehnung-ohne-nachweis'].forEach((id) => {
    const e = gut();
    e.fallen = id;
    const a = B.auswertung(e);
    assert.strictEqual(a.bereiche.regeln.status, 'falsch', id);
    assert.ok(a.sperren.length > 0);
    assert.strictEqual(a.darfAbschliessen, false);
  });
});

test('Regeln/Fallen: Legacy-Array und manipulierte Werte ergeben keine richtige Antwort', () => {
  [[], ['gebuehr'], ['keine'], 'unbekannt', 5, {}, null].forEach((v) => {
    const e = gut();
    e.fallen = v;
    assert.strictEqual(B.normalisiere(e).fallen, null, JSON.stringify(v));
    assert.notStrictEqual(st(e, 'regeln'), 'richtig', JSON.stringify(v));
    assert.strictEqual(B.auswertung(e).darfAbschliessen, false);
  });
  const e = gut();
  e.fallen = ['keine'];
  assert.strictEqual(st(e, 'regeln'), 'ungueltig');
});

test('Regeln/Fallen: alter Speicherstand (r2, Array) wird verworfen, Auswertung und Abschluss ungültig', () => {
  assert.notStrictEqual(B.BEWERTUNGSSTAND, 'b01-2026-11-01-r2');
  const alt = { fallId: 'b01', bewertungsstand: 'b01-2026-11-01-r2', eingaben: Object.assign(gut(), { fallen: [] }),
    letzteAuswertung: { eingabeVersion: 'x' }, abgeschlossen: true };
  const s = B.bereinigeGespeichert(JSON.stringify(alt));
  assert.strictEqual(s.verworfen, true);
  assert.strictEqual(s.abgeschlossen, false);
  assert.strictEqual(s.letzteAuswertung, null);
  assert.strictEqual(s.eingaben.fallen, null);
  assert.strictEqual(s.eingaben.regeln.length, 4, 'übrige Eingaben bleiben');
});

test('Regeln/Fallen: Änderung der Antwort invalidiert gespeicherte Auswertung', () => {
  const e = gut();
  const a = B.auswertung(e);
  assert.strictEqual(a.darfAbschliessen, true);
  const gesp = { fallId: 'b01', bewertungsstand: B.BEWERTUNGSSTAND, eingaben: Object.assign({}, e, { fallen: 'gebuehr' }),
    letzteAuswertung: a, abgeschlossen: true };
  const s = B.bereinigeGespeichert(JSON.stringify(gesp));
  assert.strictEqual(s.letzteAuswertung, null);
  assert.strictEqual(s.abgeschlossen, false);
});
