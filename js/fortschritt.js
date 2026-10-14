/* Gemeinsame Abschlussableitung. Noch keine Lektion speichert einen Zustand.
 * Es wird kein eigener Abschlusswert gespeichert. Schlüssel gehören nur
 * zu dieser Plattform, nicht zur IT-Ausbildung. */
(function (global) {
  "use strict";
  var SCHLUESSEL = {
    "lf1-rolle": "verwaltung-ausbildung.lf1-rolle.v1"
  };

  function abgeschlossen(id) {
    var key = SCHLUESSEL[id];
    if (!key) return false;
    try {
      var raw = global.localStorage.getItem(key);
      if (!raw) return false;
      var state = JSON.parse(raw);
      var answers = state && state.answers ? state.answers : {};
      return state.finish === true
        && answers.q1 === "azubi"
        && answers.q2 === "abstimmen"
        && answers.q3 === "ausbilder";
    } catch (e) {
      return false;
    }
  }

  function abschlusszeichen() {
    var mark = global.document.createElement("span");
    mark.className = "abschlusszeichen";
    mark.setAttribute("role", "img");
    mark.setAttribute("aria-label", "Abgeschlossen");
    mark.textContent = "✓";
    return mark;
  }

  function benachrichtigen() {
    try { global.dispatchEvent(new Event("lernfortschritt-geaendert")); } catch (e) { /* nicht jeder Browser stellt Custom Events bereit */ }
  }

  global.LERNFORTSCHRITT = { abgeschlossen: abgeschlossen, abschlusszeichen: abschlusszeichen, benachrichtigen: benachrichtigen };
})(typeof window !== "undefined" ? window : globalThis);
