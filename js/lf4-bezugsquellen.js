/* Lernfeld 4: Bezugsquellen nach dem Bedarf. Eine kleine, wiederholbare Lernorientierung. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf4-bezugsquellen.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
    {
      id: "q1",
      prompt: "Der Bedarf steht fest: zehn blaue A4-Ordner mit acht Zentimetern Rückenbreite bis Freitag. Welcher nächste Schritt hilft Mara gezielt weiter?",
      correct: "anfragen",
      options: [
        { value: "suche", label: "Nur „Ordner“ im Internet suchen und den ersten Treffer nehmen", feedback: "Der erste Treffer sagt noch nicht, ob zehn passende Ordner bis Freitag lieferbar sind. Suche gezielt und frage die fehlenden Angaben nach." },
        { value: "anfragen", label: "Den üblichen Händler anrufen, die festgelegten Ordner, Menge und Termin nennen und nach Preis und Lieferzeit fragen", feedback: "Richtig: Der Händler ist eine mögliche Bezugsquelle. Mit den geklärten Anforderungen kann Mara gezielt nach einem passenden Angebot fragen." },
        { value: "wunsch", label: "Den Wunsch eines Kollegen nach bunten Ordnern als Bezugsquelle übernehmen", feedback: "Ein Wunsch nennt keinen Anbieter. Eine Bezugsquelle ist eine Stelle, bei der Mara die benötigten Ordner bekommen kann." }
      ]
    },
    {
      id: "q2",
      prompt: "Der Händler schickt ein Angebot: zehn passende Ordner, Lieferung bis Freitag. Ein Preis steht nicht darin. Was klärt Mara vor einer Bestellung?",
      correct: "preis",
      options: [
        { value: "preis", label: "Sie fragt nach dem Preis für die angefragte Menge", feedback: "Richtig: Artikel, Menge und Lieferzeit sind genannt. Der Preis fehlt noch und muss vor einer Bestellung geklärt werden." },
        { value: "bestellen", label: "Sie bestellt sofort, weil der Liefertermin passt", feedback: "Der Termin allein reicht nicht. Ohne Preis weiß Mara noch nicht, was die zehn Ordner kosten." },
        { value: "termin", label: "Sie fragt nur noch einmal, ob Freitag als Liefertermin gemeint ist", feedback: "Freitag steht bereits im Angebot. Die fehlende Angabe ist hier der Preis für die zehn Ordner." }
      ]
    },
    {
      id: "q3",
      prompt: "Ein anderer Anbieter nennt für zehn passende Ordner einen Preis. Zur Lieferzeit steht nichts im Angebot. Was tut Mara?",
      correct: "lieferzeit",
      options: [
        { value: "annehmen", label: "Sie nimmt an, dass die Ordner rechtzeitig kommen", feedback: "Ein genannter Preis sagt nichts über die Lieferzeit. Mara braucht die Ordner bis Freitag und muss nachfragen." },
        { value: "lieferzeit", label: "Sie fragt, ob die zehn Ordner spätestens Freitag geliefert werden können", feedback: "Richtig: Die Lieferzeit fehlt. Mara klärt, ob die Lieferung zum bereits festgelegten Bedarf passt." },
        { value: "preis", label: "Sie fragt nur noch einmal nach dem bereits genannten Preis", feedback: "Der Preis ist schon bekannt. Offen ist, ob die Ordner bis Freitag geliefert werden können." }
      ]
    }
  ];
  var TERMS = ["Bezugsquelle", "Angebot"];

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, TERMS: TERMS, progress: progress };
  global.LF4_BEZUGSQUELLEN = api;
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
    var box = $("bezugsquellen-ergebnis");
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
    var host = $("bezugsquellen-fragen");
    QUESTIONS.forEach(function (q, index) {
      var field = doc.createElement("fieldset");
      var legend = doc.createElement("legend");
      var group = doc.createElement("div");
      field.className = "bezugsquellen-frage";
      legend.textContent = (index + 1) + ". " + q.prompt;
      field.appendChild(legend);
      group.className = "bezugsquellen-optionen";
      q.options.forEach(function (option) {
        var label = doc.createElement("label");
        var input = doc.createElement("input");
        var text = doc.createElement("span");
        input.type = "radio";
        input.name = q.id;
        input.value = option.value;
        if (state.answers[q.id] === option.value) input.checked = true;
        label.className = "bezugsquellen-option";
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
      feedback.className = "bezugsquellen-feedback";
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
    var box = $("bezugsquellen-ergebnis");
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
        ? "Du hast eine passende Anfrage gewählt und die fehlenden Angebotsangaben erkannt."
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
    doc.querySelectorAll('#bezugsquellen-fragen input[type="radio"]').forEach(function (input) { input.checked = false; });
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
      doc.querySelectorAll('#bezugsquellen-fragen input[type="radio"]').forEach(function (input) { input.checked = false; });
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
