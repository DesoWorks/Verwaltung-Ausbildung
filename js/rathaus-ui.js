/* Oberfläche des virtuellen Rathauses. Speichert nur einen lokalen Testzustand. */
(function () {
  "use strict";

  var KEY = "verwaltung-ausbildung.rathaus.v1";
  var KEY_HOCHBETRIEB = "verwaltung-ausbildung.rathaus.hochbetrieb.v1";
  var kernLuca = window.RATHAUS_KERN;
  var kernHochbetrieb = window.RATHAUS_HOCHBETRIEB || null;
  var kern = kernLuca;
  // Ohne gespeicherte Wahl gilt der erste Vorgang.
  var aktiverFall = "luca";
  var navi = window.RATHAUS_NAVIGATION;
  var fall = kern.fallDaten();
  var katalog = kern.katalog();
  // Wahr, solange eine Ansicht nur über den Hash geöffnet wird: das erledigt keinen Lernschritt.
  var ohneSchritt = false;

  var state = {
    ansicht: "stadt",
    gelesen: false,
    akteGelesen: false,
    entscheidung: "",
    gruende: [],
    antwort: "",
    letzteAuswertung: null,
    abgeschlossen: false,
    hilfeStufe: 0,
    lehrkraft: false,
    versuche: 0,
    veraltetHinweis: false,
    // Wahr, wenn nach einer Auswertung Eingaben geändert wurden. Wird nicht gespeichert.
    eingabenGeaendert: false
  };

  function schluessel() {
    return aktiverFall === "noelle" ? KEY_HOCHBETRIEB : KEY;
  }

  function setzeFall(id) {
    aktiverFall = (id === "noelle" && kernHochbetrieb) ? "noelle" : "luca";
    kern = aktiverFall === "noelle" ? kernHochbetrieb : kernLuca;
    fall = kern.fallDaten();
    katalog = kern.katalog();
  }

  function rohLesen(key) {
    try {
      var roh = window.localStorage.getItem(key);
      if (!roh) return null;
      var daten = JSON.parse(roh);
      return (daten && typeof daten === "object") ? daten : null;
    } catch (fehler) {
      return null;
    }
  }

  // Der alte Schlüssel behält den Zustand des ersten Vorgangs. Er trägt zusätzlich die Wahl des aktiven Vorgangs.
  function merkeAktivenFall() {
    var alt = rohLesen(KEY) || {};
    if (aktiverFall === "noelle") alt.aktiverFall = "noelle";
    else delete alt.aktiverFall;
    window.localStorage.setItem(KEY, JSON.stringify(alt));
  }

  function neuerZustand() {
    state.gelesen = false;
    state.akteGelesen = false;
    state.entscheidung = "";
    state.gruende = [];
    state.antwort = "";
    state.letzteAuswertung = null;
    state.abgeschlossen = false;
    state.veraltetHinweis = false;
    state.eingabenGeaendert = false;
    state.hilfeStufe = 0;
    state.versuche = 0;
  }

  function laden() {
    var alt = rohLesen(KEY);
    setzeFall(alt && alt.aktiverFall === "noelle" ? "noelle" : "luca");
    anwenden(aktiverFall === "noelle" ? rohLesen(KEY_HOCHBETRIEB) : alt);
  }

  function anwenden(daten) {
    try {
      if (!daten) return;
      var bereinigt = kern.bereinigeGespeichert(daten);
      ["ansicht", "gelesen", "akteGelesen", "entscheidung", "antwort", "abgeschlossen", "hilfeStufe", "lehrkraft", "versuche"].forEach(function (feld) {
        if (bereinigt[feld] !== undefined) state[feld] = bereinigt[feld];
      });
      if (Array.isArray(bereinigt.gruende)) state.gruende = bereinigt.gruende.slice();
      state.letzteAuswertung = bereinigt.letzteAuswertung;
      var hatteErgebnis = Boolean(daten.letzteAuswertung) || daten.abgeschlossen === true;
      state.veraltetHinweis = bereinigt.verworfen && hatteErgebnis;
    } catch (fehler) {
      state.ansicht = "stadt";
    }
  }

  function speichern() {
    var kopie = {
      ansicht: state.ansicht,
      gelesen: state.gelesen,
      akteGelesen: state.akteGelesen,
      entscheidung: state.entscheidung,
      gruende: state.gruende.slice(),
      antwort: state.antwort,
      letzteAuswertung: state.letzteAuswertung,
      abgeschlossen: state.abgeschlossen,
      bewertungsstand: kern.BEWERTUNGSSTAND,
      hilfeStufe: state.hilfeStufe,
      lehrkraft: state.lehrkraft,
      versuche: state.versuche
    };
    window.localStorage.setItem(schluessel(), JSON.stringify(kopie));
    if (aktiverFall === "noelle" || (rohLesen(KEY) || {}).aktiverFall) merkeAktivenFall();
  }

  // Speichert den aktiven Vorgang und lädt den gewählten. Die Lehrkraftwahl bleibt.
  function aktiviereFall(id) {
    speichern();
    var lehrkraft = state.lehrkraft;
    setzeFall(id);
    neuerZustand();
    anwenden(rohLesen(schluessel()));
    state.lehrkraft = lehrkraft;
  }

  function wechsleFall(id) {
    if (!kernHochbetrieb || (id === "noelle") === (aktiverFall === "noelle")) return;
    aktiviereFall(id);
    state.ansicht = "personal";
    speichern();
    zeichnen();
    fokus("ansicht-titel");
  }

  // Öffnet die Nachricht genau eines Vorgangs. Der andere Vorgang bleibt unverändert.
  function oeffneNachricht(id) {
    if (kernHochbetrieb && (id === "noelle") !== (aktiverFall === "noelle")) aktiviereFall(id);
    state.gelesen = true;
    zeige("vorgang");
  }

  function nachrichtGelesen(id) {
    if ((id === "noelle") === (aktiverFall === "noelle")) return state.gelesen;
    var roh = rohLesen(id === "noelle" ? KEY_HOCHBETRIEB : KEY);
    return Boolean(roh && roh.gelesen === true);
  }

  function el(tag, klasse, text) {
    var knoten = document.createElement(tag);
    if (klasse) knoten.className = klasse;
    if (text !== undefined) knoten.textContent = text;
    return knoten;
  }

  function leeren(knoten) {
    while (knoten.firstChild) knoten.removeChild(knoten.firstChild);
  }

  function fokus(id) {
    window.setTimeout(function () {
      var ziel = document.getElementById(id);
      if (ziel) ziel.focus();
    }, 0);
  }

  function zeige(ansicht) {
    state.ansicht = ansicht;
    speichern();
    zeichnen();
    fokus("ansicht-titel");
  }

  function schritte() {
    return [
      { nr: 1, label: "Nachricht lesen", done: state.gelesen },
      { nr: 2, label: "Akte öffnen", done: state.akteGelesen },
      { nr: 3, label: "Entscheiden", done: Boolean(state.entscheidung) },
      { nr: 4, label: "Begründen", done: state.gruende.length > 0 },
      { nr: 5, label: "Antwort schreiben", done: state.antwort.trim().length >= 40 },
      { nr: 6, label: "Auswertung", done: Boolean(state.letzteAuswertung) },
      { nr: 7, label: "Abschließen", done: state.abgeschlossen }
    ];
  }

  // Die Sieben-Schritte-Anzeige gehört zum aktiven Vorgang und erscheint nur in dessen Ansichten.
  function fortschritt(ziel) {
    var liste = schritte();
    var fertig = liste.filter(function (schritt) { return schritt.done; }).length;
    var name = fall.person.name;
    var kopf = el("section", "rathaus-fortschritt");
    kopf.setAttribute("aria-label", "Fortschritt im Vorgang von " + name);
    kopf.appendChild(el("p", "rathaus-fortschritt-kopf", "Aktiver Vorgang: " + name));
    var text = el("p", "rathaus-fortschritt-text", fertig + " von 7 Schritten erledigt");
    kopf.appendChild(text);
    var leiste = el("ol", "rathaus-schritte");
    liste.forEach(function (schritt) {
      var punkt = el("li", schritt.done ? "ist-fertig" : "", schritt.nr + ". " + schritt.label);
      punkt.appendChild(el("span", "nur-lesen", schritt.done ? " – erledigt" : " – offen"));
      leiste.appendChild(punkt);
    });
    kopf.appendChild(leiste);
    ziel.appendChild(kopf);
  }

  // Zeichnet die Schrittanzeige nur, wenn die Ansicht zu einem einzelnen Vorgang gehört.
  function zeichneFortschritt(host) {
    leeren(host);
    var sichtbar = navi.fortschrittSichtbar(state.ansicht);
    host.hidden = !sichtbar;
    if (sichtbar) fortschritt(host);
  }

  // Eine Ansage pro Ereignis über die dauerhafte Statusregion außerhalb des neu gezeichneten Inhalts.
  // Erst leeren, dann mit kurzer Verzögerung füllen, damit auch gleiche Texte erneut vorgelesen werden.
  function ansage(nachricht) {
    var host = document.getElementById("rathaus-ansage");
    if (!host) return;
    if (ansageTimer && typeof window.clearTimeout === "function") window.clearTimeout(ansageTimer);
    host.textContent = "";
    ansageTimer = window.setTimeout(function () { host.textContent = nachricht; }, 80);
  }

  function auswertungAnsage(ergebnis) {
    var teile = teilbewertungen(ergebnis);
    var einzeln = teile.map(function (teil) {
      var wort = teil.wert === true ? "richtig" : (teil.wert === false ? "noch nicht richtig" : "noch nicht geprüft");
      return teil.name + " " + wort + ".";
    }).join(" ");
    return "Auswertung fertig. " + einzeln + " " + ergebnisSatz(teile, ergebnis);
  }

  function bereichskarte(titel, text, status, aktiv) {
    var karte = el("article", "rathaus-karte" + (aktiv ? " ist-aktiv" : " ist-vorschau"));
    karte.appendChild(el("h3", "", titel));
    karte.appendChild(el("p", "", text));
    karte.appendChild(el("p", "rathaus-status", status));
    return karte;
  }

  function zeichneStadt(ziel) {
    ziel.appendChild(el("h2", "", "Stadtverwaltung Sonnenthal", "ansicht-titel"));
    ziel.querySelector("h2").id = "ansicht-titel";
    ziel.querySelector("h2").tabIndex = -1;
    ziel.appendChild(el("p", "rathaus-einleitung", "Willkommen in der Übungsstadt. Alles hier ist erfunden. Du bearbeitest Vorgänge im Personalamt, ohne echte Personen und ohne Netzwerk."));
    var skyline = el("div", "rathaus-skyline");
    skyline.setAttribute("aria-hidden", "true");
    ["turm", "haus", "rathaus", "haus", "turm"].forEach(function (art) {
      skyline.appendChild(el("span", "gebaeude gebaeude-" + art));
    });
    ziel.appendChild(skyline);
    var raster = el("div", "rathaus-raster");
    navi.aemter().forEach(function (amt) {
      if (amt.benutzbar) {
        var karte = bereichskarte(amt.titel, amt.beschreibung, "Benutzbar", true);
        var knopf = el("button", "knopf knopf-haupt", amt.titel + " öffnen");
        knopf.type = "button";
        knopf.addEventListener("click", function () { zeige(amt.ansicht); });
        karte.appendChild(knopf);
        raster.appendChild(karte);
      } else {
        raster.appendChild(bereichskarte(amt.titel, amt.beschreibung + " Dieses Amt ist noch geschlossen.", "Vorschau", false));
      }
    });
    ziel.appendChild(raster);
  }

  function zeichnePersonal(ziel) {
    var titel = el("h2", "", "Personalamt");
    titel.id = "ansicht-titel";
    titel.tabIndex = -1;
    ziel.appendChild(titel);
    ziel.appendChild(el("p", "", "Hier liegen Ausbildungsakten und der Posteingang. Der Stil im Vorgang ist sachlich. Die Stadtansicht darf freundlich bleiben."));
    var reihe = el("div", "knopf-reihe");
    var post = el("button", "knopf knopf-haupt", "Posteingang öffnen");
    post.type = "button";
    post.addEventListener("click", function () { zeige("post"); });
    var akte = el("button", "knopf", "Ausbildungsakte öffnen");
    akte.type = "button";
    akte.addEventListener("click", function () {
      state.akteGelesen = true;
      zeige("akte");
    });
    reihe.append(post, akte);
    ziel.appendChild(reihe);
    var nachschlagen = el("button", "knopf", "Nachschlagekarte öffnen");
    nachschlagen.type = "button";
    nachschlagen.addEventListener("click", function () { zeige("nachschlagen"); });
    reihe.appendChild(nachschlagen);
    if (kernHochbetrieb) {
      ziel.appendChild(el("h3", "", "Vorgang wählen"));
      ziel.appendChild(el("p", "rathaus-meta", "Jeder Vorgang hat einen eigenen Stand. Beim Wechsel geht nichts verloren."));
      var wahl = el("div", "knopf-reihe");
      wahl.setAttribute("role", "group");
      wahl.setAttribute("aria-label", "Vorgang wählen");
      [["luca", kernLuca], ["noelle", kernHochbetrieb]].forEach(function (paar, index) {
        var daten = paar[1].fallDaten();
        var knopf = el("button", "knopf" + (aktiverFall === paar[0] ? " knopf-haupt" : ""), "Vorgang " + (index + 1) + ": " + daten.person.name);
        knopf.type = "button";
        knopf.setAttribute("aria-pressed", aktiverFall === paar[0] ? "true" : "false");
        knopf.addEventListener("click", function () { wechsleFall(paar[0]); });
        wahl.appendChild(knopf);
      });
      ziel.appendChild(wahl);
      ziel.appendChild(el("p", "", "Aktueller Vorgang: " + fall.betreff));
    }
  }

  // Nachschlagekarte: nur Lesen. Verändert weder Lesestand noch Schritte noch Entwurf.
  function zeichneNachschlagen(ziel) {
    var daten = window.RATHAUS_NACHSCHLAGEN ? window.RATHAUS_NACHSCHLAGEN.karte() : null;
    var titel = el("h2", "", daten ? daten.titel : "Nachschlagen");
    titel.id = "ansicht-titel";
    titel.tabIndex = -1;
    ziel.appendChild(titel);
    if (!daten) {
      ziel.appendChild(el("p", "", "Die Nachschlagekarte ist gerade nicht verfügbar."));
    } else {
      ziel.appendChild(el("p", "rathaus-einleitung", daten.einleitung));
      var inhalt = el("nav", "knopf-reihe");
      inhalt.setAttribute("aria-label", "Inhalt der Nachschlagekarte");
      daten.abschnitte.forEach(function (abschnitt) {
        var sprung = el("button", "knopf", abschnitt.titel);
        sprung.type = "button";
        sprung.addEventListener("click", function () {
          var kopf = document.getElementById("nachschlagen-" + abschnitt.id);
          if (kopf) kopf.focus();
        });
        inhalt.appendChild(sprung);
      });
      ziel.appendChild(inhalt);
      daten.abschnitte.forEach(function (abschnitt) {
        var box = el("section", "rathaus-nachschlag-abschnitt");
        var kopf = el("h3", "", abschnitt.titel);
        kopf.id = "nachschlagen-" + abschnitt.id;
        kopf.tabIndex = -1;
        box.appendChild(kopf);
        abschnitt.absaetze.forEach(function (text) { box.appendChild(el("p", "", text)); });
        if (abschnitt.punkte.length) {
          var liste = el("ul", "");
          abschnitt.punkte.forEach(function (text) { liste.appendChild(el("li", "", text)); });
          box.appendChild(liste);
        }
        ziel.appendChild(box);
      });
      ziel.appendChild(el("p", "rathaus-hinweis", daten.quelle));
      ziel.appendChild(el("p", "rathaus-meta", daten.grenze));
    }
    var zurueck = el("button", "knopf", "Zurück zum Personalamt");
    zurueck.type = "button";
    zurueck.addEventListener("click", function () { zeige("personal"); });
    ziel.appendChild(zurueck);
  }

  function zeichnePost(ziel) {
    var titel = el("h2", "", "Posteingang");
    titel.id = "ansicht-titel";
    titel.tabIndex = -1;
    ziel.appendChild(titel);
    var eintraege = kernHochbetrieb ? [["luca", kernLuca], ["noelle", kernHochbetrieb]] : [["luca", kernLuca]];
    eintraege.forEach(function (paar) {
      var daten = paar[1].fallDaten();
      var gelesen = nachrichtGelesen(paar[0]);
      var karte = el("article", "rathaus-vorgangskarte");
      karte.appendChild(el("p", "rathaus-meta", (gelesen ? "Gelesen · " : "Neu · ") + daten.betreff));
      karte.appendChild(el("p", "", "Von: " + daten.von));
      karte.appendChild(el("p", "", "An: " + daten.an));
      var lesen = el("button", "knopf knopf-haupt", gelesen ? "Nachricht erneut lesen" : "Nachricht lesen");
      lesen.type = "button";
      lesen.setAttribute("aria-label", (gelesen ? "Nachricht erneut lesen: " : "Nachricht lesen: ") + daten.betreff);
      lesen.addEventListener("click", function () { oeffneNachricht(paar[0]); });
      karte.appendChild(lesen);
      ziel.appendChild(karte);
    });
    var zurueck = el("button", "knopf", "Zurück zum Personalamt");
    zurueck.type = "button";
    zurueck.addEventListener("click", function () { zeige("personal"); });
    ziel.appendChild(zurueck);
  }

  function zeichneAkte(ziel) {
    var titel = el("h2", "", "Ausbildungsakte");
    titel.id = "ansicht-titel";
    titel.tabIndex = -1;
    ziel.appendChild(titel);
    if (!ohneSchritt) state.akteGelesen = true;
    var liste = el("dl", "rathaus-akte");
    function zeile(name, wert) {
      liste.appendChild(el("dt", "", name));
      liste.appendChild(el("dd", "", wert));
    }
    zeile("Name", fall.person.name + " (fiktiv)");
    zeile("Alter", String(fall.person.alter) + " Jahre");
    zeile("Ausbildung", fall.person.beruf + ", " + fall.person.lehrjahr + ". Lehrjahr");
    if (fall.person.schule) zeile("Berufsschule", fall.person.schule);
    else zeile("Berufsschultag", fall.person.schultag + ", " + fall.person.stunden + " Unterrichtsstunden zu je " + fall.person.stundenlaenge + " Minuten");
    zeile("Vertragsauszug", fall.akte.vertrag);
    ziel.appendChild(liste);
    ziel.appendChild(el("p", "rathaus-hinweis", fall.akte.hinweis));
    var reihe = el("div", "knopf-reihe");
    var weiter = el("button", "knopf knopf-haupt", "Zum Vorgang");
    weiter.type = "button";
    weiter.addEventListener("click", function () { zeige("vorgang"); });
    var zurueck = el("button", "knopf", "Zum Posteingang");
    zurueck.type = "button";
    zurueck.addEventListener("click", function () { zeige("post"); });
    reihe.append(weiter, zurueck);
    ziel.appendChild(reihe);
    speichern();
  }

  function begriffHilfe(ziel) {
    var details = el("details", "rathaus-begriffe");
    var summary = el("summary", "", "Fachbegriffe");
    details.appendChild(summary);
    katalog.begriffe.forEach(function (eintrag) {
      var p = el("p", "");
      var stark = el("strong", "", eintrag.begriff + ": ");
      p.appendChild(stark);
      p.appendChild(document.createTextNode(eintrag.erklaerung));
      details.appendChild(p);
    });
    ziel.appendChild(details);
  }

  // Die drei Einzelbewertungen stammen aus den echten Prüffeldern der Auswertung.
  // Fehlt ein Feld, steht dort null und die Anzeige sagt "Noch nicht geprüft".
  function teilbewertungen(auswertung) {
    function lies(teil, feld) {
      return (teil && typeof teil === "object" && typeof teil[feld] === "boolean") ? teil[feld] : null;
    }
    return [
      { name: "Entscheidung", wert: lies(auswertung.entscheidung, "richtig"), ueberarbeiten: "deine Entscheidung" },
      { name: "Begründung", wert: lies(auswertung.begruendung, "reicht"), ueberarbeiten: "deine Begründung" },
      { name: "Antwortbrief", wert: lies(auswertung.antwort, "ok"), ueberarbeiten: "deinen Antwortbrief" }
    ];
  }

  function ergebnisSatz(teile, auswertung) {
    if (teile.some(function (teil) { return teil.wert === null; })) {
      return "Nicht alle Bereiche konnten geprüft werden. Werte noch einmal aus.";
    }
    var richtig = teile.filter(function (teil) { return teil.wert === true; }).length;
    var offen = teile.filter(function (teil) { return teil.wert === false; }).map(function (teil) { return teil.ueberarbeiten; });
    if (richtig === 3) {
      if (auswertung.darfAbschliessen === true) return "Drei von drei Bereichen sind richtig. Du kannst den Vorgang abschließen.";
      return "Drei von drei Bereichen sind richtig. Öffne zuerst die Ausbildungsakte und werte danach erneut aus.";
    }
    var anzahl = richtig === 2 ? "Zwei von drei Bereichen sind richtig." : (richtig === 1 ? "Einer von drei Bereichen ist richtig." : "Noch kein Bereich ist richtig.");
    var aufgabe = offen.length === 3 ? "Überarbeite alle drei Bereiche." :
      (offen.length === 2 ? "Überarbeite " + offen[0] + " und " + offen[1] + "." : "Überarbeite nur " + offen[0] + ".");
    return anzahl + " " + aufgabe;
  }

  function naechsterSchritt(teile, auswertung) {
    if (auswertung.darfAbschliessen === true) return "Du kannst den Vorgang jetzt abschließen. Wenn du noch etwas ändern willst, werte danach erneut aus.";
    if (!state.akteGelesen) return "Öffne zuerst die Ausbildungsakte und werte danach erneut aus.";
    var offen = teile.filter(function (teil) { return teil.wert !== true; }).map(function (teil) { return teil.ueberarbeiten; });
    if (offen.length === 0) return "Werte noch einmal aus.";
    return "Ändere " + offen.join(", ").replace(/, ([^,]*)$/, " und $1") + " und wähle dann „6. Auswertung anzeigen“.";
  }

  function fuelleAuswertung(auswertung) {
    leeren(auswertung);
    var ausTitel = el("h3", "", "6. Auswertung");
    ausTitel.id = "auswertung-titel";
    ausTitel.tabIndex = -1;
    auswertung.appendChild(ausTitel);
    var ergebnis = state.letzteAuswertung;
    if (state.eingabenGeaendert && !ergebnis) {
      auswertung.appendChild(el("p", "rathaus-hinweis", "Die Eingaben haben sich geändert. Bitte erneut auswerten."));
    } else if (state.veraltetHinweis && !ergebnis) {
      auswertung.appendChild(el("p", "rathaus-hinweis", "Die gespeicherte Auswertung passt nicht mehr zur aktuellen Prüfung. Deine Eingaben bleiben. Bitte erneut auswerten."));
    }
    if (!ergebnis) {
      auswertung.appendChild(el("p", "", "Noch keine Auswertung. Du kannst die Schritte in Ruhe ausfüllen."));
      return;
    }
    var teile = teilbewertungen(ergebnis);
    var liste = el("ul", "rathaus-teilbewertungen");
    teile.forEach(function (teil) {
      var symbol = teil.wert === true ? "✓" : (teil.wert === false ? "✗" : "?");
      var wort = teil.wert === true ? "Richtig" : (teil.wert === false ? "Noch nicht richtig" : "Noch nicht geprüft");
      var klasse = teil.wert === true ? "ist-richtig" : (teil.wert === false ? "ist-falsch" : "ist-offen");
      var punkt = el("li", "rathaus-teil " + klasse);
      punkt.setAttribute("aria-label", teil.name + ": " + symbol + " " + wort);
      punkt.appendChild(el("span", "rathaus-teil-name", teil.name + ":"));
      punkt.appendChild(el("span", "rathaus-teil-symbol", symbol));
      punkt.appendChild(el("span", "rathaus-teil-wort", wort));
      liste.appendChild(punkt);
    });
    auswertung.appendChild(liste);
    auswertung.appendChild(el("p", ergebnis.darfAbschliessen === true ? "rathaus-ok" : "rathaus-fehler", "Ergebnis: " + ergebnisSatz(teile, ergebnis)));

    function hinweisBlock(titel, punkte) {
      if (!Array.isArray(punkte) || punkte.length === 0) return;
      auswertung.appendChild(el("h4", "", titel));
      var ul = el("ul", "");
      punkte.forEach(function (punkt) { ul.appendChild(el("li", "", punkt)); });
      auswertung.appendChild(ul);
    }
    hinweisBlock("Das stimmt schon", ergebnis.traegt);
    hinweisBlock("Das kannst du verbessern", ergebnis.naechsterBlick);
    auswertung.appendChild(el("h4", "", "Dein nächster Schritt"));
    auswertung.appendChild(el("p", "", naechsterSchritt(teile, ergebnis)));
    hinweisBlock("Weitere Hinweise", ergebnis.hinweise);
  }

  // Der Abschlussbutton ist nur aktiv, wenn die letzte Auswertung den Abschluss freigibt.
  function fuelleAbschluss(host) {
    leeren(host);
    var frei = Boolean(state.letzteAuswertung && state.letzteAuswertung.darfAbschliessen === true);
    var status;
    if (state.abgeschlossen) {
      status = el("p", "rathaus-ok", "✓ Vorgang abgeschlossen. Du kannst ihn in der Lehrkraftansicht für einen neuen Durchlauf zurücksetzen.");
      status.id = "abschluss-titel";
      status.tabIndex = -1;
    } else if (frei) {
      status = el("p", "rathaus-ok", "✓ Bereit: Du kannst den Vorgang jetzt abschließen. Zur Korrektur änderst du die Felder und prüfst erneut.");
    } else if (state.eingabenGeaendert) {
      status = el("p", "rathaus-meta", "Noch nicht abschließen: Die Eingaben haben sich geändert. Bitte erneut auswerten.");
    } else if (state.letzteAuswertung && !state.akteGelesen) {
      status = el("p", "rathaus-meta", "Noch nicht abschließen: Öffne zuerst die Ausbildungsakte und werte danach erneut aus.");
    } else if (state.letzteAuswertung) {
      status = el("p", "rathaus-meta", "Noch nicht abschließen: Mindestens ein Bereich ist noch nicht richtig. Zur Korrektur änderst du die Felder und prüfst erneut.");
    } else {
      status = el("p", "rathaus-meta", "Noch nicht abschließen: Werte zuerst deine Eingaben aus.");
    }
    if (!status.id) status.id = "abschluss-status";

    var aktionen = el("div", "knopf-reihe");
    var abschluss = el("button", "knopf knopf-haupt", "7. Vorgang abschließen");
    abschluss.id = "abschluss-knopf";
    abschluss.type = "button";
    abschluss.disabled = !frei;
    abschluss.setAttribute("aria-describedby", status.id);
    abschluss.addEventListener("click", function () {
      if (!state.letzteAuswertung || state.letzteAuswertung.darfAbschliessen !== true) return;
      state.abgeschlossen = true;
      speichern();
      zeichnen();
      fokus("abschluss-titel");
    });
    aktionen.appendChild(abschluss);
    host.appendChild(aktionen);
    host.appendChild(status);
  }

  var aktualisiereBewertung = function () {};
  var ansageTimer = null;

  // Wird beim Ändern von Entscheidung, Gründen oder Antwort aufgerufen. Eine frühere
  // Auswertung gibt den Abschluss danach nicht mehr frei. Eingaben und Entwurf bleiben.
  function eingabeGeaendert() {
    var hatteErgebnis = Boolean(state.letzteAuswertung) || state.abgeschlossen;
    state.abgeschlossen = false;
    if (state.letzteAuswertung) {
      state.letzteAuswertung = null;
      state.eingabenGeaendert = true;
    }
    speichern();
    fortschrittNur();
    // Nur die Bewertungsbereiche neu zeichnen, damit das Textfeld Fokus und Cursor behält.
    if (hatteErgebnis) {
      aktualisiereBewertung();
      // Genau eine Ansage beim Übergang. Weitere Eingaben ohne Ergebnis bleiben still.
      ansage("Eingaben geändert. Die Auswertung gilt nicht mehr. Bitte erneut auswerten.");
    }
  }

  function zeichneVorgang(ziel) {
    var titel = el("h2", "", fall.vorgangTitel || "Vorgang: Berufsschule oder Dienststelle");
    titel.id = "ansicht-titel";
    titel.tabIndex = -1;
    ziel.appendChild(titel);
    ziel.appendChild(el("p", "rathaus-meta", "Fiktive Beispieldaten · vorläufig, nicht verbindlich · Rechtsstand " + kern.RECHTSSTAND));
    if (!state.gelesen) {
      ziel.appendChild(el("p", "rathaus-hinweis", "Lies zuerst die Nachricht im Posteingang."));
      var zurPost = el("button", "knopf knopf-haupt", "Zum Posteingang");
      zurPost.type = "button";
      zurPost.addEventListener("click", function () { zeige("post"); });
      ziel.appendChild(zurPost);
      return;
    }
    var nachricht = el("article", "rathaus-sachlich");
    nachricht.appendChild(el("h3", "", "1. Eingegangene Nachricht"));
    nachricht.appendChild(el("p", "", fall.nachricht));
    ziel.appendChild(nachricht);

    var akteKnopf = el("button", "knopf", state.akteGelesen ? "2. Akte erneut öffnen" : "2. Ausbildungsakte öffnen");
    akteKnopf.type = "button";
    akteKnopf.addEventListener("click", function () { zeige("akte"); });
    ziel.appendChild(akteKnopf);
    if (!state.akteGelesen) {
      ziel.appendChild(el("p", "rathaus-hinweis", "Öffne die Akte, bevor du entscheidest. Du kannst danach hierher zurück."));
    }

    var form = el("form", "rathaus-form");
    form.addEventListener("submit", function (event) { event.preventDefault(); });
    // Eine Auswahl ist eine benannte Gruppe: Die Überschrift steckt in der Legende, der Hinweis hängt per aria-describedby daran.
    function gruppe(titel, hilfeId, hilfeText) {
      var set = el("fieldset", "rathaus-gruppe");
      var legende = el("legend", "");
      legende.appendChild(el("h3", "", titel));
      set.appendChild(legende);
      var hilfe = el("p", "rathaus-meta", hilfeText);
      hilfe.id = hilfeId;
      set.appendChild(hilfe);
      set.setAttribute("aria-describedby", hilfeId);
      form.appendChild(set);
      return set;
    }
    var entscheidungsGruppe = gruppe("3. Sachverhalt beurteilen", "entscheidung-hilfe", "Wähle genau eine Antwort.");
    katalog.entscheidungen.forEach(function (option) {
      var label = el("label", "rathaus-option");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "entscheidung";
      input.value = option.id;
      input.checked = state.entscheidung === option.id;
      input.addEventListener("change", function () {
        state.entscheidung = option.id;
        eingabeGeaendert();
      });
      label.appendChild(input);
      label.appendChild(el("span", "", option.text));
      entscheidungsGruppe.appendChild(label);
    });

    var gruendeGruppe = gruppe("4. Entscheidung begründen", "gruende-hilfe", "Du kannst mehrere Gründe ankreuzen.");
    katalog.gruende.forEach(function (grund) {
      var label = el("label", "rathaus-option");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.value = grund.id;
      input.checked = state.gruende.indexOf(grund.id) !== -1;
      input.addEventListener("change", function () {
        if (input.checked && state.gruende.indexOf(grund.id) === -1) state.gruende.push(grund.id);
        if (!input.checked) state.gruende = state.gruende.filter(function (id) { return id !== grund.id; });
        eingabeGeaendert();
      });
      label.appendChild(input);
      label.appendChild(el("span", "", grund.text));
      gruendeGruppe.appendChild(label);
    });

    var erklaerung = kern.gesetzesErklaerung();
    var erklaerDetails = el("details", "rathaus-begriffe rathaus-gesetze");
    erklaerDetails.id = "gesetzes-erklaerung";
    erklaerDetails.appendChild(el("summary", "", erklaerung.titel));
    erklaerung.punkte.forEach(function (punkt) {
      var p = el("p", "");
      p.appendChild(el("strong", "", punkt.begriff + ": "));
      p.appendChild(document.createTextNode(punkt.text));
      erklaerDetails.appendChild(p);
    });
    erklaerDetails.appendChild(el("p", "rathaus-meta", erklaerung.hinweis));
    form.appendChild(erklaerDetails);

    var empfaenger = fall.antwortAn || "Sven Holm";
    form.appendChild(el("h3", "", "5. Sachliche Antwort an " + empfaenger));
    var feldName = el("label", "rathaus-feldname", "Dein Antwortbrief an " + empfaenger);
    feldName.setAttribute("for", "antwort-text");
    form.appendChild(feldName);
    var feld = document.createElement("textarea");
    feld.id = "antwort-text";
    feld.name = "antwort";
    feld.rows = 6;
    feld.maxLength = 1200;
    feld.value = state.antwort;
    feld.setAttribute("aria-describedby", "antwort-hilfe");
    feld.addEventListener("input", function () {
      state.antwort = feld.value;
      eingabeGeaendert();
    });
    form.appendChild(feld);
    form.appendChild(el("p", "rathaus-meta", "Schreibe selbst. Eine Musterlösung gibt es ausschließlich in der lokalen Lehrkraftansicht, nicht in dieser Lernansicht."));
    form.lastChild.id = "antwort-hilfe";

    var pruefen = el("button", "knopf knopf-haupt", "6. Auswertung anzeigen");
    pruefen.type = "button";
    pruefen.addEventListener("click", function () {
      var naechster = kern.nachPruefung(state);
      state.versuche = naechster.versuche;
      state.abgeschlossen = naechster.abgeschlossen;
      state.letzteAuswertung = naechster.letzteAuswertung;
      state.veraltetHinweis = false;
      state.eingabenGeaendert = false;
      speichern();
      zeichnen();
      fokus("auswertung-titel");
      ansage(auswertungAnsage(state.letzteAuswertung));
    });
    form.appendChild(pruefen);
    ziel.appendChild(form);

    var auswertung = el("section", "rathaus-auswertung");
    // Keine eigene Live-Region: Die Ansage kommt genau einmal über #rathaus-ansage.
    auswertung.setAttribute("aria-labelledby", "auswertung-titel");
    fuelleAuswertung(auswertung);
    ziel.appendChild(auswertung);

    begriffHilfe(ziel);
    state.hilfeStufe = kern.hilfeWechsel(state.hilfeStufe, "halten");
    var hilfeReihe = el("div", "knopf-reihe");
    function hilfeKnopf(text, richtung, gesperrt) {
      var knopf = el("button", "knopf", text);
      knopf.type = "button";
      knopf.disabled = gesperrt;
      knopf.addEventListener("click", function () {
        state.hilfeStufe = kern.hilfeWechsel(state.hilfeStufe, richtung);
        speichern();
        zeichnen();
        var ziel2 = document.getElementById("hilfe-" + richtung);
        fokus(ziel2 && !ziel2.disabled ? "hilfe-" + richtung : "hilfe-mehr");
      });
      return knopf;
    }
    var mehr = hilfeKnopf("Mehr Hilfe", "mehr", state.hilfeStufe >= 3);
    mehr.id = "hilfe-mehr";
    var weniger = hilfeKnopf("Weniger Hilfe", "weniger", state.hilfeStufe <= 0);
    weniger.id = "hilfe-weniger";
    var einklappen = hilfeKnopf("Hilfe einklappen", "einklappen", state.hilfeStufe <= 0);
    einklappen.id = "hilfe-einklappen";
    einklappen.setAttribute("aria-controls", "hilfe-bereich");
    einklappen.setAttribute("aria-expanded", state.hilfeStufe > 0 ? "true" : "false");
    hilfeReihe.append(mehr, weniger, einklappen);
    ziel.appendChild(hilfeReihe);
    var hilfeBereich = el("div", "rathaus-hilfe");
    hilfeBereich.id = "hilfe-bereich";
    hilfeBereich.setAttribute("role", "region");
    hilfeBereich.setAttribute("aria-label", "Hilfe");
    hilfeBereich.hidden = state.hilfeStufe <= 0;
    if (state.hilfeStufe > 0) {
      hilfeBereich.appendChild(el("p", "rathaus-meta", "Hilfestufe " + state.hilfeStufe + " von 3"));
      hilfeBereich.appendChild(el("p", "rathaus-hinweis", kern.hilfe(state.hilfeStufe)));
    }
    ziel.appendChild(hilfeBereich);
    var abschlussHost = el("div", "rathaus-abschluss");
    abschlussHost.id = "abschluss-bereich";
    ziel.appendChild(abschlussHost);
    fuelleAbschluss(abschlussHost);
    // Die Eingabehandler zeichnen nur diese beiden Bereiche neu, nie das Textfeld.
    aktualisiereBewertung = function () {
      fuelleAuswertung(auswertung);
      fuelleAbschluss(abschlussHost);
    };
  }

  function zeichneLehrkraft(ziel) {
    var titel = el("h2", "", "Lehrkraftansicht");
    titel.id = "ansicht-titel";
    titel.tabIndex = -1;
    ziel.appendChild(titel);
    ziel.appendChild(el("p", "rathaus-warnbanner", "Nur lokaler Test. Keine echte Rollenprüfung. Nicht produktiv. Keine Schülerdaten."));
    if (!state.lehrkraft) {
      ziel.appendChild(el("p", "", "Die Musterlösung ist ausschließlich in der lokalen Lehrkraftansicht verfügbar. Lernende sehen sie in der Lernansicht nicht."));
      return;
    }
    var loesung = kern.lehrkraftLoesung();
    ziel.appendChild(el("h3", "", "Vorläufige Übungslösung, nicht verbindlich"));
    ziel.appendChild(el("p", "rathaus-meta", "Diese Musterlösung ist ausschließlich in der lokalen Lehrkraftansicht verfügbar. In der Lernansicht erscheint sie nicht."));
    ziel.appendChild(el("p", "", "Entscheidung: " + loesung.entscheidung));
    ziel.appendChild(el("p", "", loesung.mustertext));
    ziel.appendChild(el("h3", "", "Bewertungskriterien"));
    var ul = el("ul", "");
    loesung.kriterien.forEach(function (punkt) { ul.appendChild(el("li", "", punkt)); });
    ziel.appendChild(ul);
    ziel.appendChild(el("h3", "", "Vorhandene Übungsfälle"));
    var faelleListe = el("ul", "");
    [kernLuca, kernHochbetrieb].forEach(function (k) {
      if (!k) return;
      var d = k.fallDaten();
      faelleListe.appendChild(el("li", "", d.betreff + " (" + d.person.name + ")"));
    });
    ziel.appendChild(faelleListe);
    ziel.appendChild(el("h3", "", "Quellen und Rechtsstand " + loesung.rechtsstand));
    var quellen = el("ul", "");
    loesung.quellen.forEach(function (quelle) { quellen.appendChild(el("li", "", quelle)); });
    ziel.appendChild(quellen);
    ziel.appendChild(el("p", "rathaus-hinweis", loesung.unsicherheit));
    var reset = el("button", "knopf knopf-warn", "Fall für einen neuen Durchlauf zurücksetzen");
    reset.id = "reset-knopf";
    reset.type = "button";
    reset.addEventListener("click", function () {
      var lehrkraft = true;
      window.localStorage.removeItem(schluessel());
      state.ansicht = "lehrkraft";
      state.gelesen = false;
      state.akteGelesen = false;
      state.entscheidung = "";
      state.gruende = [];
      state.antwort = "";
      state.letzteAuswertung = null;
      state.abgeschlossen = false;
      state.veraltetHinweis = false;
      state.eingabenGeaendert = false;
      state.hilfeStufe = 0;
      state.lehrkraft = lehrkraft;
      state.versuche = 0;
      speichern();
      zeichnen();
      fokus("ansicht-titel");
      ansage("Der Vorgang wurde für einen neuen Durchlauf zurückgesetzt.");
    });
    ziel.appendChild(reset);
  }

  function fortschrittNur() {
    var host = document.getElementById("rathaus-fortschritt");
    if (!host) return;
    zeichneFortschritt(host);
  }

  function navKnopf(text, klasse, ansicht) {
    var knopf = el("button", klasse, text);
    knopf.type = "button";
    knopf.addEventListener("click", function () { zeige(ansicht); });
    return knopf;
  }

  function zeichneNavigation() {
    var ebene = navi.leistenEbene(state.ansicht);
    document.querySelectorAll("[data-ansicht]").forEach(function (knopf) {
      var aktiv = knopf.getAttribute("data-ansicht") === ebene;
      if (aktiv) knopf.setAttribute("aria-current", "page");
      else knopf.removeAttribute("aria-current");
    });

    var unter = document.getElementById("rathaus-unterleiste");
    if (unter) {
      leeren(unter);
      var eintraege = navi.personalUnternavigation(state.ansicht);
      unter.hidden = eintraege.length === 0;
      eintraege.forEach(function (eintrag) {
        var knopf = navKnopf(eintrag.label, "knopf", eintrag.ansicht);
        if (eintrag.aktuell) knopf.setAttribute("aria-current", "page");
        unter.appendChild(knopf);
      });
    }

    var krumen = document.getElementById("rathaus-brotkrumen");
    if (krumen) {
      leeren(krumen);
      var rueck = navi.rueckziel(state.ansicht);
      krumen.hidden = !rueck;
      if (rueck) {
        var liste = el("ol", "rathaus-krumenliste");
        navi.brotkrumen(state.ansicht).forEach(function (krume) {
          var li = el("li", "");
          if (krume.ziel) {
            li.appendChild(navKnopf(krume.label, "knopf rathaus-krume", krume.ziel));
          } else {
            var text = el("span", "rathaus-krume-text", krume.label);
            text.setAttribute("aria-current", "page");
            li.appendChild(text);
          }
          liste.appendChild(li);
        });
        krumen.appendChild(liste);
        var zurStadt = navKnopf(rueck.label, "knopf knopf-haupt rathaus-zur-stadt", rueck.ansicht);
        zurStadt.id = "zur-stadt";
        krumen.appendChild(zurStadt);
      }
    }
  }

  function hashAnwenden() {
    var ansicht = navi.hashZuAnsicht(window.location.hash);
    if (!ansicht) return false;
    // Nur die Ansicht wechseln. Fall- und Bewertungsdaten bleiben unverändert.
    state.ansicht = ansicht;
    try {
      if (window.history && typeof window.history.replaceState === "function") {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    } catch (fehler) {
      /* Hash bleibt stehen */
    }
    return true;
  }

  function zeichnen() {
    var haupt = document.getElementById("hauptinhalt");
    var fort = document.getElementById("rathaus-fortschritt");
    var banner = document.getElementById("lehrkraft-banner");
    if (!haupt || !fort || !banner) return;
    zeichneFortschritt(fort);
    banner.hidden = !state.lehrkraft;
    zeichneNavigation();
    var lehrknopf = document.getElementById("lehrkraft-schalter");
    if (lehrknopf) lehrknopf.setAttribute("aria-pressed", state.lehrkraft ? "true" : "false");
    leeren(haupt);
    if (state.ansicht === "personal") zeichnePersonal(haupt);
    else if (state.ansicht === "post") zeichnePost(haupt);
    else if (state.ansicht === "akte") zeichneAkte(haupt);
    else if (state.ansicht === "vorgang") zeichneVorgang(haupt);
    else if (state.ansicht === "nachschlagen") zeichneNachschlagen(haupt);
    else if (state.ansicht === "lehrkraft") zeichneLehrkraft(haupt);
    else zeichneStadt(haupt);
  }

  function init() {
    laden();
    state.ansicht = navi.ansichtNachLaden(state.ansicht, state.lehrkraft);
    var vomHash = hashAnwenden();
    document.querySelectorAll("[data-ansicht]").forEach(function (knopf) {
      knopf.addEventListener("click", function () {
        zeige(knopf.getAttribute("data-ansicht"));
      });
    });
    var schalter = document.getElementById("lehrkraft-schalter");
    if (schalter) {
      schalter.addEventListener("click", function () {
        var umschalt = navi.lehrkraftUmschalten(state.ansicht, state.lehrkraft);
        state.lehrkraft = umschalt.lehrkraft;
        state.ansicht = umschalt.ansicht;
        speichern();
        zeichnen();
        fokus("ansicht-titel");
      });
    }
    ohneSchritt = vomHash;
    zeichnen();
    ohneSchritt = false;
    if (vomHash) speichern();
    window.addEventListener("hashchange", function () {
      if (!hashAnwenden()) return;
      ohneSchritt = true;
      zeichnen();
      ohneSchritt = false;
      speichern();
      fokus("ansicht-titel");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
