/* Lernfeld 3: Formulare im Textverarbeitungsprogramm. Lokale, wiederholbare Lernorientierung. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf3-formulare.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
  {
    "id": "q1",
    "prompt": "Was legt das Formular für die Rückrufbitte fest?",
    "correct": "nur-felder-ausfuellen",
    "options": [
      {
        "value": "jede-stelle-aenderbar",
        "label": "Jede Stelle darf beim Ausfüllen frei geändert werden",
        "feedback": "Dann wäre es kein Formular, sondern ein gewöhnlicher Text. Ein Formular legt fest, welche Stellen ausgefüllt werden."
      },
      {
        "value": "nur-felder-ausfuellen",
        "label": "Welche Stellen ausgefüllt werden. Der übrige Text bleibt fest",
        "feedback": "Richtig. Name, Telefonnummer und Anliegen sind die Felder zum Ausfüllen. Der übrige Text bleibt fest."
      },
      {
        "value": "nur-unterschrift-ausfuellen",
        "label": "Nur die Unterschrift wird ausgefüllt, alles andere bleibt leer",
        "feedback": "In diesem Beispiel gibt es drei Felder zum Ausfüllen: Name, Telefonnummer und Anliegen. Eine Unterschrift kommt nicht vor."
      }
    ]
  },
  {
    "id": "q2",
    "prompt": "Warum schützt Lea den festen Text des Formulars?",
    "correct": "festtext-schuetzen",
    "options": [
      {
        "value": "felder-sperren",
        "label": "Damit niemand mehr etwas in die Felder eintragen kann",
        "feedback": "Die Felder sollen ausgefüllt werden können. Geschützt wird der feste Text, nicht die Felder."
      },
      {
        "value": "schutz-gegen-lesen",
        "label": "Damit niemand das Formular lesen darf",
        "feedback": "Der Schreibschutz verhindert Änderungen am festen Text. Lesen bleibt möglich."
      },
      {
        "value": "festtext-schuetzen",
        "label": "Damit beim Ausfüllen nicht aus Versehen die Vorlage geändert wird",
        "feedback": "Richtig. Der feste Text bleibt geschützt, nur die Felder werden ausgefüllt."
      }
    ]
  },
  {
    "id": "q3",
    "prompt": "Ein Kollege hat das Formular ausgefüllt, aber das Feld für die Telefonnummer ist leer. Was ist vor dem Versand richtig?",
    "correct": "felder-vor-versand-pruefen",
    "options": [
      {
        "value": "leere-felder-egal",
        "label": "Die Rückrufbitte senden, weil ein leeres Feld nicht so wichtig ist",
        "feedback": "Ohne Telefonnummer kann niemand zurückrufen. Ein leeres Pflichtfeld geht nicht raus."
      },
      {
        "value": "festtext-neu-schreiben",
        "label": "Den festen Text neu schreiben, damit das Feld verschwindet",
        "feedback": "Die Vorlage wird nicht verändert, nur weil eine Angabe fehlt. Die fehlende Angabe wird im Feld ergänzt."
      },
      {
        "value": "felder-vor-versand-pruefen",
        "label": "Die eingetragenen Angaben prüfen und die Telefonnummer ergänzen",
        "feedback": "Richtig. Vor dem Versand werden die eingetragenen Angaben geprüft. Das fehlende Feld wird ausgefüllt."
      }
    ]
  }
];
  var LOCAL_TERMS = [
  {
    "begriff": "Formular",
    "erklaerung": "Eine Vorlage mit festem Text und Stellen zum Ausfüllen. Beim Ausfüllen soll nur an den vorgesehenen Stellen etwas eingetragen werden."
  },
  {
    "begriff": "Formularfeld",
    "erklaerung": "Eine Stelle im Formular, die ausgefüllt werden soll, zum Beispiel für einen Namen oder eine Telefonnummer."
  },
  {
    "begriff": "Schreibschutz",
    "erklaerung": "Ein Schutz, der verhindert, dass geschützter Text versehentlich geändert wird. Bei einem Formular bleibt der feste Text unverändert, während die Felder ausgefüllt werden können."
  }
];

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, LOCAL_TERMS: LOCAL_TERMS, progress: progress };
  global.LF3_FORMULARE = api;
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
    LOCAL_TERMS.forEach(function (item) {
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
    var box = $("lektion-ergebnis");
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
    var host = $("lektion-fragen");
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
    var box = $("lektion-ergebnis");
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
    if (global.LERNFORTSCHRITT) global.LERNFORTSCHRITT.benachrichtigen();
  }

  function resetAnswers() {
    state.answers = {};
    save();
    doc.querySelectorAll('#lektion-fragen input[type="radio"]').forEach(function (input) { input.checked = false; });
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
      resetAnswers();
      if (global.LERNFORTSCHRITT) global.LERNFORTSCHRITT.benachrichtigen();
      step("start");
    }
  });

  load();
  buildTerms();
  buildQuestions();
  update();
})(typeof window !== "undefined" ? window : globalThis);
