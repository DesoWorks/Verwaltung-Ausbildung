/* Oberfläche des virtuellen Rathauses. Speichert nur einen lokalen Testzustand. */
(function () {
  "use strict";

  var KEY = "verwaltung-ausbildung.rathaus.v1";
  var kern = window.RATHAUS_KERN;
  var fall = kern.fallDaten();
  var katalog = kern.katalog();

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
    veraltetHinweis: false
  };

  function laden() {
    try {
      var roh = window.localStorage.getItem(KEY);
      if (!roh) return;
      var daten = JSON.parse(roh);
      if (!daten || typeof daten !== "object") return;
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
    window.localStorage.setItem(KEY, JSON.stringify(kopie));
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

  function fortschritt(ziel) {
    var liste = schritte();
    var fertig = liste.filter(function (schritt) { return schritt.done; }).length;
    var kopf = el("div", "rathaus-fortschritt");
    var text = el("p", "rathaus-fortschritt-text", fertig + " von 7 Schritten erledigt");
    kopf.appendChild(text);
    var leiste = el("ol", "rathaus-schritte");
    liste.forEach(function (schritt) {
      var punkt = el("li", schritt.done ? "ist-fertig" : "", schritt.nr + ". " + schritt.label);
      leiste.appendChild(punkt);
    });
    kopf.appendChild(leiste);
    ziel.appendChild(kopf);
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
    var personal = bereichskarte("Personalamt", "Ausbildungsverhältnisse, Akten und der erste bearbeitbare Vorgang.", "Benutzbar", true);
    var knopf = el("button", "knopf knopf-haupt", "Personalamt öffnen");
    knopf.type = "button";
    knopf.addEventListener("click", function () { zeige("personal"); });
    personal.appendChild(knopf);
    raster.appendChild(personal);
    raster.appendChild(bereichskarte("Bürgerbüro", "Schalter und Anliegen der Einwohnerschaft. In dieser Testfassung nur eine Vorschau.", "Vorschau", false));
    raster.appendChild(bereichskarte("Ordnungsamt", "Ordnung und Genehmigungen. Noch keine Vorgänge.", "Vorschau", false));
    raster.appendChild(bereichskarte("Stadtkasse", "Zahlungen und Gebühren. Noch keine Vorgänge.", "Vorschau", false));
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
    var zurueck = el("button", "knopf", "Zur Stadtübersicht");
    zurueck.type = "button";
    zurueck.addEventListener("click", function () { zeige("stadt"); });
    reihe.append(post, akte, zurueck);
    ziel.appendChild(reihe);
  }

  function zeichnePost(ziel) {
    var titel = el("h2", "", "Posteingang");
    titel.id = "ansicht-titel";
    titel.tabIndex = -1;
    ziel.appendChild(titel);
    var karte = el("article", "rathaus-vorgangskarte");
    karte.appendChild(el("p", "rathaus-meta", "Neu · " + fall.betreff));
    karte.appendChild(el("p", "", "Von: " + fall.von));
    karte.appendChild(el("p", "", "An: " + fall.an));
    var lesen = el("button", "knopf knopf-haupt", state.gelesen ? "Nachricht erneut lesen" : "Nachricht lesen");
    lesen.type = "button";
    lesen.addEventListener("click", function () {
      state.gelesen = true;
      zeige("vorgang");
    });
    karte.appendChild(lesen);
    ziel.appendChild(karte);
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
    state.akteGelesen = true;
    var liste = el("dl", "rathaus-akte");
    function zeile(name, wert) {
      liste.appendChild(el("dt", "", name));
      liste.appendChild(el("dd", "", wert));
    }
    zeile("Name", fall.person.name + " (fiktiv)");
    zeile("Alter", String(fall.person.alter) + " Jahre");
    zeile("Ausbildung", fall.person.beruf + ", " + fall.person.lehrjahr + ". Lehrjahr");
    zeile("Berufsschultag", fall.person.schultag + ", " + fall.person.stunden + " Unterrichtsstunden zu je " + fall.person.stundenlaenge + " Minuten");
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

  function zeichneVorgang(ziel) {
    var titel = el("h2", "", "Vorgang: Berufsschule oder Dienststelle");
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
    form.appendChild(el("h3", "", "3. Sachverhalt beurteilen"));
    katalog.entscheidungen.forEach(function (option) {
      var label = el("label", "rathaus-option");
      var input = document.createElement("input");
      input.type = "radio";
      input.name = "entscheidung";
      input.value = option.id;
      input.checked = state.entscheidung === option.id;
      input.addEventListener("change", function () {
        state.entscheidung = option.id;
        state.abgeschlossen = false;
        speichern();
        fortschrittNur();
      });
      label.appendChild(input);
      label.appendChild(el("span", "", option.text));
      form.appendChild(label);
    });

    form.appendChild(el("h3", "", "4. Entscheidung begründen"));
    katalog.gruende.forEach(function (grund) {
      var label = el("label", "rathaus-option");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.value = grund.id;
      input.checked = state.gruende.indexOf(grund.id) !== -1;
      input.addEventListener("change", function () {
        if (input.checked && state.gruende.indexOf(grund.id) === -1) state.gruende.push(grund.id);
        if (!input.checked) state.gruende = state.gruende.filter(function (id) { return id !== grund.id; });
        state.abgeschlossen = false;
        speichern();
        fortschrittNur();
      });
      label.appendChild(input);
      label.appendChild(el("span", "", grund.text));
      form.appendChild(label);
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

    form.appendChild(el("h3", "", "5. Sachliche Antwort an Sven Holm"));
    var feld = document.createElement("textarea");
    feld.id = "antwort-text";
    feld.rows = 6;
    feld.maxLength = 1200;
    feld.value = state.antwort;
    feld.setAttribute("aria-describedby", "antwort-hilfe");
    feld.addEventListener("input", function () {
      state.antwort = feld.value;
      state.abgeschlossen = false;
      speichern();
      fortschrittNur();
    });
    form.appendChild(feld);
    form.appendChild(el("p", "rathaus-meta", "Schreibe selbst. Die Musterlösung erscheint nicht in dieser Ansicht.", "antwort-hilfe"));
    form.lastChild.id = "antwort-hilfe";

    var pruefen = el("button", "knopf knopf-haupt", "6. Auswertung anzeigen");
    pruefen.type = "button";
    pruefen.addEventListener("click", function () {
      var naechster = kern.nachPruefung(state);
      state.versuche = naechster.versuche;
      state.abgeschlossen = naechster.abgeschlossen;
      state.letzteAuswertung = naechster.letzteAuswertung;
      state.veraltetHinweis = false;
      speichern();
      zeichnen();
      fokus("auswertung-titel");
    });
    form.appendChild(pruefen);
    ziel.appendChild(form);

    var auswertung = el("section", "rathaus-auswertung");
    auswertung.setAttribute("aria-live", "polite");
    var ausTitel = el("h3", "", "6. Auswertung");
    ausTitel.id = "auswertung-titel";
    ausTitel.tabIndex = -1;
    auswertung.appendChild(ausTitel);
    if (state.veraltetHinweis && !state.letzteAuswertung) {
      auswertung.appendChild(el("p", "rathaus-hinweis", "Die gespeicherte Auswertung passt nicht mehr zur aktuellen Prüfung. Deine Eingaben bleiben. Bitte erneut auswerten."));
    }
    if (!state.letzteAuswertung) {
      auswertung.appendChild(el("p", "", "Noch keine Auswertung. Du kannst die Schritte in Ruhe ausfüllen."));
    } else if (state.letzteAuswertung.bestanden) {
      auswertung.appendChild(el("p", "rathaus-ok", "Tragfähig. Die Entscheidung, die Begründung und die Antwort passen zusammen."));
    } else {
      auswertung.appendChild(el("p", "rathaus-fehler", "Noch nicht tragfähig. Du kannst alles ändern und es erneut versuchen."));
    }
    if (state.letzteAuswertung) {
      var traegt = state.letzteAuswertung.traegt || [];
      var blick = state.letzteAuswertung.naechsterBlick || [];
      if (traegt.length > 0) {
        auswertung.appendChild(el("h4", "", "Das passt schon"));
        var traegtListe = el("ul", "");
        traegt.forEach(function (punkt) { traegtListe.appendChild(el("li", "", punkt)); });
        auswertung.appendChild(traegtListe);
      }
      if (blick.length > 0) {
        auswertung.appendChild(el("h4", "", "Dein nächster Blick"));
        var blickListe = el("ul", "");
        blick.forEach(function (punkt) { blickListe.appendChild(el("li", "", punkt)); });
        auswertung.appendChild(blickListe);
      }
      auswertung.appendChild(el("h4", "", "Einzelne Hinweise"));
      var ul = el("ul", "");
      state.letzteAuswertung.hinweise.forEach(function (hinweis) {
        ul.appendChild(el("li", "", hinweis));
      });
      auswertung.appendChild(ul);
    }
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
    var aktionen = el("div", "knopf-reihe");

    var abschluss = el("button", "knopf knopf-haupt", "7. Vorgang abschließen");
    abschluss.type = "button";
    abschluss.disabled = !(state.letzteAuswertung && state.letzteAuswertung.darfAbschliessen);
    abschluss.addEventListener("click", function () {
      if (!state.letzteAuswertung || !state.letzteAuswertung.darfAbschliessen) return;
      state.abgeschlossen = true;
      speichern();
      zeichnen();
      fokus("abschluss-titel");
    });
    aktionen.appendChild(abschluss);
    ziel.appendChild(aktionen);
    if (state.abgeschlossen) {
      var fertig = el("p", "rathaus-ok", "Vorgang abgeschlossen. Du kannst ihn in der Lehrkraftansicht für einen neuen Durchlauf zurücksetzen.");
      fertig.id = "abschluss-titel";
      fertig.tabIndex = -1;
      ziel.appendChild(fertig);
    } else if (state.letzteAuswertung && state.letzteAuswertung.darfAbschliessen) {
      ziel.appendChild(el("p", "rathaus-ok", "Du kannst den Vorgang jetzt abschließen. Zur Korrektur änderst du die Felder und prüfst erneut."));
    } else {
      ziel.appendChild(el("p", "rathaus-meta", "Abschließen geht erst nach einer tragfähigen Auswertung. Zur Korrektur änderst du die Felder und prüfst erneut."));
    }
  }

  function zeichneLehrkraft(ziel) {
    var titel = el("h2", "", "Lehrkraftansicht");
    titel.id = "ansicht-titel";
    titel.tabIndex = -1;
    ziel.appendChild(titel);
    ziel.appendChild(el("p", "rathaus-warnbanner", "Nur lokaler Test. Keine echte Rollenprüfung. Nicht produktiv. Keine Schülerdaten."));
    if (!state.lehrkraft) {
      ziel.appendChild(el("p", "", "Die Musterlösung bleibt zu, bis du die lokale Lehrkraftansicht einschaltest."));
      return;
    }
    var loesung = kern.lehrkraftLoesung();
    ziel.appendChild(el("h3", "", "Vorläufige Übungslösung, nicht verbindlich"));
    ziel.appendChild(el("p", "", "Entscheidung: " + loesung.entscheidung));
    ziel.appendChild(el("p", "", loesung.mustertext));
    ziel.appendChild(el("h3", "", "Bewertungskriterien"));
    var ul = el("ul", "");
    loesung.kriterien.forEach(function (punkt) { ul.appendChild(el("li", "", punkt)); });
    ziel.appendChild(ul);
    ziel.appendChild(el("h3", "", "Vorhandene Übungsfälle"));
    ziel.appendChild(el("p", "", fall.betreff));
    ziel.appendChild(el("h3", "", "Quellen und Rechtsstand " + loesung.rechtsstand));
    var quellen = el("ul", "");
    loesung.quellen.forEach(function (quelle) { quellen.appendChild(el("li", "", quelle)); });
    ziel.appendChild(quellen);
    ziel.appendChild(el("p", "rathaus-hinweis", loesung.unsicherheit));
    var reset = el("button", "knopf knopf-warn", "Fall für einen neuen Durchlauf zurücksetzen");
    reset.type = "button";
    reset.addEventListener("click", function () {
      var lehrkraft = true;
      window.localStorage.removeItem(KEY);
      state.ansicht = "lehrkraft";
      state.gelesen = false;
      state.akteGelesen = false;
      state.entscheidung = "";
      state.gruende = [];
      state.antwort = "";
      state.letzteAuswertung = null;
      state.abgeschlossen = false;
      state.veraltetHinweis = false;
      state.hilfeStufe = 0;
      state.lehrkraft = lehrkraft;
      state.versuche = 0;
      speichern();
      zeichnen();
    });
    ziel.appendChild(reset);
  }

  function fortschrittNur() {
    var host = document.getElementById("rathaus-fortschritt");
    if (!host) return;
    leeren(host);
    fortschritt(host);
  }

  function zeichnen() {
    var haupt = document.getElementById("hauptinhalt");
    var fort = document.getElementById("rathaus-fortschritt");
    var banner = document.getElementById("lehrkraft-banner");
    if (!haupt || !fort || !banner) return;
    leeren(fort);
    fortschritt(fort);
    banner.hidden = !state.lehrkraft;
    document.querySelectorAll("[data-ansicht]").forEach(function (knopf) {
      var aktiv = knopf.getAttribute("data-ansicht") === state.ansicht;
      knopf.setAttribute("aria-current", aktiv ? "page" : "false");
    });
    var lehrknopf = document.getElementById("lehrkraft-schalter");
    if (lehrknopf) lehrknopf.setAttribute("aria-pressed", state.lehrkraft ? "true" : "false");
    leeren(haupt);
    if (state.ansicht === "personal") zeichnePersonal(haupt);
    else if (state.ansicht === "post") zeichnePost(haupt);
    else if (state.ansicht === "akte") zeichneAkte(haupt);
    else if (state.ansicht === "vorgang") zeichneVorgang(haupt);
    else if (state.ansicht === "lehrkraft") zeichneLehrkraft(haupt);
    else zeichneStadt(haupt);
  }

  function init() {
    laden();
    document.querySelectorAll("[data-ansicht]").forEach(function (knopf) {
      knopf.addEventListener("click", function () {
        zeige(knopf.getAttribute("data-ansicht"));
      });
    });
    var schalter = document.getElementById("lehrkraft-schalter");
    if (schalter) {
      schalter.addEventListener("click", function () {
        state.lehrkraft = !state.lehrkraft;
        if (state.lehrkraft) state.ansicht = "lehrkraft";
        speichern();
        zeichnen();
        fokus("ansicht-titel");
      });
    }
    zeichnen();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
