/* BWL-Werkstatt: Rechenkern ohne Oberfläche.
   Beträge intern in ganzen Cent. Keine externen Dienste, kein DOM.
   Technische Grundlage: Rechenkern der BWL-Werkstatt aus IT-Ausbildung
   (Review-Stand 17fd7fd), hier als eigene, getrennte Datei übernommen.

   Rundung: kaufmännisch auf volle Cent. Bei genau einem halben Cent wird aufgerundet.
   Prozentsätze werden in Hundertstel Prozent geführt (7,50 % = 750):
     percentFein(cents, hundertstel) = floor((cents * hundertstel + 5000) / 10000)
   Mengen werden in Tausendsteln geführt (1,5 = 1500). Der Betrag einer
   Position wird einmal auf volle Cent gerundet und danach nicht erneut.

   Fachlicher Status: Bezugsbasen (Handlungskosten auf Positionssumme,
   Gewinn auf Selbstkosten) sind Übungsannahmen und noch nicht fachlich freigegeben. */
(function (g) {
  "use strict";

  var MAX_CENTS = 100000000000;
  var MAX_QTY_MILLI = 1000000000;
  var MAX_RATE = 10000;
  var MAX_POSITIONEN = 6;

  function percentFein(cents, hundertstel) {
    return Math.floor((cents * hundertstel + 5000) / 10000);
  }

  function fmt(cents) {
    var sign = cents < 0 ? "-" : "";
    var n = Math.abs(cents);
    var e = Math.floor(n / 100);
    var c = n % 100;
    return sign + String(e).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + (c < 10 ? "0" : "") + c;
  }

  function money(text) {
    /* Akzeptierte Formate: Ziffern ohne Gruppierung (12, 1234,56) oder mit Tausenderpunkten
       (erste Gruppe 1 bis 3 Ziffern, danach genau 3, z. B. 1.234,56), optional Komma
       mit 1 oder 2 Nachkommastellen. Nur Leerzeichen am Rand werden ignoriert.
       Alles andere wird abgelehnt, nichts wird stillschweigend entfernt. */
    var raw = String(text == null ? "" : text).trim();
    if (raw === "") return { ok: false, error: "Trage einen Betrag ein, zum Beispiel 12,50." };
    if (raw.indexOf(".") >= 0 && raw.indexOf(",") < 0) {
      return { ok: false, error: "Verwende das Komma als Dezimalzeichen, zum Beispiel 12,50. Der Punkt ist nur das Tausenderzeichen." };
    }
    if (!/^(\d{1,3}(\.\d{3})+|\d+)(,\d{1,2})?$/.test(raw)) {
      if (raw.indexOf(".") >= 0 && /^[\d.]+(,\d{1,2})?$/.test(raw)) {
        return { ok: false, error: "Der Tausenderpunkt steht an der falschen Stelle. Schreibe zum Beispiel 1.234,56 oder 1234,56." };
      }
      return { ok: false, error: "Gib einen Geldbetrag nur mit Ziffern und einem Komma ein, mit höchstens zwei Nachkommastellen, zum Beispiel 12,50 oder 1.234,56." };
    }
    raw = raw.replace(/\./g, "").replace(",", ".");
    var parts = raw.split(".");
    var cents = Number(parts[0]) * 100 + (parts[1] ? Number((parts[1] + "00").slice(0, 2)) : 0);
    if (!Number.isSafeInteger(cents) || cents > MAX_CENTS) {
      return { ok: false, error: "Der Betrag ist zu groß. Höchstens 1.000.000.000,00 Euro." };
    }
    return { ok: true, cents: cents };
  }

  function qty(text) {
    /* Akzeptiert: Ziffern, optional Komma mit 1 bis 3 Nachkommastellen (3, 1,5). Nichts wird still entfernt. */
    var raw = String(text == null ? "" : text).trim();
    if (!/^\d+(,\d{1,3})?$/.test(raw)) {
      return { ok: false, error: "Gib eine Menge nur mit Ziffern und höchstens einem Komma ein, zum Beispiel 3 oder 1,5." };
    }
    raw = raw.replace(",", ".");
    var parts = raw.split(".");
    var milli = Number(parts[0]) * 1000 + (parts[1] ? Number((parts[1] + "000").slice(0, 3)) : 0);
    if (!Number.isSafeInteger(milli) || milli > MAX_QTY_MILLI) {
      return { ok: false, error: "Die Menge darf höchstens 1.000.000 sein." };
    }
    return { ok: true, milli: milli };
  }

  function rate(text) {
    /* Akzeptiert: Ziffern, optional Komma mit 1 oder 2 Nachkommastellen, optional ein einzelnes % am Ende (7, 7,5, 19,00 %). */
    var raw = String(text == null ? "" : text).trim();
    if (raw === "") return { ok: false, error: "Gib einen Prozentsatz ein, zum Beispiel 7 oder 19,00." };
    var m = /^(\d+(,\d{1,2})?)\s*%?$/.exec(raw);
    if (!m) {
      return { ok: false, error: "Gib einen Prozentsatz nur mit Ziffern und höchstens einem Komma ein, mit höchstens zwei Nachkommastellen, zum Beispiel 7,50." };
    }
    raw = m[1].replace(",", ".");
    var parts = raw.split(".");
    var hundertstel = Number(parts[0]) * 100 + (parts[1] ? Number((parts[1] + "00").slice(0, 2)) : 0);
    if (hundertstel > MAX_RATE) return { ok: false, error: "Der Prozentsatz darf nicht über 100,00 liegen." };
    return { ok: true, hundertstel: hundertstel, label: fmt(hundertstel) };
  }

  function fmtQty(milli) {
    var ganz = Math.floor(milli / 1000);
    var rest = milli % 1000;
    if (!rest) return String(ganz);
    return ganz + "," + String(rest).padStart(3, "0").replace(/0+$/, "");
  }

  /* Menge (Tausendstel) mal Einzelpreis (Cent), einmal kaufmännisch gerundet.
     BigInt vermeidet Gleitkommafehler und Überlauf. */
  function line(item) {
    var q = qty(item.menge);
    if (!q.ok) return q;
    var u = money(item.einzelpreis);
    if (!u.ok) return u;
    var big = (BigInt(q.milli) * BigInt(u.cents) + 500n) / 1000n;
    if (big > BigInt(MAX_CENTS)) return { ok: false, error: "Eine Position wird zu groß." };
    return { ok: true, cents: Number(big), menge: q.milli, einzel: u.cents };
  }

  function angebot(input) {
    input = input || {};
    var positionen = (Array.isArray(input.positionen) ? input.positionen : []).filter(function (item) {
      var menge = String(item && item.menge != null ? item.menge : "").trim();
      var preis = String(item && item.einzelpreis != null ? item.einzelpreis : "").trim();
      return menge !== "" || preis !== "";
    });
    if (!positionen.length) return { ok: false, error: "Mindestens eine Position fehlt. Ungenutzte Zeilen bleiben leer." };
    if (positionen.length > MAX_POSITIONEN) return { ok: false, error: "Es sind höchstens " + MAX_POSITIONEN + " Positionen möglich." };
    var steps = [];
    var zeilen = [];
    var summe = 0;
    for (var i = 0; i < positionen.length; i++) {
      var p = line(positionen[i]);
      if (!p.ok) return { ok: false, error: "Position " + (i + 1) + ": " + p.error };
      summe += p.cents;
      zeilen.push({
        name: String(positionen[i] && positionen[i].name != null ? positionen[i].name : "").trim().slice(0, 80),
        menge: fmtQty(p.menge), einzelpreis: fmt(p.einzel), betrag: fmt(p.cents), cents: p.cents
      });
      steps.push("Position " + (i + 1) + ": Menge " + fmtQty(p.menge) + " × " + fmt(p.einzel) + " Euro = " + fmt(p.cents) + " Euro.");
    }
    if (summe > MAX_CENTS) return { ok: false, error: "Die Positionssumme ist zu groß." };
    steps.push("Positionssumme: " + fmt(summe) + " Euro.");
    var hk = rate(input.handlungskostenSatz);
    if (!hk.ok) return { ok: false, error: "Handlungskostenzuschlag: " + hk.error };
    var hkCents = percentFein(summe, hk.hundertstel);
    var selbst = summe + hkCents;
    steps.push("Handlungskostenzuschlag " + hk.label + " % auf die Positionssumme: " + fmt(hkCents) + " Euro.");
    steps.push("Selbstkosten = Positionssumme + Handlungskostenzuschlag = " + fmt(selbst) + " Euro.");
    var gw = rate(input.gewinnSatz);
    if (!gw.ok) return { ok: false, error: "Gewinnzuschlag: " + gw.error };
    var gwCents = percentFein(selbst, gw.hundertstel);
    var netto = selbst + gwCents;
    steps.push("Gewinnzuschlag " + gw.label + " % auf die Selbstkosten: " + fmt(gwCents) + " Euro.");
    steps.push("Nettoangebotspreis = Selbstkosten + Gewinnzuschlag = " + fmt(netto) + " Euro.");
    return { ok: true, positionssumme: summe, handlungskosten: hkCents, selbstkosten: selbst, gewinn: gwCents, netto: netto, steps: steps, zeilen: zeilen };
  }

  function gewinn(input) {
    input = input || {};
    var weg = input.weg === "differenz" ? "differenz" : "zuschlag";
    if (weg === "differenz") {
      var erloes = money(input.erloes);
      if (!erloes.ok) return { ok: false, error: "Erlös: " + erloes.error };
      var kosten = money(input.kosten);
      if (!kosten.ok) return { ok: false, error: "Kosten: " + kosten.error };
      var diff = erloes.cents - kosten.cents;
      return {
        ok: true, weg: weg, erloes: erloes.cents, kosten: kosten.cents, gewinn: diff,
        steps: [
          "Weg: Gewinn als Differenz. Dieser Weg verwendet keinen Zuschlagssatz.",
          "Gewinn = Erlös − Kosten = " + fmt(erloes.cents) + " − " + fmt(kosten.cents) + " = " + fmt(diff) + " Euro." +
            (diff < 0 ? " Der Wert ist negativ: Das ist ein Verlust." : "")
        ]
      };
    }
    var basis = money(input.basis);
    if (!basis.ok) return { ok: false, error: "Basis: " + basis.error };
    var satz = rate(input.satz);
    if (!satz.ok) return { ok: false, error: "Gewinnzuschlag: " + satz.error };
    var betrag = percentFein(basis.cents, satz.hundertstel);
    return {
      ok: true, weg: weg, basis: basis.cents, satz: satz.hundertstel, gewinn: betrag,
      steps: [
        "Weg: Gewinn als Zuschlag. Die Basis ist der eingegebene Betrag.",
        "Gewinnzuschlag " + satz.label + " % von " + fmt(basis.cents) + " Euro = " + fmt(betrag) + " Euro."
      ]
    };
  }

  function rabatt(input) {
    input = input || {};
    var basis = money(input.basis);
    if (!basis.ok) return { ok: false, error: "Basis: " + basis.error };
    var art = input.art === "betrag" ? "betrag" : "prozent";
    var abzug;
    var satzText;
    if (art === "betrag") {
      var betrag = money(input.betrag);
      if (!betrag.ok) return { ok: false, error: "Rabattbetrag: " + betrag.error };
      if (betrag.cents > basis.cents) return { ok: false, error: "Der Rabattbetrag darf nicht größer sein als die Basis." };
      abzug = betrag.cents;
      satzText = "Rabatt als Betrag: " + fmt(abzug) + " Euro.";
    } else {
      var satz = rate(input.satz);
      if (!satz.ok) return { ok: false, error: "Rabattsatz: " + satz.error };
      abzug = percentFein(basis.cents, satz.hundertstel);
      satzText = "Rabatt " + satz.label + " % von " + fmt(basis.cents) + " Euro = " + fmt(abzug) + " Euro.";
    }
    return {
      ok: true, art: art, basis: basis.cents, rabatt: abzug, ergebnis: basis.cents - abzug,
      steps: [
        "Basis des Rabatts: " + fmt(basis.cents) + " Euro. Der Rabatt wird nicht mit einem Zuschlag verrechnet.",
        satzText,
        "Betrag nach Rabatt = Basis − Rabatt = " + fmt(basis.cents - abzug) + " Euro."
      ]
    };
  }

  function steuer(input) {
    input = input || {};
    var betrag = money(input.betrag);
    if (!betrag.ok) return { ok: false, error: "Betrag: " + betrag.error };
    var satz = rate(input.satz);
    if (!satz.ok) return { ok: false, error: "Steuersatz: " + satz.error };
    var richtung = input.richtung === "brutto-zu-netto" ? "brutto-zu-netto" : "netto-zu-brutto";
    if (richtung === "netto-zu-brutto") {
      var steuerCents = percentFein(betrag.cents, satz.hundertstel);
      return {
        ok: true, richtung: richtung, netto: betrag.cents, steuer: steuerCents, brutto: betrag.cents + steuerCents, satz: satz.hundertstel,
        steps: [
          "Richtung: von Netto nach Brutto. Der Steuersatz ist eine Eingabe, kein fest eingebauter Satz.",
          "Steuerbetrag = " + fmt(betrag.cents) + " Euro × " + satz.label + " % = " + fmt(steuerCents) + " Euro.",
          "Brutto = Netto + Steuerbetrag = " + fmt(betrag.cents + steuerCents) + " Euro."
        ]
      };
    }
    var teiler = 10000 + satz.hundertstel;
    var netto = Math.floor((betrag.cents * 10000 + Math.floor(teiler / 2)) / teiler);
    return {
      ok: true, richtung: richtung, brutto: betrag.cents, steuer: betrag.cents - netto, netto: netto, satz: satz.hundertstel,
      steps: [
        "Richtung: von Brutto nach Netto. Netto = Brutto × 100 ÷ (100 + Satz), kaufmännisch auf volle Cent.",
        "Netto = " + fmt(netto) + " Euro. Steuerbetrag = " + fmt(betrag.cents - netto) + " Euro. Brutto bleibt " + fmt(betrag.cents) + " Euro."
      ]
    };
  }

  /* Referenzfall aus der Übergabe: 2.850,00 / 199,50 / 3.049,50 / 152,48 / 3.201,98 */
  function referenzAngebot() {
    return angebot({
      positionen: [
        { menge: "3", einzelpreis: "640,00" },
        { menge: "3", einzelpreis: "150,00" },
        { menge: "3", einzelpreis: "30,00" },
        { menge: "3", einzelpreis: "40,00" },
        { menge: "1", einzelpreis: "0,00" },
        { menge: "3", einzelpreis: "90,00" }
      ],
      handlungskostenSatz: "7",
      gewinnSatz: "5"
    });
  }

  function positionenHinzufuegen(anzahl) {
    var n = Math.floor(Number(anzahl));
    if (!(n >= 1)) return 1;
    return Math.min(n + 1, MAX_POSITIONEN);
  }

  function positionenEntfernen(zeilen, index) {
    var liste = Array.isArray(zeilen) ? zeilen.slice(0, MAX_POSITIONEN) : [];
    if (!Number.isInteger(index) || index < 1 || index >= liste.length) return liste;
    liste.splice(index, 1);
    return liste;
  }

  var api = {
    MAX_CENTS: MAX_CENTS, MAX_POSITIONEN: MAX_POSITIONEN,
    percentFein: percentFein, fmt: fmt, money: money, qty: qty, rate: rate,
    angebot: angebot, gewinn: gewinn, rabatt: rabatt, steuer: steuer,
    referenzAngebot: referenzAngebot,
    positionenHinzufuegen: positionenHinzufuegen, positionenEntfernen: positionenEntfernen
  };
  g.BWL_KERN = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
