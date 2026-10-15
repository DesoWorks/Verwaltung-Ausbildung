/* Lernfeld 1: Rechte und Pflichten im Ausbildungsverhältnis. Eine kleine, wiederholbare Lernorientierung. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf1-rechte.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
    {
      id: "q1",
      prompt: "Jonas hält seinen Ausbildungsvertrag in der Hand. Was regelt dieser Vertrag?",
      correct: "ausbildung",
      options: [
        { value: "arbeit", label: "Ein späteres Arbeitsverhältnis nach der Ausbildung", feedback: "Ein späteres Arbeitsverhältnis wäre ein anderer Vertrag, der Arbeitsvertrag. Der Ausbildungsvertrag regelt das Ausbildungsverhältnis." },
        { value: "ausbildung", label: "Das Ausbildungsverhältnis, in dem Jonas jetzt lernt", feedback: "Richtig. Der Ausbildungsvertrag regelt das Ausbildungsverhältnis und nicht ein späteres Arbeitsverhältnis." },
        { value: "alles", label: "Alle Regeln des Betriebs, auch für andere Beschäftigte", feedback: "Der Ausbildungsvertrag gilt für das Ausbildungsverhältnis. Für andere Beschäftigte gelten ihre eigenen Verträge." }
      ]
    },
    {
      id: "q2",
      prompt: "Jonas versteht eine Pflicht in seinem Vertrag nicht. Was ist eine gute nächste Handlung?",
      correct: "nachfragen",
      options: [
        { value: "ignorieren", label: "Die Pflicht ignorieren, weil er sie nicht versteht", feedback: "Eine Pflicht fällt nicht weg, nur weil sie unklar ist. Frage lieber nach, was gemeint ist." },
        { value: "nachfragen", label: "Nachfragen, was gemeint ist", feedback: "Richtig. Du darfst nachfragen. Rechte und Pflichten stehen im Vertrag und in den Gesetzen, und du musst nicht alles auswendig kennen." },
        { value: "auswendig", label: "Erst alle Paragraphen auswendig lernen", feedback: "Das ist nicht nötig. Du musst keine Paragraphen auswendig können. Wichtig ist, dass du weißt, wo es steht, und dass du nachfragen darfst." }
      ]
    },
    {
      id: "q3",
      prompt: "Jonas hat ein Problem mit einer Ausbildungsaufgabe. Wen fragt er zuerst?",
      correct: "ausbilder",
      options: [
        { value: "ausbilder", label: "Seine Ausbilderin oder seinen Ausbilder", feedback: "Richtig. Bei einem Problem mit der Ausbildung ist die Ausbilderin oder der Ausbilder die erste Ansprechperson." },
        { value: "jav", label: "Zuerst die Jugend- und Auszubildendenvertretung, weil sie seinen Vertrag ändert", feedback: "Die Jugend- und Auszubildendenvertretung vertritt Interessen. Sie ist nicht deine Ausbilderin und ändert nicht allein deinen Vertrag." },
        { value: "tarif", label: "Im Tarifvertrag nachsehen, weil der in jedem Betrieb gilt", feedback: "Tarifrecht gilt, wenn ein Tarifvertrag für dich gilt. Es gilt nicht automatisch in jedem Betrieb. Frage zuerst deine Ausbilderin oder deinen Ausbilder." }
      ]
    }
  ];
  var TERMS = ["Ausbildungsvertrag", "Arbeitsvertrag", "Berufsbildungsgesetz", "Jugendarbeitsschutzgesetz", "Tarifvertrag", "Jugend- und Auszubildendenvertretung"];

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, TERMS: TERMS, progress: progress };
  global.LF1_RECHTE = api;
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
      var item = (global.GLOSSAR || []).find(function (entry) { return entry.begriff === term; });
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
    var box = $("rechte-ergebnis");
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
    var host = $("rechte-fragen");
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
    var box = $("rechte-ergebnis");
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
    doc.querySelectorAll('#rechte-fragen input[type="radio"]').forEach(function (input) { input.checked = false; });
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
