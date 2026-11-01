"use strict";

// Führt die echte rathaus-buergerbuero-ui.js (und für die Einbindung rathaus-ui.js) gegen einen kleinen
// DOM-Ersatz aus. jsdom ist im Projekt nicht installiert; es gilt dasselbe Muster wie in rathaus-ui-faelle.test.js.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const wurzel = path.join(__dirname, "..");
const bb = require("../js/rathaus-buergerbuero.js");
const luca = require("../js/rathaus-kern.js");
const hb = require("../js/rathaus-hochbetrieb.js");
const navi = require("../js/rathaus-navigation.js");

const KEY = "verwaltung-ausbildung.rathaus.v1";
const BB = bb.SPEICHER_SCHLUESSEL;

function knoten(tag) {
  return {
    tag, className: "", textContent: "", children: [], attrs: {}, handlers: {}, hidden: false, id: "", type: "",
    disabled: false, checked: false, value: "", name: "", tabIndex: 0,
    appendChild(c) { this.children.push(c); return c; },
    append() { Array.from(arguments).forEach((c) => this.children.push(c)); },
    get firstChild() { return this.children[0] || null; },
    removeChild(c) { this.children.splice(this.children.indexOf(c), 1); },
    setAttribute(n, w) { this.attrs[n] = String(w); },
    getAttribute(n) { return this.attrs[n] === undefined ? null : this.attrs[n]; },
    removeAttribute(n) { delete this.attrs[n]; },
    addEventListener(n, f) { this.handlers[n] = f; },
    focus() { knoten.fokus = this; },
    querySelector(t) { return alle(this).find((x) => x.tag === t) || null; }
  };
}
function alle(k) {
  return k.children.reduce((liste, c) => liste.concat([c], alle(c)), []);
}
function text(k) {
  return [k.textContent].concat(k.children.map(text)).join(" ");
}

function umgebung(speicher, optionen) {
  const o = optionen || {};
  const store = Object.assign({}, speicher);
  const geschrieben = [];
  const entfernt = [];
  const ids = {};
  ["hauptinhalt", "rathaus-fortschritt", "lehrkraft-banner", "lehrkraft-schalter", "rathaus-unterleiste", "rathaus-brotkrumen"].forEach((id) => {
    ids[id] = knoten("div");
    ids[id].id = id;
  });
  const document = {
    readyState: "complete",
    createElement: knoten,
    createTextNode: (t) => Object.assign(knoten("#text"), { textContent: t }),
    getElementById: (id) => ids[id] || null,
    querySelectorAll: () => [],
    addEventListener() {}
  };
  const bestaetigungen = [];
  const window = {
    RATHAUS_KERN: luca,
    RATHAUS_HOCHBETRIEB: hb,
    RATHAUS_NAVIGATION: navi,
    RATHAUS_LEHRKRAFT: require("../js/rathaus-lehrkraft.js"),
    RATHAUS_BUERGERBUERO: bb,
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, w) => {
        if (o.schreibFehler) throw new Error("voll");
        geschrieben.push(k);
        store[k] = String(w);
      },
      removeItem: (k) => { entfernt.push(k); delete store[k]; }
    },
    confirm: (t) => { bestaetigungen.push(t); return o.bestaetigen === true; },
    location: { hash: "", pathname: "/rathaus.html", search: "" },
    history: { replaceState() {} },
    setTimeout: (f) => { f(); return 1; },
    addEventListener() {}
  };
  const kontext = { window, document };
  vm.createContext(kontext);
  vm.runInContext(fs.readFileSync(path.join(wurzel, "js/rathaus-buergerbuero-ui.js"), "utf8"), kontext);
  const haupt = ids.hauptinhalt;
  const api = {
    store, geschrieben, entfernt, bestaetigungen, window, haupt, ids,
    sicht: () => text(haupt),
    knoepfe: () => alle(haupt).filter((k) => k.tag === "button"),
    knopf(beschriftung) {
      const k = alle(haupt).find((x) => x.tag === "button" && x.textContent === beschriftung);
      assert.ok(k, "Knopf fehlt: " + beschriftung);
      return k;
    },
    klick(beschriftung) {
      const k = api.knopf(beschriftung);
      assert.equal(k.disabled, false, "Knopf ist gesperrt: " + beschriftung);
      k.handlers.click();
    },
    eingabe(name, wert) {
      const i = alle(haupt).find((x) => x.tag === "input" && x.name === name && x.value === wert);
      assert.ok(i, "Auswahl fehlt: " + name + "=" + wert);
      i.checked = true;
      i.handlers.change();
    },
    abwahl(name, wert) {
      const i = alle(haupt).find((x) => x.tag === "input" && x.name === name && x.value === wert);
      assert.ok(i, "Auswahl fehlt: " + name + "=" + wert);
      i.checked = false;
      i.handlers.change();
    },
    zeichne(modus, ansicht) {
      window.RATHAUS_BUERGERBUERO_UI.zeichne(haupt, { ansicht: ansicht || "buerger", modus, wechsle() {} });
    }
  };
  return api;
}

function fuelleGut(u) {
  u.eingabe("bb-anliegen", "zuzug");
  u.eingabe("bb-einzug", "datum-09-11");
  u.eingabe("bb-weitereWohnung", "keine");
  u.eingabe("bb-dok-ausweis", "passt");
  u.eingabe("bb-dok-mietvertrag", "kein-ersatz");
  u.eingabe("bb-dok-bestaetigung", "fehlt");
  u.eingabe("bb-dok-merkmal", "fehlt");
  ["bmg17", "bmg19", "bmg23", "ortskarte"].forEach((id) => u.eingabe("bb-regeln", id));
  u.eingabe("bb-vorbereitung", "mitteilung-klaerung");
  ["anliegen", "nachweis-fehlt", "mitteilung-aufgenommen", "naechster-schritt", "nicht-abgeschlossen"].forEach((id) => u.eingabe("bb-bausteine", id));
}

const gespeichert = (u) => JSON.parse(u.store[BB]);

test("B01-Erfolg sperrt nicht: Abschluss möglich, Hinweis auf reine Übung", () => {
  const u = umgebung({});
  u.zeichne("fall");
  assert.equal(u.knopf("Übungsfall abschließen").disabled, true, "vor der Prüfung gesperrt");
  fuelleGut(u);
  u.klick("Auswertung prüfen");
  assert.equal(u.knopf("Übungsfall abschließen").disabled, false);
  u.klick("Übungsfall abschließen");
  assert.equal(gespeichert(u).abgeschlossen, true);
  assert.ok(u.sicht().includes("keine Anmeldung durchgeführt"));
  assert.equal(u.knopf("Übungsfall abschließen").disabled, true, "nach Abschluss nicht erneut");
});

test("Mietvertrag als ausreichend sperrt den Abschluss", () => {
  const u = umgebung({});
  u.zeichne("fall");
  fuelleGut(u);
  u.eingabe("bb-dok-mietvertrag", "passt");
  u.klick("Auswertung prüfen");
  const k = u.knopf("Übungsfall abschließen");
  assert.equal(k.disabled, true);
  assert.ok(u.sicht().includes("Unterlagen"));
  assert.notEqual(gespeichert(u).abgeschlossen, true);
  assert.ok(/Noch nicht abschließbar/.test(u.sicht()));
});

test("Baustein „Anmeldung abgeschlossen“ sperrt den Abschluss", () => {
  const u = umgebung({});
  u.zeichne("fall");
  fuelleGut(u);
  u.eingabe("bb-bausteine", "anmeldung-abgeschlossen");
  u.klick("Auswertung prüfen");
  assert.equal(u.knopf("Übungsfall abschließen").disabled, true);
});

test("Änderung eines strukturierten Feldes macht die Auswertung sofort ungültig", () => {
  const u = umgebung({});
  u.zeichne("fall");
  fuelleGut(u);
  u.klick("Auswertung prüfen");
  assert.equal(u.knopf("Übungsfall abschließen").disabled, false);
  u.eingabe("bb-vorbereitung", "erledigt");
  assert.equal(u.knopf("Übungsfall abschließen").disabled, true);
  assert.equal(gespeichert(u).letzteAuswertung, null);
  assert.equal(gespeichert(u).abgeschlossen, false);
  assert.ok(u.sicht().includes("erneut prüfen"));
});

test("Freitext wird gespeichert und als Entwurf, nicht automatisch geprüft gezeigt", () => {
  const u = umgebung({});
  u.zeichne("fall");
  const feld = alle(u.haupt).find((k) => k.tag === "textarea");
  assert.ok(feld);
  feld.value = "Mein eigener Entwurf an Frau Yilmaz";
  feld.handlers.input();
  assert.equal(gespeichert(u).eingaben.freitext, "Mein eigener Entwurf an Frau Yilmaz");
  const t = u.sicht();
  assert.ok(t.includes("Mein eigener Entwurf an Frau Yilmaz"));
  assert.ok(t.includes("Entwurf, nicht automatisch geprüft"));
  // Der Freitext allein ändert die Auswertung nicht und macht nichts „richtig“.
  fuelleGut(u);
  u.klick("Auswertung prüfen");
  const nach = u.sicht();
  assert.ok(nach.includes("Entwurf, nicht automatisch geprüft"));
});

test("Reset-Abbruch lässt den Speicher unverändert, Bestätigung löscht nur B01", () => {
  const u = umgebung({});
  u.zeichne("fall");
  fuelleGut(u);
  u.klick("Auswertung prüfen");
  assert.equal(u.knopf("Übungsfall abschließen").disabled, false);
  const feld = alle(u.haupt).find((k) => k.tag === "textarea");
  feld.value = "Nachträglicher Entwurf";
  feld.handlers.input();
  assert.equal(u.knopf("Übungsfall abschließen").disabled, true, "Freitextänderung sperrt den Abschluss");
  assert.equal(gespeichert(u).letzteAuswertung, null);
  assert.equal(gespeichert(u).abgeschlossen, false);
  assert.ok(u.sicht().includes("erneut prüfen"));
  u.klick("Auswertung prüfen");
  assert.equal(u.knopf("Übungsfall abschließen").disabled, false, "nach erneuter Prüfung wieder möglich");
  assert.ok(u.sicht().includes("Entwurf, nicht automatisch geprüft"));
});

test("Reset-Abbruch lässt den Speicher unverändert, Bestätigung löscht nur B01", () => {
  const luca1 = JSON.stringify({ ansicht: "post", bewertungsstand: luca.BEWERTUNGSSTAND });
  const u = umgebung({ [KEY]: luca1 }, { bestaetigen: false });
  u.zeichne("fall");
  u.eingabe("bb-anliegen", "zuzug");
  const vorher = u.store[BB];
  u.klick("Fall B01 zurücksetzen");
  assert.deepEqual(u.bestaetigungen, [bb.resetText()]);
  assert.equal(u.store[BB], vorher);
  assert.deepEqual(u.entfernt, []);

  const v = umgebung({ [KEY]: luca1 }, { bestaetigen: true });
  v.zeichne("fall");
  v.eingabe("bb-anliegen", "zuzug");
  assert.ok(v.store[BB]);
  v.klick("Fall B01 zurücksetzen");
  assert.deepEqual(v.entfernt, [BB]);
  assert.equal(v.store[BB], undefined);
  assert.equal(v.store[KEY], luca1, "Luca-Schlüssel bleibt");
});

test("Die Oberfläche schreibt nur den eigenen Schlüssel", () => {
  const luca1 = JSON.stringify({ ansicht: "post", bewertungsstand: luca.BEWERTUNGSSTAND });
  const u = umgebung({ [KEY]: luca1 });
  u.zeichne("fall");
  fuelleGut(u);
  u.klick("Auswertung prüfen");
  u.klick("Übungsfall abschließen");
  assert.ok(u.geschrieben.length > 0);
  assert.ok(u.geschrieben.every((k) => k === BB), u.geschrieben.join(","));
  assert.equal(u.store[KEY], luca1);
});

test("Speicherfehler: sichtbare Meldung, keine Erfolgsmeldung", () => {
  const u = umgebung({}, { schreibFehler: true });
  u.zeichne("fall");
  u.eingabe("bb-anliegen", "zuzug");
  assert.ok(u.sicht().includes("Speichern nicht möglich"));
  fuelleGut(u);
  u.klick("Auswertung prüfen");
  u.knopf("Übungsfall abschließen");
  assert.equal(u.knopf("Übungsfall abschließen").disabled, false, "Prüfung läuft im Speicher weiter");
  u.klick("Übungsfall abschließen");
  assert.ok(u.sicht().includes("Speichern nicht möglich"));
  assert.equal(u.sicht().includes("✓ Übungsfall abgeschlossen"), false, "kein Erfolg ohne Speicherstand");
});

test("Übersicht: B02 und B03 sind gesperrt mit Text „geplant, noch nicht startbar“", () => {
  const u = umgebung({});
  u.zeichne("uebersicht");
  const gesperrt = u.knoepfe().filter((k) => k.textContent === "geplant, noch nicht startbar");
  assert.equal(gesperrt.length, 2);
  gesperrt.forEach((k) => assert.equal(k.disabled, true));
  assert.ok(u.sicht().includes("Meldebescheinigung"));
  assert.ok(u.sicht().includes("Führungszeugnis"));
  assert.ok(u.knoepfe().some((k) => k.textContent === "Fall B01 öffnen" && !k.disabled));
});

test("Fallansicht: sechs beschriftete Bereiche, Gruppen mit legend, Hilfe in drei Stufen ohne Musterbrief", () => {
  const u = umgebung({});
  u.zeichne("fall");
  const t = u.sicht();
  ["1. Anliegen", "2. Unterlagen", "3. Regeln", "4. Vorbereitung", "5. Antwort", "6. Auswertung"].forEach((n) => {
    assert.ok(t.includes(n), n);
  });
  const gruppen = alle(u.haupt).filter((k) => k.tag === "fieldset");
  assert.ok(gruppen.length >= 8);
  gruppen.forEach((g) => assert.ok(g.children.some((c) => c.tag === "legend"), "legend fehlt"));
  const muster = bb.lehrkraft().musterantwort;
  for (let i = 0; i < 4; i++) {
    const mehr = u.knopf("Mehr Hilfe");
    if (!mehr.disabled) mehr.handlers.click();
  }
  assert.ok(u.sicht().includes("Hilfestufe 3 von 3"));
  assert.ok(u.sicht().includes(bb.hilfe(3)));
  assert.equal(u.sicht().includes(muster), false);
  u.klick("Hilfe einklappen");
  assert.equal(u.sicht().includes("Hilfestufe"), false);
});

test("Dokumente öffnen sich inline, ohne Upload", () => {
  const u = umgebung({});
  u.zeichne("fall");
  assert.equal(alle(u.haupt).some((k) => k.tag === "input" && k.type === "file"), false);
  assert.equal(u.sicht().includes("Mietbeginn: 01.11.2026"), false);
  u.klick("Mietvertrag öffnen");
  assert.ok(u.sicht().includes("Mietbeginn: 01.11.2026"));
  assert.equal(u.knopf("Mietvertrag schließen").getAttribute("aria-expanded"), "true");
});

test("Nachschlagekarte zeigt Themen und verändert keinen Speicher", () => {
  const u = umgebung({});
  u.zeichne(null, "buerger-karte");
  assert.ok(u.sicht().includes(bb.nachschlagen().titel));
  assert.deepEqual(u.geschrieben, []);
  assert.equal(u.store[BB], undefined);
});

// ---------- Einbindung in rathaus-ui.js ----------

function mitRathausUi(speicher) {
  const u = umgebung(speicher);
  const kontext = { window: u.window, document: {
    readyState: "complete",
    createElement: knoten,
    createTextNode: (t) => Object.assign(knoten("#text"), { textContent: t }),
    getElementById: (id) => u.ids[id] || null,
    querySelectorAll: () => [],
    addEventListener() {}
  } };
  vm.createContext(kontext);
  vm.runInContext(fs.readFileSync(path.join(wurzel, "js/rathaus-buergerbuero-ui.js"), "utf8"), kontext);
  vm.runInContext(fs.readFileSync(path.join(wurzel, "js/rathaus-ui.js"), "utf8"), kontext);
  return u;
}

test("rathaus-ui: Bürgerbüro-Übersicht öffnet B01, ohne den B01-Schlüssel zu beschreiben", () => {
  const luca1 = JSON.stringify({ ansicht: "buerger", bewertungsstand: luca.BEWERTUNGSSTAND });
  const u = mitRathausUi({ [KEY]: luca1 });
  assert.ok(u.sicht().includes("Fallübersicht"));
  assert.equal(u.geschrieben.includes(BB), false);
  u.klick("Fall B01 öffnen");
  assert.ok(u.sicht().includes("1. Anliegen"));
  assert.equal(u.store[BB], undefined, "reines Navigieren schreibt keinen B01-Stand");
  assert.equal(JSON.parse(u.store[KEY]).ansicht, "buerger");
});

test("rathaus-ui: Lehrkraftansicht zeigt zusätzlich den B01-Block samt Warnung", () => {
  const u = mitRathausUi({ [KEY]: JSON.stringify({ ansicht: "lehrkraft", lehrkraft: true, bewertungsstand: luca.BEWERTUNGSSTAND }) });
  const t = u.sicht();
  assert.ok(t.includes("Luca Berger") && t.includes("Noelle Kranz"));
  assert.ok(t.includes("Samira Yilmaz"));
  assert.ok(t.includes(bb.lehrkraft().musterantwort));
  assert.ok(t.includes(bb.lehrkraft().warnung));
  assert.ok(t.includes(luca.lehrkraftLoesung().mustertext), "Luca-Block bleibt");
});

test("rathaus-ui: Lernansichten des Personalamts zeigen den B01-Block nicht", () => {
  const u = mitRathausUi({ [KEY]: JSON.stringify({ ansicht: "personal", bewertungsstand: luca.BEWERTUNGSSTAND }) });
  assert.equal(u.sicht().includes(bb.lehrkraft().musterantwort), false);
});

test("rathaus.html bindet Kern und Oberfläche vor rathaus-ui.js ein", () => {
  const html = fs.readFileSync(path.join(wurzel, "module/rathaus.html"), "utf8");
  const i = (n) => html.indexOf(n);
  assert.ok(i("rathaus-buergerbuero.js") > -1);
  assert.ok(i("rathaus-buergerbuero.js") < i("rathaus-buergerbuero-ui.js"));
  assert.ok(i("rathaus-buergerbuero-ui.js") < i("rathaus-ui.js"));
});

test("Antwortentwurf B01 ist groß und vertikal veränderbar, Personalamt unberührt", () => {
  const fs = require("node:fs");
  const css = fs.readFileSync(require("node:path").join(__dirname, "..", "css", "rathaus.css"), "utf8");
  assert.match(css, /(^|\n)textarea\.rathaus-freitext-gross\s*\{[^}]*width:\s*100%[^}]*min-height:\s*12rem[^}]*resize:\s*vertical/);
  assert.doesNotMatch(css, /\.rathaus-form textarea\.rathaus-freitext-gross/);
  const ui = fs.readFileSync(require("node:path").join(__dirname, "..", "js", "rathaus-buergerbuero-ui.js"), "utf8");
  assert.match(ui, /rathaus-freitext-gross/);
  assert.doesNotMatch(ui, /rathaus-form/);
});
