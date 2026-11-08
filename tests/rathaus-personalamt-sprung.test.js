"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const source = fs.readFileSync(path.join(__dirname, "../js/rathaus-ui.js"), "utf8");
// Echte Renderfunktionen aus der Browser-IIFE ausführen, keine kopierte Implementierung.
const renderSource = source.slice(source.indexOf("  function teilbewertungen("), source.indexOf("  // Der Abschlussbutton", source.indexOf("  function teilbewertungen(")));
function node(tag, cls, text) {
  return { tag, className: cls, text: text || "", children: [], attrs: {}, handlers: {},
    appendChild(child) { this.children.push(child); return child; },
    setAttribute(key, value) { this.attrs[key] = value; },
    addEventListener(event, handler) { this.handlers[event] = handler; } };
}
function all(root) { return [root, ...root.children.flatMap(all)]; }
function harness(result, akteGelesen = true) {
  const state = { letzteAuswertung: result, akteGelesen, entscheidung: "unveraendert", gruende: ["a"], antwort: "Mein Brief", lichtStand: { behalten: true }, versuche: 2, abgeschlossen: false };
  const timers = [], navigation = [], focus = [], scroll = [];
  const targets = Object.fromEntries(["entscheidung-abschnitt", "gruende-abschnitt", "antwort-abschnitt"].map(id => [id, {
    querySelector() { return { focus() { focus.push(id); } }; },
    focus() { focus.push(id); }, scrollIntoView() { scroll.push(id); }
  }]));
  targets["antwort-text"] = { focus() { focus.push("antwort-text"); } };
  const context = { state, el: node, leeren(n) { n.children = []; },
    document: { getElementById(id) { return targets[id] || null; } },
    setTimeout(fn) { timers.push(fn); },
    zeige(view) {
      navigation.push(view);
      // Reguläres zeichneAkte markiert die Akte gelesen; dies ist keine Antwortänderung.
      if (view === "akte") state.akteGelesen = true;
      timers.push(() => focus.push("ansicht-titel"));
    }
  };
  vm.createContext(context);
  vm.runInContext(renderSource + "\nthis.render = fuelleAuswertung;", context);
  const root = node("div"); context.render(root);
  return { state, root, navigation, focus, scroll, targets, buttons: all(root).filter(n => n.tag === "button"), flush() { while (timers.length) timers.shift()(); } };
}
function result(a, b, c) { return { entscheidung: { richtig: a }, begruendung: { reicht: b }, antwort: { ok: c }, darfAbschliessen: false }; }
test("Vor Auswertung keine Sprungbuttons oder Lösung", () => {
  const h = harness(null, false);
  assert.equal(h.buttons.length, 0);
  assert.doesNotMatch(all(h.root).map(n => n.text).join(" "), /Zu Schritt 3|Musterlösung/);
});
test("Falsche Teilbewertungen haben echte Buttons mit zugänglichem Namen", () => {
  const h = harness(result(false, false, false));
  assert.deepEqual(h.buttons.map(n => n.text), ["Zu Schritt 3: Entscheiden", "Zu Schritt 4: Begründen", "Zu Schritt 5: Antwort schreiben"]);
  for (const b of h.buttons) { assert.equal(b.type, "button"); assert.equal(b.attrs["aria-label"], b.text); }
});
test("Klick navigiert und fokussiert nach Ansichts-Fokus; Antworten und Status bleiben erhalten", () => {
  const h = harness(result(false, false, false));
  assert.equal(h.buttons.length, 3);
  const before = JSON.stringify(h.state);
  h.buttons.forEach((b, i) => {
    b.handlers.click(); h.flush();
    assert.equal(h.navigation.at(-1), "vorgang");
    assert.equal(h.focus.at(-1), ["entscheidung-abschnitt", "gruende-abschnitt", "antwort-text"][i]);
    assert.equal(h.scroll.at(-1), ["entscheidung-abschnitt", "gruende-abschnitt", "antwort-abschnitt"][i]);
    assert.equal(JSON.stringify(h.state), before);
  });
});
test("Richtig und ungeprüft sind keine falschen Schritte; 6 und 7 nie verlinken", () => {
  for (const value of [true, null]) assert.equal(harness(result(value, value, value)).buttons.length, 0);
  const h = harness(result(true, false, null));
  assert.deepEqual(h.buttons.map(b => b.text), ["Zu Schritt 4: Begründen"]);
  assert.doesNotMatch(h.buttons.map(b => b.text).join(" "), /Schritt [67]/);
});
test("Aktenhinweis öffnet Akte: nur reguläres zeichneAkte darf akteGelesen ändern, keine Neubewertung", () => {
  const h = harness(result(true, true, true), false);
  const before = JSON.stringify({ ...h.state, akteGelesen: true });
  assert.equal(h.buttons.length, 1);
  assert.equal(h.buttons[0].text, "Zu Schritt 2: Akte öffnen");
  assert.equal(h.buttons[0].type, "button");
  assert.equal(h.buttons[0].attrs["aria-label"], h.buttons[0].text);
  h.buttons[0].handlers.click(); h.flush();
  assert.deepEqual(h.navigation, ["akte"]);
  assert.equal(JSON.stringify(h.state), before);
  assert.equal(h.state.letzteAuswertung.darfAbschliessen, false);
  assert.doesNotMatch(renderSource, /state\.akteGelesen\s*=(?!=)/);
});
test("Reale Zielabschnitte besitzen stabile IDs und programmatischen Fokus", () => {
  for (const [variable, id] of [["entscheidungsGruppe", "entscheidung-abschnitt"], ["gruendeGruppe", "gruende-abschnitt"], ["antwortTitel", "antwort-abschnitt"]]) {
    assert.match(source, new RegExp(variable + '\\.id = "' + id + '"'));
    assert.match(source, new RegExp(variable + '\\.tabIndex = -1'));
  }
});
test("Fehlendes DOM-Ziel verursacht keinen Fehler oder Antwortverlust", () => {
  const h = harness(result(false, true, true));
  assert.equal(h.buttons.length, 1);
  delete h.targets["entscheidung-abschnitt"];
  const before = JSON.stringify(h.state);
  h.buttons[0].handlers.click(); assert.doesNotThrow(() => h.flush());
  assert.equal(JSON.stringify(h.state), before);
});
