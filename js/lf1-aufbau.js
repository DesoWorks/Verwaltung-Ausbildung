/* Lernfeld 1: Aufbau und Handlungsrahmen. Eine kleine, wiederholbare Lernorientierung. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf1-aufbau.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
    {
      id: "q1",
      prompt: "Mira möchte wissen, in welcher Abteilung sie arbeitet und an wen sie berichtet. Was beschreibt das?",
      correct: "aufbau",
      options: [
        { value: "aufbau", label: "Die Aufbauorganisation des Betriebs", feedback: "Richtig. Die Aufbauorganisation zeigt Abteilungen und Stellen und wer an wen berichtet." },
        { value: "ablaufschritte", label: "Die einzelnen Schritte eines Arbeitsablaufs", feedback: "Das beschreibt einen Prozess. Die Frage zielt aber auf Abteilungen und Stellen, also auf den Aufbau des Betriebs." },
        { value: "gewinn", label: "Die Gewinnziele des Betriebs", feedback: "Ziele des Betriebs sind ein anderes Thema. Hier geht es um Abteilungen, Stellen und Zuständigkeiten." }
      ]
    },
    {
      id: "q2",
      prompt: "Eine Kundenanfrage kommt an, wird weitergegeben, bearbeitet und beantwortet. Wie heißt eine solche Folge von Arbeitsschritten?",
      correct: "prozess",
      options: [
        { value: "abteilung", label: "Eine Abteilung", feedback: "Eine Abteilung ist ein Teil des Betriebsaufbaus. Die Folge von Arbeitsschritten heißt Prozess." },
        { value: "prozess", label: "Ein Geschäftsprozess", feedback: "Richtig. Ein Geschäftsprozess ist eine Folge von Arbeitsschritten, hier von der Anfrage bis zur Antwort." },
        { value: "stelle", label: "Eine einzelne Stelle", feedback: "Eine Stelle ist ein Platz im Betriebsaufbau. Die Folge der Schritte nennt man Prozess." }
      ]
    },
    {
      id: "q3",
      prompt: "Ein Lieferant bittet Mira, etwas im Namen des Betriebs zu unterschreiben. Sie ist unsicher, ob sie das darf. Was ist sinnvoll?",
      correct: "vollmacht",
      options: [
        { value: "unterschreiben", label: "Einfach unterschreiben, damit es schnell geht", feedback: "Das ist riskant. Ohne Klarheit über die Vertretungsvollmacht unterschreibst du besser nichts im Namen des Betriebs." },
        { value: "nie", label: "Grundsätzlich ablehnen, weil Auszubildende nie etwas tun dürfen", feedback: "So pauschal stimmt das nicht. Dein Handlungsrahmen wird im Betrieb festgelegt. Frage nach, was du darfst." },
        { value: "vollmacht", label: "Nachfragen, ob ihre Vertretungsvollmacht das erlaubt", feedback: "Richtig. Wie weit eine Vertretungsvollmacht reicht, legt der Betrieb fest. Im Zweifel fragst du vorher nach." }
      ]
    }
  ];
  var LOCAL_TERMS = [
    { begriff: "Aufbauorganisation", erklaerung: "Die Ordnung eines Betriebs in Abteilungen und Stellen. Sie zeigt, wer wofür zuständig ist und an wen berichtet wird." },
    { begriff: "Geschäftsprozess", erklaerung: "Eine Folge von Arbeitsschritten mit einem Ergebnis für Kunden oder den Betrieb, zum Beispiel von der Kundenanfrage bis zur Antwort." },
    { begriff: "Vertretungsvollmacht", erklaerung: "Die Erlaubnis, im Namen des Betriebs zu handeln. Wie weit sie reicht, legt der Betrieb fest. Im Zweifel fragst du nach." }
  ];

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, LOCAL_TERMS: LOCAL_TERMS, progress: progress };
  global.LF1_AUFBAU = api;
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
    var box = $("uebung-ergebnis");
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
    var host = $("uebung-fragen");
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
    var box = $("uebung-ergebnis");
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
    doc.querySelectorAll('#uebung-fragen input[type="radio"]').forEach(function (input) { input.checked = false; });
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
