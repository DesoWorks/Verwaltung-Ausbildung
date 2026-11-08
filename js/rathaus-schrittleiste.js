/* Gemeinsame Schrittleiste für Personalamt und Bürgerbüro.
 * Zeichnet nur die Anzeige: kompakte, anklickbare Statusflächen als echte Buttons.
 * Bewertet nichts, speichert nichts und kennt keine Falllogik. Wer sie benutzt, liefert Status und Klickziel.
 *
 * Status (immer auch als Text, nie nur Farbe):
 *   offen       neutral        "noch offen"
 *   bearbeitet  neutral, Rand  "bearbeitet"            (ausgefüllt, aber nicht bewertet)
 *   richtig     grün           "richtig"
 *   falsch      rot, gestrichelt "noch nicht richtig"
 *   veraltet    gepunktet, ↻   "Bewertung veraltet"    (Antwort nach der Bewertung geändert)
 *   gesperrt    deaktiviert    "noch gesperrt"
 * Der aktuelle Schritt kommt zusätzlich zu jedem Status: ist-aktuell, aria-current="step" und das Wort "aktuell".
 */
(function () {
  "use strict";

  var STATUS = {
    offen: { klasse: "", text: "noch offen" },
    bearbeitet: { klasse: "ist-bearbeitet", text: "bearbeitet" },
    richtig: { klasse: "ist-fertig", text: "richtig" },
    falsch: { klasse: "ist-nicht-richtig", text: "noch nicht richtig" },
    veraltet: { klasse: "ist-veraltet", text: "Bewertung veraltet" },
    gesperrt: { klasse: "ist-gesperrt", text: "noch gesperrt" }
  };

  function statusText(status) {
    return (STATUS[status] || STATUS.offen).text;
  }

  // Übersetzt die Statusworte der Bürgerbüro-Fälle (bereichStatus) in die gemeinsamen Status.
  // Unbekannte Worte bleiben als Text sichtbar und gelten als "Korrektur nötig", wie bisher bei den Chips.
  function ausStand(stand) {
    var roh = String(stand === undefined || stand === null ? "" : stand).trim();
    var k = roh.toLowerCase();
    if (k === "" || k === "noch nicht geprüft" || k === "noch nicht geprueft") return { status: "offen" };
    if (k === "richtig") return { status: "richtig" };
    if (k === "noch nicht richtig") return { status: "falsch" };
    if (k === "bewertung veraltet") return { status: "veraltet" };
    if (k === "abgeschlossen") return { status: "bearbeitet", text: "abgeschlossen" };
    if (k === "auswertung" || k === "zur auswertung" || k === "noch offen" || k === "offen") return { status: "offen", text: roh || "noch offen" };
    if (k === "noch nicht vollständig" || k === "unvollständig" || k === "ungültig") return { status: "falsch", text: roh };
    // Unbekanntes Wort nicht rot färben. Der Originaltext bleibt sichtbar.
    return { status: "offen", text: roh };
  }

  function el(tag, klasse, text) {
    var knoten = document.createElement(tag);
    if (klasse) knoten.className = klasse;
    if (text !== undefined) knoten.textContent = text;
    return knoten;
  }

  // o: { label, knopfKlasse, onWahl(schritt), schritte: [{ nr, name, status, text, aktuell, gesperrt }] }
  function zeichne(o) {
    var liste = el("ol", "rathaus-schritte");
    if (o.label) liste.setAttribute("aria-label", o.label);
    (o.schritte || []).forEach(function (s) {
      var gesperrt = s.gesperrt === true || s.status === "gesperrt";
      var status = gesperrt ? "gesperrt" : (STATUS[s.status] ? s.status : "offen");
      var def = STATUS[status];
      var klassen = "schritt-punkt" + (def.klasse ? " " + def.klasse : "") + (s.aktuell ? " ist-aktuell" : "");
      var punkt = el("li", klassen);
      var knopf = el("button", "schritt-knopf" + (o.knopfKlasse ? " " + o.knopfKlasse : ""));
      knopf.type = "button";
      knopf.setAttribute("data-schritt", String(s.nr));
      knopf.setAttribute("data-status", status);
      knopf.appendChild(el("span", "schritt-name", s.nr + ". " + s.name));
      var wort = el("span", "schritt-status", " – " + (s.text || def.text));
      knopf.appendChild(wort);
      if (s.aktuell) {
        knopf.setAttribute("aria-current", "step");
        knopf.appendChild(el("span", "schritt-aktuell", " · aktuell"));
      }
      if (gesperrt) {
        knopf.disabled = true;
        knopf.setAttribute("aria-disabled", "true");
      } else if (typeof o.onWahl === "function") {
        knopf.addEventListener("click", function () { o.onWahl(s); });
      }
      punkt.appendChild(knopf);
      liste.appendChild(punkt);
    });
    return liste;
  }

  var api = { zeichne: zeichne, statusText: statusText, ausStand: ausStand, STATUS: STATUS };
  window.RATHAUS_SCHRITTLEISTE = api;
  if (typeof module === "object" && module.exports) module.exports = api;
})();
