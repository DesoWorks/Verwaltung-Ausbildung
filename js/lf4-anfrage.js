/* Lernfeld 4: Eine Anfrage an den Lieferanten schreiben. Lokale, wiederholbare Kurzlektion. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf4-anfrage.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
  {
    "id": "q1",
    "prompt": "Welche Angaben schreibt Sophie in die Anfrage?",
    "correct": "angaben-vier",
    "options": [
      {
        "value": "angaben-nur-gruss",
        "label": "Nur einen freundlichen Gruß, den Rest klärt der Lieferant",
        "feedback": "Ohne Angaben kann der Lieferant kein Angebot machen. Er muss wissen, was, wie viel, bis wann und wohin."
      },
      {
        "value": "angaben-bestellmenge-preis",
        "label": "Die Menge und einen Preis, den der Lieferant akzeptieren muss",
        "feedback": "Einen Preis diktiert man nicht. Den nennt der Lieferant in seinem Angebot."
      },
      {
        "value": "angaben-vier",
        "label": "Was sie braucht, wie viel, bis wann und wohin geliefert werden soll",
        "feedback": "Richtig. Das sind die vier Angaben, die in eine Anfrage gehören."
      }
    ]
  },
  {
    "id": "q2",
    "prompt": "Welcher Satz passt in die Anfrage?",
    "correct": "satz-angebot-bitte",
    "options": [
      {
        "value": "satz-hiermit-bestellen",
        "label": "„Hiermit bestellen wir die Ware.“",
        "feedback": "Das wäre eine Bestellung. Eine Anfrage bittet nur um ein Angebot."
      },
      {
        "value": "satz-angebot-bitte",
        "label": "„Bitte senden Sie uns ein Angebot.“",
        "feedback": "Richtig. So bittet Sophie höflich um ein Angebot, ohne zu bestellen."
      },
      {
        "value": "satz-preis-vorgeben",
        "label": "„Wir zahlen nur den Preis, den wir vorgeben.“",
        "feedback": "Das ist ein Preisdiktat. In eine Anfrage gehört kein vorgegebener Preis."
      }
    ]
  },
  {
    "id": "q3",
    "prompt": "Sophie hat die Anfrage abgeschickt. Was bedeutet das?",
    "correct": "wirkung-unverbindlich",
    "options": [
      {
        "value": "wirkung-vertrag-sofort",
        "label": "Der Vertrag mit dem Lieferanten besteht jetzt schon",
        "feedback": "Eine Anfrage ist noch kein Vertrag. Sie bittet nur um ein Angebot."
      },
      {
        "value": "wirkung-lieferpflicht",
        "label": "Der Lieferant muss jetzt auf jeden Fall liefern",
        "feedback": "Der Lieferant ist durch die Anfrage nicht gebunden. Er schickt zunächst ein Angebot."
      },
      {
        "value": "wirkung-unverbindlich",
        "label": "Die Anfrage ist unverbindlich. Ein Vertrag kann erst nach einem Angebot und einer späteren Bestellung entstehen",
        "feedback": "Richtig. Die Anfrage bindet keine der beiden Seiten."
      }
    ]
  }
];
  var LOCAL_TERMS = [
  {
    "begriff": "Anfrage",
    "erklaerung": "Eine Bitte an einen Lieferanten, ein Angebot zu schicken. Sie ist unverbindlich und noch keine Bestellung."
  },
  {
    "begriff": "Angebot",
    "erklaerung": "Die Antwort des Lieferanten auf eine Anfrage. Dort nennt er, was er liefern kann und zu welchen Bedingungen."
  },
  {
    "begriff": "Norm- und sachgerecht schreiben",
    "erklaerung": "Ein Schreiben so aufbauen, wie es für Geschäftsbriefe üblich ist, und die nötigen Angaben vollständig und klar nennen."
  }
];

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, LOCAL_TERMS: LOCAL_TERMS, progress: progress };
  global.LF4_ANFRAGE = api;
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
