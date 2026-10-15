/* Textbaustein- und Formularübung. Kein Textprogramm. */
(function () {
  "use strict";
  var bausteine = {
    anfrage: "Bitte senden Sie uns ein Angebot zu der genannten Menge. Die Anfrage ist unverbindlich und noch keine Bestellung.",
    dank: "Vielen Dank für Ihre bisherige Zusammenarbeit. Bitte geben Sie uns eine kurze Rückmeldung zu Preis und Lieferzeit.",
    leer: ""
  };

  function wert(id) {
    return document.getElementById(id).value.trim();
  }

  function zusammensetzen() {
    var fehlend = ["absender", "empfaenger", "betreff", "artikel", "menge", "termin", "ort"].filter(function (id) {
      return !wert(id);
    });
    var vorschau = document.getElementById("vorschau");
    if (fehlend.length) {
      vorschau.textContent = "Diese Normfelder sind noch leer: " + fehlend.join(", ") + ". Der Text wird erst zusammengesetzt, wenn alle Felder gefüllt sind.";
      document.getElementById(fehlend[0]).focus();
      return;
    }
    var gewaehlt = document.querySelector('input[name="baustein"]:checked').value;
    var baustein = bausteine[gewaehlt];
    var zeilen = [
      wert("absender"),
      "",
      "An: " + wert("empfaenger"),
      "Betreff: " + wert("betreff"),
      "",
      "Artikel: " + wert("artikel"),
      "Menge: " + wert("menge"),
      "Termin: " + wert("termin"),
      "Lieferort: " + wert("ort"),
      ""
    ];
    if (baustein) zeilen.push(baustein);
    else zeilen.push("Kein Baustein eingesetzt. Die Normfelder stehen allein.");
    vorschau.textContent = zeilen.join("\n");
  }

  document.getElementById("zusammensetzen").addEventListener("click", zusammensetzen);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && event.target.tagName === "INPUT" && event.target.type !== "radio") {
      event.preventDefault();
      zusammensetzen();
    }
  });
})();
