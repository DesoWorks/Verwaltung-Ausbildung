/* Lernfeld 2: Termine und Sitzungen. Grundlage: lokaler KMK-Rahmenlehrplan, Seiten 10–11. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf2-termine.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
    {
      id: "q1",
      prompt: "Mira trägt eine einzelne Kundenbesprechung und die wöchentliche Teamsitzung ein. Wie unterscheidet sie die Termine?",
      correct: "termin",
      options: [
        { value: "gleich", label: "Beides als wöchentlichen Termin eintragen", feedback: "Nur die Teamsitzung wiederholt sich jede Woche. Die einzelne Kundenbesprechung ist ein Einzeltermin." },
        { value: "termin", label: "Die Kundenbesprechung als Einzeltermin und die Teamsitzung als Serientermin eintragen", feedback: "Richtig. Ein Einzeltermin findet einmal statt. Ein Serientermin wiederholt sich nach einem vereinbarten Muster." },
        { value: "weglassen", label: "Nur die Kundenbesprechung eintragen, weil sich alle an das Team erinnern", feedback: "Auch eine regelmäßige Teamsitzung gehört in den Terminplan. Als Serientermin bleibt ihre Wiederholung sichtbar." }
      ]
    },
    {
      id: "q2",
      prompt: "Mira bereitet die Teamsitzung vor. Was hilft dem Team, gemeinsam zu starten?",
      correct: "vorbereiten",
      options: [
        { value: "abwarten", label: "Die Themen erst während der Sitzung sammeln und den Raum offenlassen", feedback: "Ohne Themen und geklärten Ort weiß das Team nicht, worauf es sich vorbereiten soll. Kläre beides vorher." },
        { value: "vorbereiten", label: "Ziel, Themen, Beteiligte, Zeit und Raum oder Zugang klären und Unterlagen bereitstellen", feedback: "Richtig. Mit einer Tagesordnung kennt das Team die Themen. Zeit, Ort oder digitaler Zugang und Unterlagen gehören ebenfalls zur Vorbereitung." },
        { value: "ergebnis", label: "Schon vorher aufschreiben, was das Team angeblich entschieden hat", feedback: "Die Ergebnisse stehen erst nach der Besprechung fest. Bereite die Themen vor, statt Entscheidungen zu erfinden." }
      ]
    },
    {
      id: "q3",
      prompt: "Das Team hat die Themen für eine Kundenmappe festgelegt. Was gehört ins einfache Ergebnisprotokoll?",
      correct: "protokoll",
      options: [
        { value: "wunsch", label: "Miras eigene Wunschlösung, auch wenn das Team anders entschieden hat", feedback: "Ein Ergebnisprotokoll hält die gemeinsamen Ergebnisse fest. Eigene Wünsche ersetzen keine vereinbarte Entscheidung." },
        { value: "themen", label: "Nur die geplanten Themen, ohne Ergebnisse oder Aufgaben", feedback: "Die geplanten Themen gehören zur Tagesordnung. Nach der Sitzung brauchst du auch die Ergebnisse und die vereinbarten Aufgaben." },
        { value: "protokoll", label: "Die Entscheidung und die vereinbarten Aufgaben mit den zuständigen Personen", feedback: "Richtig. Das Ergebnisprotokoll zeigt, was entschieden wurde und wer welche Aufgabe übernimmt. Eine reine Themenliste reicht dafür nicht." }
      ]
    }
  ];
  var LOCAL_TERMS = [
    { begriff: "Serientermin", erklaerung: "Ein Termin, der sich nach einem vereinbarten Muster wiederholt, zum Beispiel eine wöchentliche Teamsitzung." },
    { begriff: "Tagesordnung", erklaerung: "Die geordnete Liste der Themen, die in einer Sitzung besprochen werden sollen." },
    { begriff: "Ergebnisprotokoll", erklaerung: "Eine kurze schriftliche Zusammenfassung der Ergebnisse einer Sitzung. Sie hält auch vereinbarte Aufgaben und die zuständigen Personen fest." }
  ];
  var TERMS = LOCAL_TERMS.map(function (entry) { return entry.begriff; });

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, TERMS: TERMS, progress: progress };
  global.LF2_TERMINE = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (!global.document) return;

  var doc = global.document;
  var state = { answers: {}, finish: false };

  function $(id) { return doc.getElementById(id); }

  function load() {
    try {
      var saved = JSON.parse(global.localStorage.getItem(KEY) || "null");
      if (saved) {
        state.answers = saved.answers || {};
        state.finish = !!saved.finish;
      }
    } catch (e) { /* gespeicherter Stand ist optional */ }
  }

  function save() {
    try { global.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* privater Modus darf scheitern */ }
  }

  function update() {
    var n = progress(state);
    $("fortschritt-balken").style.width = n + "%";
    $("fortschritt-text").textContent = "Fortschritt: " + n + " %";
    var status = $("abschluss-status");
    if (status) {
      var richtig = QUESTIONS.reduce(function (count, q) {
        return count + (state.answers[q.id] === q.correct ? 1 : 0);
      }, 0);
      status.textContent = richtig === QUESTIONS.length
        ? "Die Übung ist vollständig richtig. Du kannst sie jederzeit wiederholen."
        : "Die Übung ist noch nicht vollständig richtig. Du kannst sie ohne Zeitdruck wiederholen.";
    }
  }

  function step(id) {
    STEPS.forEach(function (name) { $(name).hidden = name !== id; });
    doc.querySelectorAll(".schritt-knopf").forEach(function (button) {
      if (button.dataset.ziel === id) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    if (id === "abschluss") {
      state.finish = true;
      save();
      if (global.LERNFORTSCHRITT) global.LERNFORTSCHRITT.benachrichtigen();
    }
    update();
    $("hauptinhalt").focus();
    global.scrollTo(0, 0);
  }

  function buildTerms() {
    var host = $("fachwoerter-liste");
    TERMS.forEach(function (term) {
      var item = (global.GLOSSAR || []).concat(LOCAL_TERMS).find(function (entry) { return entry.begriff === term; });
      if (!item) return;
      var details = doc.createElement("details");
      var summary = doc.createElement("summary");
      var text = doc.createElement("p");
      details.className = "fachwort-hinweis";
      summary.textContent = item.begriff;
      text.textContent = item.erklaerung;
      details.append(summary, text);
      host.appendChild(details);
    });
  }

  function clearResult() {
    var box = $("termine-ergebnis");
    box.hidden = true;
    box.textContent = "";
    QUESTIONS.forEach(function (q) {
      var feedback = $("feedback-" + q.id);
      if (!feedback) return;
      feedback.hidden = true;
      feedback.textContent = "";
    });
  }

  function buildQuestions() {
    var host = $("termine-fragen");
    QUESTIONS.forEach(function (q, index) {
      var field = doc.createElement("fieldset");
      var legend = doc.createElement("legend");
      var group = doc.createElement("div");
      field.className = "rollen-frage";
      legend.textContent = (index + 1) + ". " + q.prompt;
      field.appendChild(legend);
      group.className = "rollen-optionen";
      q.options.forEach(function (option) {
        var label = doc.createElement("label");
        var input = doc.createElement("input");
        var text = doc.createElement("span");
        input.type = "radio";
        input.name = q.id;
        input.value = option.value;
        if (state.answers[q.id] === option.value) input.checked = true;
        label.className = "rollen-option";
        text.textContent = option.label;
        label.append(input, text);
        input.addEventListener("change", clearResult);
        group.appendChild(label);
      });
      field.appendChild(group);
      var feedback = doc.createElement("p");
      feedback.id = "feedback-" + q.id;
      feedback.className = "rollen-feedback";
      feedback.hidden = true;
      feedback.setAttribute("aria-live", "polite");
      field.appendChild(feedback);
      host.appendChild(field);
    });
  }

  function selected(q) {
    var input = doc.querySelector('input[name="' + q.id + '"]:checked');
    return input ? input.value : "";
  }

  function check() {
    var box = $("termine-ergebnis");
    var correct = 0;
    var unanswered = 0;
    box.textContent = "";
    var heading = doc.createElement("h3");
    box.appendChild(heading);
    QUESTIONS.forEach(function (q, index) {
      var value = selected(q);
      var option = q.options.find(function (item) { return item.value === value; });
      var isCorrect = !!option && value === q.correct;
      var row = doc.createElement("p");
      row.textContent = (isCorrect ? "Richtig: " : value ? "Noch nicht richtig: " : "Nicht beantwortet: ")
        + "Aufgabe " + (index + 1) + ". "
        + (option ? option.feedback : "Wähle eine Antwort. Du kannst es danach erneut prüfen.");
      box.appendChild(row);
      if (isCorrect) correct += 1;
      if (!value) unanswered += 1;
      var feedback = $("feedback-" + q.id);
      feedback.textContent = option ? option.feedback : "Noch nicht beantwortet. Wähle eine Antwort und prüfe erneut.";
      feedback.hidden = false;
    });
    heading.textContent = correct === QUESTIONS.length
      ? "Alle Antworten richtig"
      : unanswered === QUESTIONS.length
        ? "Noch nichts ausgewählt"
        : correct
          ? "Teilweise richtig"
          : "Noch nicht richtig";
    var summary = doc.createElement("p");
    summary.textContent = unanswered
      ? (unanswered === 1 ? "Eine Aufgabe ist noch unbeantwortet." : unanswered + " Aufgaben sind noch unbeantwortet.")
      : correct === QUESTIONS.length
        ? "Du hast alle drei Situationen passend eingeordnet."
        : "Lies die Hinweise und versuche es erneut. Es gibt keinen Zeitdruck.";
    box.appendChild(summary);
    box.hidden = false;
    state.answers = {};
    QUESTIONS.forEach(function (q) { state.answers[q.id] = selected(q); });
    save();
    update();
  }

  function resetAnswers() {
    state.answers = {};
    save();
    doc.querySelectorAll('#termine-fragen input[type="radio"]').forEach(function (input) { input.checked = false; });
    clearResult();
    update();
  }

  doc.querySelectorAll("[data-ziel]").forEach(function (button) {
    button.addEventListener("click", function () { step(button.dataset.ziel); });
  });
  doc.querySelectorAll("[data-weiter]").forEach(function (button) {
    button.addEventListener("click", function () { step(button.dataset.weiter); });
  });
  $("antworten-pruefen").addEventListener("click", check);
  $("uebung-reset").addEventListener("click", resetAnswers);
  $("reset-alles").addEventListener("click", function () {
    if (global.confirm("Gespeicherten Lernfortschritt dieser Lektion zurücksetzen?")) {
      state = { answers: {}, finish: false };
      save();
      if (global.LERNFORTSCHRITT) global.LERNFORTSCHRITT.benachrichtigen();
      step("start");
    }
  });

  load();
  buildTerms();
  buildQuestions();
  update();
})(typeof window !== "undefined" ? window : globalThis);
