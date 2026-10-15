/* Lernfeld 2: Zeitdiebe und Prioritäten. Quelle: lokale KMK-Arbeitskopie, Dokumentseite 10. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf2-zeit.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
    {
      id: "q1",
      prompt: "Was ist in Miras Arbeitsphase ein Zeitdieb?",
      correct: "zeitdieb",
      options: [
        { value: "pause", label: "Eine bewusst eingeplante Erholungspause.", feedback: "Eine geplante Pause gehört zu einer vernünftigen Arbeitsplanung. Sie ist kein Zeitdieb." },
        { value: "zeitdieb", label: "Ständig private Nachrichten lesen, obwohl das nicht zur Aufgabe gehört.", feedback: "Richtig. Das verbraucht Arbeitszeit, ohne zur Aufgabe beizutragen. Eine geplante Pause ist dagegen kein Zeitdieb." },
        { value: "aufgabenarbeit", label: "Die für das Ergebnis nötigen Angaben sorgfältig prüfen.", feedback: "Diese Prüfung gehört zur Aufgabe und trägt zum Ergebnis bei. Nicht jede zeitaufwendige Tätigkeit ist ein Zeitdieb." }
      ]
    },
    {
      id: "q2",
      prompt: "Mira will „nur kurz“ eine schon gut lesbare Überschrift verschönern und verliert dabei eine halbe Stunde. Was passt dazu?",
      correct: "zeitfalle",
      options: [
        { value: "zeitfalle", label: "Eine selbst ausgelöste Zeitfalle: Aus „nur kurz“ wird unnötige Feinarbeit.", feedback: "Richtig. In diese Falle läuft Mira selbst. Sie kann vorher begrenzen, wie viel zusätzliche Feinarbeit wirklich nötig ist." },
        { value: "zwang", label: "Das ist unvermeidbar, weil jede Überschrift immer weiter verbessert werden muss.", feedback: "Nicht jede mögliche Verbesserung ist nötig. Mira kann sich am Zweck der Unterlage orientieren und unnötige Feinarbeit begrenzen." },
        { value: "erholung", label: "Das ist automatisch eine bewusst geplante Erholungspause.", feedback: "Mira hat keine Pause geplant, sondern verliert sich in unnötiger Arbeit. Das ist die Zeitfalle des Beispiels." }
      ]
    },
    {
      id: "q3",
      prompt: "Eine wichtige Auswertung wird heute benötigt. Danach kommt eine unwichtige dekorative Änderung neu herein. Wie setzt Mira Prioritäten?",
      correct: "prioritaet",
      options: [
        { value: "neueste", label: "Immer die zuletzt eingegangene Bitte zuerst bearbeiten.", feedback: "Die Eingangsreihenfolge sagt noch nichts über Wichtigkeit und Dringlichkeit. Die neue Bitte hat nicht automatisch Vorrang." },
        { value: "leichteste", label: "Immer die leichteste Tätigkeit zuerst erledigen, unabhängig von den Folgen.", feedback: "Leichte Tätigkeiten können wichtige Aufgaben verdrängen. Mira sollte Wichtigkeit und Dringlichkeit prüfen." },
        { value: "prioritaet", label: "Wichtigkeit und Dringlichkeit prüfen und die heute benötigte wichtige Auswertung zuerst bearbeiten.", feedback: "Richtig. Das Eisenhower-Prinzip trennt wichtig und dringend. Die Auswertung ist hier beides, die neueste Bitte nicht automatisch wichtiger." }
      ]
    }
  ];
  var LOCAL_TERMS = [
    { begriff: "Zeitdieb", erklaerung: "Etwas, das Arbeitszeit verbraucht, ohne zur Aufgabe beizutragen, zum Beispiel ständiges Lesen privater Nachrichten. Eine bewusst geplante Pause ist kein Zeitdieb." },
    { begriff: "Zeitfalle", erklaerung: "Eine Gewohnheit oder Entscheidung, durch die man selbst unnötig Zeit verliert, zum Beispiel mit dem Gedanken „nur kurz“ immer weiter an unwichtigen Einzelheiten zu arbeiten." },
    { begriff: "Eisenhower-Prinzip", erklaerung: "Eine Methode, Aufgaben getrennt nach Wichtigkeit und Dringlichkeit zu sortieren. Daraus ergeben sich vier Gruppen: jetzt bearbeiten, einplanen, eine passende Übernahme prüfen oder weglassen beziehungsweise zurückstellen." }
  ];
  var TERMS = LOCAL_TERMS.map(function (item) { return item.begriff; });

  function progress(state) {
    var answered = QUESTIONS.reduce(function (count, q) {
      return count + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, TERMS: TERMS, LOCAL_TERMS: LOCAL_TERMS, progress: progress };
  global.LF2_ZEIT = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (!global.document) return;

  var doc = global.document;
  var state = { answers: {}, finish: false };
  function $(id) { return doc.getElementById(id); }

  function load() {
    try {
      var saved = JSON.parse(global.localStorage.getItem(KEY) || "null");
      if (!saved || typeof saved !== "object") return;
      QUESTIONS.forEach(function (q) {
        var value = saved.answers && saved.answers[q.id];
        if (q.options.some(function (option) { return option.value === value; })) state.answers[q.id] = value;
      });
      state.finish = saved.finish === true;
    } catch (e) { /* Ein unlesbarer Speicherstand darf die Lektion nicht blockieren. */ }
  }

  function save() {
    try { global.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* Auch ohne Speicher nutzbar. */ }
  }

  function notify() {
    if (global.LERNFORTSCHRITT) global.LERNFORTSCHRITT.benachrichtigen();
  }

  function update() {
    var n = progress(state);
    $("fortschritt-balken").style.width = n + "%";
    $("fortschritt-text").textContent = "Fortschritt: " + n + " %";
    var correct = QUESTIONS.filter(function (q) { return state.answers[q.id] === q.correct; }).length;
    $("abschluss-status").textContent = correct === QUESTIONS.length
      ? "Alle drei Antworten passen. Prüfe deine Auswahl in der Übung; du kannst sie jederzeit wiederholen."
      : "Die Übung ist noch nicht vollständig richtig. Du kannst sie ohne Zeitdruck wiederholen.";
  }

  function step(id) {
    if (STEPS.indexOf(id) === -1) return;
    STEPS.forEach(function (name) { $(name).hidden = name !== id; });
    doc.querySelectorAll(".schritt-knopf").forEach(function (button) {
      if (button.dataset.ziel === id) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    if (id === "abschluss") { state.finish = true; save(); notify(); }
    update();
    $("hauptinhalt").focus();
    global.scrollTo(0, 0);
  }

  function buildTerms() {
    LOCAL_TERMS.forEach(function (item) {
      var details = doc.createElement("details");
      var summary = doc.createElement("summary");
      var text = doc.createElement("p");
      details.className = "fachwort-hinweis";
      summary.textContent = item.begriff;
      text.textContent = item.erklaerung;
      details.append(summary, text);
      $("fachwoerter-liste").appendChild(details);
    });
  }

  function clearResult() {
    $("lektion-ergebnis").hidden = true;
    $("lektion-ergebnis").textContent = "";
    QUESTIONS.forEach(function (q) {
      $("feedback-" + q.id).hidden = true;
      $("feedback-" + q.id).textContent = "";
    });
  }

  function buildQuestions() {
    QUESTIONS.forEach(function (q, index) {
      var field = doc.createElement("fieldset");
      var legend = doc.createElement("legend");
      var group = doc.createElement("div");
      field.className = "lern-frage";
      legend.textContent = (index + 1) + ". " + q.prompt;
      field.appendChild(legend);
      group.className = "lern-optionen";
      q.options.forEach(function (option) {
        var label = doc.createElement("label");
        var input = doc.createElement("input");
        var text = doc.createElement("span");
        input.type = "radio";
        input.name = q.id;
        input.value = option.value;
        input.setAttribute("aria-describedby", "feedback-" + q.id);
        input.checked = state.answers[q.id] === option.value;
        label.className = "lern-option";
        text.textContent = option.label;
        label.append(input, text);
        input.addEventListener("change", function () {
          state.answers[q.id] = input.value;
          clearResult();
          save();
          update();
          notify();
        });
        group.appendChild(label);
      });
      field.appendChild(group);
      var feedback = doc.createElement("p");
      feedback.id = "feedback-" + q.id;
      feedback.className = "lern-feedback";
      feedback.hidden = true;
      feedback.setAttribute("aria-live", "polite");
      field.appendChild(feedback);
      $("lektion-fragen").appendChild(field);
    });
  }

  function selected(q) {
    var input = doc.querySelector('input[name="' + q.id + '"]:checked');
    return input ? input.value : "";
  }

  function check() {
    var box = $("lektion-ergebnis");
    var correct = 0;
    var unanswered = 0;
    box.textContent = "";
    var heading = doc.createElement("h3");
    box.appendChild(heading);
    QUESTIONS.forEach(function (q, index) {
      var value = selected(q);
      var option = q.options.find(function (item) { return item.value === value; });
      var isCorrect = !!option && value === q.correct;
      var feedback = option ? option.feedback : "Noch nicht beantwortet. Wähle eine Antwort und prüfe erneut.";
      var row = doc.createElement("p");
      row.textContent = (isCorrect ? "Richtig: " : value ? "Noch nicht richtig: " : "Nicht beantwortet: ")
        + "Aufgabe " + (index + 1) + ". " + feedback;
      box.appendChild(row);
      if (isCorrect) correct += 1;
      if (!value) unanswered += 1;
      $("feedback-" + q.id).textContent = feedback;
      $("feedback-" + q.id).hidden = false;
      state.answers[q.id] = value;
    });
    heading.textContent = correct === QUESTIONS.length ? "Alle Antworten richtig"
      : unanswered === QUESTIONS.length ? "Noch nichts ausgewählt"
        : correct ? "Teilweise richtig" : "Noch nicht richtig";
    var summary = doc.createElement("p");
    summary.textContent = unanswered
      ? (unanswered === 1 ? "Eine Aufgabe ist noch unbeantwortet." : unanswered + " Aufgaben sind noch unbeantwortet.")
      : correct === QUESTIONS.length ? "Du hast alle drei Situationen passend eingeordnet."
        : "Lies die Hinweise und versuche es erneut. Es gibt keinen Zeitdruck.";
    box.appendChild(summary);
    box.hidden = false;
    save();
    update();
    notify();
  }

  function resetAnswers() {
    state.answers = {};
    doc.querySelectorAll('#lektion-fragen input[type="radio"]').forEach(function (input) { input.checked = false; });
    clearResult();
    save();
    update();
    notify();
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
      state.finish = false;
      resetAnswers();
      step("start");
    }
  });
  load();
  buildTerms();
  buildQuestions();
  update();
})(typeof window !== "undefined" ? window : globalThis);