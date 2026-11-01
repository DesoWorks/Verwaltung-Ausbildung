"use strict";

// Einzelbewertung und Abschlussbutton in der echten rathaus-ui.js, gegen einen kleinen DOM-Ersatz (jsdom ist nicht installiert).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const wurzel = path.join(__dirname, "..");
const KEY = "verwaltung-ausbildung.rathaus.v1";
const KEY_H = "verwaltung-ausbildung.rathaus.hochbetrieb.v1";
const hb = require("../js/rathaus-hochbetrieb.js");
const luca = require("../js/rathaus-kern.js");
const navi = require("../js/rathaus-navigation.js");

function knoten(tag) {
  return {
    tag, className: "", textContent: "", children: [], attrs: {}, handlers: {}, hidden: false, id: "", type: "",
    appendChild(c) { this.children.push(c); return c; },
    append() { Array.from(arguments).forEach((c) => this.children.push(c)); },
    get firstChild() { return this.children[0] || null; },
    get lastChild() { return this.children[this.children.length - 1] || null; },
    removeChild(c) { this.children.splice(this.children.indexOf(c), 1); },
    setAttribute(n, w) { this.attrs[n] = String(w); },
    getAttribute(n) { return this.attrs[n] === undefined ? null : this.attrs[n]; },
    removeAttribute(n) { delete this.attrs[n]; },
    addEventListener(n, f) { this.handlers[n] = f; },
    focus() {},
    querySelector(t) { return alle(this).find((x) => x.tag === t) || null; }
  };
}
function alle(k) {
  return k.children.reduce((liste, c) => liste.concat([c], alle(c)), []);
}
function text(k) {
  return [k.textContent].concat(k.children.map(text)).join(" ");
}

function start(speicher) {
  const store = Object.assign({}, speicher);
  const ids = {};
  ["hauptinhalt", "rathaus-fortschritt", "lehrkraft-banner", "lehrkraft-schalter", "rathaus-unterleiste", "rathaus-brotkrumen"].forEach((id) => {
    ids[id] = knoten("div");
    ids[id].id = id;
  });
  const document = {
    readyState: "complete",
    createElement: knoten,
    createTextNode: (t) => Object.assign(knoten("#text"), { textContent: t }),
    getElementById: (id) => ids[id] || (ids.hauptinhalt && alle(ids.hauptinhalt).find((k) => k.id === id)) || null,
    querySelectorAll: () => [],
    addEventListener() {}
  };
  const window = {
    RATHAUS_KERN: luca,
    RATHAUS_HOCHBETRIEB: hb,
    RATHAUS_NAVIGATION: navi,
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, w) => { store[k] = String(w); },
      removeItem: (k) => { delete store[k]; }
    },
    location: { hash: "", pathname: "/rathaus.html", search: "" },
    history: { replaceState() {} },
    setTimeout() {},
    addEventListener() {}
  };
  vm.runInNewContext(fs.readFileSync(path.join(wurzel, "js/rathaus-ui.js"), "utf8"), { window, document });
  const haupt = ids.hauptinhalt;
  const finde = (fn) => alle(haupt).find(fn) || null;
  return {
    store,
    haupt,
    sicht: () => text(haupt),
    knopf: (beschriftung) => finde((k) => k.tag === "button" && k.textContent === beschriftung),
    abschluss: () => finde((k) => k.id === "abschluss-knopf"),
    feld: () => finde((k) => k.tag === "textarea"),
    teile: () => alle(haupt).filter((k) => /rathaus-teil /.test(k.className + " ")).map((k) => k.getAttribute("aria-label")),
    auswerten() { this.knopf("6. Auswertung anzeigen").handlers.click(); }
  };
}

const FAELLE = [
  {
    name: "Luca", kern: luca, key: KEY,
    gut: "Guten Tag, Herr Holm. Luca Berger wird am Dienstag für die Berufsschule freigestellt. Er kommt nicht in die Dienststelle.",
    schlecht: "Luca soll die Berufsschule ausfallen lassen und stattdessen den Tag in der Dienststelle am Schalter arbeiten."
  },
  {
    name: "Noelle", kern: hb, key: KEY_H,
    gut: "Noelle Kranz besucht die Berufsschule in den drei Wochen weiter. Für diese Zeit erfolgt keine Einteilung in die Dienststelle statt des Unterrichts.",
    schlecht: "Noelle Kranz besucht die Berufsschule weiter. Trotzdem wird sie in der Dienststelle eingeteilt und arbeitet dort."
  }
];

function speicher(f, extra) {
  const eigen = JSON.stringify(Object.assign({
    ansicht: "vorgang", gelesen: true, akteGelesen: true, entscheidung: "B", gruende: ["bbig15"], antwort: f.gut,
    bewertungsstand: f.kern.BEWERTUNGSSTAND
  }, extra));
  if (f.key === KEY) return { [KEY]: eigen };
  return { [KEY]: JSON.stringify({ aktiverFall: "noelle", bewertungsstand: luca.BEWERTUNGSSTAND }), [KEY_H]: eigen };
}

FAELLE.forEach((f) => {
  test(f.name + ": richtige Entscheidung und Begründung, falscher Brief zeigt zwei von drei und sperrt den Abschluss", () => {
    assert.equal(f.kern.bewerteAntwort(f.schlecht).ok, false);
    const s = start(speicher(f, { antwort: f.schlecht }));
    s.auswerten();
    assert.deepEqual(s.teile(), ["Entscheidung: ✓ Richtig", "Begründung: ✓ Richtig", "Antwortbrief: ✗ Noch nicht richtig"]);
    const t = s.sicht();
    assert.ok(t.includes("Zwei von drei Bereichen sind richtig."));
    assert.ok(t.includes("Überarbeite nur deinen Antwortbrief."));
    assert.equal(t.includes("deine Entscheidung"), false);
    assert.equal(t.includes("deine Begründung"), false);
    assert.equal(t.includes("Das passt schon"), false);
    assert.equal(t.includes(f.kern.lehrkraftLoesung().mustertext), false, "keine Musterlösung");
    assert.equal(s.abschluss().disabled, true);
    s.abschluss().handlers.click();
    assert.equal(JSON.parse(s.store[f.key]).abgeschlossen, false);
  });

  test(f.name + ": alle drei richtig und Akte gelesen gibt den Abschluss frei", () => {
    const s = start(speicher(f));
    s.auswerten();
    assert.deepEqual(s.teile(), ["Entscheidung: ✓ Richtig", "Begründung: ✓ Richtig", "Antwortbrief: ✓ Richtig"]);
    assert.ok(s.sicht().includes("Drei von drei Bereichen sind richtig."));
    assert.ok(s.sicht().includes("Bereit"));
    assert.equal(s.abschluss().disabled, false);
    s.abschluss().handlers.click();
    assert.equal(JSON.parse(s.store[f.key]).abgeschlossen, true);
  });

  test(f.name + ": alles richtig, aber Akte nicht gelesen: Teile bleiben richtig, Abschluss gesperrt mit Hinweis", () => {
    const s = start(speicher(f, { akteGelesen: false }));
    s.auswerten();
    assert.deepEqual(s.teile(), ["Entscheidung: ✓ Richtig", "Begründung: ✓ Richtig", "Antwortbrief: ✓ Richtig"]);
    assert.ok(s.sicht().includes("Öffne zuerst die Ausbildungsakte"));
    assert.equal(s.abschluss().disabled, true);
  });

  test(f.name + ": ohne Auswertung ist der Button gesperrt und der Hinweis hängt per aria-describedby daran", () => {
    const s = start(speicher(f));
    const knopf = s.abschluss();
    assert.equal(knopf.tag, "button");
    assert.equal(knopf.type, "button");
    assert.equal(knopf.disabled, true);
    const hinweis = alle(s.haupt).find((k) => k.id === knopf.getAttribute("aria-describedby"));
    assert.ok(hinweis, "Hinweis fehlt");
    assert.ok(text(hinweis).includes("Werte zuerst deine Eingaben aus"));
    knopf.handlers.click();
    assert.notEqual(JSON.parse(s.store[f.key]).abgeschlossen, true);
    assert.equal(s.abschluss().disabled, true);
  });

  test(f.name + ": Änderung des Antworttexts nach tragfähiger Auswertung sperrt den Abschluss und behält den Entwurf", () => {
    const s = start(speicher(f));
    s.auswerten();
    assert.equal(s.abschluss().disabled, false);
    const feldVorher = s.feld();
    const neu = f.gut + " Bitte um kurze Rückmeldung.";
    feldVorher.value = neu;
    feldVorher.handlers.input();
    assert.equal(s.feld(), feldVorher, "Textfeld darf nicht neu gezeichnet werden");
    assert.equal(s.abschluss().disabled, true);
    const gespeichert = JSON.parse(s.store[f.key]);
    assert.equal(gespeichert.letzteAuswertung, null);
    assert.equal(gespeichert.abgeschlossen, false);
    assert.equal(gespeichert.antwort, neu);
    assert.equal(gespeichert.entscheidung, "B");
    assert.deepEqual(gespeichert.gruende, ["bbig15"]);
    assert.ok(s.sicht().includes("Die Eingaben haben sich geändert. Bitte erneut auswerten."));
    s.abschluss().handlers.click();
    assert.equal(JSON.parse(s.store[f.key]).abgeschlossen, false);
    s.auswerten();
    assert.equal(s.abschluss().disabled, false, "erneutes Auswerten gibt wieder frei");
  });

  test(f.name + ": Änderung von Entscheidung oder Begründung sperrt den Abschluss ebenfalls", () => {
    const s = start(speicher(f));
    s.auswerten();
    const radio = alle(s.haupt).find((k) => k.tag === "input" && k.type === "radio" && k.value === "A");
    radio.handlers.change();
    assert.equal(s.abschluss().disabled, true);
    assert.equal(JSON.parse(s.store[f.key]).entscheidung, "A");
    assert.equal(JSON.parse(s.store[f.key]).letzteAuswertung, null);

    const s2 = start(speicher(f));
    s2.auswerten();
    const box = alle(s2.haupt).find((k) => k.tag === "input" && k.type === "checkbox" && k.value === "bbig15");
    box.checked = false;
    box.handlers.change();
    assert.equal(s2.abschluss().disabled, true);
    assert.deepEqual(JSON.parse(s2.store[f.key]).gruende, []);
  });
});

test("Fehlt ein Teilfeld, steht dort Noch nicht geprüft und nicht Richtig", () => {
  const s = start(speicher(FAELLE[0], {
    letzteAuswertung: { bewertungsstand: luca.BEWERTUNGSSTAND, bestanden: true, darfAbschliessen: false, hinweise: [], traegt: [], naechsterBlick: [] }
  }));
  assert.deepEqual(s.teile(), ["Entscheidung: ? Noch nicht geprüft", "Begründung: ? Noch nicht geprüft", "Antwortbrief: ? Noch nicht geprüft"]);
  assert.equal(s.sicht().includes("Drei von drei"), false);
  assert.equal(s.abschluss().disabled, true);
});

test("Falsche Entscheidung und falsche Begründung benennen genau die offenen Bereiche", () => {
  const s = start(speicher(FAELLE[0], { entscheidung: "A", gruende: [] }));
  s.auswerten();
  assert.deepEqual(s.teile(), ["Entscheidung: ✗ Noch nicht richtig", "Begründung: ✗ Noch nicht richtig", "Antwortbrief: ✓ Richtig"]);
  assert.ok(s.sicht().includes("Einer von drei Bereichen ist richtig. Überarbeite deine Entscheidung und deine Begründung."));
  assert.equal(s.abschluss().disabled, true);
});

test("Gespeicherte Auswertung mit Abschluss bleibt nach dem Laden bestehen, Button bleibt dann aktiv nur bei Freigabe", () => {
  const frei = luca.nachPruefung({ akteGelesen: true, entscheidung: "B", gruende: ["bbig15"], antwort: FAELLE[0].gut });
  const s = start(speicher(FAELLE[0], { letzteAuswertung: frei.letzteAuswertung }));
  assert.equal(s.abschluss().disabled, false);
  assert.deepEqual(s.teile(), ["Entscheidung: ✓ Richtig", "Begründung: ✓ Richtig", "Antwortbrief: ✓ Richtig"]);
});
