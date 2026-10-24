/* BWL-Werkstatt: Oberfläche. Rechnet nicht selbst, nutzt BWL_KERN aus js/bwl-kern.js.
 * Speichert nichts, lädt nichts nach. */
(function () {
  "use strict";
  var K = window.BWL_KERN;
  var d = document;
  function $(id) { return d.getElementById(id); }
  function val(id) { return $(id).value; }
  function checked(name) { var r = d.querySelector("[name='" + name + "']:checked"); return r ? r.value : ""; }

  var MAX = K.MAX_POSITIONEN;
  var box = $("bwl-positionen");
  var rows = [];
  for (var i = 1; i <= MAX; i++) rows.push(baueZeile(i));

  function feld(labelText, id, cls) {
    var wrap = d.createElement("div");
    if (cls) wrap.className = cls;
    var l = d.createElement("label"); l.setAttribute("for", id); l.textContent = labelText;
    var inp = d.createElement("input"); inp.type = "text"; inp.id = id; inp.setAttribute("autocomplete", "off");
    if (id.indexOf("name") < 0) inp.setAttribute("inputmode", "decimal"); else inp.maxLength = 80;
    wrap.appendChild(l); wrap.appendChild(inp);
    return { wrap: wrap, label: l, input: inp };
  }

  function baueZeile(n) {
    var row = d.createElement("div");
    row.className = "bwl-zeile";
    row.setAttribute("role", "group");
    var h = d.createElement("h3");
    var name = feld("Artikelname (freiwillig)", "p" + n + "-name", "bwl-name");
    var menge = feld("", "p" + n + "-menge");
    var preis = feld("", "p" + n + "-preis");
    var rem = d.createElement("button");
    rem.type = "button"; rem.className = "knopf"; rem.textContent = "Entfernen";
    row.appendChild(h); row.appendChild(name.wrap); row.appendChild(menge.wrap); row.appendChild(preis.wrap);
    if (n > 1) row.appendChild(rem);
    box.appendChild(row);
    return { row: row, h: h, name: name.input, menge: menge.input, preis: preis.input, lm: menge.label, lp: preis.label, rem: rem, n: n };
  }

  function schreibe(r, p) { r.name.value = p.name; r.menge.value = p.menge; r.preis.value = p.einzelpreis; }
  function lies(r) { return { name: r.name.value, menge: r.menge.value, einzelpreis: r.preis.value }; }
  function anzahl() { return rows.filter(function (r) { return !r.row.hidden; }).length; }
  function status(t) { $("bwl-position-status").textContent = t; }

  function setAnzahl(n) {
    rows.forEach(function (r, i) {
      var an = i < n;
      r.row.hidden = !an;
      if (!an) schreibe(r, { name: "", menge: "", einzelpreis: "" });
      var nr = i + 1;
      r.row.setAttribute("aria-label", "Artikel " + nr);
      r.h.textContent = "Artikel " + nr;
      r.lm.textContent = "Menge " + nr;
      r.lp.textContent = "Einzelpreis " + nr + " netto in Euro";
      r.rem.setAttribute("aria-label", "Artikel " + nr + " entfernen");
    });
    $("bwl-artikel-plus").disabled = n >= MAX;
  }

  $("bwl-artikel-plus").addEventListener("click", function () {
    var alt = anzahl();
    var neu = K.positionenHinzufuegen(alt);
    if (neu === alt) { status("Mehr als " + MAX + " Artikel sind nicht möglich."); return; }
    setAnzahl(neu); loescheErgebnis();
    status("Artikel " + neu + " wurde hinzugefügt. Es sind " + neu + " von höchstens " + MAX + " Artikeln sichtbar.");
    rows[neu - 1].name.focus();
  });
  rows.forEach(function (r, i) {
    r.rem.addEventListener("click", function () {
      var rest = K.positionenEntfernen(rows.slice(0, anzahl()).map(lies), i);
      rest.forEach(function (p, k) { schreibe(rows[k], p); });
      setAnzahl(rest.length); loescheErgebnis();
      status("Artikel " + (i + 1) + " wurde entfernt. Die übrigen Artikel sind neu nummeriert. Es sind " + rest.length + " Artikel sichtbar.");
      rows[Math.min(i, rest.length - 1)].name.focus();
    });
  });
  setAnzahl(1);

  function loescheErgebnis() {
    $("bwl-fehler").hidden = true; $("bwl-fehler").textContent = "";
    $("bwl-ergebnis").hidden = true;
  }
  function zeigeFehler(t) {
    var f = $("bwl-fehler");
    f.textContent = t; f.hidden = false;
    $("bwl-ergebnis").hidden = true;
    f.focus();
  }
  function el(tag, text, cls) {
    var e = d.createElement(tag);
    if (text != null) e.textContent = text;
    if (cls) e.className = cls;
    return e;
  }
  function tabelle(parent, titel, kopf, zeilen, zahl) {
    var wrap = el("div", null, "bwl-tabelle-wrap");
    wrap.tabIndex = 0; wrap.setAttribute("role", "region"); wrap.setAttribute("aria-label", titel);
    var t = el("table", null, "bwl-tabelle");
    t.appendChild(el("caption", titel));
    var hr = d.createElement("tr");
    kopf.forEach(function (h, i) { var th = el("th", h, zahl.indexOf(i) >= 0 ? "bwl-zahl" : ""); th.scope = "col"; hr.appendChild(th); });
    var thead = d.createElement("thead"); thead.appendChild(hr); t.appendChild(thead);
    var tb = d.createElement("tbody");
    zeilen.forEach(function (z) {
      var tr = d.createElement("tr");
      z.forEach(function (c, i) {
        var cell = i === 0 ? el("th", c) : el("td", c, zahl.indexOf(i) >= 0 ? "bwl-zahl" : "");
        if (i === 0) cell.scope = "row";
        tr.appendChild(cell);
      });
      tb.appendChild(tr);
    });
    t.appendChild(tb); wrap.appendChild(t); parent.appendChild(wrap);
  }

  function zeige(res, titel) {
    if (!res.ok) { zeigeFehler(res.error); return; }
    var out = $("bwl-ergebnis");
    out.textContent = "";
    out.appendChild(el("h3", titel));
    out.appendChild(el("p", "Übungsannahme, fachlich noch nicht freigegeben. Keine Steuer- oder Rechtsberatung."));
    if (res.zeilen) {
      tabelle(out, "Positionen", ["Artikel", "Menge", "Einzelpreis netto", "Positionsbetrag"],
        res.zeilen.map(function (z, i) { return [z.name || ("Artikel " + (i + 1)), z.menge, z.einzelpreis + " €", z.betrag + " €"]; }), [1, 2, 3]);
      tabelle(out, "Summen", ["Posten", "Betrag"], [
        ["Positionssumme", K.fmt(res.positionssumme) + " €"],
        ["Handlungskosten", K.fmt(res.handlungskosten) + " €"],
        ["Selbstkosten", K.fmt(res.selbstkosten) + " €"],
        ["Gewinn", K.fmt(res.gewinn) + " €"],
        ["Nettoangebotspreis", K.fmt(res.netto) + " €"]
      ], [1]);
    } else if (res.steuer !== undefined) {
      tabelle(out, "Beträge", ["Posten", "Betrag"], [
        ["Netto", K.fmt(res.netto) + " €"], ["Steuerbetrag", K.fmt(res.steuer) + " €"], ["Brutto", K.fmt(res.brutto) + " €"]
      ], [1]);
    } else if (res.rabatt !== undefined) {
      tabelle(out, "Beträge", ["Posten", "Betrag"], [
        ["Basis", K.fmt(res.basis) + " €"], ["Rabatt", K.fmt(res.rabatt) + " €"], ["Betrag nach Rabatt", K.fmt(res.ergebnis) + " €"]
      ], [1]);
    } else {
      out.appendChild(el("p", "Gewinn: " + K.fmt(res.gewinn) + " €", "bwl-ergebnis-zeile"));
    }
    out.appendChild(el("h4", "Rechenweg"));
    res.steps.forEach(function (s) { out.appendChild(el("p", s)); });
    out.hidden = false;
    $("bwl-fehler").hidden = true;
    out.focus();
  }

  function art() { return val("bwl-art"); }
  function berechne() {
    var a = art();
    if (a === "angebot") {
      zeige(K.angebot({ positionen: rows.filter(function (r) { return !r.row.hidden; }).map(lies), handlungskostenSatz: val("an-hk"), gewinnSatz: val("an-gw") }), "Angebotsrechnung");
    } else if (a === "gewinn") {
      zeige(K.gewinn({ weg: checked("gewinn-weg"), basis: val("gw-basis"), satz: val("gw-satz"), erloes: val("gw-erloes"), kosten: val("gw-kosten") }), "Gewinnberechnung");
    } else if (a === "rabatt") {
      zeige(K.rabatt({ basis: val("rb-basis"), art: checked("rabatt-art"), satz: val("rb-satz"), betrag: val("rb-betrag") }), "Rabattberechnung");
    } else {
      zeige(K.steuer({ betrag: val("st-betrag"), satz: val("st-satz"), richtung: checked("steuer-richtung") }), "Netto-Brutto-Berechnung");
    }
  }

  function zeigePanel() {
    var a = art();
    d.querySelectorAll(".bwl-panel").forEach(function (p) { p.hidden = p.getAttribute("data-rechner") !== a; });
    loescheErgebnis();
  }
  function umschalten(name, wert, zeigId, versteckId) {
    d.querySelectorAll("[name='" + name + "']").forEach(function (r) {
      r.addEventListener("change", function () {
        var an = checked(name) === wert;
        $(zeigId).hidden = !an; $(versteckId).hidden = an;
        loescheErgebnis();
      });
    });
  }
  umschalten("gewinn-weg", "differenz", "gw-differenz", "gw-zuschlag");
  umschalten("rabatt-art", "betrag", "rb-betrag-feld", "rb-satz-feld");

  function beispiel() {
    var a = art();
    if (a === "angebot") {
      var w = [["Ordner", "24", "2,35"], ["Kopierpapier (Paket)", "10", "4,49"], ["Locher", "3", "7,90"], ["Haftnotizen", "12", "1,85"]];
      setAnzahl(w.length);
      w.forEach(function (x, i) { schreibe(rows[i], { name: x[0], menge: x[1], einzelpreis: x[2] }); });
      $("an-hk").value = "8"; $("an-gw").value = "5";
    } else if (a === "gewinn") {
      $("gw-basis").value = "1.250,00"; $("gw-satz").value = "6";
      $("gw-erloes").value = "1.400,00"; $("gw-kosten").value = "1.250,00";
    } else if (a === "rabatt") {
      $("rb-basis").value = "480,00"; $("rb-satz").value = "10"; $("rb-betrag").value = "40,00";
    } else {
      $("st-betrag").value = "100,00"; $("st-satz").value = "19";
    }
    loescheErgebnis();
  }
  function leeren() {
    var p = d.querySelector(".bwl-panel:not([hidden])");
    p.querySelectorAll("input[type='text']").forEach(function (i) { i.value = ""; });
    if (art() === "angebot") { setAnzahl(1); status(""); }
    loescheErgebnis();
  }

  $("bwl-art").addEventListener("change", zeigePanel);
  $("bwl-form").addEventListener("submit", function (e) { e.preventDefault(); berechne(); });
  $("bwl-form").addEventListener("input", loescheErgebnis);
  $("bwl-beispiel").addEventListener("click", beispiel);
  $("bwl-leeren").addEventListener("click", leeren);
})();
