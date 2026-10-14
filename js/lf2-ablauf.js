/* Lernfeld 2: den eigenen Arbeitsablauf von Störungen trennen. Eine kleine, wiederholbare Lernorientierung. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf2-ablauf.v1";
  var STEPS = ["start", "ablauf", "uebung", "abschluss"];
  var QUESTIONS = [
    {
      id: "q1",
      prompt: "Mira schaut beim Ablegen alle paar Minuten ins Postfach, obwohl sie nichts Dringendes erwartet. Was ist das?",
      correct: "zeitdieb",
      options: [
        { value: "stoerung", label: "Eine Störung, weil sie von außen kommt", feedback: "Das Nachsehen geht von Mira selbst aus. Eine Störung kommt von außen, zum Beispiel durch einen Anruf." },
        { value: "zeitdieb", label: "Ein Zeitdieb, weil es Zeit kostet und hier nichts bringt", feedback: "Richtig. Mira unterbricht sich selbst und verliert dabei Zeit und Überblick. Das ist ein Zeitdieb." },
        { value: "termin", label: "Ein Termin, weil sie regelmäßig nachsieht", feedback: "Ein Termin hat einen festen Zeitpunkt, den jemand vereinbart hat. Mira schaut nur aus Gewohnheit nach." }
      ]
    },
    {
      id: "q2",
      prompt: "Es ist 9:30 Uhr. Um 11:00 Uhr beginnt die Besprechung. Die Unterlagen sind nicht fertig, die Ablage auch nicht. Was tut Mira als Nächstes?",
      correct: "ordnen",
      options: [
        { value: "alles", label: "Sie fängt Unterlagen, Ablage und Postfach gleichzeitig an", feedback: "Wer alles gleichzeitig anfängt, wird oft mit nichts fertig. Der Termin um 11:00 Uhr bleibt in Gefahr." },
        { value: "ablage", label: "Sie legt zuerst alle Rechnungen fertig ab", feedback: "Die Ablage ist nützlich, aber nicht an den Termin gebunden. Was bis 11:00 Uhr fertig sein muss, kommt zuerst." },
        { value: "ordnen", label: "Sie schreibt eine kurze Checkliste für die Unterlagen und beginnt damit", feedback: "Richtig. Die Checkliste zeigt, was bis 11:00 Uhr fehlt. Die Ablage kommt danach." }
      ]
    },
    {
      id: "q3",
      prompt: "Mira arbeitet an den Unterlagen. Ein Kunde ruft an und will eine Auskunft, die nicht eilig ist. Was ist eine gute nächste Handlung?",
      correct: "rueckruf",
      options: [
        { value: "rueckruf", label: "Freundlich einen Rückruf nach dem Termin anbieten und ihn notieren", feedback: "Richtig. Der Kunde wird ernst genommen und Mira bleibt bei der Aufgabe mit dem festen Termin. Die Notiz verhindert, dass der Rückruf vergessen wird." },
        { value: "auflegen", label: "Den Anruf ohne ein Wort beenden", feedback: "Das ist unhöflich und schadet dem Betrieb. Ein Kunde bekommt eine Antwort oder einen Rückruf." },
        { value: "lange", label: "Die Auskunft ausführlich geben und die Unterlagen später machen", feedback: "Die Auskunft ist nicht eilig. Der feste Termin hat Vorrang. So gerät der Ablauf durcheinander." }
      ]
    }
  ];
  var TERMS = ["Arbeitsablauf", "Störung", "Zeitdieb", "Checkliste"];

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, TERMS: TERMS, progress: progress };
  global.LF2_ABLAUF = api;
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
    var box = $("ablauf-ergebnis");
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
    var host = $("ablauf-fragen");
    QUESTIONS.forEach(function (q, index) {
      var field = doc.createElement("fieldset");
      var legend = doc.createElement("legend");
      var group = doc.createElement("div");
      field.className = "ablauf-frage";
      legend.textContent = (index + 1) + ". " + q.prompt;
      field.appendChild(legend);
      group.className = "ablauf-optionen";
      q.options.forEach(function (option) {
        var label = doc.createElement("label");
        var input = doc.createElement("input");
        var text = doc.createElement("span");
        input.type = "radio";
        input.name = q.id;
        input.value = option.value;
        if (state.answers[q.id] === option.value) input.checked = true;
        label.className = "ablauf-option";
        text.textContent = option.label;
        label.append(input, text);
        input.addEventListener("change", clearResult);
        group.appendChild(label);
      });
      field.appendChild(group);
      var feedback = doc.createElement("p");
      feedback.id = "feedback-" + q.id;
      feedback.className = "ablauf-feedback";
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
    var box = $("ablauf-ergebnis");
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
    doc.querySelectorAll('#ablauf-fragen input[type="radio"]').forEach(function (input) { input.checked = false; });
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
