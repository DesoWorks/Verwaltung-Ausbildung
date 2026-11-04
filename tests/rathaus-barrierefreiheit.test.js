"use strict";

// Barrierefreiheit und Bedienung des Personalamts: Beschriftung, Gruppen, Ansagen, Fokus,
// Schrittanzeige und Musterlösungstexte. Gegen die echte rathaus-ui.js mit einem kleinen DOM-Ersatz (jsdom ist nicht installiert).
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
const karte = require("../js/rathaus-nachschlagen.js");

function alle(k) {
  return k.children.reduce((liste, c) => liste.concat([c], alle(c)), []);
}
function text(k) {
  return [k.textContent].concat(k.children.map(text)).join(" ");
}

function start(speicher) {
  const store = Object.assign({}, speicher);
  const fokusLog = [];
  const ansagen = [];
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
      focus() { fokusLog.push(this.id); },
      querySelector(t) { return alle(this).find((x) => x.tag === t) || null; }
    };
  }
  const ids = {};
  ["hauptinhalt", "rathaus-fortschritt", "lehrkraft-banner", "lehrkraft-schalter", "rathaus-bereiche", "lehrkraft-status", "rathaus-unterleiste", "rathaus-brotkrumen", "rathaus-ansage"].forEach((id) => {
    ids[id] = knoten("div");
    ids[id].id = id;
  });
  // Jede nicht leere Ansage der Statusregion wird einmal gezählt.
  let aktuell = "";
  Object.defineProperty(ids["rathaus-ansage"], "textContent", {
    get() { return aktuell; },
    set(w) { aktuell = w; if (w) ansagen.push(w); }
  });
  const document = {
    readyState: "complete",
    createElement: knoten,
    createTextNode: (t) => Object.assign(knoten("#text"), { textContent: t }),
    getElementById: (id) => ids[id] || (alle(ids.hauptinhalt).find((k) => k.id === id)) || null,
    querySelectorAll: () => [],
    addEventListener() {}
  };
  const window = {
    RATHAUS_KERN: luca,
    RATHAUS_HOCHBETRIEB: hb,
    RATHAUS_NAVIGATION: navi,
    RATHAUS_LEHRKRAFT: require("../js/rathaus-lehrkraft.js"),
    RATHAUS_NACHSCHLAGEN: karte,
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, w) => { store[k] = String(w); },
      removeItem: (k) => { delete store[k]; }
    },
    location: { hash: "", pathname: "/rathaus.html", search: "" },
    history: { replaceState() {} },
    // Sofort ausführen, damit Fokus und Ansage in den Tests sichtbar werden.
    setTimeout(fn) { fn(); return 1; },
    addEventListener() {}
  };
  vm.runInNewContext(fs.readFileSync(path.join(wurzel, "js/rathaus-ui.js"), "utf8"), { window, document });
  const haupt = ids.hauptinhalt;
  const finde = (fn) => alle(haupt).find(fn) || null;
  return {
    store, ids, haupt, fokusLog, ansagen,
    sicht: () => text(haupt),
    knopf: (beschriftung) => finde((k) => k.tag === "button" && k.textContent === beschriftung),
    abschluss: () => finde((k) => k.id === "abschluss-knopf"),
    feld: () => finde((k) => k.tag === "textarea"),
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
  test(f.name + ": Antwortbrief-Textfeld hat eine zugeordnete Beschriftung", () => {
    const s = start(speicher(f));
    const feld = s.feld();
    assert.ok(feld, "Textfeld fehlt");
    assert.ok(feld.id, "Textfeld braucht eine id");
    const label = alle(s.haupt).find((k) => k.tag === "label" && k.getAttribute("for") === feld.id);
    assert.ok(label, "label for=" + feld.id + " fehlt");
    assert.ok(label.textContent.includes("Antwortbrief"), "Beschriftung benennt das Feld");
    assert.ok(label.textContent.includes(f.kern.fallDaten().antwortAn || "Sven Holm"), "Beschriftung nennt den Empfänger");
    const form = alle(s.haupt).find((k) => k.tag === "form");
    assert.ok(form.children.indexOf(label) < form.children.indexOf(feld), "Beschriftung steht vor dem Feld");
    const hilfe = alle(s.haupt).find((k) => k.id === feld.getAttribute("aria-describedby"));
    assert.ok(hilfe, "Hilfetext hängt per aria-describedby am Feld");
  });

  test(f.name + ": Entscheidung und Begründung sind benannte Gruppen", () => {
    const s = start(speicher(f));
    const sets = alle(s.haupt).filter((k) => k.tag === "fieldset");
    assert.equal(sets.length, 2);
    sets.forEach((set) => {
      const legende = set.children.find((k) => k.tag === "legend");
      assert.ok(legende && text(legende).trim().length > 0, "Legende fehlt");
      const hilfe = alle(set).find((k) => k.id === set.getAttribute("aria-describedby"));
      assert.ok(hilfe && hilfe.textContent.length > 0, "Gruppenhinweis fehlt");
    });
    const [a, b] = sets;
    assert.ok(text(a.children.find((k) => k.tag === "legend")).includes("3."));
    assert.ok(text(b.children.find((k) => k.tag === "legend")).includes("4."));
    const radios = alle(a).filter((k) => k.tag === "input");
    const boxen = alle(b).filter((k) => k.tag === "input");
    assert.ok(radios.length >= 2 && radios.every((k) => k.type === "radio" && k.name === "entscheidung"));
    assert.ok(boxen.length >= 2 && boxen.every((k) => k.type === "checkbox"));
    assert.equal(alle(s.haupt).filter((k) => k.tag === "input").length, radios.length + boxen.length, "keine Eingabe außerhalb der Gruppen");
    // Jede Option ist ein label mit sichtbarem Text, der das Eingabefeld umschließt.
    alle(s.haupt).filter((k) => k.tag === "label" && k.className === "rathaus-option").forEach((l) => {
      assert.ok(l.children.some((k) => k.tag === "input") && l.children.some((k) => k.tag === "span" && k.textContent.length > 0));
    });
  });

  test(f.name + ": Auswertung wird genau einmal angesagt, ohne eigene Live-Region im neu gezeichneten Inhalt", () => {
    const s = start(speicher(f, { antwort: f.schlecht }));
    s.auswerten();
    assert.equal(s.ansagen.length, 1, "genau eine Ansage");
    const a = s.ansagen[0];
    assert.ok(a.includes("Auswertung fertig."));
    assert.ok(a.includes("Entscheidung richtig.") && a.includes("Begründung richtig.") && a.includes("Antwortbrief noch nicht richtig."));
    assert.ok(a.includes("Überarbeite nur deinen Antwortbrief."), "Fehlerhinweis ist Teil der Ansage");
    const live = alle(s.haupt).concat([s.haupt]).filter((k) => k.getAttribute("aria-live") !== null || k.getAttribute("role") === "alert");
    assert.equal(live.length, 0, "keine zweite Live-Region");
    assert.ok(s.fokusLog.includes("auswertung-titel"));
  });

  test(f.name + ": Änderung nach einer Auswertung wird einmal angesagt, weitere Tastenanschläge schweigen", () => {
    const s = start(speicher(f));
    s.auswerten();
    s.ansagen.length = 0;
    const feld = s.feld();
    feld.value = f.gut + " Danke.";
    feld.handlers.input();
    assert.equal(s.ansagen.length, 1);
    assert.ok(s.ansagen[0].includes("Auswertung gilt nicht mehr"));
    feld.value = f.gut + " Danke schön.";
    feld.handlers.input();
    feld.value = f.gut + " Danke schön!";
    feld.handlers.input();
    assert.equal(s.ansagen.length, 1, "keine Mehrfachansage");
    const roh = JSON.parse(s.store[f.key]);
    assert.equal(roh.letzteAuswertung, null, "alte Auswertung bleibt ungültig");
    assert.equal(roh.abgeschlossen, false);
    assert.equal(s.abschluss().disabled, true);
  });

  test(f.name + ": Eingabe ohne vorherige Auswertung bleibt still", () => {
    const s = start(speicher(f));
    s.feld().value = f.gut + " Mehr.";
    s.feld().handlers.input();
    assert.equal(s.ansagen.length, 0);
  });

  test(f.name + ": Abschluss setzt den Fokus auf die Statuszeile und sagt nicht zusätzlich an", () => {
    const s = start(speicher(f));
    s.auswerten();
    s.ansagen.length = 0;
    s.fokusLog.length = 0;
    s.abschluss().handlers.click();
    assert.equal(JSON.parse(s.store[f.key]).abgeschlossen, true);
    assert.equal(s.fokusLog[s.fokusLog.length - 1], "abschluss-titel");
    assert.equal(s.ansagen.length, 0, "Fokus liest die Statuszeile bereits vor");
    const status = alle(s.haupt).find((k) => k.id === "abschluss-titel");
    assert.equal(status.tabIndex, -1);
    assert.ok(status.textContent.includes("Vorgang abgeschlossen"));
  });

  test(f.name + ": Die Schrittanzeige zeigt den aktiven Vorgang in Akte und Vorgang, sonst bleibt sie verborgen", () => {
    const name = f.kern.fallDaten().person.name;
    const andere = FAELLE.find((x) => x !== f).kern.fallDaten().person.name;
    ["akte", "vorgang"].forEach((ansicht) => {
      const s = start(speicher(f, { ansicht }));
      const box = s.ids["rathaus-fortschritt"];
      assert.equal(box.hidden, false, ansicht);
      const t = text(box);
      assert.ok(t.includes("Aktiver Vorgang: " + name), ansicht);
      assert.equal(t.includes(andere), false, "der andere Vorgang erscheint nicht");
      assert.ok(/\d von 7 Schritten erledigt/.test(t));
    });
    ["stadt", "personal", "post", "nachschlagen"].forEach((ansicht) => {
      const s = start(speicher(f, { ansicht }));
      const box = s.ids["rathaus-fortschritt"];
      assert.equal(box.hidden, true, ansicht);
      assert.equal(box.children.length, 0, ansicht);
      assert.equal(text(box).includes("von 7"), false);
    });
  });

  test(f.name + ": Schritte tragen ihren Stand auch als Text, nicht nur über Farbe", () => {
    const s = start(speicher(f));
    const punkte = alle(s.ids["rathaus-fortschritt"]).filter((k) => k.tag === "li");
    assert.equal(punkte.length, 7);
    punkte.forEach((p) => {
      const stand = p.children.find((k) => k.className === "nur-lesen");
      assert.ok(stand && /erledigt|offen/.test(stand.textContent));
      assert.equal(/erledigt/.test(stand.textContent), /ist-fertig/.test(p.className));
    });
  });
});

test("Ansichtswechsel setzt den Fokus auf die Überschrift der neuen Ansicht", () => {
  const s = start({ [KEY]: JSON.stringify({ ansicht: "personal", bewertungsstand: luca.BEWERTUNGSSTAND }) });
  s.fokusLog.length = 0;
  s.knopf("Nachschlagekarte öffnen").handlers.click();
  assert.equal(s.fokusLog[s.fokusLog.length - 1], "ansicht-titel");
  alle(s.ids["rathaus-brotkrumen"]).find((k) => k.id === "rathaus-zurueck").handlers.click();
  assert.equal(s.fokusLog[s.fokusLog.length - 1], "ansicht-titel");
});

test("Lehrkraftmodus umschalten setzt den Fokus auf die Überschrift", () => {
  const s = start({ [KEY]: JSON.stringify({ ansicht: "personal", bewertungsstand: luca.BEWERTUNGSSTAND }) });
  s.fokusLog.length = 0;
  s.ids["lehrkraft-schalter"].handlers.click();
  assert.equal(s.fokusLog[s.fokusLog.length - 1], "ansicht-titel");
  s.ids["lehrkraft-schalter"].handlers.click();
  assert.equal(s.fokusLog[s.fokusLog.length - 1], "ansicht-titel");
});

test("Jede Ansicht hat genau eine fokussierbare Hauptüberschrift mit der id ansicht-titel", () => {
  ["stadt", "personal", "post", "akte", "vorgang", "nachschlagen", "lehrkraft"].forEach((ansicht) => {
    const s = start({ [KEY]: JSON.stringify({ ansicht, lehrkraft: ansicht === "lehrkraft", gelesen: true, bewertungsstand: luca.BEWERTUNGSSTAND }) });
    const titel = alle(s.haupt).filter((k) => k.id === "ansicht-titel");
    assert.equal(titel.length, 1, ansicht);
    assert.equal(titel[0].tag, "h2", ansicht);
    assert.equal(titel[0].tabIndex, -1, ansicht);
  });
});

test("Zurück zur Stadtübersicht blendet die Schrittanzeige aus", () => {
  const s = start(speicher(FAELLE[0]));
  assert.equal(s.ids["rathaus-fortschritt"].hidden, false);
  const zurStadt = alle(s.ids["rathaus-brotkrumen"]).find((k) => k.id === "rathaus-zurueck");
  assert.ok(zurStadt, "Knopf zur Stadt fehlt");
  zurStadt.handlers.click();
  assert.equal(s.ids["rathaus-fortschritt"].hidden, true);
  assert.equal(s.ids["rathaus-fortschritt"].children.length, 0);
});

test("fortschrittSichtbar: nur Akte und Vorgang zeigen die Sieben-Schritte-Anzeige", () => {
  navi.ANSICHTEN.forEach((a) => assert.equal(navi.fortschrittSichtbar(a), a === "akte" || a === "vorgang", a));
  assert.equal(navi.fortschrittSichtbar("unbekannt"), false);
});

test("Musterlösung: Lernende lesen, dass sie nur in der lokalen Lehrkraftansicht verfügbar ist", () => {
  FAELLE.forEach((f) => {
    const s = start(speicher(f));
    const t = s.sicht();
    assert.ok(t.includes("Musterlösung gibt es ausschließlich in der lokalen Lehrkraftansicht"), f.name);
    assert.equal(t.includes(f.kern.lehrkraftLoesung().mustertext), false, f.name);
    assert.equal(/Die Musterlösung erscheint nicht in dieser Ansicht/.test(t), false, "alter, unklarer Text ist weg");
  });
  const gesperrt = start({ [KEY]: JSON.stringify({ ansicht: "lehrkraft", lehrkraft: false, bewertungsstand: luca.BEWERTUNGSSTAND }) });
  // Ohne Lehrkraftmodus öffnet die Oberfläche die Stadtübersicht. Über den Schalter kommt die Ansicht.
  assert.equal(gesperrt.sicht().includes(luca.lehrkraftLoesung().mustertext), false);
  const an = start({ [KEY]: JSON.stringify({ ansicht: "lehrkraft", lehrkraft: true, bewertungsstand: luca.BEWERTUNGSSTAND }) });
  assert.ok(an.sicht().includes("ausschließlich in der lokalen Lehrkraftansicht verfügbar"));
  assert.ok(an.sicht().includes(luca.lehrkraftLoesung().mustertext), "Lehrkraft sieht die Lösung");
});

test("Reset in der Lehrkraftansicht fragt nach, setzt dann zurück, setzt den Fokus und sagt einmal an", () => {
  const s = start({ [KEY]: JSON.stringify({ ansicht: "lehrkraft", lehrkraft: true, gelesen: true, antwort: FAELLE[0].gut, bewertungsstand: luca.BEWERTUNGSSTAND }) });
  s.fokusLog.length = 0;
  s.knopf("Fall Luca Berger für einen neuen Durchlauf zurücksetzen").handlers.click();
  assert.equal(s.ansagen.length, 0, "vor der Bestätigung ändert sich nichts");
  s.knopf("Ja, Fall Luca Berger zurücksetzen").handlers.click();
  assert.equal(s.ansagen.length, 1);
  assert.ok(s.ansagen[0].includes("zurückgesetzt"));
  assert.equal(s.fokusLog[s.fokusLog.length - 1], "ansicht-titel");
});

test("Seite und Stilregeln: Statusregion, Nur-Lesen-Klasse, Fokus und schmale Fenster", () => {
  const html = fs.readFileSync(path.join(wurzel, "module/rathaus.html"), "utf8");
  assert.match(html, /id="rathaus-ansage"[^>]*role="status"/);
  assert.match(html, /id="rathaus-ansage"[^>]*aria-live="polite"/);
  assert.equal((html.match(/aria-live=/g) || []).length, 1, "genau eine Live-Region auf der Seite");
  assert.match(html, /id="rathaus-fortschritt" hidden/);
  const css = fs.readFileSync(path.join(wurzel, "css/rathaus.css"), "utf8");
  assert.match(css, /\.nur-lesen\s*\{[^}]*clip: rect\(0, 0, 0, 0\)/);
  assert.match(css, /\.rathaus-inhalt \[tabindex="-1"\]:focus\s*\{[^}]*outline: 3px/);
  assert.match(css, /\.rathaus-abschluss \.knopf:not\(:disabled\):focus-visible/);
  assert.match(css, /\.rathaus-gruppe\s*\{[^}]*min-width: 0/);
  assert.match(css, /@media \(max-width: 640px\)/);
  const schmal = css.slice(css.indexOf("@media (max-width: 640px)"));
  assert.match(schmal, /\.rathaus-unterleiste\s*\{[^}]*grid-template-columns: repeat\(auto-fit, minmax\(min\(100%, 5\.5rem\), 1fr\)\)/, "Unterleiste: responsive Spalten statt fester Spaltenzahl (Reflow bei 320 px und großer Schrift)");
  assert.equal(/overflow-x:\s*hidden/.test(css.replace(/\/\*[\s\S]*?\*\//g, "")), false, "Reflow wird nicht durch overflow-x: hidden verdeckt");
  assert.match(schmal, /\.rathaus-ansichten,\s*\.rathaus-unterleiste\s*\{[^}]*display: grid/);
  assert.match(schmal, /min-height: 44px/, "Mindest-Zielgröße");
  assert.match(css, /\.rathaus-inhalt \.knopf[^{]*\{[^}]*overflow-wrap: anywhere/, "unteilbare Langwörter in Knöpfen brechen als letzte Möglichkeit um, statt die Seite zu verbreitern");
  assert.match(schmal, /hyphens: auto/, "Silbentrennung statt Wortbruch");
  assert.match(css, /\.rathaus-unterleiste\[hidden\]/, "verborgene Unterleiste bleibt verborgen");
});

test('Anzeige: Textgröße gilt auch auf kleinen Bildschirmen, Warnbanner nutzt Theme-Farben', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const styles = fs.readFileSync(path.join(__dirname, '..', 'css', 'styles.css'), 'utf8');
  const rathaus = fs.readFileSync(path.join(__dirname, '..', 'css', 'rathaus.css'), 'utf8');
  const mobil = styles.match(/@media \(max-width[^)]*\)\s*\{[^@]*?html \{ font-size: 17px;[^}]*\}/);
  assert.ok(mobil && /var\(--text-scale/.test(mobil[0]), 'mobile Schriftgröße muss --text-scale nutzen');
  const banner = rathaus.match(/\.rathaus-warnbanner \{[^}]*\}/)[0];
  assert.doesNotMatch(banner, /#[0-9a-fA-F]{3,6}/);
  ['index.html', 'glossar.html'].concat(fs.readdirSync(path.join(__dirname, '..', 'module')).filter((f) => f.endsWith('.html')).map((f) => 'module/' + f))
    .forEach((f) => assert.match(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'), /anzeige-lesen\.js/, f));
});
