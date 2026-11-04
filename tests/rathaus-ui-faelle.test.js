"use strict";

// Führt die echte rathaus-ui.js gegen einen kleinen DOM-Ersatz aus (jsdom ist nicht installiert).
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
  const k = {
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
  return k;
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
  ["hauptinhalt", "rathaus-fortschritt", "lehrkraft-banner", "lehrkraft-schalter", "rathaus-bereiche", "lehrkraft-status", "rathaus-unterleiste", "rathaus-brotkrumen"].forEach((id) => {
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
  const window = {
    RATHAUS_KERN: luca,
    RATHAUS_HOCHBETRIEB: hb,
    RATHAUS_NAVIGATION: navi,
    RATHAUS_LEHRKRAFT: require("../js/rathaus-lehrkraft.js"),
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
  return {
    store,
    haupt,
    schalter: ids["lehrkraft-schalter"],
    sicht: () => text(haupt),
    knoepfe: () => alle(haupt).filter((k) => k.tag === "button"),
    klick(beschriftung, nr) {
      const treffer = alle(haupt).filter((k) => k.tag === "button" && k.textContent === beschriftung);
      assert.ok(treffer[nr || 0], "Knopf fehlt: " + beschriftung);
      treffer[nr || 0].handlers.click();
    }
  };
}

const post = (extra) => ({ [KEY]: JSON.stringify(Object.assign({ ansicht: "post", bewertungsstand: luca.BEWERTUNGSSTAND }, extra)) });

test("Posteingang zeigt beide Nachrichten, auch wenn Luca aktiv ist", () => {
  const s = start(post());
  const t = s.sicht();
  assert.ok(t.includes(luca.fallDaten().betreff));
  assert.ok(t.includes(hb.fallDaten().betreff));
  assert.equal(s.knoepfe().filter((k) => k.textContent === "Nachricht lesen").length, 2);
});

test("Posteingang zeigt beide Nachrichten, auch wenn Noelle aktiv ist", () => {
  const s = start(Object.assign(post({ aktiverFall: "noelle" }), {
    [KEY_H]: JSON.stringify({ ansicht: "post", bewertungsstand: hb.BEWERTUNGSSTAND })
  }));
  const t = s.sicht();
  assert.ok(t.includes(luca.fallDaten().betreff));
  assert.ok(t.includes(hb.fallDaten().betreff));
});

test("Nachricht lesen an der Noelle-Karte aktiviert nur Noelle und lässt Luca ungelesen", () => {
  const s = start(post());
  s.klick("Nachricht lesen", 1);
  const alt = JSON.parse(s.store[KEY]);
  assert.equal(alt.aktiverFall, "noelle");
  assert.notEqual(alt.gelesen, true, "Luca bleibt ungelesen");
  const neu = JSON.parse(s.store[KEY_H]);
  assert.equal(neu.gelesen, true);
  assert.equal(neu.ansicht, "vorgang");
  assert.ok(s.sicht().includes("Noelle"), "Vorgang von Noelle ist offen");
});

test("Nachricht lesen an der Luca-Karte, während Noelle aktiv ist, lässt Noelle ungelesen", () => {
  const s = start(Object.assign(post({ aktiverFall: "noelle" }), {
    [KEY_H]: JSON.stringify({ ansicht: "post", bewertungsstand: hb.BEWERTUNGSSTAND })
  }));
  s.klick("Nachricht lesen", 0);
  const alt = JSON.parse(s.store[KEY]);
  assert.equal(alt.gelesen, true);
  assert.equal(alt.aktiverFall, undefined, "Luca ist aktiv");
  assert.notEqual(JSON.parse(s.store[KEY_H]).gelesen, true, "Noelle bleibt ungelesen");
  assert.ok(s.sicht().includes("Luca"));
});

test("Eine bereits gelesene andere Nachricht bleibt als gelesen markiert", () => {
  const s = start(Object.assign(post({ aktiverFall: "noelle" }), {
    [KEY_H]: JSON.stringify({ ansicht: "post", gelesen: true, bewertungsstand: hb.BEWERTUNGSSTAND })
  }));
  const knoepfe = s.knoepfe().map((k) => k.textContent);
  assert.deepEqual(knoepfe.filter((t) => /Nachricht/.test(t)).sort(), ["Nachricht erneut lesen", "Nachricht lesen"]);
});

test("Lehrkraftansicht listet beide Fälle mit Betreff und Name, ohne Id und Pfad", () => {
  const s = start({ [KEY]: JSON.stringify({ ansicht: "lehrkraft", lehrkraft: true, bewertungsstand: luca.BEWERTUNGSSTAND }) });
  const t = s.sicht();
  [luca.fallDaten(), hb.fallDaten()].forEach((d) => {
    assert.ok(t.includes(d.betreff), d.betreff);
    assert.ok(t.includes(d.person.name), d.person.name);
    assert.equal(t.includes(d.id), false, "interne Id sichtbar: " + d.id);
  });
  assert.equal(t.includes("/home/"), false);
  assert.equal(t.includes(".js"), false);
  assert.ok(t.includes(luca.lehrkraftLoesung().mustertext), "Musterlösung in der Lehrkraftansicht");
});

test("Lehrkraftansicht listet beide Fälle auch bei aktivem Noelle-Fall", () => {
  const s = start(Object.assign({ [KEY]: JSON.stringify({ aktiverFall: "noelle", bewertungsstand: luca.BEWERTUNGSSTAND }) }, {
    [KEY_H]: JSON.stringify({ ansicht: "lehrkraft", lehrkraft: true, bewertungsstand: hb.BEWERTUNGSSTAND })
  }));
  const t = s.sicht();
  assert.ok(t.includes("Luca Berger") && t.includes("Noelle Kranz"));
  assert.ok(t.includes(hb.lehrkraftLoesung().mustertext));
});

test("Lernansicht zeigt keine Musterlösung und keine Lehrkraftliste", () => {
  ["vorgang", "post", "akte", "personal"].forEach((ansicht) => {
    [KEY, KEY_H].forEach((schl, i) => {
      const s = start(Object.assign({ [KEY]: JSON.stringify({ aktiverFall: i ? "noelle" : undefined, bewertungsstand: luca.BEWERTUNGSSTAND }) }, {
        [KEY_H]: JSON.stringify({ ansicht, gelesen: true, akteGelesen: true, bewertungsstand: hb.BEWERTUNGSSTAND })
      }, i ? {} : { [KEY]: JSON.stringify({ ansicht, gelesen: true, akteGelesen: true, bewertungsstand: luca.BEWERTUNGSSTAND }) }));
      const t = s.sicht();
      assert.equal(t.includes(luca.lehrkraftLoesung().mustertext), false, ansicht);
      assert.equal(t.includes(hb.lehrkraftLoesung().mustertext), false, ansicht);
      assert.equal(t.includes("Vorhandene Übungsfälle"), false, ansicht);
    });
  });
});
