/* Lernfeld 1: die eigene Rolle im Betrieb. Eine kleine, wiederholbare Lernorientierung. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf1-rolle.v1";
  var STEPS = ["start", "rollen", "uebung", "abschluss"];
  var QUESTIONS = [
    {
      id: "q1",
      prompt: "Mira lernt im fiktiven Beispiel in der Auftragsbearbeitung. Welche Rolle hat sie dort jetzt?",
      correct: "azubi",
      options: [
        { value: "arbeit", label: "Sie ist bereits Arbeitnehmerin, weil sie im Betrieb mitarbeitet", feedback: "Mitarbeit allein macht aus dem Ausbildungsverhältnis kein Arbeitsverhältnis. Mira lernt auf Grundlage des Ausbildungsvertrags." },
        { value: "azubi", label: "Sie ist Auszubildende auf Grundlage des Ausbildungsvertrags", feedback: "Richtig. Die jetzige Rolle ist das Ausbildungsverhältnis. Ein späteres Arbeitsverhältnis wäre ein anderer Vertrag." },
        { value: "betrieb", label: "Sie ist eine eigene Abteilung des Betriebs", feedback: "Eine Person ist keine Abteilung. Mira lernt in der Auftragsbearbeitung. Sie ist keine zusätzliche Organisationsebene." }
      ]
    },
    {
      id: "q2",
      prompt: "Eine Kundin fragt Mira nach einem verbindlichen Preis. Was ist eine gute nächste Handlung?",
      correct: "abstimmen",
      options: [
        { value: "zusagen", label: "Den Preis sofort zusagen, damit die Kundin nicht wartet", feedback: "Eine Zusage nach außen kann den Betrieb binden. Preise stimmst du vorher mit einer verantwortlichen Person ab." },
        { value: "abstimmen", label: "Den Preis nicht selbst zusagen und mit der verantwortlichen Person abstimmen", feedback: "Richtig. Verbindliche Preise und Zusagen nach außen gehören nicht in den eigenen Verantwortungsbereich, solange sie nicht freigegeben sind." },
        { value: "liegen", label: "Die Anfrage ohne Rückmeldung liegen lassen", feedback: "Wenn eine Aufgabe unklar oder nicht freigegeben ist, fragst du nach und sagst, was du noch klären musst." }
      ]
    },
    {
      id: "q3",
      prompt: "Mira ist unsicher, wer für eine Ausbildungsaufgabe zuständig ist. Wen fragt sie zuerst?",
      correct: "ausbilder",
      options: [
        { value: "ausbilder", label: "Ihre Ausbilderin oder ihren Ausbilder", feedback: "Richtig. Bei einer Ausbildungsaufgabe ist die Ausbilderin oder der Ausbilder die erste Ansprechperson." },
        { value: "jav", label: "Zuerst die Jugend- und Auszubildendenvertretung, weil die den Vertrag ändert", feedback: "Die Jugend- und Auszubildendenvertretung vertritt Interessen. Sie ist nicht deine Ausbilderin und ändert nicht deinen Ausbildungsvertrag." },
        { value: "kunde", label: "Die Kundin, weil die den Auftrag erteilt hat", feedback: "Die Kundin ist nicht deine Ausbilderin. Interne Zuständigkeit klärst du im Betrieb, nicht bei der Kundin." }
      ]
    }
  ];
  var TERMS = ["Ausbildungsvertrag", "Arbeitsvertrag", "Verantwortungsbereich", "Jugend- und Auszubildendenvertretung"];

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, TERMS: TERMS, progress: progress };
  global.LF1_ROLLE = api;
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
    var box = $("rollen-ergebnis");
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
    var host = $("rollen-fragen");
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
    var box = $("rollen-ergebnis");
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
      ? unanswered + " Aufgabe oder Aufgaben sind unbeantwortet."
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
    doc.querySelectorAll('#rollen-fragen input[type="radio"]').forEach(function (input) { input.checked = false; });
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
