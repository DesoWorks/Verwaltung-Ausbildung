/* Lernfeld 3: Schriftstücke vervielfältigen. Lokale, wiederholbare Kurzlektion. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf3-vervielfaeltigen.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
  {
    "id": "q1",
    "prompt": "Emre hat einen Brief auf Papier. Die Kollegin im Homeoffice braucht ihn als Datei. Was tut er?",
    "correct": "aufgabe-scannen",
    "options": [
      {
        "value": "aufgabe-kopie-posten",
        "label": "Den Brief kopieren und die Papierkopie mit der Post schicken",
        "feedback": "Die Kollegin braucht eine Datei, keine Papierkopie. Ein Papier wird mit dem Scannen zur Datei."
      },
      {
        "value": "aufgabe-scannen",
        "label": "Den Brief scannen und die Datei weitergeben",
        "feedback": "Richtig. Scannen macht aus Papier eine Datei."
      },
      {
        "value": "aufgabe-drucken-brief",
        "label": "Den Brief drucken",
        "feedback": "Drucken bringt eine Datei auf Papier. Emre hat aber schon Papier und braucht eine Datei."
      }
    ]
  },
  {
    "id": "q2",
    "prompt": "Eine Kollegin soll den fertigen Entwurf nur lesen und nichts daran ändern. Welches Format passt?",
    "correct": "format-pdf-lesen",
    "options": [
      {
        "value": "format-textdatei-aendern",
        "label": "Eine bearbeitbare Textdatei, damit sie alles ändern kann",
        "feedback": "Sie soll nichts ändern. Eine bearbeitbare Datei ist hier nicht nötig und lässt Änderungen leicht zu."
      },
      {
        "value": "format-pdf-lesen",
        "label": "Eine PDF-Datei",
        "feedback": "Richtig. PDF eignet sich, wenn ein Schriftstück nur gelesen und nicht verändert werden soll."
      },
      {
        "value": "format-einzelbilder",
        "label": "Jede Seite als einzelne Bilddatei",
        "feedback": "Das ist umständlich, und der Text lässt sich schlecht lesen und ordnen. Eine PDF-Datei hält die Seiten zusammen."
      }
    ]
  },
  {
    "id": "q3",
    "prompt": "Emre soll eine interne Unterlage mit vielen Seiten nur für das Lesen bereitstellen. Wie spart er Papier und Energie?",
    "correct": "sparen-seiten-beidseitig",
    "options": [
      {
        "value": "sparen-alles-einseitig",
        "label": "Alle Seiten einseitig für jede Person ausdrucken",
        "feedback": "Das verbraucht viel Papier. Besser sind nur nötige Seiten, beidseitig, oder gleich am Bildschirm lesen."
      },
      {
        "value": "sparen-seiten-beidseitig",
        "label": "Nur die nötigen Seiten drucken, beidseitig, oder die Unterlage gleich am Bildschirm lesen lassen",
        "feedback": "Richtig. So sparen Papier und Energie."
      },
      {
        "value": "sparen-drucker-laufen",
        "label": "Das Gerät den ganzen Tag eingeschaltet lassen, damit es bereit ist",
        "feedback": "Das verbraucht unnötig Energie. Nicht benötigte Geräte schaltet man aus oder nutzt den Energiesparmodus."
      }
    ]
  }
];
  var LOCAL_TERMS = [
  {
    "begriff": "Kopieren, Drucken, Scannen",
    "erklaerung": "Kopieren macht aus Papier wieder Papier. Drucken bringt eine Datei auf Papier. Scannen macht aus Papier eine Datei."
  },
  {
    "begriff": "Dateiformat",
    "erklaerung": "Die Art, wie eine Datei gespeichert wird. PDF eignet sich, wenn ein Schriftstück nur gelesen und nicht verändert werden soll."
  },
  {
    "begriff": "Nachhaltig vervielfältigen",
    "erklaerung": "Papier und Energie sparen, zum Beispiel nur nötige Seiten drucken, beidseitig drucken und nicht benötigte Geräte ausschalten."
  }
];

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, LOCAL_TERMS: LOCAL_TERMS, progress: progress };
  global.LF3_VERVIELFAELTIGEN = api;
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
