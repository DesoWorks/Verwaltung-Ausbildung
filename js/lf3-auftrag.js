/* Lernfeld 3: von der Anfrage zum Auftrag. Eine kleine, wiederholbare Lernorientierung. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf3-auftrag.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
    {
      id: "q1",
      prompt: "Eine Kundin schreibt: „Was kosten 20 Ordner?“ Was liegt vor?",
      correct: "anfrage",
      options: [
        { value: "auftrag", label: "Ein Auftrag, den Leo sofort zusagen kann", feedback: "Die Kundin fragt erst nach dem Preis und hat noch kein Angebot angenommen. Leo darf daraus keine Zusage ableiten." },
        { value: "anfrage", label: "Eine Anfrage, noch kein Auftrag", feedback: "Richtig: Die Kundin fragt nach dem Preis und hat noch nichts bestellt." },
        { value: "angebot", label: "Ein Angebot, weil Artikel und Menge genannt sind", feedback: "Das Angebot kommt vom Betrieb als Antwort auf die Anfrage. Hier fragt die Kundin erst nach dem Preis." }
      ]
    },
    {
      id: "q2",
      prompt: "Leo hat ein Angebot geschrieben. Die Kundin hat es noch nicht angenommen. Was tut Leo als Nächstes?",
      correct: "warten",
      options: [
        { value: "liefern", label: "Er lässt die Ordner schon ausliefern, damit es schneller geht", feedback: "Die Annahme fehlt noch. Eine Lieferung wäre im Beispiel zu früh und könnte einen unnötigen Versand auslösen." },
        { value: "zusage", label: "Er bestätigt den Auftrag, als hätte die Kundin schon zugesagt", feedback: "Leo würde eine Annahme festhalten, die es noch nicht gibt. Erst die Kundin muss das Angebot annehmen." },
        { value: "warten", label: "Er wartet auf die Annahme und lässt noch nichts ausliefern", feedback: "Richtig: Ohne Annahme lässt Leo im Beispiel noch nichts ausliefern." }
      ]
    },
    {
      id: "q3",
      prompt: "Die Kundin hat das Angebot angenommen. Wie gibt Leo den Auftrag an die Kollegin in der Auslieferung weiter?",
      correct: "weitergeben",
      options: [
        { value: "weitergeben", label: "Er gibt Menge, Artikel und vereinbarten Liefertermin vollständig weiter", feedback: "Richtig: Mit Menge, Artikel und Liefertermin kann die Kollegin den Auftrag ohne fehlende Angaben weiterbearbeiten." },
        { value: "menge", label: "Er sagt nur „20 Ordner“; den Liefertermin kann die Kollegin später suchen", feedback: "Der Liefertermin fehlt. Leo gibt die vereinbarten Angaben vollständig weiter, statt die Suche der Kollegin zu überlassen." },
        { value: "sofort", label: "Er verspricht der Kundin eine frühere Lieferung, ohne sie mit der Auslieferung zu klären", feedback: "Eine frühere Lieferung ist nicht geprüft. Leo bleibt beim vereinbarten Termin und klärt Änderungen zuerst mit der zuständigen Kollegin." }
      ]
    }
  ];
  var TERMS = ["Anfrage", "Angebot", "Auftrag", "Auftragsbestätigung"];

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, TERMS: TERMS, progress: progress };
  global.LF3_AUFTRAG = api;
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
    var box = $("auftrag-ergebnis");
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
    var host = $("auftrag-fragen");
    QUESTIONS.forEach(function (q, index) {
      var field = doc.createElement("fieldset");
      var legend = doc.createElement("legend");
      var group = doc.createElement("div");
      field.className = "auftrag-frage";
      legend.textContent = (index + 1) + ". " + q.prompt;
      field.appendChild(legend);
      group.className = "auftrag-optionen";
      q.options.forEach(function (option) {
        var label = doc.createElement("label");
        var input = doc.createElement("input");
        var text = doc.createElement("span");
        input.type = "radio";
        input.name = q.id;
        input.value = option.value;
        if (state.answers[q.id] === option.value) input.checked = true;
        label.className = "auftrag-option";
        text.textContent = option.label;
        label.append(input, text);
        input.addEventListener("change", function () {
          clearResult();
          state.answers[q.id] = input.value;
          save();
          update();
          if (global.LERNFORTSCHRITT) global.LERNFORTSCHRITT.benachrichtigen();
        });
        group.appendChild(label);
      });
      field.appendChild(group);
      var feedback = doc.createElement("p");
      feedback.id = "feedback-" + q.id;
      feedback.className = "auftrag-feedback";
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
    var box = $("auftrag-ergebnis");
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
    if (global.LERNFORTSCHRITT) global.LERNFORTSCHRITT.benachrichtigen();
  }

  function resetAnswers() {
    state.answers = {};
    save();
    doc.querySelectorAll('#auftrag-fragen input[type="radio"]').forEach(function (input) { input.checked = false; });
    clearResult();
    update();
    if (global.LERNFORTSCHRITT) global.LERNFORTSCHRITT.benachrichtigen();
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
      doc.querySelectorAll('#auftrag-fragen input[type="radio"]').forEach(function (input) { input.checked = false; });
      clearResult();
      if (global.LERNFORTSCHRITT) global.LERNFORTSCHRITT.benachrichtigen();
      step("start");
    }
  });

  load();
  buildTerms();
  buildQuestions();
  update();
})(typeof window !== "undefined" ? window : globalThis);
