/* Nutzwerttabelle: Gewicht mal Punkte, Summe je Angebot. */
(function () {
  "use strict";
  var kriterien = ["preis", "zeit", "nachhalt"];

  function lesen(id) {
    var roh = document.getElementById(id).value.trim().replace(",", ".");
    if (roh === "") return null;
    var wert = Number(roh);
    return Number.isFinite(wert) ? wert : NaN;
  }

  function rechnen() {
    var box = document.getElementById("summen");
    var summe1 = 0;
    var summe2 = 0;
    var teile = [];
    var fehler = false;
    kriterien.forEach(function (name) {
      var gewicht = lesen("g-" + name);
      var p1 = lesen("a1-" + name);
      var p2 = lesen("a2-" + name);
      if ([gewicht, p1, p2].some(function (n) { return n === null || Number.isNaN(n) || n < 0; })) {
        fehler = true;
        return;
      }
      summe1 += gewicht * p1;
      summe2 += gewicht * p2;
      teile.push(name + ": " + gewicht + " × " + p1 + " und " + gewicht + " × " + p2);
    });
    if (fehler) {
      box.textContent = "Gewicht und Punkte müssen Zahlen ab 0 sein. Eine Zelle ist leer oder ungültig.";
      return;
    }
    var sieger = summe1 === summe2
      ? "Beide Angebote haben dieselbe Summe."
      : (summe1 > summe2 ? "Angebot 1" : "Angebot 2") + " hat die höhere Summe.";
    box.textContent = "Zwischenschritt: " + teile.join("; ") + ". Summe Angebot 1 = " + summe1.toLocaleString("de-DE") + ". Summe Angebot 2 = " + summe2.toLocaleString("de-DE") + ". " + sieger;
  }

  document.querySelectorAll("input").forEach(function (feld) {
    feld.addEventListener("input", rechnen);
  });
  rechnen();
})();
