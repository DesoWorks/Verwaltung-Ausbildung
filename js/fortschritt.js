/* Gemeinsame Abschlussableitung aus den gespeicherten Antworten und dem Abschluss der Lektionen.
 * Es wird kein eigener Abschlusswert gespeichert. Schlüssel gehören nur
 * zu dieser Plattform, nicht zur IT-Ausbildung. */
(function (global) {
  "use strict";
  var SCHLUESSEL = {
    "lf1-rolle": "verwaltung-ausbildung.lf1-rolle.v1",
    "lf2-ablauf": "verwaltung-ausbildung.lf2-ablauf.v1",
    "lf3-auftrag": "verwaltung-ausbildung.lf3-auftrag.v1",
    "lf4-bedarf": "verwaltung-ausbildung.lf4-bedarf.v1"
  };
  var LOESUNGEN = {
    "lf1-rolle": { q1: "azubi", q2: "abstimmen", q3: "ausbilder" },
    "lf2-ablauf": { q1: "zeitdieb", q2: "ordnen", q3: "rueckruf" },
    "lf3-auftrag": { q1: "anfrage", q2: "warten", q3: "weitergeben" },
    "lf4-bedarf": { q1: "wunsch", q2: "voreilig", q3: "klaeren" }
  };

  function abgeschlossen(id) {
    var key = SCHLUESSEL[id];
    if (!key) return false;
    try {
      var raw = global.localStorage.getItem(key);
      if (!raw) return false;
      var state = JSON.parse(raw);
      var answers = state && state.answers ? state.answers : {};
      var loesung = LOESUNGEN[id];
      return state.finish === true
        && Object.keys(loesung).every(function (frage) { return answers[frage] === loesung[frage]; });
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
