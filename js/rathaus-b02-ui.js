/* Rathaus – Bürgerbüro: Arbeitsplatz für den Übungsfall B02 (Meldebescheinigung für die eigene Person).
 * Zeichnet nur die Ansicht "buerger-b02". Speichert ausschließlich unter RATHAUS_B02.SPEICHER_SCHLUESSEL.
 * Die Bewertung kommt vollständig aus rathaus-b02.js. Es entsteht nie eine echte Bescheinigung.
 */
(function () {
  "use strict";

  var b2 = window.RATHAUS_B02;

  var ETAPPEN = ["Anliegen", "Unterlagen", "Regeln", "Vorbereitung", "Antwort", "Auswertung"];
  var STATUSWORT = {
    richtig: "Richtig",
    falsch: "Noch nicht richtig",
    unvollstaendig: "Noch nicht vollständig",
    offen: "Noch offen",
    ungueltig: "Ungültig"
  };
  var FRAGEN = [
    { id: "person", frage: "Geht es um Sie selbst oder um eine andere Person?", antwort: "Es geht nur um mich. Ich brauche den Nachweis für mich." },
    { id: "form", frage: "Welche Form der Bescheinigung möchten Sie?", antwort: "Eine einfache schriftliche Meldebescheinigung reicht mir." },
    { id: "zusatz", frage: "Brauchen Sie weitere Angaben außer den üblichen?", antwort: "Nein, nur das, was normalerweise darauf steht." },
    { id: "umzug", frage: "Sind Sie gerade erst umgezogen?", antwort: "Nein, ich wohne schon länger hier und bin hier gemeldet." }
  ];
  var DOKUMENTE = [
    { id: "ausweis", text: "Personalausweis", inhalt: "Personalausweis (fiktives Übungsdokument). Name: Alex Weber. Geburtsdatum: 14.02.1997. Der Ausweis liegt im Original vor und gilt in dieser Übung als gültig." },
    { id: "antrag", text: "Antragsangaben", inhalt: "Antragsangaben (fiktiv). Familienname: Weber. Vorname: Alex. Geburtsdatum: 14.02.1997. Derzeitige alleinige Anschrift: Lindenweg 8, 00000 Sonnenthal. Gewünscht: einfache schriftliche Meldebescheinigung, keine Zusatzdaten." },
    { id: "register", text: "Übungsregisterauszug", inhalt: "Übungsregisterauszug (fiktiv). Alex Weber, geboren 14.02.1997, alleinige Wohnung Lindenweg 8, 00000 Sonnenthal. Kein Doktorgrad gespeichert. Alle Angaben stimmen mit Ausweis und Antrag überein." }
  ];
  var LESEFEHLER = "Der gespeicherte Stand konnte nicht gelesen werden. Du startest mit einem leeren Fall.";
  var VERWORFEN_HINWEIS = "Hinweis: Der gespeicherte Stand von B02 konnte nicht gelesen werden oder passt nicht mehr zur aktuellen Bewertung. " +
    "Es wird kein alter Abschluss und keine alte Auswertung übernommen. Bitte prüfe deine Eingaben und lass sie erneut auswerten.";
  var SCHREIBFEHLER = "Speichern nicht möglich. Dein Stand gilt nur, bis du diese Seite verlässt. Prüfe, ob der Browser das Speichern erlaubt.";

  var modell = null;
  var hilfeStufe = 0;
  var speicherMeldung = "";
  var refs = {};
  var merkHost = null;
  var flussApi = null;
  var merkKontext = null;
  var ansageTimer = null;

  function el(tag, klasse, text) {
    var knoten = document.createElement(tag);
    if (klasse) knoten.className = klasse;
    if (text !== undefined) knoten.textContent = text;
    return knoten;
  }
  function leeren(knoten) { while (knoten.firstChild) knoten.removeChild(knoten.firstChild); }
  function knopf(text, klasse, onClick) {
    var k = el("button", klasse || "knopf", text);
    k.type = "button";
    if (onClick) k.addEventListener("click", onClick);
    return k;
  }
  function fokusAuf(knoten) { if (knoten && typeof knoten.focus === "function") knoten.focus(); }
  function liste(host, punkte) {
    var ul = el("ul", "");
    punkte.forEach(function (p) { ul.appendChild(el("li", "", p)); });
    host.appendChild(ul);
  }

  // ---------- Speicher ----------

  function leeresModell() {
    return { eingaben: b2.normalisiere({}), letzteAuswertung: null, abgeschlossen: false, verworfen: false, veraltet: false, lichtStand: {} };
  }

  function laden() {
    speicherMeldung = "";
    var roh = null;
    try {
      roh = window.localStorage.getItem(b2.SPEICHER_SCHLUESSEL);
    } catch (fehler) {
      speicherMeldung = LESEFEHLER;
      return leeresModell();
    }
    if (!roh) return leeresModell();
    var b = b2.bereinigeGespeichert(roh);
    return { eingaben: b.eingaben, letzteAuswertung: b.letzteAuswertung, abgeschlossen: b.abgeschlossen, verworfen: b.verworfen, veraltet: false, lichtStand: b.lichtStand || {} };
  }

  function zeigeFehler() {
    if (!refs.fehler) return;
    refs.fehler.textContent = speicherMeldung;
    refs.fehler.hidden = !speicherMeldung;
  }

  function speichern() {
    var nutzlast = {
      fallId: b2.FALL_ID,
      bewertungsstand: b2.BEWERTUNGSSTAND,
      eingaben: modell.eingaben,
      letzteAuswertung: modell.letzteAuswertung,
      abgeschlossen: modell.abgeschlossen,
      lichtStand: modell.lichtStand || {}
    };
    try {
      window.localStorage.setItem(b2.SPEICHER_SCHLUESSEL, JSON.stringify(nutzlast));
      speicherMeldung = "";
      zeigeFehler();
      return true;
    } catch (fehler) {
      speicherMeldung = SCHREIBFEHLER;
      zeigeFehler();
      return false;
    }
  }

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

  function gruppe(host, id, legende, hinweis, lichtKey) {
    var set = el("fieldset", "rathaus-gruppe");
    if (lichtKey) registriereLicht(set, lichtKey);
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
    var set = gruppe(host, "b2-" + key, legende, hinweis, key);
    b2.katalog()[key].optionen.forEach(function (o) {
      option(set, "radio", "b2-" + key, o.id, o.text, modell.eingaben[key] === o.id, function () {
        modell.eingaben[key] = o.id;
        eingabeGeaendert();
      });
    });
  }

  function mehrfachGruppe(host, key, legende, hinweis) {
    var set = gruppe(host, "b2-" + key, legende, hinweis, key);
    b2.katalog()[key].optionen.forEach(function (o) {
      option(set, "checkbox", "b2-" + key, o.id, o.text, modell.eingaben[key].indexOf(o.id) !== -1, function (an) {
        var neu = modell.eingaben[key].filter(function (id) { return id !== o.id; });
        if (an) neu.push(o.id);
        modell.eingaben[key] = neu;
        eingabeGeaendert();
      });
    });
  }

  function etappe(host, nr, intro) {
    var box = el("section", "rathaus-etappe");
    var kopf = el("h3", "", nr + ". " + ETAPPEN[nr - 1]);
    kopf.id = "b2-etappe-" + nr;
    kopf.tabIndex = -1;
    box.setAttribute("aria-labelledby", kopf.id);
    box.appendChild(kopf);
    if (intro) box.appendChild(el("p", "rathaus-meta", intro));
    refs.etappen[nr] = kopf;
    host.appendChild(box);
    return box;
  }

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
    if (modell.letzteAuswertung) modell.anzeigeAuswertung = modell.letzteAuswertung;
    modell.letzteAuswertung = null;
    modell.abgeschlossen = false;
    if (hatte) modell.veraltet = true;
    speichern();
    aktualisiere();
    if (hatte) ansage("Eingaben geändert. Nur der geänderte Block ist veraltet. Bitte erneut prüfen.");
  }

  function etappenStatus() {
    var e = modell.eingaben;
    var angabenIds = b2.katalog().angaben.optionen.map(function (o) { return o.id; });
    return [
      Boolean(e.anliegen),
      angabenIds.every(function (id) { return Boolean(e.angaben[id]); }) && Boolean(e.identitaet),
      Boolean(e.umfang) && Boolean(e.aussagen) && e.regeln.length > 0,
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
    var ol = el("ol", "rathaus-schritte");
    ETAPPEN.forEach(function (name, i) {
      var li = el("li", status[i] ? "ist-fertig" : "");
      var k = knopf((status[i] ? "✓ " : "") + (i + 1) + ". " + name, "knopf rathaus-schritt", function () {
        var ziel = refs.etappen[i + 1];
        if (ziel && typeof ziel.scrollIntoView === "function") ziel.scrollIntoView();
        fokusAuf(ziel);
      });
      k.appendChild(el("span", "nur-lesen", status[i] ? " – bearbeitet" : " – offen"));
      li.appendChild(k);
      ol.appendChild(li);
    });
    host.appendChild(ol);
  }

  function ergebnisSatz(a) {
    if (a.darfAbschliessen) return "Alle Bereiche sind richtig. Du kannst den Übungsfall abschließen.";
    var offen = b2.BEREICHE.filter(function (b) { return a.bereiche[b.key].status !== "richtig"; })
      .map(function (b) { return b.name; });
    if (!offen.length) return "Der Abschluss ist gesperrt.";
    return "Noch nicht abschließbar. Überarbeite: " + offen.join(", ") + ".";
  }

  function pruefen() {
    modell.letzteAuswertung = b2.auswertung(modell.eingaben);
    modell.lichtStand = b2.lichtAntworten(modell.eingaben);
    modell.abgeschlossen = false;
    modell.veraltet = false;
    modell.verworfen = false;
    var ok = speichern();
    aktualisiere();
    if (flussApi) flussApi.gehe(5, false);
    fokusAuf(refs.ergebnis);
    ansage(ok
      ? "Auswertung fertig. " + ergebnisSatz(modell.letzteAuswertung)
      : "Die Auswertung wurde nicht gespeichert. " + SCHREIBFEHLER);
  }

  function abschliessen() {
    var a = b2.auswertung(modell.eingaben);
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
    ansage("Übungsfall B02 abgeschlossen. Es wurde keine echte Bescheinigung ausgestellt.");
  }

  function fuelleAuswertung(host) {
    leeren(host);
    var a = modell.letzteAuswertung;

    var ergTitel = el("h4", "", "Ergebnis");
    ergTitel.id = "b2-ergebnis";
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
      b2.BEREICHE.forEach(function (b) {
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
      b2.BEREICHE.forEach(function (b) {
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
    entwurf.appendChild(el("p", "rathaus-meta", "Nicht automatisch geprüft – Rückmeldung durch die Lehrkraft"));
    var entwurfText = el("p", "rathaus-entwurf", modell.eingaben.freitext);
    entwurf.appendChild(entwurfText);
    entwurf.hidden = !modell.eingaben.freitext.trim();
    refs.entwurfBox = entwurf;
    refs.entwurfText = entwurfText;
    host.appendChild(entwurf);

    var frei = Boolean(a && a.darfAbschliessen === true && !modell.abgeschlossen);
    var status;
    if (modell.abgeschlossen) {
      status = el("p", "rathaus-ok", "✓ Übungsfall abgeschlossen. Das ist nur eine Übung: Es wurde keine echte Bescheinigung ausgestellt und nichts an eine Behörde übermittelt.");
      status.id = "b2-abschluss-titel";
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
    if (!status.id) status.id = "b2-abschluss-status";
    var abschluss = knopf("Übungsfall abschließen", "knopf knopf-haupt", abschliessen);
    abschluss.id = "b2-abschluss-knopf";
    abschluss.disabled = !frei;
    abschluss.setAttribute("aria-describedby", status.id);
    var zeile = el("div", "rathaus-abschluss");
    zeile.appendChild(abschluss);
    zeile.appendChild(status);
    host.appendChild(zeile);
  }

  function aktualisiere() {
    if (refs.verworfen) refs.verworfen.hidden = !modell.verworfen;
    if (refs.schritte) fuelleSchritte(refs.schritte);
    if (refs.auswertung) fuelleAuswertung(refs.auswertung);
    zeigeLichter();
    if (flussApi) flussApi.aktualisiere();
  }

  // Frageblock-Lichter: nur für Blöcke mit gespeichertem, zur Antwort passendem Auswertungsstand.
  function registriereLicht(set, key) {
    set.setAttribute("data-licht-feld", key);
    refs.lichtSets = (refs.lichtSets || []).filter(function (e) { return e.key !== key; });
    refs.lichtSets.push({ set: set, key: key });
  }

  function zeigeLichter() {
    var L = window.RATHAUS_LICHTER;
    if (!L || !refs.lichtSets || typeof b2.lichtFelder !== "function") return;
    var felder = b2.lichtFelder();
    var antworten = b2.lichtAntworten(modell.eingaben);
    var stand = modell.lichtStand || {};
    refs.lichtSets.forEach(function (e) { L.zeigeFeld(e.set, felder[e.key], antworten[e.key], stand[e.key]); });
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
    zu.setAttribute("aria-controls", "b2-hilfe-bereich");
    zu.setAttribute("aria-expanded", hilfeStufe > 0 ? "true" : "false");
    var reihe = el("div", "knopf-reihe");
    reihe.append(mehr, weniger, zu);
    host.appendChild(reihe);
    var bereich = el("div", "rathaus-hilfe");
    bereich.id = "b2-hilfe-bereich";
    bereich.setAttribute("role", "region");
    bereich.setAttribute("aria-label", "Hilfe");
    bereich.hidden = hilfeStufe <= 0;
    if (hilfeStufe > 0) {
      bereich.appendChild(el("p", "rathaus-meta", "Hilfestufe " + hilfeStufe + " von 3"));
      bereich.appendChild(el("p", "rathaus-hinweis", b2.hilfe(hilfeStufe)));
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
    var ja = typeof window.confirm === "function" ? window.confirm(b2.resetText()) : false;
    if (!ja) {
      ansage("Zurücksetzen abgebrochen. Es wurde nichts geändert.");
      return;
    }
    try {
      window.localStorage.removeItem(b2.SPEICHER_SCHLUESSEL);
      if (window.RATHAUS_AUFGABENFLUSS) window.RATHAUS_AUFGABENFLUSS.loescheSchritt("b02");
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
    ansage("Fall B02 wurde zurückgesetzt.");
  }

  // ---------- Ansicht ----------

  function zeichneKarte(host) {
    var karte = b2.nachschlagen();
    var box = el("section", "rathaus-etappe");
    box.appendChild(el("h3", "", karte.titel));
    aufklappbar(box, "b2-karte", "Nachschlagekarte öffnen", "Nachschlagekarte schließen", function () {
      var inhalt = el("div", "");
      karte.themen.forEach(function (thema) {
        var abschnitt = el("section", "rathaus-nachschlag-abschnitt");
        abschnitt.appendChild(el("h4", "", thema.titel));
        abschnitt.appendChild(el("p", "", thema.text));
        inhalt.appendChild(abschnitt);
      });
      inhalt.appendChild(el("p", "rathaus-hinweis", karte.quelle));
      inhalt.appendChild(el("p", "rathaus-meta", "Die Nachschlagekarte verändert keinen Fallstand."));
      return inhalt;
    });
    host.appendChild(box);
  }


  function legeInFluss(zielHost, gebaut, daten) {
    var fluss = window.RATHAUS_AUFGABENFLUSS;
    var kinder = Array.prototype.slice.call(gebaut.children);
    var etappen = kinder.filter(function (k) {
      return k.className === "rathaus-etappe" && k.children[0] && /^\d+\./.test(k.children[0].textContent || "");
    });
    var hilfe = kinder.filter(function (k) { return k.children[0] && k.children[0].textContent === "Hilfe"; })[0];
    var schrittHinweis = el("p", "rathaus-meta", "");
    if (hilfe) hilfe.appendChild(schrittHinweis);
    var schrittTexte = [
      "Geht es um die eigene Person oder um jemand anderen?",
      "Vergleiche Ausweis, Antrag und Übungsregister, bevor du den Stand festlegst.",
      "Umfang, Regel und Aussage sind drei verschiedene Fragen.",
      "Vorbereiten heißt nicht aushändigen.",
      "Die Bausteine müssen zum Antrag passen. Der eigene Entwurf wird nicht automatisch bewertet.",
      "Die Auswertung zeigt den Stand. Sie ersetzt nicht die Lehrkraftlösung."
    ];
    var reset = kinder.filter(function (k) { return k.children[0] && k.children[0].textContent === "Zurücksetzen"; })[0];
    var karte = kinder.filter(function (k) {
      return k.className === "rathaus-etappe" && etappen.indexOf(k) < 0 && k !== hilfe && k !== reset;
    });
    var vor = kinder.filter(function (k) {
      return k.className === "rathaus-meta" || k.className === "rathaus-hinweis" || k.className === "rathaus-fehler" ||
        k.getAttribute("role") === "alert" || k.getAttribute("role") === "status";
    });
    flussApi = fluss.mount(zielHost, {
      fallId: "b02",
      kicker: "Bürgerbüro · Fall B02",
      titel: "Fall B02: " + daten.titel,
      bewertete: b2.BEREICHE.length,
      richtig: function () {
        var a = modell.letzteAuswertung;
        if (!a) return 0;
        return b2.BEREICHE.filter(function (bereich) { return a.bereiche[bereich.key] && a.bereiche[bereich.key].status === "richtig"; }).length;
      },
      bereichStatus: function (schritt, i) {
        if (i >= b2.BEREICHE.length) return modell.abgeschlossen ? "abgeschlossen" : "Auswertung";
        var L = window.RATHAUS_LICHTER;
        var felder = b2.lichtFelder();
        var licht = L ? L.gruppenStand(L.erweitere(b2.BEREICHE[i].felder, felder), felder, b2.lichtAntworten(modell.eingaben), modell.lichtStand) : "ungeprueft";
        if (licht === "veraltet") return "Bewertung veraltet";
        if (licht === "richtig") return "Richtig";
        if (licht === "fehler") return "Noch nicht richtig";
        if (!modell.letzteAuswertung) return "noch nicht geprüft";
        return STATUSWORT[modell.letzteAuswertung.bereiche[b2.BEREICHE[i].key].status] || "offen";
      },
      rueckmeldung: function (schritt, i) {
        if (i >= b2.BEREICHE.length) return null;
        var L = window.RATHAUS_LICHTER;
        var felder = b2.lichtFelder();
        var licht = L ? L.gruppenStand(L.erweitere(b2.BEREICHE[i].felder, felder), felder, b2.lichtAntworten(modell.eingaben), modell.lichtStand) : "ungeprueft";
        if (licht === "veraltet") return { hinweise: ["Bewertung veraltet. Die alte Rückmeldung dieses Schritts gilt nicht mehr."], mehrfach: [] };
        var a = modell.letzteAuswertung || modell.anzeigeAuswertung;
        if (!a) return null;
        var b = a.bereiche[b2.BEREICHE[i].key];
        if (!b) return null;
        var ergebnis = { hinweise: (b.hinweise || []).slice(), mehrfach: [] };
        var gruppeKat = b2.katalog()[b2.BEREICHE[i].key];
        var auswahl = modell.eingaben[b2.BEREICHE[i].key];
        if (gruppeKat && Array.isArray(auswahl) && gruppeKat.optionen && gruppeKat.optionen.every(function (o) { return typeof o.richtig === "boolean"; })) {
          var gewaehlt = gruppeKat.optionen.filter(function (o) { return auswahl.indexOf(o.id) !== -1; });
          ergebnis.mehrfach.push({
            frage: "Deine Auswahl",
            richtig: gewaehlt.filter(function (o) { return o.richtig; }).map(function (o) { return o.text; }),
            falsch: gewaehlt.filter(function (o) { return !o.richtig; }).map(function (o) { return o.text; }),
            fehlt: gruppeKat.optionen.filter(function (o) { return o.richtig && auswahl.indexOf(o.id) === -1; }).map(function (o) { return o.text; })
          });
        }
        return ergebnis;
      },
      schritte: etappen.map(function (box, i) {
        return { id: (b2.BEREICHE[i] && b2.BEREICHE[i].key) || "auswertung", name: ETAPPEN[i], panel: box };
      }),
      vorKarte: function (box) { vor.forEach(function (k) { box.appendChild(k); }); },
      hilfeKnoten: hilfe,
      hilfeAktualisieren: function () { schrittHinweis.textContent = schrittTexte[flussApi.schritt()] || ""; },
      untenKnoten: [reset],
      akte: { titel: "Fallakte", fuellen: function (panel) {
        panel.appendChild(el("p", "rathaus-meta", "Unterlagen und Nachschlagekarte bleiben erreichbar. Die Bearbeitung geht nicht verloren."));
        DOKUMENTE.forEach(function (d) {
          aufklappbar(panel, "b2-akte-" + d.id, "Akte: " + d.text, "Akte schließen: " + d.text, function () {
            return el("p", "", d.inhalt);
          });
        });
        karte.forEach(function (k) { panel.appendChild(k); });
      } }
    });
    refs.titel = flussApi.titel;
  }

  function zeichne(zielHost, ctx) {
    refs = { etappen: {} };
    merkHost = zielHost;
    merkKontext = ctx;
    if (!b2) {
      zielHost.appendChild(el("p", "rathaus-fehler", "Der Fall B02 ist gerade nicht verfügbar."));
      return;
    }
    if (!modell) modell = laden();
    var daten = b2.fallDaten();
    var bau = el("div", "");

    var h = el("h2", "", "Fall B02: " + daten.titel);
    h.id = "ansicht-titel";
    h.tabIndex = -1;
    refs.titel = h;
    bau.appendChild(h);
    bau.appendChild(el("p", "rathaus-meta", "Fiktive Übung mit erfundener Person. Es wird keine echte Bescheinigung ausgestellt."));
    bau.appendChild(el("p", "rathaus-hinweis", daten.uebungsannahme));
    bau.appendChild(el("p", "rathaus-hinweis", daten.hinweis));

    refs.fehler = el("p", "rathaus-fehler", speicherMeldung);
    refs.fehler.setAttribute("role", "alert");
    zeigeFehler();
    bau.appendChild(refs.fehler);

    refs.verworfen = el("p", "rathaus-hinweis", VERWORFEN_HINWEIS);
    refs.verworfen.id = "b2-verworfen-hinweis";
    refs.verworfen.setAttribute("role", "status");
    refs.verworfen.hidden = !modell.verworfen;
    bau.appendChild(refs.verworfen);

    refs.status = el("p", "nur-lesen");
    refs.status.setAttribute("role", "status");
    refs.status.setAttribute("aria-live", "polite");
    refs.status.setAttribute("aria-atomic", "true");
    bau.appendChild(refs.status);

    refs.schritte = el("nav", "rathaus-fortschritt");
    refs.schritte.setAttribute("aria-label", "Bereiche im Fall B02");
    bau.appendChild(refs.schritte);

    // 1 Anliegen
    var e1 = etappe(bau, 1, "Höre zu, stelle Rückfragen und halte fest, worum es geht.");
    if (window.RATHAUS_AUFGABENFLUSS && window.RATHAUS_AUFGABENFLUSS.grundlagen) {
      // Grundlagen vor der ersten bewerteten Frage. Texte stammen unverändert aus der vorhandenen B02-Karte.
      var karteB2 = b2.nachschlagen();
      e1.appendChild(window.RATHAUS_AUFGABENFLUSS.grundlagen({
        id: "b2",
        einfuehrung: "Bevor du entscheidest: Lies zuerst, worum es bei einer Meldebescheinigung geht. Die Fragen weiter unten werden bewertet.",
        themen: karteB2.themen.map(function (t) { return { titel: t.titel, text: t.text }; }),
        bedeutung: "Eine Meldebescheinigung wird auf Antrag erteilt und hängt an Identität und Umfang der Angaben.",
        beispiel: "Eine Person beantragt eine Bescheinigung über die eigenen Meldedaten. Das ist nicht dieselbe Sache wie die Anmeldung nach einem Einzug. Die Einzelheiten stehen in der Nachschlagekarte.",
        hinweis: karteB2.quelle + " Die Nachschlagekarte bleibt während der Aufgabe nachschlagbar."
      }));
    }
    e1.appendChild(el("p", "rathaus-gespraech", "Alex Weber sagt: „" + daten.anliegenText + "“"));
    e1.appendChild(el("h4", "", "Rückfragen stellen"));
    FRAGEN.forEach(function (f) {
      aufklappbar(e1, "b2-frage-" + f.id, "Frage: " + f.frage, "Antwort ausblenden: " + f.frage, function () {
        return el("p", "rathaus-antwort", "Alex Weber antwortet: „" + f.antwort + "“");
      });
    });
    einzelGruppe(e1, "anliegen", "Worum geht es bei dem Anliegen?", "Wähle genau eine Antwort.");

    // 2 Unterlagen
    var e2 = etappe(bau, 2, "Öffne jede Unterlage, vergleiche die Angaben und prüfe die Identität.");
    DOKUMENTE.forEach(function (d) {
      aufklappbar(e2, "b2-dok-" + d.id, d.text + " öffnen", d.text + " schließen", function () {
        var artikel = el("article", "rathaus-dokument-inhalt");
        artikel.appendChild(el("h4", "", d.text));
        artikel.appendChild(el("p", "", d.inhalt));
        return artikel;
      });
    });
    var angaben = b2.katalog().angaben;
    e2.appendChild(el("p", "rathaus-meta", angaben.frage));
    angaben.optionen.forEach(function (zeile) {
      var set = gruppe(e2, "b2-angaben-" + zeile.id, zeile.text + ": Stand der Angabe", null, "angaben." + zeile.id);
      angaben.status.forEach(function (s) {
        option(set, "radio", "b2-angaben-" + zeile.id, s.id, s.text, modell.eingaben.angaben[zeile.id] === s.id, function () {
          modell.eingaben.angaben[zeile.id] = s.id;
          eingabeGeaendert();
        });
      });
    });
    einzelGruppe(e2, "identitaet", b2.katalog().identitaet.frage, "Wähle genau eine Antwort.");

    // 3 Regeln
    var e3 = etappe(bau, 3, "Ordne Umfang, Regeln und Rechtsgrundlage ein. Die Nachschlagekarte unten hilft dabei.");
    einzelGruppe(e3, "umfang", b2.katalog().umfang.frage, "Wähle genau eine Antwort.");
    mehrfachGruppe(e3, "regeln", b2.katalog().regeln.frage, "Du kannst mehrere ankreuzen.");
    einzelGruppe(e3, "aussagen", b2.katalog().aussagen.frage, "Wähle genau eine Antwort. Wenn keine Aussage stimmt, wähle ausdrücklich die letzte Option.");

    // 4 Vorbereitung
    var e4 = etappe(bau, 4, "Entscheide, was du für die weitere Bearbeitung vorbereitest. Vorbereiten heißt nicht aushändigen.");
    einzelGruppe(e4, "vorbereitung", b2.katalog().vorbereitung.frage, "Wähle genau eine Antwort.");

    // 5 Antwort
    var e5 = etappe(bau, 5, "Stelle die Antwort an Alex Weber aus Bausteinen zusammen. Eigenen Text kannst du zusätzlich schreiben.");
    mehrfachGruppe(e5, "bausteine", b2.katalog().bausteine.frage, "Du kannst mehrere ankreuzen.");
    var feldName = el("label", "rathaus-feldname", "Eigener Antwortentwurf (freiwillig)");
    feldName.setAttribute("for", "b2-freitext");
    e5.appendChild(feldName);
    var feld = document.createElement("textarea");
    feld.id = "b2-freitext";
    feld.name = "freitext";
    feld.rows = 4;
    feld.className = "rathaus-freitext-gross";
    feld.maxLength = 2000;
    feld.value = modell.eingaben.freitext;
    feld.setAttribute("aria-describedby", "b2-freitext-hilfe");
    feld.addEventListener("input", function () {
      modell.eingaben.freitext = String(feld.value).slice(0, 2000);
      eingabeGeaendert();
      if (refs.entwurfText) refs.entwurfText.textContent = modell.eingaben.freitext;
      if (refs.entwurfBox) refs.entwurfBox.hidden = !modell.eingaben.freitext.trim();
    });
    e5.appendChild(feld);
    var feldHilfe = el("p", "rathaus-meta", "Nicht automatisch geprüft – Rückmeldung durch die Lehrkraft. Der Text wird gespeichert und angezeigt, aber nicht bewertet.");
    feldHilfe.id = "b2-freitext-hilfe";
    e5.appendChild(feldHilfe);

    // 6 Auswertung
    var e6 = etappe(bau, 6, "Lass deine Eingaben prüfen. Danach kannst du den Übungsfall abschließen.");
    refs.auswertung = el("div", "rathaus-auswertung");
    e6.appendChild(refs.auswertung);

    // Hilfe und Karte
    var hilfeBox = el("section", "rathaus-etappe");
    hilfeBox.appendChild(el("h3", "", "Hilfe"));
    hilfeBox.appendChild(el("p", "rathaus-meta", "Drei Stufen, von allgemein bis konkret. Eine fertige Antwort gibt es hier nicht."));
    var hilfeHost = el("div", "");
    fuelleHilfe(hilfeHost);
    hilfeBox.appendChild(hilfeHost);
    bau.appendChild(hilfeBox);
    zeichneKarte(bau);

    // Zurücksetzen und Rückweg
    var reset = el("section", "rathaus-etappe");
    reset.appendChild(el("h3", "", "Zurücksetzen"));
    reset.appendChild(knopf("Fall B02 zurücksetzen", "knopf knopf-warn", zuruecksetzen));
    bau.appendChild(reset);

    if (window.RATHAUS_AUFGABENFLUSS) legeInFluss(zielHost, bau, daten);
    else { while (bau.firstChild) zielHost.appendChild(bau.firstChild); }
    aktualisiere();
  }

  // Block für die Lehrkraftansicht: ohne Schreibzugriff.
  function zeichneLehrkraft(host) {
    if (!b2) return;
    var l = b2.lehrkraft();
    host.appendChild(el("h3", "", "Bürgerbüro B02: Alex Weber"));
    host.appendChild(el("p", "rathaus-hinweis", l.warnung));
    host.appendChild(el("p", "rathaus-meta", "Bewertungsstand " + b2.BEWERTUNGSSTAND));
    host.appendChild(el("h4", "", "Sachverhalt"));
    host.appendChild(el("p", "", l.sachverhalt));
    host.appendChild(el("h4", "", "Lernziele"));
    liste(host, l.lernziele);
    host.appendChild(el("h4", "", "Typische Fehler"));
    liste(host, l.typischeFehler);
    host.appendChild(el("h4", "", "Musterlösung je Feld"));
    liste(host, l.loesungen.map(function (x) { return x.feld + ": " + x.richtig + " (Bezug: " + x.bezug + ")"; }));
    host.appendChild(el("h4", "", "Musterantwort (Übungslösung, nicht verbindlich)"));
    host.appendChild(el("p", "", l.musterantwort));
    host.appendChild(el("h4", "", "Bewertungskriterien"));
    liste(host, l.kriterien);
    host.appendChild(el("h4", "", "Rechtsquellen und Grenzen"));
    liste(host, l.quellen.normen.concat(["Quelldatei: " + l.quellen.datei]));
    host.appendChild(el("p", "rathaus-hinweis", l.quellen.uebungsannahme));
    host.appendChild(el("p", "rathaus-hinweis", l.quellen.luecke));
  }

  window.RATHAUS_B02_UI = { zeichne: zeichne, zeichneLehrkraft: zeichneLehrkraft };
})();
