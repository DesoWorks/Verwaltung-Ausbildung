/* Lernfeld 1: Zwei Lernorte (duales System). Eigenmaterial, fiktives Beispiel Büroservice Sonnenthal.
 * Auswertung ausschließlich über feste Werte. Freitext wird nicht bewertet und standardmäßig nicht gespeichert. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf1-dual.v1";
  var SCHEMA = 1;
  var STEPS = ["start", "erklaerung", "beispiel", "uebung", "kontrolle", "abschluss"];
  var STEP_VON_BLOCK = { a: "uebung", k: "kontrolle" };

  var FRAGEN = [
    {
      id: "a1", teil: "uebung", titel: "A1 – Lernorte erkennen", flag: "lernorteErkannt",
      prompt: "Welche Kombination bezeichnet die beiden zentralen Lernorte im dualen System?",
      options: [
        { value: "a", label: "Ausbildungsbetrieb und Berufsschule." },
        { value: "b", label: "Ausbildungsordnung und Ausbildungsplan." },
        { value: "c", label: "Ausbildungsbetrieb und dessen Pausenraum." }
      ],
      hinweis: "Unterscheide Lernort und Dokument.",
      hilfen: ["Suche nach Orten, an denen Ausbildung stattfindet.", "Ein Ort gehört zum Unternehmen, der andere zum schulischen Lernen."]
    },
    {
      id: "a2", teil: "uebung", titel: "A2 – Lernen im Betrieb", flag: "betrieblichesLernenErkannt",
      prompt: "Alex erfasst eine Übungsanfrage im betrieblichen System und bespricht den Entwurf mit der Ausbilderin. Was trifft zu?",
      options: [
        { value: "a", label: "Das ist nur Unterricht der Berufsschule, weil etwas erklärt wird." },
        { value: "b", label: "Das ist Lernen im Ausbildungsbetrieb mit Anleitung und Rückmeldung." },
        { value: "c", label: "Das ist keine Ausbildung, weil noch nichts allein versendet wird." }
      ],
      hinweis: "Auch Anleitung im Betrieb gehört zum Lernen.",
      hilfen: ["Wo spielt die Handlung, wer begleitet Alex?", "Erklären und Rückmeldung sind auch Teil betrieblicher Ausbildung."]
    },
    {
      id: "a3", teil: "uebung", titel: "A3 – Grundlagen unterscheiden", flag: "grundlagenUnterschieden",
      prompt: "Welche Zuordnung stimmt?",
      options: [
        { value: "a", label: "Ausbildungsordnung = tägliche Aufgabenliste; Ausbildungsplan = Schulzeugnis; Rahmenlehrplan = Raumbelegung." },
        { value: "b", label: "Ausbildungsordnung = nur Hausordnung der Schule; Ausbildungsplan = beliebiger Dienstplan; Rahmenlehrplan = Kundenliste." },
        { value: "c", label: "Ausbildungsordnung = Grundlage des Ausbildungsberufs; Ausbildungsplan = konkrete betriebliche Ausbildungsplanung; Rahmenlehrplan = schulische Inhaltsgrundlage." }
      ],
      hinweis: "Vergleiche die drei Funktionen in der Tabelle.",
      hilfen: ["Trenne übergreifende Vorgabe, konkrete Betriebsplanung und schulische Inhalte.", "Ein Dokument für einen Ausbildungsberuf ist nicht der Tagesplan einer einzelnen Person."]
    },
    {
      id: "a4", teil: "uebung", titel: "A4 – Beide Lernorte verbinden", flag: "lernorteVerknuepft",
      prompt: "Alex versteht in der Schule, warum Angaben vollständig sein müssen. Im Betrieb prüft Alex damit eine neue Anfrage. Welche Erklärung passt?",
      options: [
        { value: "a", label: "Das ist Zusammenarbeit der Lernorte: Wissen wird in einer beruflichen Aufgabe angewendet und überprüft." },
        { value: "b", label: "Schule und Betrieb haben nichts miteinander zu tun." },
        { value: "c", label: "Mit dem Unterricht entfällt jede Anleitung im Betrieb." }
      ],
      hinweis: "Suche die Verbindung zwischen Verstehen und Anwenden.",
      hilfen: ["Was nimmt Alex aus dem Unterricht in die nächste Aufgabe mit?", "Achte auf Verstehen, Anwenden und Prüfen statt auf ein Entweder-oder."]
    },
    {
      id: "a5", teil: "uebung", titel: "A5 – Nächster Schritt", flag: "klaerungGewaehlt",
      prompt: "Alex soll eine unbekannte Aufgabe ohne Erklärung sofort selbstständig versenden. Was ist in diesem Übungsfall die passende erste Handlung?",
      options: [
        { value: "a", label: "Ungeprüft versenden, damit die Aufgabe schnell erledigt ist." },
        { value: "b", label: "Die Aufgabe kommentarlos liegen lassen." },
        { value: "c", label: "Bei der zuständigen Ausbildungsperson Ziel, Anleitung und Prüfung vor dem Versand klären." }
      ],
      hinweis: "Klärung vor dem Versand fehlt.",
      hilfen: ["Was fehlt Alex, bevor verantwortbar gearbeitet werden kann?", "Kläre Auftrag und Unterstützung mit der zuständigen Ausbildungsperson, bevor etwas hinausgeht."]
    },
    {
      id: "k1", teil: "kontrolle", titel: "K1 – Handlungsfähigkeit", flag: "handlungsfaehigkeitErkannt",
      prompt: "Woran zeigt sich berufliche Handlungsfähigkeit am besten?",
      options: [
        { value: "a", label: "Alex kopiert einen unbekannten Text, ohne ihn zu verstehen." },
        { value: "b", label: "Alex prüft fehlende Angaben, begründet die Rückfrage und bespricht den Entwurf." },
        { value: "c", label: "Alex kennt nur die Farbe der Versandtaste." }
      ],
      aufloesung: "Richtig ist b: Alex verbindet Prüfen, Begründen und begleitetes Handeln. Ein einzelner auswendig gelernter Handgriff reicht dafür nicht."
    },
    {
      id: "k2", teil: "kontrolle", titel: "K2 – Ausbildungsplanung", flag: "ausbildungsplanErkannt",
      prompt: "Welches Dokument konkretisiert im Betrieb die zeitliche und inhaltliche Ausbildungsplanung?",
      options: [
        { value: "a", label: "Der betriebliche Ausbildungsplan." },
        { value: "b", label: "Die Kundenanfrage." },
        { value: "c", label: "Der Speiseplan." }
      ],
      aufloesung: "Richtig ist a: Der Plan konkretisiert die betriebliche Ausbildung, nicht eine Kundenanfrage."
    },
    {
      id: "k3", teil: "kontrolle", titel: "K3 – Duales System", flag: "dualesSystemErkannt",
      prompt: "Welche Aussage zum dualen System trifft zu?",
      options: [
        { value: "a", label: "Im Betrieb wird nie erklärt, in der Schule nie praktisch gearbeitet." },
        { value: "b", label: "Eine Ausbildungsordnung ist der zweite Lernort." },
        { value: "c", label: "Betrieb und Berufsschule leisten unterschiedliche, sich ergänzende Beiträge zur Ausbildung." }
      ],
      aufloesung: "Richtig ist c: Beide Lernorte ergänzen sich; die reine Trennung Praxis/Theorie greift zu kurz."
    },
    {
      id: "k4", teil: "kontrolle", titel: "K4 – Aufgaben in der Ausbildung", flag: "ausbildungszweckErkannt",
      prompt: "Was lässt sich aus dem gelesenen § 14 Absatz 3 BBiG ableiten?",
      options: [
        { value: "a", label: "Jede beliebige Aufgabe ist zulässig, wenn sie schnell erledigt wird." },
        { value: "b", label: "Übertragene Aufgaben müssen dem Ausbildungszweck dienen und den körperlichen Kräften angemessen sein." },
        { value: "c", label: "Der betriebliche Ausbildungsplan ersetzt den Berufsschulbesuch." }
      ],
      aufloesung: "Richtig ist b: Das entspricht der gelesenen Vorgabe zu Ausbildungsaufgaben."
    }
  ];

  /* Fester Schlüssel. Clientseitiger Quellcode ist kein Geheimnisspeicher; die Ansicht verwendet ihn nur nach der Auswertung. */
  var SCHLUESSEL = { a1: "a", a2: "b", a3: "c", a4: "a", a5: "c", k1: "b", k2: "a", k3: "c", k4: "b" };
  var IDS = FRAGEN.map(function (f) { return f.id; });
  var A_IDS = IDS.filter(function (id) { return id.charAt(0) === "a"; });
  var K_IDS = IDS.filter(function (id) { return id.charAt(0) === "k"; });
  var STATUS_TEXT = {
    unbeantwortet: "Noch nicht beantwortet",
    neutral: "Beantwortet, noch nicht ausgewertet",
    richtig: "\u2713 Richtig",
    falsch: "\u2717 Noch nicht richtig",
    veraltet: "\u21BB Antwort geändert – bitte erneut auswerten"
  };

  function frage(id) {
    for (var i = 0; i < FRAGEN.length; i += 1) if (FRAGEN[i].id === id) return FRAGEN[i];
    return null;
  }

  function leer() {
    return { v: SCHEMA, answers: {}, bewertet: {}, hilfen: {}, finish: false, notizenSpeichern: false, notizen: {}, selbstcheck: {} };
  }

  function istWert(value) { return value === "a" || value === "b" || value === "c"; }

  /* Zustand eines Frageblocks: unbeantwortet | richtig | falsch | veraltet. */
  function status(state, id) {
    var antwort = state.answers[id];
    if (!istWert(antwort)) return "unbeantwortet";
    var bewertet = state.bewertet[id];
    if (!istWert(bewertet)) return "unbeantwortet";
    if (bewertet !== antwort) return "veraltet";
    return bewertet === SCHLUESSEL[id] ? "richtig" : "falsch";
  }

  function flags(state, ids) {
    var out = {};
    (ids || IDS).forEach(function (id) { out[frage(id).flag] = status(state, id) === "richtig"; });
    return out;
  }

  function anzahlRichtig(state, ids) {
    return (ids || IDS).filter(function (id) { return status(state, id) === "richtig"; }).length;
  }

  function uebungFreigegeben(state) { return anzahlRichtig(state, A_IDS) === A_IDS.length; }
  function kontrolleBestanden(state) { return anzahlRichtig(state, K_IDS) === K_IDS.length; }
  function abschlussMoeglich(state) { return uebungFreigegeben(state) && kontrolleBestanden(state); }
  function abgeschlossen(state) { return state.finish === true && abschlussMoeglich(state); }

  /* Wertet die übergebenen Blöcke aus. Fehlende Antworten bleiben unbeantwortet und werden nicht als falsch gezählt. */
  function auswerten(state, ids) {
    var fehlend = [];
    (ids || IDS).forEach(function (id) {
      if (istWert(state.answers[id])) state.bewertet[id] = state.answers[id];
      else { delete state.bewertet[id]; fehlend.push(id); }
    });
    return { fehlend: fehlend };
  }

  /* Eine Antwortänderung setzt nur die betroffene Bewertung auf veraltet (über den Vergleich mit dem Snapshot) und sperrt den Abschluss. */
  function antworten(state, id, wert) {
    if (!frage(id) || !istWert(wert)) return false;
    state.answers[id] = wert;
    state.finish = false;
    return true;
  }

  function hilfeAufrufen(state, id) {
    var f = frage(id);
    if (!f || !f.hilfen) return 0;
    var stufe = Math.min((state.hilfen[id] || 0) + 1, f.hilfen.length);
    state.hilfen[id] = stufe;
    return stufe;
  }

  function abschlussVersuchen(state) {
    state.finish = abschlussMoeglich(state);
    return state.finish;
  }

  /* Ansichtsmodell: Hinweise und Auflösungen nur nach der Auswertung und nur, solange die Bewertung aktuell ist. */
  function ansicht(state, id) {
    var f = frage(id);
    var s = status(state, id);
    var out = {
      id: id,
      status: s,
      statusText: s === "unbeantwortet" && istWert(state.answers[id]) ? STATUS_TEXT.neutral : STATUS_TEXT[s],
      meldung: "",
      hinweis: null,
      aufloesung: null,
      hilfen: []
    };
    if (s === "richtig") out.meldung = "Richtig. Deine Antwort passt zur Aufgabe.";
    if (s === "falsch") out.meldung = "Noch nicht richtig.";
    if (s === "veraltet") out.meldung = "Antwort geändert – bitte erneut auswerten.";
    if (s === "falsch" && f.hinweis) out.hinweis = f.hinweis;
    if ((s === "richtig" || s === "falsch") && f.aufloesung) out.aufloesung = f.aufloesung;
    if (f.hilfen) out.hilfen = f.hilfen.slice(0, state.hilfen[id] || 0);
    return out;
  }

  /* Persistenz */
  function serialisieren(state) {
    var data = {
      v: SCHEMA,
      answers: state.answers,
      bewertet: state.bewertet,
      hilfen: state.hilfen,
      finish: abgeschlossen(state),
      notizenSpeichern: !!state.notizenSpeichern,
      selbstcheck: state.selbstcheck
    };
    if (state.notizenSpeichern) data.notizen = state.notizen;
    return JSON.stringify(data);
  }

  function bereinigt(quelle, nurWerte) {
    var out = {};
    if (!quelle || typeof quelle !== "object") return out;
    IDS.forEach(function (id) {
      if (nurWerte ? istWert(quelle[id]) : Number.isInteger(quelle[id]) && quelle[id] >= 0 && quelle[id] <= 2) out[id] = quelle[id];
    });
    return out;
  }

  /* Unbekannte Schema-Version oder beschädigte Daten ergeben einen leeren Stand. */
  function parsen(raw) {
    var state = leer();
    if (!raw) return state;
    try {
      var saved = JSON.parse(raw);
      if (!saved || typeof saved !== "object" || saved.v !== SCHEMA) return state;
      state.answers = bereinigt(saved.answers, true);
      state.bewertet = bereinigt(saved.bewertet, true);
      state.hilfen = bereinigt(saved.hilfen, false);
      state.notizenSpeichern = saved.notizenSpeichern === true;
      if (state.notizenSpeichern && saved.notizen && typeof saved.notizen === "object") {
        ["start", "transfer"].forEach(function (name) {
          if (typeof saved.notizen[name] === "string") state.notizen[name] = saved.notizen[name].slice(0, 2000);
        });
      }
      if (saved.selbstcheck && typeof saved.selbstcheck === "object") {
        ["lernorte", "zusammenhang", "klaerung"].forEach(function (name) {
          if (saved.selbstcheck[name] === true) state.selbstcheck[name] = true;
        });
      }
      state.finish = saved.finish === true && abschlussMoeglich(state);
    } catch (e) { return leer(); }
    return state;
  }

  function speichern(storage, state) {
    try { storage.setItem(KEY, serialisieren(state)); return true; } catch (e) { return false; }
  }

  function laden(storage) {
    try { return parsen(storage.getItem(KEY)); } catch (e) { return leer(); }
  }

  function fortschritt(state) {
    return Math.round((anzahlRichtig(state) + (abgeschlossen(state) ? 1 : 0)) / (IDS.length + 1) * 100);
  }

  var api = {
    KEY: KEY, SCHEMA: SCHEMA, STEPS: STEPS, FRAGEN: FRAGEN, A_IDS: A_IDS, K_IDS: K_IDS, STATUS_TEXT: STATUS_TEXT,
    leer: leer, status: status, flags: flags, anzahlRichtig: anzahlRichtig,
    uebungFreigegeben: uebungFreigegeben, kontrolleBestanden: kontrolleBestanden, abschlussMoeglich: abschlussMoeglich,
    abgeschlossen: abgeschlossen, auswerten: auswerten, antworten: antworten, hilfeAufrufen: hilfeAufrufen,
    abschlussVersuchen: abschlussVersuchen, ansicht: ansicht, serialisieren: serialisieren, parsen: parsen,
    speichern: speichern, laden: laden, fortschritt: fortschritt
  };
  global.LF1_DUAL = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (!global.document) return;

  /* Oberfläche */
  var doc = global.document;
  var state = leer();

  function $(id) { return doc.getElementById(id); }

  function sichern() {
    var ok;
    try { ok = speichern(global.localStorage, state); } catch (e) { ok = false; }
    var hinweis = $("speicher-status");
    if (hinweis) {
      hinweis.textContent = ok ? "" : "Hinweis: Der Lernstand konnte in diesem Browser nicht gespeichert werden. Du kannst trotzdem weiterlernen; beim Schließen der Seite geht er verloren.";
      hinweis.hidden = ok;
    }
  }

  function benachrichtigen() {
    if (global.LERNFORTSCHRITT) global.LERNFORTSCHRITT.benachrichtigen();
  }

  function block(f) {
    var wrap = doc.createElement("section");
    var h = doc.createElement("h3");
    var field = doc.createElement("fieldset");
    var legend = doc.createElement("legend");
    var group = doc.createElement("div");
    var badge = doc.createElement("p");
    var meldung = doc.createElement("div");
    wrap.className = "dual-block";
    wrap.id = "block-" + f.id;
    h.id = "titel-" + f.id;
    h.tabIndex = -1;
    h.textContent = f.titel;
    legend.textContent = f.prompt;
    group.className = "dual-optionen";
    f.options.forEach(function (option) {
      var label = doc.createElement("label");
      var input = doc.createElement("input");
      var text = doc.createElement("span");
      input.type = "radio";
      input.name = f.id;
      input.value = option.value;
      label.className = "dual-option";
      text.textContent = option.label;
      label.append(input, text);
      input.addEventListener("change", function () {
        antworten(state, f.id, option.value);
        sichern();
        render();
        benachrichtigen();
      });
      group.appendChild(label);
    });
    field.append(legend, group);
    badge.id = "status-" + f.id;
    badge.className = "dual-status";
    meldung.id = "meldung-" + f.id;
    meldung.className = "dual-meldung";
    meldung.setAttribute("aria-live", "polite");
    meldung.hidden = true;
    wrap.append(h, field, badge, meldung);
    if (f.hilfen) {
      var hilfe = doc.createElement("div");
      var knopf = doc.createElement("button");
      var liste = doc.createElement("div");
      hilfe.className = "dual-hilfe";
      knopf.type = "button";
      knopf.className = "knopf";
      knopf.id = "hilfe-knopf-" + f.id;
      knopf.addEventListener("click", function () {
        hilfeAufrufen(state, f.id);
        sichern();
        render();
        liste.focus();
      });
      liste.id = "hilfe-" + f.id;
      liste.tabIndex = -1;
      liste.setAttribute("aria-live", "polite");
      hilfe.append(knopf, liste);
      wrap.appendChild(hilfe);
    }
    return wrap;
  }

  function renderBlock(f) {
    var v = ansicht(state, f.id);
    var meldung = $("meldung-" + f.id);
    $("block-" + f.id).setAttribute("data-status", v.status);
    doc.querySelectorAll('input[name="' + f.id + '"]').forEach(function (input) {
      input.checked = state.answers[f.id] === input.value;
    });
    $("status-" + f.id).textContent = v.statusText;
    meldung.textContent = "";
    var teile = [];
    if (v.meldung) teile.push(v.meldung);
    if (v.hinweis) teile.push("Hinweis: " + v.hinweis);
    if (v.aufloesung) teile.push(v.aufloesung);
    teile.forEach(function (t) {
      var p = doc.createElement("p");
      p.textContent = t;
      meldung.appendChild(p);
    });
    if (v.status === "falsch") {
      var link = doc.createElement("a");
      link.href = "#titel-" + f.id;
      link.textContent = "Fehler bearbeiten";
      link.addEventListener("click", function (e) { e.preventDefault(); springen(f.id); });
      meldung.appendChild(link);
    }
    meldung.hidden = !teile.length;
    if (f.hilfen) {
      var stufe = v.hilfen.length;
      var liste = $("hilfe-" + f.id);
      var knopf = $("hilfe-knopf-" + f.id);
      liste.textContent = "";
      v.hilfen.forEach(function (text, i) {
        var p = doc.createElement("p");
        p.textContent = "Hilfe " + (i + 1) + ": " + text;
        liste.appendChild(p);
      });
      knopf.hidden = stufe >= f.hilfen.length;
      knopf.textContent = "Hilfe " + (stufe + 1) + " anzeigen";
    }
  }

  function springen(id) {
    step(STEP_VON_BLOCK[id.charAt(0)], true);
    var ziel = $("titel-" + id);
    if (ziel) { ziel.focus(); ziel.scrollIntoView(); }
  }

  function zusammenfassung(ids, boxId, name, erfolg) {
    var box = $(boxId);
    var richtig = anzahlRichtig(state, ids);
    var veraltet = ids.filter(function (id) { return status(state, id) === "veraltet"; }).length;
    var ohne = ids.filter(function (id) { return !istWert(state.answers[id]); }).length;
    var h = doc.createElement("h3");
    var p = doc.createElement("p");
    var teile = [];
    box.textContent = "";
    h.textContent = name + ": " + richtig + " von " + ids.length + " aktuell richtig";
    if (ohne) teile.push(ohne + " Aufgabe(n) ohne Antwort.");
    if (veraltet) teile.push(veraltet + " Bewertung(en) veraltet – bitte erneut auswerten.");
    if (richtig === ids.length) teile.push(erfolg);
    p.textContent = teile.join(" ");
    box.append(h, p);
  }

  function render() {
    FRAGEN.forEach(renderBlock);
    var n = fortschritt(state);
    $("fortschritt-balken").style.width = n + "%";
    $("fortschritt-text").textContent = "Fortschritt: " + n + " %";
    $("abschluss-status").textContent = [
      uebungFreigegeben(state) ? "Übung: vollständig richtig und aktuell." : "Übung: noch nicht vollständig richtig und aktuell.",
      kontrolleBestanden(state) ? "Lernkontrolle: vollständig richtig und aktuell." : "Lernkontrolle: noch nicht vollständig richtig und aktuell.",
      abgeschlossen(state) ? "Die Lektion ist abgeschlossen." : "Abschluss gesperrt, bis Übung und Lernkontrolle vollständig richtig und aktuell sind."
    ].join(" ");
  }

  function step(id, ohneFokus) {
    STEPS.forEach(function (name) { $(name).hidden = name !== id; });
    doc.querySelectorAll(".schritt-knopf").forEach(function (button) {
      if (button.dataset.ziel === id) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    if (id === "abschluss") {
      abschlussVersuchen(state);
      sichern();
      benachrichtigen();
    }
    render();
    if (!ohneFokus) {
      $("hauptinhalt").focus();
      global.scrollTo(0, 0);
    }
  }

  function notizen() {
    var cb = $("notizen-speichern");
    cb.checked = state.notizenSpeichern;
    [["notiz-start", "start"], ["notiz-transfer", "transfer"]].forEach(function (paar) {
      var feld = $(paar[0]);
      feld.value = state.notizen[paar[1]] || "";
      feld.addEventListener("input", function () {
        state.notizen[paar[1]] = feld.value.slice(0, 2000);
        if (state.notizenSpeichern) sichern();
      });
    });
    cb.addEventListener("change", function () {
      state.notizenSpeichern = cb.checked;
      state.notizen = { start: $("notiz-start").value, transfer: $("notiz-transfer").value };
      sichern();
    });
    [["check-lernorte", "lernorte"], ["check-zusammenhang", "zusammenhang"], ["check-klaerung", "klaerung"]].forEach(function (paar) {
      var box = $(paar[0]);
      box.checked = state.selbstcheck[paar[1]] === true;
      box.addEventListener("change", function () { state.selbstcheck[paar[1]] = box.checked; sichern(); });
    });
  }

  function pruefen(ids, boxId, name, erfolg) {
    return function () {
      var res = auswerten(state, ids);
      sichern();
      render();
      res.fehlend.forEach(function (id) {
        var m = $("meldung-" + id);
        m.textContent = "Bitte wähle eine Antwort.";
        m.hidden = false;
      });
      zusammenfassung(ids, boxId, name, erfolg);
      $(boxId).hidden = false;
      benachrichtigen();
    };
  }

  FRAGEN.forEach(function (f) { $(f.teil === "uebung" ? "uebung-fragen" : "kontrolle-fragen").appendChild(block(f)); });
  doc.querySelectorAll("[data-ziel]").forEach(function (button) {
    button.addEventListener("click", function () { step(button.dataset.ziel); });
  });
  doc.querySelectorAll("[data-weiter]").forEach(function (button) {
    button.addEventListener("click", function () { step(button.dataset.weiter); });
  });
  $("uebung-pruefen").addEventListener("click", pruefen(A_IDS, "uebung-ergebnis", "Übung", "Die Übung ist freigegeben."));
  $("kontrolle-pruefen").addEventListener("click", pruefen(K_IDS, "kontrolle-ergebnis", "Lernkontrolle", "Das Ziel der Lernkontrolle ist erreicht."));
  $("reset-alles").addEventListener("click", function () {
    if (!global.confirm("Gespeicherten Lernfortschritt dieser Lektion zurücksetzen?")) return;
    state = leer();
    doc.querySelectorAll("textarea").forEach(function (t) { t.value = ""; });
    doc.querySelectorAll('input[type="checkbox"]').forEach(function (c) { c.checked = false; });
    $("uebung-ergebnis").hidden = true;
    $("kontrolle-ergebnis").hidden = true;
    try { global.localStorage.removeItem(KEY); } catch (e) { /* Speicher verweigert */ }
    benachrichtigen();
    step("start");
  });

  state = laden(global.localStorage);
  notizen();
  render();
})(typeof window !== "undefined" ? window : globalThis);
