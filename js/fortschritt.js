/* Gemeinsame Abschlussableitung aus den gespeicherten Antworten und dem Abschluss der Lektionen.
 * Es wird kein eigener Abschlusswert gespeichert. Schlüssel gehören nur
 * zu dieser Plattform, nicht zur IT-Ausbildung. */
(function (global) {
  "use strict";
  var SCHLUESSEL = {
    "lf1-lernziel": "verwaltung-ausbildung.lf1-lernziel.v1",
    "lf2-lernziel": "verwaltung-ausbildung.lf2-lernziel.v1",
    "lf3-lernziel": "verwaltung-ausbildung.lf3-lernziel.v1",
    "lf4-lernziel": "verwaltung-ausbildung.lf4-lernziel.v1",
    "lf1-rolle": "verwaltung-ausbildung.lf1-rolle.v1",
    "lf1-rechte": "verwaltung-ausbildung.lf1-rechte.v1",
    "lf2-ablauf": "verwaltung-ausbildung.lf2-ablauf.v1",
    "lf2-arbeitsplatz": "verwaltung-ausbildung.lf2-arbeitsplatz.v1",
    "lf3-auftrag": "verwaltung-ausbildung.lf3-auftrag.v1",
    "lf4-bedarf": "verwaltung-ausbildung.lf4-bedarf.v1",
    "lf4-bezugsquellen": "verwaltung-ausbildung.lf4-bezugsquellen.v1",
    "lf1-betrieb": "verwaltung-ausbildung.lf1-betrieb.v1",
    "lf2-termine": "verwaltung-ausbildung.lf2-termine.v1",
    "lf2-post": "verwaltung-ausbildung.lf2-post.v1",
    "lf3-preis": "verwaltung-ausbildung.lf3-preis.v1",
    "lf3-dokumente": "verwaltung-ausbildung.lf3-dokumente.v1",
    "lf4-vergleich": "verwaltung-ausbildung.lf4-vergleich.v1",
    "lf1-ziele": "verwaltung-ausbildung.lf1-ziele.v1",
    "lf2-zeit": "verwaltung-ausbildung.lf2-zeit.v1",
    "lf4-menge": "verwaltung-ausbildung.lf4-menge.v1",
    "lf1-aufbau": "verwaltung-ausbildung.lf1-aufbau.v1",
    "lf3-angebot": "verwaltung-ausbildung.lf3-angebot.v1",
    "lf4-vertrag": "verwaltung-ausbildung.lf4-vertrag.v1",
    "lf2-team": "verwaltung-ausbildung.lf2-team.v1",
    "lf3-textbausteine": "verwaltung-ausbildung.lf3-textbausteine.v1",
    "lf4-wareneingang": "verwaltung-ausbildung.lf4-wareneingang.v1",
    "lf3-formulare": "verwaltung-ausbildung.lf3-formulare.v1",
    "lf1-fortbildung": "verwaltung-ausbildung.lf1-fortbildung.v1",
    "lf4-lager": "verwaltung-ausbildung.lf4-lager.v1",
    "lf4-rechnung": "verwaltung-ausbildung.lf4-rechnung.v1",
    "lf1-praesentation": "verwaltung-ausbildung.lf1-praesentation.v1",
    "lf2-protokoll": "verwaltung-ausbildung.lf2-protokoll.v1",
    "lf3-vervielfaeltigen": "verwaltung-ausbildung.lf3-vervielfaeltigen.v1",
    "lf4-anfrage": "verwaltung-ausbildung.lf4-anfrage.v1",
    "lf4-stoerung": "verwaltung-ausbildung.lf4-stoerung.v1",
    "lf4-miete": "verwaltung-ausbildung.lf4-miete.v1"
  };
  var LOESUNGEN = {
    "lf1-lernziel": { q1: "a", q2: "b", q3: "c", q4: "a", q5: "b" },
    "lf2-lernziel": { q1: "c", q2: "a", q3: "b", q4: "c", q5: "a" },
    "lf3-lernziel": { q1: "b", q2: "c", q3: "a", q4: "b", q5: "c" },
    "lf4-lernziel": { q1: "a", q2: "b", q3: "c", q4: "a", q5: "b" },
    "lf1-rolle": { q1: "azubi", q2: "abstimmen", q3: "ausbilder" },
    "lf1-rechte": { q1: "ausbildung", q2: "nachfragen", q3: "ausbilder" },
    "lf2-ablauf": { q1: "zeitdieb", q2: "ordnen", q3: "rueckruf" },
    "lf2-arbeitsplatz": { q1: "gestalten", q2: "belastung", q3: "unterstuetzung" },
    "lf3-auftrag": { q1: "anfrage", q2: "warten", q3: "weitergeben" },
    "lf4-bedarf": { q1: "wunsch", q2: "voreilig", q3: "klaeren" },
    "lf4-bezugsquellen": { q1: "anfragen", q2: "preis", q3: "lieferzeit" },
    "lf1-betrieb": { q1: "quelle", q2: "leistung", q3: "datenschutz" },
    "lf2-termine": { q1: "termin", q2: "vorbereiten", q3: "protokoll" },
    "lf2-post": { q1: "weitergeben", q2: "versand", q3: "ablage" },
    "lf3-preis": { q1: "rechnen", q2: "prozent", q3: "pruefen" },
    "lf3-dokumente": { q1: "bestaetigung", q2: "lieferschein", q3: "rechnung" },
    "lf4-vergleich": { q1: "vergleichen", q2: "kriterium", q3: "nicht-nur-preis" },
    "lf1-ziele": { q1: "ziele", q2: "arbeitsteilung", q3: "kreislauf" },
    "lf2-zeit": { q1: "zeitdieb", q2: "zeitfalle", q3: "prioritaet" },
    "lf4-menge": { q1: "zeitpunkt", q2: "menge", q3: "diagramm" },
    "lf1-aufbau": { q1: "aufbau", q2: "prozess", q3: "vollmacht" },
    "lf3-angebot": { q1: "verlangt", q2: "unverlangt", q3: "form" },
    "lf4-vertrag": { q1: "kauf", q2: "werk", q3: "dienst" },
    "lf2-team": { q1: "gruende-erfragen", q2: "uebersicht-mit-details", q3: "sachlich-begruenden" },
    "lf3-textbausteine": { q1: "wiederverwendbarer-textteil", q2: "gepruefte-falldaten", q3: "gesamttext-pruefen" },
    "lf4-wareneingang": { q1: "lieferung-abgleichen", q2: "abweichung-dokumentieren", q3: "trocken-vorgesehen" },
    "lf3-formulare": { q1: "nur-felder-ausfuellen", q2: "festtext-schuetzen", q3: "felder-vor-versand-pruefen" },
    "lf1-fortbildung": { q1: "pruefen-passt", q2: "ziel-konkret", q3: "gelerntes-nutzen" },
    "lf4-lager": { q1: "griffnah-regal", q2: "abschliessbar", q3: "trocken-regal" },
    "lf4-rechnung": { q1: "abweichung-melden", q2: "skonto-nutzen", q3: "ueberweisung-bank" },
    "lf1-praesentation": { q1: "form-kurz-bildschirm", q2: "schutz-namen-quelle", q3: "katalog-kriterien-liste" },
    "lf2-protokoll": { q1: "protokoll-ergebnis", q2: "festhalten-beschluss-offen", q3: "weitergabe-teilnehmende" },
    "lf3-vervielfaeltigen": { q1: "aufgabe-scannen", q2: "format-pdf-lesen", q3: "sparen-seiten-beidseitig" },
    "lf4-anfrage": { q1: "angaben-vier", q2: "satz-angebot-bitte", q3: "wirkung-unverbindlich" },
    "lf4-stoerung": { q1: "stoerung-schlechtleistung", q2: "meldung-konkret", q3: "schritt-vorschlag-info" },
    "lf4-miete": { q1: "miete", q2: "kauf-dauer", q3: "nutzen-risiko" }
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
