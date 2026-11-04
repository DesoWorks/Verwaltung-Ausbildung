/* Plattformnavigation, Gliederung in Bereiche. Reine Funktionen: kein DOM, kein localStorage.
 * Praxiswelten sind keine Lektionen und zählen keinen Lernfortschritt.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.PLATTFORM_NAVIGATION = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var BEREICH_LABELS = {
    themen: "Themenübersicht",
    praxiswelten: "Praxiswelten",
    unterricht: "Unterricht",
    werkzeuge: "Werkzeuge und Glossar"
  };

  function liste(wert) {
    return Array.isArray(wert) ? wert : [];
  }

  // Gleichrangige freie Einträge (Praxiswelten, Werkzeuge) alphabetisch nach sichtbarem Titel, deutsch und
  // mit natürlicher Ziffernsortierung. Sortiert immer eine Kopie; Katalog und IDs bleiben unverändert.
  function sortiereNachTitel(eintraege) {
    var kopie = liste(eintraege).slice();
    var vergleich = typeof Intl === "object" && Intl.Collator
      ? new Intl.Collator("de", { numeric: true, sensitivity: "base" }).compare
      : function (a, b) { return a < b ? -1 : (a > b ? 1 : 0); };
    return kopie
      .map(function (e, index) { return { e: e, index: index }; })
      .sort(function (a, b) {
        return vergleich(String(a.e.titel || ""), String(b.e.titel || "")) || a.index - b.index;
      })
      .map(function (x) { return x.e; });
  }

  function praxisEintraege(einstieg) {
    return sortiereNachTitel(liste(einstieg)
      .filter(function (e) { return e && e.status === "verfuegbar" && e.datei; })
      .map(function (e) {
        return { id: e.id, titel: e.titel, beschreibung: e.beschreibung || "", datei: e.datei, page: e.page, rolle: "praxiswelt", zaehltFortschritt: false };
      }));
  }

  function unterrichtEintraege(module) {
    var ergebnis = [];
    liste(module).forEach(function (jahr) {
      liste(jahr.module).forEach(function (feld) {
        if (feld.id === "einstieg") return;
        liste(feld.unterthemen).forEach(function (u) {
          ergebnis.push({
            id: u.id,
            titel: u.titel,
            datei: u.datei,
            page: u.page,
            status: u.status,
            jahr: jahr.jahr,
            lernfeld: feld.id,
            rolle: u.typ === "werkzeug" ? "werkzeug" : "lektion",
            zaehltFortschritt: true
          });
        });
      });
    });
    return ergebnis;
  }

  function werkzeugEintraege(tools) {
    var ergebnis = sortiereNachTitel(liste(tools).map(function (t) {
      return { id: t.id, titel: t.titel, datei: t.datei, page: t.page, rolle: "werkzeug", zaehltFortschritt: true };
    }));
    ergebnis.push({ id: "glossary", titel: "Wörter & Begriffe", datei: "glossar.html", page: "glossary", rolle: "glossar", zaehltFortschritt: true });
    return ergebnis;
  }

  // Liefert die vier Bereiche in fester Reihenfolge. Verändert die übergebenen Daten nicht.
  function bereiche(daten) {
    var d = daten || {};
    return [
      { id: "themen", label: BEREICH_LABELS.themen, eintraege: [{ id: "overview", titel: "Themenübersicht", datei: "index.html", page: "overview", rolle: "uebersicht", zaehltFortschritt: true }] },
      { id: "praxiswelten", label: BEREICH_LABELS.praxiswelten, eintraege: praxisEintraege(d.einstieg) },
      { id: "unterricht", label: BEREICH_LABELS.unterricht, eintraege: unterrichtEintraege(d.module) },
      { id: "werkzeuge", label: BEREICH_LABELS.werkzeuge, eintraege: werkzeugEintraege(d.tools) }
    ];
  }

  return { BEREICH_LABELS: BEREICH_LABELS, bereiche: bereiche, sortiereNachTitel: sortiereNachTitel };
});
