'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const V = require('../js/lf1-vertrag.js');
const html = fs.readFileSync(path.join(__dirname, '..', 'module', 'lf1-vertrag.html'), 'utf8');
const fortschritt = fs.readFileSync(path.join(__dirname, '..', 'js', 'fortschritt.js'), 'utf8');

function fragenAusHtml() {
  const form = html.match(/<form id="vertrag-form"[\s\S]*?<\/form>/);
  assert.ok(form, 'Vertragsfall-Formular ist vorhanden');
  const fieldsets = [...form[0].matchAll(/<fieldset>([\s\S]*?)<\/fieldset>/g)];
  return fieldsets.map(([, block]) => {
    const id = (block.match(/name="([a-z][a-z0-9_]*)"/) || [])[1];
    const prompt = (block.match(/<legend>([\s\S]*?)<\/legend>/) || [])[1] || '';
    const options = [...block.matchAll(/<label>\s*<input[^>]*name="([^"]+)"[^>]*value="([^"]+)"[^>]*>\s*([\s\S]*?)<\/label>/g)]
      .map(([, name, value, label]) => ({ name, value, label: label.replace(/<[^>]*>/g, '').trim() }));
    return { id, prompt: prompt.replace(/<[^>]*>/g, '').trim(), options };
  });
}

function regelVorAufgabe(id) {
  const allText = html.slice(0, html.indexOf('<section aria-labelledby="fall">'));
  const rules = {
    duration: /Regelausbildungsdauer/,
    probation: /mindestens einen Monat und höchstens vier Monate/,
    pay_details: /Zahlung und Höhe der Vergütung gehören zum Mindestinhalt/,
    record_owner: /Auszubildende führen den Ausbildungsnachweis/,
    materials: /Mittel kostenlos/,
    record_support: /sehen den Nachweis regelmäßig durch/
  };
  return rules[id] && rules[id].test(allText);
}

test('jeder LF1-B-Aufgabenschlüssel hat genau einen auswählbaren Sollwert aus der vorhandenen Logik', () => {
  const keyMatch = fortschritt.match(/"lf1-vertrag"\s*:\s*\{([^}]*)\}/);
  assert.ok(keyMatch, 'fortschritt.js enthält den Soll-Schlüssel für lf1-vertrag');
  const plattformSOLL = Object.fromEntries([...keyMatch[1].matchAll(/([a-z][a-z0-9_]*)\s*:\s*"([a-z_]+)"/g)]
    .map(([, id, wert]) => [id, wert]));
  assert.deepStrictEqual(Object.keys(plattformSOLL).sort(), V.MAIN_IDS.slice().sort(), 'Fortschrittslogik und Aufgaben müssen dieselben Schlüssel enthalten');
  assert.deepStrictEqual(V.SOLL, plattformSOLL, 'Auswertung und Abschlusslogik müssen dieselben Sollwerte verwenden');

  const fragen = fragenAusHtml();
  assert.deepStrictEqual(fragen.map((f) => f.id).sort(), V.MAIN_IDS.slice().sort(), 'Jeder Aufgaben-Schlüssel kommt in genau einem Aufgabenfeld vor');
  for (const id of V.MAIN_IDS) {
    const passendeFragen = fragen.filter((f) => f.id === id);
    assert.equal(passendeFragen.length, 1, `${id}: genau ein Aufgabenfeld`);
    const frage = passendeFragen[0];
    const sollwert = V.SOLL[id];
    assert.equal(frage.options.filter((o) => o.value === sollwert).length, 1, `${id}: Sollwert ist genau eine vorhandene Auswahl`);
    assert.ok(frage.options.every((o) => o.name === id), `${id}: Auswahl gehört zum richtigen Eingabeschlüssel`);
  }
});

test('Aufgabenstellung und Hilfen verraten den Schlüsselwert nicht vor der Auswertung', () => {
  const fragen = fragenAusHtml();
  for (const frage of fragen) {
    const sollwert = V.SOLL[frage.id];
    assert.ok(!frage.prompt.includes(sollwert), `${frage.id}: Sollwert steht nicht in der Aufgabenfrage`);
    const sollOption = frage.options.find((o) => o.value === sollwert);
    assert.ok(sollOption, `${frage.id}: Solloption vorhanden`);
    assert.ok(!frage.prompt.includes(sollOption.label), `${frage.id}: sichtbarer Solltext steht nicht schon in der Fragestellung`);
  }
  for (const hilfe of V.HILFEN) {
    for (const id of V.MAIN_IDS) {
      assert.ok(!hilfe.includes(V.SOLL[id]), `Hilfe verrät den Sollwert ${V.SOLL[id]} nicht`);
    }
  }
});

test('eine auswählbare falsche Option wird von der echten Auswertungslogik nicht als richtig akzeptiert', () => {
  const fragen = fragenAusHtml();
  for (const id of V.MAIN_IDS) {
    const frage = fragen.find((f) => f.id === id);
    const falsch = frage.options.find((o) => o.value !== V.SOLL[id]);
    assert.ok(falsch, `${id}: mindestens eine falsche Auswahl zum Gegenprüfen`);
    const s = V.neuerZustand();
    for (const otherId of V.MAIN_IDS) V.setAntwort(s, otherId, V.SOLL[otherId]);
    V.setAntwort(s, id, falsch.value);
    const result = V.auswerten(s);
    assert.equal(result.score, V.MAIN_IDS.length - 1, `${id}: falsche Auswahl senkt die Punktzahl`);
    assert.deepStrictEqual(result.flags, [
      ({ duration: 'duration_mismatch', probation: 'probation_range_missed', pay_details: 'pay_content_missing',
        record_owner: 'record_duty_missed', materials: 'materials_cost_missed', record_support: 'record_support_missed' })[id]
    ], `${id}: falsche Auswahl erzeugt das zugehörige Fehlerkennzeichen`);
  }
});

test('der Lerntext erklärt die jeweilige Regel vor dem Fall, soweit die Textstruktur es erkennen lässt', () => {
  for (const id of V.MAIN_IDS) assert.ok(regelVorAufgabe(id), `${id}: zugehörige Regel steht vor dem Abschnitt mit den Aufgaben`);
});
