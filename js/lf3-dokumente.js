/* Lernfeld 3: Dokumente zum Auftrag. Grundlage: lokaler KMK-Rahmenlehrplan, Seite 12. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf3-dokumente.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
    {
      id: "q1",
      prompt: "Lea soll schriftlich festhalten, welchen Auftrag der Betrieb angenommen hat. Welches Dokument passt?",
      correct: "bestaetigung",
      options: [
        { value: "rechnung", label: "Die Rechnung", feedback: "Die Rechnung rechnet die Lieferung oder Arbeit ab. Die Annahme des Auftrags hält die Auftragsbestätigung fest." },
        { value: "bestaetigung", label: "Die Auftragsbestätigung", feedback: "Richtig. Die Auftragsbestätigung hält fest, welchen Auftrag der Betrieb angenommen hat. Sie beschreibt nicht schon die tatsächliche Lieferung." },
        { value: "lieferschein", label: "Der Lieferschein", feedback: "Der Lieferschein beschreibt die mitgelieferten Artikel und Mengen. Für die Annahme des Auftrags ist hier die Auftragsbestätigung passend." }
      ]
    },
    {
      id: "q2",
      prompt: "Eine Kundin will prüfen, welche Artikel und Mengen zu einer Lieferung gehören. Welches Dokument hilft ihr dabei?",
      correct: "lieferschein",
      options: [
        { value: "bestaetigung", label: "Nur die Auftragsbestätigung", feedback: "Die Auftragsbestätigung zeigt den angenommenen Auftrag. Für die Zuordnung zur konkreten Lieferung nutzt du den Lieferschein und vergleichst ihn mit den angekommenen Artikeln." },
        { value: "lieferschein", label: "Der Lieferschein zur Lieferung", feedback: "Richtig. Der Lieferschein nennt die Artikel und Mengen der Lieferung. Die Kundin kann die angekommenen Artikel damit vergleichen." },
        { value: "rechnung", label: "Nur die Rechnung als Beweis, dass alles angekommen ist", feedback: "Eine Rechnung beweist nicht, dass alles angekommen ist. Für die Lieferkontrolle vergleichst du die Artikel mit dem Lieferschein." }
      ]
    },
    {
      id: "q3",
      prompt: "Die Lieferung soll abgerechnet werden. Welches Dokument ordnet Lea diesem Zweck zu?",
      correct: "rechnung",
      options: [
        { value: "lieferschein", label: "Den Lieferschein, weil er zugleich jede Zahlung bestätigt", feedback: "Der Lieferschein beschreibt die Lieferung. Er ist weder die Abrechnung noch ein Nachweis einer Zahlung." },
        { value: "bestaetigung", label: "Die Auftragsbestätigung, weil sie die Abrechnung ersetzt", feedback: "Die Auftragsbestätigung hält den angenommenen Auftrag fest. Die Abrechnung erfolgt mit einer Rechnung." },
        { value: "rechnung", label: "Die Rechnung als Abrechnung der Lieferung", feedback: "Richtig. Die Rechnung dient der Abrechnung. Sie ist nicht automatisch ein Nachweis, dass bereits bezahlt wurde." }
      ]
    }
  ];
  var LOCAL_TERMS = [
    { begriff: "Lieferschein", erklaerung: "Ein Dokument zur Lieferung, das die zugehörigen Artikel und Mengen beschreibt. Du kannst es mit den angekommenen Artikeln vergleichen." },
    { begriff: "Rechnung", erklaerung: "Das Dokument, mit dem ein Betrieb eine Lieferung oder ausgeführte Arbeit abrechnet. Es ist nicht automatisch ein Nachweis einer Zahlung." },
    { begriff: "Auftragsabwicklung", erklaerung: "Die Durchführung eines angenommenen Auftrags. Dazu gehört, die passenden Dokumente für Bestätigung, Lieferung und Abrechnung zuzuordnen." }
  ];
  var TERMS = LOCAL_TERMS.map(function (entry) { return entry.begriff; });

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, TERMS: TERMS, progress: progress };
  global.LF3_DOKUMENTE = api;
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
    var box = $("dokumente-ergebnis");
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
    var host = $("dokumente-fragen");
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
    var box = $("dokumente-ergebnis");
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
    doc.querySelectorAll('#dokumente-fragen input[type="radio"]').forEach(function (input) { input.checked = false; });
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
