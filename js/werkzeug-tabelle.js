/* Kleine Tabelle: Summe, Prozentanteil, WENN, SVERWEIS, Balkendiagramm. */
(function () {
  "use strict";
  var zeilen = [2, 3, 4];

  function lesen(id) {
    var roh = document.getElementById(id).value.trim().replace(/\s/g, "").replace(",", ".");
    if (roh === "") return null;
    var wert = Number(roh);
    return Number.isFinite(wert) ? wert : NaN;
  }

  function euro(wert) {
    return wert.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " Euro";
  }

  function rechnen() {
    var posten = [];
    var gesamt = 0;
    var fehler = false;
    zeilen.forEach(function (n) {
      var name = document.getElementById("name-" + n).value.trim() || ("Zeile " + n);
      var menge = lesen("menge-" + n);
      var preis = lesen("preis-" + n);
      var summeZelle = document.getElementById("summe-" + n);
      var wennZelle = document.getElementById("wenn-" + n);
      if (menge === null || preis === null || Number.isNaN(menge) || Number.isNaN(preis) || menge < 0 || preis < 0) {
        fehler = true;
        summeZelle.textContent = "—";
        wennZelle.textContent = "Zahl fehlt";
        return;
      }
      var summe = menge * preis;
      gesamt += summe;
      summeZelle.textContent = euro(summe);
      wennZelle.textContent = summe >= 20 ? "prüfen" : "ok";
      posten.push({ name: name, summe: summe, menge: menge, preis: preis });
    });
    var summeText = document.getElementById("summe-text");
    if (fehler) {
      summeText.textContent = "Summe nur aus vollständigen Zahlenzeilen: " + euro(gesamt) + ". Eine Zeile hat keine gültige Zahl.";
    } else {
      summeText.textContent = "SUMME der Zeilen = " + euro(gesamt) + ". Der Prozentanteil steht im Diagramm neben jedem Balken.";
    }
    var diagramm = document.getElementById("diagramm");
    diagramm.innerHTML = "";
    var max = Math.max.apply(null, posten.map(function (p) { return p.summe; }).concat([1]));
    posten.forEach(function (p) {
      var zeile = document.createElement("div");
      zeile.className = "balken-zeile";
      var name = document.createElement("span");
      name.textContent = p.name;
      var spur = document.createElement("div");
      var balken = document.createElement("div");
      balken.className = "balken";
      balken.style.width = Math.max(2, Math.round(p.summe / max * 100)) + "%";
      spur.appendChild(balken);
      var wert = document.createElement("span");
      var anteil = gesamt > 0 ? (p.summe / gesamt * 100) : 0;
      wert.textContent = anteil.toLocaleString("de-DE", { maximumFractionDigits: 0 }) + " %";
      zeile.append(name, spur, wert);
      diagramm.appendChild(zeile);
    });
    diagramm.setAttribute("aria-label", posten.map(function (p) {
      return p.name + " " + euro(p.summe);
    }).join(", "));
    return posten;
  }

  function suchen() {
    var ziel = document.getElementById("suchname").value.trim().toLowerCase();
    var box = document.getElementById("suchergebnis");
    var posten = rechnen();
    box.hidden = false;
    if (!ziel) {
      box.textContent = "Trag einen Positionsnamen ein. SVERWEIS sucht den Namen in der ersten Spalte und gibt die Zeilensumme zurück.";
      return;
    }
    var treffer = posten.find(function (p) { return p.name.toLowerCase() === ziel; });
    if (!treffer) {
      box.textContent = "SVERWEIS: „" + document.getElementById("suchname").value.trim() + "“ steht nicht in der Positionsspalte.";
      return;
    }
    box.textContent = "SVERWEIS findet „" + treffer.name + "“ und gibt die Zeilensumme zurück: " + euro(treffer.summe) + ".";
  }

  document.querySelectorAll(".blatt input").forEach(function (feld) {
    feld.addEventListener("input", rechnen);
  });
  document.getElementById("suchen").addEventListener("click", suchen);
  document.getElementById("suchname").addEventListener("keydown", function (event) {
    if (event.key === "Enter") { event.preventDefault(); suchen(); }
  });
  rechnen();
})();
