/* Kaufmännischer Rechner: Dreisatz, Prozent, Skonto.
 * Eingabe, Zwischenschritt, Ergebnis. Speichert nichts. */
(function () {
  "use strict";
  var art = document.getElementById("art");
  var felder = {
    dreisatz: document.getElementById("felder-dreisatz"),
    prozent: document.getElementById("felder-prozent"),
    skonto: document.getElementById("felder-skonto")
  };
  var weg = document.getElementById("weg");

  function zeigeArt() {
    Object.keys(felder).forEach(function (name) {
      felder[name].hidden = name !== art.value;
    });
    weg.hidden = true;
    weg.textContent = "";
  }

  function zahl(id) {
    var roh = document.getElementById(id).value.trim().replace(/\s/g, "").replace(",", ".");
    if (roh === "") return null;
    var wert = Number(roh);
    if (!Number.isFinite(wert)) return NaN;
    return wert;
  }

  function euro(wert) {
    return wert.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " Euro";
  }

  function satzText(wert) {
    return wert.toLocaleString("de-DE", { maximumFractionDigits: 2 });
  }

  function fehler(text) {
    weg.hidden = false;
    weg.innerHTML = "";
    var p = document.createElement("p");
    p.className = "hinweis-fehler";
    p.textContent = text;
    weg.appendChild(p);
  }

  function zeige(zeilen) {
    weg.hidden = false;
    weg.innerHTML = "";
    zeilen.forEach(function (zeile) {
      var p = document.createElement("p");
      var stark = document.createElement("strong");
      stark.textContent = zeile[0] + ": ";
      p.appendChild(stark);
      p.appendChild(document.createTextNode(zeile[1]));
      weg.appendChild(p);
    });
  }

  function rechne(event) {
    event.preventDefault();
    if (art.value === "dreisatz") {
      var bekannt = zahl("ds-menge-bekannt");
      var preis = zahl("ds-preis-bekannt");
      var neu = zahl("ds-menge-neu");
      if (bekannt === null || preis === null || neu === null) return fehler("Trag bekannte Menge, Preis und gesuchte Menge ein.");
      if ([bekannt, preis, neu].some(function (n) { return Number.isNaN(n) || n < 0; }) || bekannt === 0) {
        return fehler("Mengen und Preis müssen Zahlen ab 0 sein. Die bekannte Menge darf nicht 0 sein.");
      }
      var einzel = preis / bekannt;
      var ergebnis = einzel * neu;
      return zeige([
        ["Eingabe", satzText(bekannt) + " Stück kosten " + euro(preis) + ". Gesucht ist der Preis für " + satzText(neu) + " Stück."],
        ["Zwischenschritt", "Preis für 1 Stück = " + euro(preis) + " ÷ " + satzText(bekannt) + " = " + euro(einzel) + "."],
        ["Ergebnis", euro(ergebnis)]
      ]);
    }
    if (art.value === "prozent") {
      var grund = zahl("pr-grund");
      var satz = zahl("pr-satz");
      var richtung = document.getElementById("pr-richtung").value;
      if (grund === null || satz === null) return fehler("Trag Grundwert und Prozentsatz ein.");
      if ([grund, satz].some(function (n) { return Number.isNaN(n) || n < 0; })) {
        return fehler("Grundwert und Prozentsatz müssen Zahlen ab 0 sein.");
      }
      var betrag = grund * satz / 100;
      var text = richtung === "aufschlag" ? "Grundwert plus Prozentbetrag" : richtung === "abzug" ? "Grundwert minus Prozentbetrag" : "Nur der Prozentbetrag";
      var ergebnis = richtung === "aufschlag" ? grund + betrag : richtung === "abzug" ? grund - betrag : betrag;
      return zeige([
        ["Eingabe", "Grundwert " + euro(grund) + ", Prozentsatz " + satzText(satz) + " %."],
        ["Zwischenschritt", "Prozentbetrag = " + euro(grund) + " × " + satzText(satz) + " ÷ 100 = " + euro(betrag) + "."],
        ["Ergebnis", text + " = " + euro(ergebnis)]
      ]);
    }
    var rechnung = zahl("sk-betrag");
    var skonto = zahl("sk-satz");
    var frist = document.getElementById("sk-frist").value;
    if (rechnung === null || skonto === null) return fehler("Trag Rechnungsbetrag und Skontosatz ein.");
    if ([rechnung, skonto].some(function (n) { return Number.isNaN(n) || n < 0; })) {
      return fehler("Betrag und Skontosatz müssen Zahlen ab 0 sein.");
    }
    if (frist === "nein") {
      return zeige([
        ["Eingabe", "Rechnungsbetrag " + euro(rechnung) + ", Skonto " + satzText(skonto) + " %. Die Frist ist nicht eingehalten."],
        ["Zwischenschritt", "Skonto gilt nur innerhalb der genannten Frist."],
        ["Ergebnis", "Zu zahlen: " + euro(rechnung)]
      ]);
    }
    var nachlass = rechnung * skonto / 100;
    return zeige([
      ["Eingabe", "Rechnungsbetrag " + euro(rechnung) + ", Skonto " + satzText(skonto) + " %, Frist eingehalten."],
      ["Zwischenschritt", "Skontobetrag = " + euro(rechnung) + " × " + satzText(skonto) + " ÷ 100 = " + euro(nachlass) + "."],
      ["Ergebnis", "Zu zahlen: " + euro(rechnung - nachlass)]
    ]);
  }

  function leeren() {
    document.querySelectorAll("#rechner-form input").forEach(function (feld) { feld.value = ""; });
    weg.hidden = true;
    weg.textContent = "";
    document.getElementById("ds-menge-bekannt").focus();
  }

  art.addEventListener("change", zeigeArt);
  document.getElementById("rechner-form").addEventListener("submit", rechne);
  document.getElementById("leeren").addEventListener("click", leeren);
  zeigeArt();
})();
