/* Lernfeld 4: Angebote vergleichen. Eine kleine, wiederholbare Lernorientierung. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf4-vergleich.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
    {
      id: "q1",
      prompt: "Zwei Angebote für Kopierpapier liegen auf Maras Tisch. Wie geht sie vor?",
      correct: "vergleichen",
      options: [
        { value: "erstes", label: "Das Angebot nehmen, das zuerst gekommen ist", feedback: "Dass ein Angebot zuerst kam, sagt nichts über seine Qualität. Lege beide nebeneinander und vergleiche." },
        { value: "bekannt", label: "Den Anbieter nehmen, dessen Namen sie schon einmal gehört hat", feedback: "Ein bekannter Name ist kein Vergleich. Prüfe beide Angebote nach denselben Kriterien." },
        { value: "vergleichen", label: "Beide Angebote nebeneinanderlegen und nach denselben Kriterien vergleichen", feedback: "Richtig. Nur mit demselben Maßstab kannst du zwei Angebote fair vergleichen." }
      ]
    },
    {
      id: "q2",
      prompt: "Welches dieser Merkmale ist ein qualitatives Kriterium?",
      correct: "kriterium",
      options: [
        { value: "preis", label: "Der Preis in Euro", feedback: "Der Preis lässt sich zählen. Er ist ein Kriterium, das du in Zahlen angibst. Ein qualitatives Kriterium beschreibst du in Worten." },
        { value: "lieferzeit", label: "Die Lieferzeit in Tagen", feedback: "Tage kannst du zählen. Das ist ein Kriterium in Zahlen. Qualitativ ist ein Merkmal, das du in Worten beschreibst." },
        { value: "kriterium", label: "Ob das Papier Recyclingpapier ist", feedback: "Richtig. Das beschreibst du in Worten, du zählst nicht. Das ist ein qualitatives Kriterium." }
      ]
    },
    {
      id: "q3",
      prompt: "Angebot 1 ist 4,00 Euro billiger. Angebot 2 ist Recyclingpapier und kommt schneller. Wie entscheidet Mara?",
      correct: "nicht-nur-preis",
      options: [
        { value: "guenstig", label: "Das billigere nehmen, weil nur der Preis zählt", feedback: "Der Preis ist wichtig, aber nicht das Einzige. Auch Lieferzeit und Papierart können dem Betrieb wichtig sein." },
        { value: "teuer", label: "Das teurere nehmen, weil teurer immer besser ist", feedback: "Teurer heißt nicht automatisch besser. Mara muss begründen, was dem Betrieb wichtiger ist." },
        { value: "nicht-nur-preis", label: "Preis und Kriterien zusammen abwägen und die Entscheidung begründen", feedback: "Richtig. Der Preis allein reicht nicht. Du wägst ab, was dem Betrieb wichtiger ist, und schreibst die Begründung auf." }
      ]
    }
  ];
  var TERMS = ["Kriterium", "Qualitatives Kriterium", "Angebotsvergleich"];
  var TERM_FALLBACK = {
    "Kriterium": "Ein Maßstab, nach dem du etwas beurteilst, zum Beispiel Preis oder Lieferzeit. Bei einem Vergleich nutzt du für alle Angebote dieselben Kriterien.",
    "Qualitatives Kriterium": "Ein Merkmal, das du in Worten beschreibst und nicht zählst, zum Beispiel ob Papier Recyclingpapier ist.",
    "Angebotsvergleich": "Du legst mehrere Angebote nebeneinander und beurteilst sie nach denselben Kriterien. Am Ende begründest du deine Wahl."
  };

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, TERMS: TERMS, progress: progress };
  global.LF4_VERGLEICH = api;
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
    var box = $("vergleich-ergebnis");
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
    var host = $("vergleich-fragen");
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
    var box = $("vergleich-ergebnis");
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
    doc.querySelectorAll('#vergleich-fragen input[type="radio"]').forEach(function (input) { input.checked = false; });
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
