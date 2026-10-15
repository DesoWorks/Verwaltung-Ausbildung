/* Lernfeld 3: Preisrechnung vor dem Angebot. Eine kleine, wiederholbare Lernorientierung. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf3-preis.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
    {
      id: "q1",
      prompt: "12 Ordner kosten 30,00 Euro (erfundene Zahlen). Lena braucht den Preis für 20 Ordner. Wie rechnet sie?",
      correct: "rechnen",
      options: [
        { value: "raten", label: "30,00 + 8 = 38,00 Euro, weil 8 Ordner dazukommen", feedback: "Das ist geraten. Ein Ordner kostet nicht 1,00 Euro. Beim Dreisatz rechnest du zuerst den Preis für einen Ordner aus." },
        { value: "rechnen", label: "30,00 : 12 = 2,50 Euro je Ordner, dann 20 × 2,50 = 50,00 Euro", feedback: "Richtig. Das ist der Dreisatz: erst auf einen Ordner, dann auf 20 Ordner." },
        { value: "verdoppeln", label: "30,00 × 2 = 60,00 Euro, weil es fast doppelt so viele sind", feedback: "20 Ordner sind nicht doppelt so viele wie 12. Doppelt wären 24. Rechne über den Preis für einen Ordner." }
      ]
    },
    {
      id: "q2",
      prompt: "Der Preis für 20 Ordner ist 50,00 Euro. Die Kundin bekommt 10 % Rabatt. Wie rechnet Lena?",
      correct: "prozent",
      options: [
        { value: "euro", label: "50,00 − 10 = 40,00 Euro", feedback: "Hier wurden 10 Euro abgezogen, nicht 10 Prozent. 10 % sind ein Zehntel von 50,00 Euro." },
        { value: "plus", label: "50,00 + 5,00 = 55,00 Euro", feedback: "Ein Rabatt macht den Preis kleiner. Du ziehst den Nachlass ab und rechnest ihn nicht dazu." },
        { value: "prozent", label: "10 % von 50,00 sind 5,00 Euro, also 50,00 − 5,00 = 45,00 Euro", feedback: "Richtig. Du berechnest den Prozentsatz vom Preis und ziehst ihn ab." }
      ]
    },
    {
      id: "q3",
      prompt: "Lena hat 45,00 Euro ausgerechnet. Das Angebot ist fertig geschrieben. Was tut sie vor dem Versand?",
      correct: "pruefen",
      options: [
        { value: "abschicken", label: "Sofort abschicken, weil ein Taschenrechner nie falsch ist", feedback: "Der Taschenrechner rechnet, was du eintippst. Ein Tippfehler fällt dir nur auf, wenn du das Ergebnis prüfst." },
        { value: "schoen", label: "Die Zahl ändern, bis sie schön aussieht", feedback: "Der Preis muss zur Rechnung passen. Ändere ihn nicht, nur damit er glatt aussieht." },
        { value: "pruefen", label: "Das Ergebnis mit einem Überschlag prüfen", feedback: "Richtig. Ein Überschlag zeigt dir schnell, ob das Ergebnis ungefähr passt." }
      ]
    }
  ];
  var TERMS = ["Dreisatz", "Prozentsatz", "Überschlag"];
  var TERM_FALLBACK = {
    "Dreisatz": "Eine Rechenart in drei Schritten. Du rechnest erst auf eine Einheit, zum Beispiel einen Ordner, und dann auf die gewünschte Menge.",
    "Prozentsatz": "Die Zahl vor dem Prozentzeichen. 10 % bedeuten zehn von hundert, also ein Zehntel des Grundwerts.",
    "Überschlag": "Eine schnelle, grobe Rechnung mit runden Zahlen. Du siehst damit, ob dein genaues Ergebnis ungefähr stimmen kann."
  };

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, TERMS: TERMS, progress: progress };
  global.LF3_PREIS = api;
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
      var explanation = item ? item.erklaerung : TERM_FALLBACK[term];
      if (!explanation) return;
      var details = doc.createElement("details");
      var summary = doc.createElement("summary");
      var text = doc.createElement("p");
      details.className = "fachwort-hinweis";
      summary.textContent = term;
      text.textContent = explanation;
      details.append(summary, text);
      host.appendChild(details);
    });
  }

  function clearResult() {
    var box = $("preis-ergebnis");
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
    var host = $("preis-fragen");
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
    var box = $("preis-ergebnis");
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
    doc.querySelectorAll('#preis-fragen input[type="radio"]').forEach(function (input) { input.checked = false; });
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
