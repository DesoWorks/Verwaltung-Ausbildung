/* Lernfeld 4: Eine Lieferstörung sachlich melden. Lokale, wiederholbare Kurzlektion. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf4-stoerung.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
  {
    "id": "q1",
    "prompt": "Die Kartons kamen pünktlich, aber drei sind nass und unbrauchbar. Welche Störung ist das?",
    "correct": "stoerung-schlechtleistung",
    "options": [
      {
        "value": "stoerung-zu-spaet",
        "label": "Eine Nicht-Rechtzeitig-Lieferung",
        "feedback": "Die Lieferung kam pünktlich. Eine Nicht-Rechtzeitig-Lieferung läge vor, wenn die Ware zu spät käme."
      },
      {
        "value": "stoerung-schlechtleistung",
        "label": "Eine Schlechtleistung",
        "feedback": "Richtig. Die Ware kam, ist aber mangelhaft."
      },
      {
        "value": "stoerung-keine",
        "label": "Gar keine Störung, weil die Lieferung angekommen ist",
        "feedback": "Angekommen heißt nicht in Ordnung. Nasse, unbrauchbare Ware ist ein Mangel."
      }
    ]
  },
  {
    "id": "q2",
    "prompt": "Wie beschreibt Tim den Mangel?",
    "correct": "meldung-konkret",
    "options": [
      {
        "value": "meldung-empoert",
        "label": "„Das ist eine unglaubliche Schlamperei!“",
        "feedback": "Das ist ein Vorwurf, aber keine Beschreibung. Sachlich heißt: genau sagen, was los ist."
      },
      {
        "value": "meldung-vage",
        "label": "„Mit der Lieferung stimmt irgendetwas nicht.“",
        "feedback": "Das ist zu ungenau. Der Lieferant muss wissen, was genau betroffen ist."
      },
      {
        "value": "meldung-konkret",
        "label": "„Drei von zehn Kartons waren beim Auspacken nass, das Papier ist unbrauchbar.“",
        "feedback": "Richtig. Das ist konkret, sachlich und ohne Vorwurf."
      }
    ]
  },
  {
    "id": "q3",
    "prompt": "Was tut Tim nach der Beschreibung noch?",
    "correct": "schritt-vorschlag-info",
    "options": [
      {
        "value": "schritt-schweigen",
        "label": "Nichts, er wartet, ob der Lieferant es selbst merkt",
        "feedback": "Dann erfährt der Lieferant nichts. Tim informiert den Vertragspartner."
      },
      {
        "value": "schritt-alles-abbrechen",
        "label": "Er teilt mit, dass der Betrieb nie wieder bei diesem Lieferanten kauft",
        "feedback": "Das löst die Störung nicht und ist nicht sachlich. Besser ist ein Lösungsvorschlag."
      },
      {
        "value": "schritt-vorschlag-info",
        "label": "Er nennt einen Lösungsvorschlag, zum Beispiel Ersatz für die drei Kartons, und teilt ihn dem Lieferanten mit",
        "feedback": "Richtig. So kann der Lieferant gezielt reagieren."
      }
    ]
  }
];
  var LOCAL_TERMS = [
  {
    "begriff": "Nicht-Rechtzeitig-Lieferung",
    "erklaerung": "Die Ware kommt nicht zum vereinbarten Termin, sondern später."
  },
  {
    "begriff": "Schlechtleistung",
    "erklaerung": "Die Ware kommt, ist aber mangelhaft, zum Beispiel beschädigt oder nicht wie vereinbart."
  },
  {
    "begriff": "Sachlich melden",
    "erklaerung": "Genau sagen, was los ist, ohne Vorwürfe, und einen Lösungsvorschlag nennen. So kann der Vertragspartner schnell reagieren."
  }
];

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, LOCAL_TERMS: LOCAL_TERMS, progress: progress };
  global.LF4_STOERUNG = api;
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
