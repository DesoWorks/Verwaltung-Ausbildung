/* Rathaus – Bürgerbüro: Arbeitsplatz für den Übungsfall B01.
 * Zeichnet nur die Ansichten "buerger" und "buerger-karte". Speichert ausschließlich unter
 * RATHAUS_BUERGERBUERO.SPEICHER_SCHLUESSEL. Die Bewertung kommt vollständig aus rathaus-buergerbuero.js.
 */
(function () {
  "use strict";

  var bb = window.RATHAUS_BUERGERBUERO;

  var ETAPPEN = ["Anliegen", "Unterlagen", "Regeln", "Vorbereitung", "Antwort", "Auswertung"];
  var BEREICHE = [
    { key: "anliegen", name: "Anliegen" },
    { key: "unterlagen", name: "Unterlagen" },
    { key: "regeln", name: "Regeln" },
    { key: "vorbereitung", name: "Vorbereitung" },
    { key: "antwort", name: "Antwort" }
  ];
  var STATUSWORT = {
    richtig: "Richtig",
    falsch: "Noch nicht richtig",
    unvollstaendig: "Noch nicht vollständig",
    offen: "Noch offen",
    ungueltig: "Ungültig"
  };
  var FRAGEN = [
    { id: "einzug", frage: "Wann sind Sie eingezogen?", antwort: "Ich bin am 09.11.2026 eingezogen. Der Mietvertrag beginnt schon am 01.11.2026." },
    { id: "wohnung", frage: "Haben Sie noch eine weitere Wohnung?", antwort: "Nein, ich wohne nur in dieser einen Wohnung." },
    { id: "bestaetigung", frage: "Haben Sie eine Bestätigung Ihres Wohnungsgebers oder ein Zuordnungsmerkmal?", antwort: "Nein, die habe ich noch nicht. Mein Vermieter hat mir nichts gegeben." }
  ];
  var DOKUMENTE = {
    ausweis: "Personalausweis (fiktives Übungsdokument). Name: Samira Yilmaz. Alter: 22 Jahre. Der Ausweis liegt im Original vor und gilt in dieser Übung als gültig.",
    mietvertrag: "Mietvertrag (fiktives Übungsdokument). Mieterin: Samira Yilmaz. Mietbeginn: 01.11.2026. Der Vertrag beschreibt die Wohnung. Eine Einzugsbestätigung des Wohnungsgebers ist nicht enthalten. Tatsächlich eingezogen ist Frau Yilmaz am 09.11.2026.",
    bestaetigung: "Bestätigung des Wohnungsgebers: Sie liegt nicht vor. Frau Yilmaz hat sie noch nicht erhalten.",
    merkmal: "Elektronisches Zuordnungsmerkmal: Es liegt nicht vor. Frau Yilmaz hat kein Zuordnungsmerkmal dabei."
  };
  var LESEFEHLER = "Der gespeicherte Stand konnte nicht gelesen werden. Du startest mit einem leeren Fall.";
  var SCHREIBFEHLER = "Speichern nicht möglich. Dein Stand gilt nur, bis du diese Seite verlässt. Prüfe, ob der Browser das Speichern erlaubt.";

  var modell = null;
  var hilfeStufe = 0;
  var speicherMeldung = "";
  var refs = {};
  var merkHost = null;
  var merkKontext = null;
  var ansageTimer = null;

  function el(tag, klasse, text) {
    var knoten = document.createElement(tag);
    if (klasse) knoten.className = klasse;
    if (text !== undefined) knoten.textContent = text;
    return knoten;
  }

  function leeren(knoten) {
    while (knoten.firstChild) knoten.removeChild(knoten.firstChild);
  }

  function knopf(text, klasse, onClick) {
    var k = el("button", klasse || "knopf", text);
    k.type = "button";
    if (onClick) k.addEventListener("click", onClick);
    return k;
  }

  function fokusAuf(knoten) {
    if (knoten && typeof knoten.focus === "function") knoten.focus();
  }

  // ---------- Speicher ----------

  function leeresModell() {
    return { eingaben: bb.normalisiere({}), letzteAuswertung: null, abgeschlossen: false, verworfen: false, veraltet: false };
  }

  function laden() {
    speicherMeldung = "";
    var roh = null;
    try {
      roh = window.localStorage.getItem(bb.SPEICHER_SCHLUESSEL);
    } catch (fehler) {
      speicherMeldung = LESEFEHLER;
      return leeresModell();
    }
    if (!roh) return leeresModell();
    var b = bb.bereinigeGespeichert(roh);
    return { eingaben: b.eingaben, letzteAuswertung: b.letzteAuswertung, abgeschlossen: b.abgeschlossen, verworfen: b.verworfen, veraltet: false };
  }

  function zeigeFehler() {
    if (!refs.fehler) return;
    refs.fehler.textContent = speicherMeldung;
    refs.fehler.hidden = !speicherMeldung;
  }

  function speichern() {
    var nutzlast = {
      fallId: bb.FALL_ID,
      bewertungsstand: bb.BEWERTUNGSSTAND,
      eingaben: modell.eingaben,
      letzteAuswertung: modell.letzteAuswertung,
      abgeschlossen: modell.abgeschlossen
    };
    try {
      window.localStorage.setItem(bb.SPEICHER_SCHLUESSEL, JSON.stringify(nutzlast));
      speicherMeldung = "";
      zeigeFehler();
      return true;
    } catch (fehler) {
      speicherMeldung = SCHREIBFEHLER;
      zeigeFehler();
      return false;
    }
  }

  // Eine Ansage pro Ereignis über die Statusregion, nie bei jedem Tastendruck.
  function ansage(text) {
    if (!refs.status) return;
    refs.status.textContent = "";
    if (ansageTimer && typeof window.clearTimeout === "function") window.clearTimeout(ansageTimer);
    if (typeof window.setTimeout === "function") {
      ansageTimer = window.setTimeout(function () { if (refs.status) refs.status.textContent = text; }, 80);
    } else {
      refs.status.textContent = text;
    }
  }

  // ---------- Bausteine ----------

  function gruppe(host, id, legende, hinweis) {
    var set = el("fieldset", "rathaus-gruppe");
    set.appendChild(el("legend", "", legende));
    if (hinweis) {
      var h = el("p", "rathaus-meta", hinweis);
      h.id = id + "-hilfe";
      set.appendChild(h);
      set.setAttribute("aria-describedby", id + "-hilfe");
    }
    host.appendChild(set);
    return set;
  }

  function option(set, typ, name, wert, text, aktiv, onChange) {
    var label = el("label", "rathaus-option");
    var input = document.createElement("input");
    input.type = typ;
    input.name = name;
    input.value = wert;
    input.checked = aktiv;
    input.addEventListener("change", function () { onChange(input.checked); });
    label.appendChild(input);
    label.appendChild(el("span", "", text));
    set.appendChild(label);
  }

  function einzelGruppe(host, key, legende, hinweis) {
    var set = gruppe(host, "bb-" + key, legende, hinweis);
    bb.katalog()[key].optionen.forEach(function (o) {
      option(set, "radio", "bb-" + key, o.id, o.text, modell.eingaben[key] === o.id, function () {
        modell.eingaben[key] = o.id;
        eingabeGeaendert();
      });
    });
  }

  function mehrfachGruppe(host, key, legende, hinweis) {
    var set = gruppe(host, "bb-" + key, legende, hinweis);
    bb.katalog()[key].optionen.forEach(function (o) {
      option(set, "checkbox", "bb-" + key, o.id, o.text, modell.eingaben[key].indexOf(o.id) !== -1, function (an) {
        var liste = modell.eingaben[key].filter(function (id) { return id !== o.id; });
        if (an) liste.push(o.id);
        modell.eingaben[key] = liste;
        eingabeGeaendert();
      });
    });
  }

  function etappe(host, nr, intro) {
    var box = el("section", "rathaus-etappe");
    var kopf = el("h3", "", nr + ". " + ETAPPEN[nr - 1]);
    kopf.id = "bb-etappe-" + nr;
    kopf.tabIndex = -1;
    box.setAttribute("aria-labelledby", kopf.id);
    box.appendChild(kopf);
    if (intro) box.appendChild(el("p", "rathaus-meta", intro));
    refs.etappen[nr] = kopf;
    host.appendChild(box);
    return box;
  }

  // Ein Knopf klappt den Inhalt direkt darunter auf und zu. Nichts wird hochgeladen.
  function aufklappbar(host, idBasis, textOeffnen, textSchliessen, erzeuge) {
    var wrapper = el("div", "rathaus-aufklapp");
    var panel = el("div", "rathaus-dokument");
    panel.id = idBasis + "-panel";
    var offen = false;
    var k = knopf(textOeffnen, "knopf", function () {
      offen = !offen;
      leeren(panel);
      if (offen) panel.appendChild(erzeuge());
      k.textContent = offen ? textSchliessen : textOeffnen;
      k.setAttribute("aria-expanded", offen ? "true" : "false");
    });
    k.setAttribute("aria-expanded", "false");
    k.setAttribute("aria-controls", panel.id);
    wrapper.appendChild(k);
    wrapper.appendChild(panel);
    host.appendChild(wrapper);
  }

  // ---------- Änderungen und Auswertung ----------

  function eingabeGeaendert() {
    var hatte = Boolean(modell.letzteAuswertung) || modell.abgeschlossen;
    modell.letzteAuswertung = null;
    modell.abgeschlossen = false;
    if (hatte) modell.veraltet = true;
    speichern();
    aktualisiere();
    if (hatte) ansage("Eingaben geändert. Die Auswertung gilt nicht mehr. Bitte erneut prüfen.");
  }

  function etappenStatus() {
    var e = modell.eingaben;
    var dokIds = bb.katalog().dokumente.optionen.map(function (o) { return o.id; });
    return [
      Boolean(e.anliegen && e.einzug && e.weitereWohnung),
      dokIds.every(function (id) { return Boolean(e.dokumente[id]); }),
      e.regeln.length > 0,
      Boolean(e.vorbereitung),
      e.bausteine.length > 0,
      Boolean(modell.letzteAuswertung)
    ];
  }

  function fuelleSchritte(host) {
    leeren(host);
    var status = etappenStatus();
    var fertig = status.filter(Boolean).length;
    host.appendChild(el("p", "rathaus-fortschritt-text", fertig + " von 6 Bereichen bearbeitet"));
    var liste = el("ol", "rathaus-schritte");
    ETAPPEN.forEach(function (name, i) {
      var li = el("li", status[i] ? "ist-fertig" : "");
      var k = knopf((status[i] ? "✓ " : "") + (i + 1) + ". " + name, "knopf rathaus-schritt", function () {
        var ziel = refs.etappen[i + 1];
        if (ziel && typeof ziel.scrollIntoView === "function") ziel.scrollIntoView();
        fokusAuf(ziel);
      });
      k.appendChild(el("span", "nur-lesen", status[i] ? " – bearbeitet" : " – offen"));
      li.appendChild(k);
      liste.appendChild(li);
    });
    host.appendChild(liste);
  }

  function ergebnisSatz(a) {
    if (a.darfAbschliessen) return "Alle Bereiche sind richtig. Du kannst den Übungsfall abschließen.";
    var offen = BEREICHE.filter(function (b) { return a.bereiche[b.key].status !== "richtig"; })
      .map(function (b) { return b.name; });
    if (!offen.length) return "Der Abschluss ist gesperrt.";
    return "Noch nicht abschließbar. Überarbeite: " + offen.join(", ") + ".";
  }

  function liste(host, punkte) {
    var ul = el("ul", "");
    punkte.forEach(function (p) { ul.appendChild(el("li", "", p)); });
    host.appendChild(ul);
  }

  function pruefen() {
    modell.letzteAuswertung = bb.auswertung(modell.eingaben);
    modell.abgeschlossen = false;
    modell.veraltet = false;
    modell.verworfen = false;
    var ok = speichern();
    aktualisiere();
    fokusAuf(refs.ergebnis);
    ansage(ok
      ? "Auswertung fertig. " + ergebnisSatz(modell.letzteAuswertung)
      : "Die Auswertung wurde nicht gespeichert. " + SCHREIBFEHLER);
  }

  function abschliessen() {
    var a = bb.auswertung(modell.eingaben);
    var alt = modell.letzteAuswertung;
    if (!alt || !a.darfAbschliessen || alt.eingabeVersion !== a.eingabeVersion) return;
    modell.abgeschlossen = true;
    var ok = speichern();
    if (!ok) {
      modell.abgeschlossen = false;
      aktualisiere();
      ansage("Der Abschluss wurde nicht gespeichert. " + SCHREIBFEHLER);
      return;
    }
    aktualisiere();
    fokusAuf(refs.abschlussTitel);
    ansage("Übungsfall B01 abgeschlossen. Es wurde keine Anmeldung durchgeführt.");
  }

  function fuelleAuswertung(host) {
    leeren(host);
    var a = modell.letzteAuswertung;

    var ergTitel = el("h4", "", "Ergebnis");
    ergTitel.id = "bb-ergebnis";
    ergTitel.tabIndex = -1;
    refs.ergebnis = ergTitel;
    host.appendChild(ergTitel);

    if (!a) {
      if (modell.veraltet) host.appendChild(el("p", "rathaus-hinweis", "Die Eingaben haben sich geändert. Bitte erneut prüfen."));
      else if (modell.verworfen) host.appendChild(el("p", "rathaus-hinweis", "Der gespeicherte Stand passt nicht mehr zur aktuellen Bewertung. Deine Eingaben bleiben. Bitte erneut prüfen."));
      else host.appendChild(el("p", "", "Noch keine Auswertung. Du kannst die Bereiche in Ruhe ausfüllen."));
    }
    host.appendChild(knopf(a ? "Erneut prüfen" : "Auswertung prüfen", "knopf knopf-haupt", pruefen));

    if (a) {
      var ul = el("ul", "rathaus-teilbewertungen");
      BEREICHE.forEach(function (b) {
        var bereich = a.bereiche[b.key];
        var richtig = bereich.status === "richtig";
        var punkt = el("li", "rathaus-teil " + (richtig ? "ist-richtig" : "ist-falsch"));
        punkt.appendChild(el("span", "rathaus-teil-name", b.name + ":"));
        punkt.appendChild(el("span", "rathaus-teil-symbol", richtig ? "✓" : "✗"));
        punkt.appendChild(el("span", "rathaus-teil-wort", STATUSWORT[bereich.status] || bereich.status));
        ul.appendChild(punkt);
      });
      host.appendChild(ul);
      host.appendChild(el("p", a.darfAbschliessen ? "rathaus-ok" : "rathaus-fehler", "Ergebnis: " + ergebnisSatz(a)));
      BEREICHE.forEach(function (b) {
        var bereich = a.bereiche[b.key];
        if (!bereich.hinweise.length) return;
        host.appendChild(el("h5", "", b.name));
        liste(host, bereich.hinweise);
      });
      if (a.sperren.length) {
        host.appendChild(el("h5", "", "Das sperrt den Abschluss"));
        liste(host, a.sperren);
      }
    }

    var entwurf = el("div", "rathaus-entwurf-box");
    entwurf.appendChild(el("h5", "", "Dein eigener Antwortentwurf"));
    entwurf.appendChild(el("p", "rathaus-meta", "Entwurf, nicht automatisch geprüft"));
    var entwurfText = el("p", "rathaus-entwurf", modell.eingaben.freitext);
    entwurf.appendChild(entwurfText);
    entwurf.hidden = !modell.eingaben.freitext.trim();
    refs.entwurfBox = entwurf;
    refs.entwurfText = entwurfText;
    host.appendChild(entwurf);

    var frei = Boolean(a && a.darfAbschliessen === true && !modell.abgeschlossen);
    var status;
    if (modell.abgeschlossen) {
      status = el("p", "rathaus-ok", "✓ Übungsfall abgeschlossen. Das ist nur eine Übung: Es wurde keine Anmeldung durchgeführt und nichts an eine Behörde übermittelt.");
      status.id = "bb-abschluss-titel";
      status.tabIndex = -1;
      refs.abschlussTitel = status;
    } else if (frei) {
      status = el("p", "rathaus-ok", "Bereit: Du kannst den Übungsfall jetzt abschließen.");
    } else if (modell.veraltet) {
      status = el("p", "rathaus-meta", "Noch nicht abschließen: Die Eingaben haben sich geändert. Bitte erneut prüfen.");
    } else if (a) {
      status = el("p", "rathaus-meta", "Noch nicht abschließen: Mindestens ein Bereich ist noch nicht richtig.");
    } else {
      status = el("p", "rathaus-meta", "Noch nicht abschließen: Prüfe zuerst deine Eingaben.");
    }
    if (!status.id) status.id = "bb-abschluss-status";
    var abschluss = knopf("Übungsfall abschließen", "knopf knopf-haupt", abschliessen);
    abschluss.id = "bb-abschluss-knopf";
    abschluss.disabled = !frei;
    abschluss.setAttribute("aria-describedby", status.id);
    var zeile = el("div", "rathaus-abschluss");
    zeile.appendChild(abschluss);
    zeile.appendChild(status);
    host.appendChild(zeile);
  }

  function aktualisiere() {
    if (refs.schritte) fuelleSchritte(refs.schritte);
    if (refs.auswertung) fuelleAuswertung(refs.auswertung);
  }

  // ---------- Hilfe ----------

  function fuelleHilfe(host, fokusId) {
    leeren(host);
    function wechsel(delta) {
      hilfeStufe = delta === 0 ? 0 : Math.max(0, Math.min(3, hilfeStufe + delta));
      fuelleHilfe(host, delta);
    }
    var mehr = knopf("Mehr Hilfe", "knopf", function () { wechsel(1); });
    mehr.disabled = hilfeStufe >= 3;
    var weniger = knopf("Weniger Hilfe", "knopf", function () { wechsel(-1); });
    weniger.disabled = hilfeStufe <= 0;
    var zu = knopf("Hilfe einklappen", "knopf", function () { wechsel(0); });
    zu.disabled = hilfeStufe <= 0;
    zu.setAttribute("aria-controls", "bb-hilfe-bereich");
    zu.setAttribute("aria-expanded", hilfeStufe > 0 ? "true" : "false");
    var reihe = el("div", "knopf-reihe");
    reihe.append(mehr, weniger, zu);
    host.appendChild(reihe);
    var bereich = el("div", "rathaus-hilfe");
    bereich.id = "bb-hilfe-bereich";
    bereich.setAttribute("role", "region");
    bereich.setAttribute("aria-label", "Hilfe");
    bereich.hidden = hilfeStufe <= 0;
    if (hilfeStufe > 0) {
      bereich.appendChild(el("p", "rathaus-meta", "Hilfestufe " + hilfeStufe + " von 3"));
      bereich.appendChild(el("p", "rathaus-hinweis", bb.hilfe(hilfeStufe)));
    }
    host.appendChild(bereich);
    if (fokusId !== undefined) {
      var wunsch = fokusId > 0 ? mehr : (fokusId < 0 ? weniger : zu);
      var ziel = !wunsch.disabled ? wunsch : [mehr, weniger, zu].filter(function (k) { return !k.disabled; })[0];
      fokusAuf(ziel || mehr);
    }
  }

  // ---------- Reset ----------

  function zuruecksetzen() {
    var ja = typeof window.confirm === "function" ? window.confirm(bb.resetText()) : false;
    if (!ja) {
      ansage("Zurücksetzen abgebrochen. Es wurde nichts geändert.");
      return;
    }
    try {
      window.localStorage.removeItem(bb.SPEICHER_SCHLUESSEL);
    } catch (fehler) {
      speicherMeldung = "Zurücksetzen nicht möglich. Der gespeicherte Stand wurde nicht gelöscht.";
      zeigeFehler();
      return;
    }
    modell = leeresModell();
    hilfeStufe = 0;
    speicherMeldung = "";
    leeren(merkHost);
    zeichne(merkHost, merkKontext);
    fokusAuf(refs.titel);
    ansage("Fall B01 wurde zurückgesetzt.");
  }

  // ---------- Ansichten ----------

  function titel(host, text) {
    var h = el("h2", "", text);
    h.id = "ansicht-titel";
    h.tabIndex = -1;
    refs.titel = h;
    host.appendChild(h);
  }

  function standText() {
    if (modell.abgeschlossen) return "Stand: Übungsfall abgeschlossen";
    if (modell.letzteAuswertung) return "Stand: ausgewertet, noch nicht abgeschlossen";
    var leer = bb.eingabeVersion({}) === bb.eingabeVersion(modell.eingaben) && !modell.eingaben.freitext;
    return leer ? "Stand: noch nicht begonnen" : "Stand: in Bearbeitung";
  }

  function zeichneUebersicht(host, ctx) {
    titel(host, "Bürgerbüro Sonnenthal");
    var daten = bb.fallDaten();
    host.appendChild(el("p", "rathaus-einleitung", "Hier nimmst du Anliegen von Einwohnerinnen und Einwohnern auf. Die Stadt und alle Personen sind erfunden."));
    host.appendChild(el("p", "rathaus-hinweis", daten.uebungsannahme));
    refs.fehler = el("p", "rathaus-fehler", speicherMeldung);
    refs.fehler.setAttribute("role", "alert");
    zeigeFehler();
    host.appendChild(refs.fehler);
    host.appendChild(el("h3", "", "Fallübersicht"));
    var raster = el("div", "rathaus-raster");
    bb.fallListe().forEach(function (f) {
      var karte = el("article", "rathaus-karte " + (f.startbar ? "ist-aktiv" : "ist-vorschau"));
      karte.appendChild(el("h4", "", "Fall " + f.id.toUpperCase() + ": " + f.titel));
      if (f.startbar) {
        karte.appendChild(el("p", "rathaus-status", standText()));
        karte.appendChild(knopf("Fall B01 öffnen", "knopf knopf-haupt", function () { ctx.wechsle("buerger", "fall"); }));
      } else {
        var gesperrt = knopf("geplant, noch nicht startbar", "knopf", null);
        gesperrt.disabled = true;
        gesperrt.setAttribute("aria-label", "Fall " + f.id.toUpperCase() + " " + f.titel + ": geplant, noch nicht startbar");
        karte.appendChild(gesperrt);
      }
      raster.appendChild(karte);
    });
    host.appendChild(raster);
    host.appendChild(knopf("Nachschlagekarte Meldewesen öffnen", "knopf", function () { ctx.wechsle("buerger-karte", null); }));
  }

  function zeichneKarte(host, ctx) {
    var karte = bb.nachschlagen();
    titel(host, karte.titel);
    karte.themen.forEach(function (thema) {
      var box = el("section", "rathaus-nachschlag-abschnitt");
      box.appendChild(el("h3", "", thema.titel));
      box.appendChild(el("p", "", thema.text));
      host.appendChild(box);
    });
    host.appendChild(el("p", "rathaus-hinweis", karte.quelle));
    host.appendChild(el("p", "rathaus-meta", "Die Nachschlagekarte verändert keinen Fallstand."));
    host.appendChild(knopf("Zur Bürgerbüro-Übersicht", "knopf", function () { ctx.wechsle("buerger", "uebersicht"); }));
  }

  function zeichneFall(host, ctx) {
    var daten = bb.fallDaten();
    titel(host, "Fall B01: " + daten.titel);
    host.appendChild(el("p", "rathaus-meta", "Fiktive Übung mit erfundener Person. Es wird keine echte Anmeldung durchgeführt."));
    host.appendChild(el("p", "rathaus-hinweis", daten.uebungsannahme));

    refs.fehler = el("p", "rathaus-fehler", speicherMeldung);
    refs.fehler.setAttribute("role", "alert");
    zeigeFehler();
    host.appendChild(refs.fehler);

    refs.status = el("p", "nur-lesen");
    refs.status.setAttribute("role", "status");
    refs.status.setAttribute("aria-live", "polite");
    refs.status.setAttribute("aria-atomic", "true");
    host.appendChild(refs.status);

    refs.schritte = el("nav", "rathaus-fortschritt");
    refs.schritte.setAttribute("aria-label", "Bereiche im Fall B01");
    host.appendChild(refs.schritte);

    // 1 Anliegen
    var e1 = etappe(host, 1, "Höre zu, stelle Rückfragen und halte fest, worum es geht.");
    e1.appendChild(el("p", "rathaus-gespraech", "Frau Yilmaz sagt: „" + daten.anliegenText + "“"));
    e1.appendChild(el("h4", "", "Rückfragen stellen"));
    FRAGEN.forEach(function (f) {
      aufklappbar(e1, "bb-frage-" + f.id, "Frage: " + f.frage, "Antwort ausblenden: " + f.frage, function () {
        return el("p", "rathaus-antwort", "Frau Yilmaz antwortet: „" + f.antwort + "“");
      });
    });
    einzelGruppe(e1, "anliegen", "Worum geht es bei dem Anliegen?", "Wähle genau eine Antwort.");
    einzelGruppe(e1, "einzug", "Welches Datum zählt für die Frist?", "Wähle genau eine Antwort.");
    einzelGruppe(e1, "weitereWohnung", "Gibt es weitere Wohnungen?", "Wähle genau eine Antwort.");

    // 2 Unterlagen
    var e2 = etappe(host, 2, "Öffne jede Unterlage und entscheide, was sie für die Anmeldung bedeutet.");
    var kat = bb.katalog().dokumente;
    kat.optionen.forEach(function (d) {
      aufklappbar(e2, "bb-dok-" + d.id, d.text + " öffnen", d.text + " schließen", function () {
        var artikel = el("article", "rathaus-dokument-inhalt");
        artikel.appendChild(el("h4", "", d.text));
        artikel.appendChild(el("p", "", DOKUMENTE[d.id]));
        return artikel;
      });
    });
    kat.optionen.forEach(function (d) {
      var set = gruppe(e2, "bb-dok-" + d.id, d.text + ": Stand der Unterlage", null);
      kat.status.forEach(function (s) {
        option(set, "radio", "bb-dok-" + d.id, s.id, s.text, modell.eingaben.dokumente[d.id] === s.id, function () {
          modell.eingaben.dokumente[d.id] = s.id;
          eingabeGeaendert();
        });
      });
    });

    // 3 Regeln
    var e3 = etappe(host, 3, "Ordne die Regeln und die Zuständigkeit ein.");
    mehrfachGruppe(e3, "regeln", "Welche Regeln und Zuständigkeiten gehören zum Fall?", "Du kannst mehrere ankreuzen.");
    mehrfachGruppe(e3, "fallen", "Welche dieser Aussagen treffen im Fall von Frau Yilmaz zu?", "Kreuze nur an, was wirklich gilt. Wenn keine Aussage stimmt, lass alle leer.");

    // 4 Vorbereitung
    var e4 = etappe(host, 4, "Entscheide, was du für die weitere Bearbeitung vorbereitest.");
    einzelGruppe(e4, "vorbereitung", "Wie wird die weitere Bearbeitung vorbereitet?", "Wähle genau eine Antwort.");

    // 5 Antwort
    var e5 = etappe(host, 5, "Stelle die Antwort an Frau Yilmaz aus Bausteinen zusammen. Eigenen Text kannst du zusätzlich schreiben.");
    mehrfachGruppe(e5, "bausteine", "Welche Bausteine gehören in die Antwort an Frau Yilmaz?", "Du kannst mehrere ankreuzen.");
    var feldName = el("label", "rathaus-feldname", "Eigener Antwortentwurf (freiwillig)");
    feldName.setAttribute("for", "bb-freitext");
    e5.appendChild(feldName);
    var feld = document.createElement("textarea");
    feld.id = "bb-freitext";
    feld.name = "freitext";
    feld.rows = 12;
    feld.className = "rathaus-freitext-gross";
    feld.maxLength = 2000;
    feld.value = modell.eingaben.freitext;
    feld.setAttribute("aria-describedby", "bb-freitext-hilfe");
    feld.addEventListener("input", function () {
      modell.eingaben.freitext = String(feld.value).slice(0, 2000);
      eingabeGeaendert();
      if (refs.entwurfText) refs.entwurfText.textContent = modell.eingaben.freitext;
      if (refs.entwurfBox) refs.entwurfBox.hidden = !modell.eingaben.freitext.trim();
    });
    e5.appendChild(feld);
    var feldHilfe = el("p", "rathaus-meta", "Entwurf, nicht automatisch geprüft. Er wird gespeichert und angezeigt, aber nicht bewertet.");
    feldHilfe.id = "bb-freitext-hilfe";
    e5.appendChild(feldHilfe);

    // 6 Auswertung
    var e6 = etappe(host, 6, "Lass deine Eingaben prüfen. Danach kannst du den Übungsfall abschließen.");
    refs.auswertung = el("div", "rathaus-auswertung");
    e6.appendChild(refs.auswertung);

    // Hilfe
    var hilfeBox = el("section", "rathaus-etappe");
    hilfeBox.appendChild(el("h3", "", "Hilfe"));
    hilfeBox.appendChild(el("p", "rathaus-meta", "Drei Stufen, von allgemein bis konkret. Eine fertige Antwort gibt es hier nicht."));
    var hilfeHost = el("div", "");
    fuelleHilfe(hilfeHost);
    hilfeBox.appendChild(hilfeHost);
    host.appendChild(hilfeBox);

    // Zurücksetzen und Rückweg
    var reset = el("section", "rathaus-etappe");
    reset.appendChild(el("h3", "", "Zurücksetzen"));
    reset.appendChild(knopf("Fall B01 zurücksetzen", "knopf knopf-warn", zuruecksetzen));
    host.appendChild(reset);
    host.appendChild(knopf("Zur Bürgerbüro-Übersicht", "knopf", function () { ctx.wechsle("buerger", "uebersicht"); }));

    aktualisiere();
  }

  function zeichne(host, ctx) {
    refs = { etappen: {} };
    merkHost = host;
    merkKontext = ctx;
    if (!bb) {
      host.appendChild(el("p", "rathaus-fehler", "Das Bürgerbüro ist gerade nicht verfügbar."));
      return;
    }
    if (ctx.ansicht === "buerger-karte") {
      zeichneKarte(host, ctx);
      return;
    }
    if (!modell) modell = laden();
    if (ctx.modus === "fall") zeichneFall(host, ctx);
    else zeichneUebersicht(host, ctx);
  }

  // Block für die Lehrkraftansicht: zusätzlich zu Luca und Noelle, ohne Schreibzugriff.
  function zeichneLehrkraft(host) {
    if (!bb) return;
    var l = bb.lehrkraft();
    host.appendChild(el("h3", "", "Bürgerbüro B01: Samira Yilmaz"));
    host.appendChild(el("p", "rathaus-hinweis", l.warnung));
    host.appendChild(el("p", "rathaus-meta", "Bewertungsstand " + bb.BEWERTUNGSSTAND));
    host.appendChild(el("h4", "", "Sachverhalt"));
    host.appendChild(el("p", "", l.sachverhalt));
    host.appendChild(el("h4", "", "Lernziele"));
    liste(host, l.lernziele);
    host.appendChild(el("h4", "", "Typische Fehler"));
    liste(host, l.typischeFehler);
    host.appendChild(el("h4", "", "Musterantwort (Übungslösung, nicht verbindlich)"));
    host.appendChild(el("p", "", l.musterantwort));
    host.appendChild(el("h4", "", "Bewertungskriterien"));
    liste(host, l.kriterien);
    host.appendChild(el("h4", "", "Rechtsquellen und Grenzen"));
    liste(host, l.quellen.normen.concat(["Quelldatei: " + l.quellen.datei]));
    host.appendChild(el("p", "rathaus-hinweis", l.quellen.uebungsannahme));
    host.appendChild(el("p", "rathaus-hinweis", l.quellen.luecke));
  }

  window.RATHAUS_BUERGERBUERO_UI = { zeichne: zeichne, zeichneLehrkraft: zeichneLehrkraft };
})();
