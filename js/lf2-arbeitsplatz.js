/* Lernfeld 2: Arbeitsplatz und Gesundheit. Eine kleine, wiederholbare Lektion. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf2-arbeitsplatz.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
    {
      id: "q1",
      prompt: "Sami sitzt verdreht vor dem Bildschirm. Licht blendet, und ein Kabel liegt im Gehweg. Was passt?",
      correct: "gestalten",
      options: [
        { value: "geschmack", label: "Alles so lassen, solange der Platz schön aussieht", feedback: "Das Aussehen reicht nicht. Eine verdrehte Haltung, Blendung und ein Kabel im Weg betreffen Ergonomie und Sicherheit." },
        { value: "gestalten", label: "Stuhl, Bildschirm und Licht passend einrichten und den unsicheren Gehweg ansprechen", feedback: "Richtig. Die Arbeitsbedingungen sollen zum Menschen passen. Ein freier, sicherer Weg gehört zur Arbeitssicherheit. Sami holt sich Hilfe bei der Einrichtung." },
        { value: "gewoehnen", label: "Sich an die Haltung gewöhnen und über das Kabel steigen", feedback: "Sich daran zu gewöhnen löst das Problem nicht. Der Platz soll passend und sicher gestaltet werden, statt dass Sami die Hindernisse hinnimmt." }
      ]
    },
    {
      id: "q2",
      prompt: "Sami steht seit mehreren Tagen unter starkem Druck. Seine Pausen fallen immer wieder aus. Wie ordnet er das ein?",
      correct: "belastung",
      options: [
        { value: "zeitdieb", label: "Das ist nur ein einzelner Zeitdieb, den er übergehen kann", feedback: "Hier geht es um anhaltenden Druck und wiederholt fehlende Pausen. Das ist mehr als ein einzelner Zeitdieb. Sami sollte die Belastung ansprechen." },
        { value: "diagnose", label: "Damit steht eine medizinische Diagnose bereits fest", feedback: "Aus dieser Beschreibung folgt keine medizinische Diagnose. Sami kann die Belastung ernst nehmen und Unterstützung suchen, ohne eine Diagnose zu stellen." },
        { value: "belastung", label: "Das ist eine anhaltende Belastung. Er spricht sie an und sucht Unterstützung", feedback: "Richtig. Dauerstress und fehlende Pausen betreffen die Gesundheit. Sami klärt mit seiner Ausbilderin, was sich an den Arbeitsbedingungen ändern muss." }
      ]
    },
    {
      id: "q3",
      prompt: "Ein Kollege macht Sami wiederholt vor anderen lächerlich und grenzt ihn aus. Was ist ein guter erster Schritt?",
      correct: "unterstuetzung",
      options: [
        { value: "unterstuetzung", label: "Eine vertrauenswürdige Anlaufstelle im Betrieb ansprechen, zum Beispiel die Ausbilderin", feedback: "Richtig. Bei möglichem Mobbing oder einem schweren Konflikt sucht Sami Unterstützung. Ist die Ausbilderin beteiligt, wählt er eine andere vertrauenswürdige Anlaufstelle im Betrieb." },
        { value: "ignorieren", label: "Einfach ignorieren und mit niemandem darüber sprechen", feedback: "Wiederholte Ausgrenzung muss Sami nicht allein bewältigen. Unterstützung zu suchen ist sinnvoller, als alles still hinzunehmen." },
        { value: "allein", label: "Das allein lösen, weil Hilfe im Betrieb nicht infrage kommt", feedback: "Sami muss einen schweren Konflikt nicht allein lösen. Eine Ausbilderin, eine andere vertrauenswürdige Führungskraft oder eine vorhandene Interessenvertretung kann eine Anlaufstelle sein." }
      ]
    }
  ];
  var TERMS = ["Arbeitsplatz", "Ergonomie", "Belastung"];

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, TERMS: TERMS, progress: progress };
  global.LF2_ARBEITSPLATZ = api;
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
    var box = $("arbeitsplatz-ergebnis");
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
    var host = $("arbeitsplatz-fragen");
    QUESTIONS.forEach(function (q, index) {
      var field = doc.createElement("fieldset");
      var legend = doc.createElement("legend");
      var group = doc.createElement("div");
      field.className = "arbeitsplatz-frage";
      legend.textContent = (index + 1) + ". " + q.prompt;
      field.appendChild(legend);
      group.className = "arbeitsplatz-optionen";
      q.options.forEach(function (option) {
        var label = doc.createElement("label");
        var input = doc.createElement("input");
        var text = doc.createElement("span");
        input.type = "radio";
        input.name = q.id;
        input.value = option.value;
        if (state.answers[q.id] === option.value) input.checked = true;
        label.className = "arbeitsplatz-option";
        text.textContent = option.label;
        label.append(input, text);
        input.addEventListener("change", clearResult);
        group.appendChild(label);
      });
      field.appendChild(group);
      var feedback = doc.createElement("p");
      feedback.id = "feedback-" + q.id;
      feedback.className = "arbeitsplatz-feedback";
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
    var box = $("arbeitsplatz-ergebnis");
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
    doc.querySelectorAll('#arbeitsplatz-fragen input[type="radio"]').forEach(function (input) { input.checked = false; });
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
      doc.querySelectorAll('#arbeitsplatz-fragen input[type="radio"]').forEach(function (input) { input.checked = false; });
      clearResult();
      step("start");
    }
  });

  load();
  buildTerms();
  buildQuestions();
  update();
})(typeof window !== "undefined" ? window : globalThis);
