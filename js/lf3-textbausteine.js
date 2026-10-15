/* Lernfeld 3: Textbausteine passend einsetzen. Lokale, wiederholbare Lernorientierung. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf3-textbausteine.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
  {
    "id": "q1",
    "prompt": "Was ist der vorbereitete Text mit [Name] und [Auftragsnummer]?",
    "correct": "wiederverwendbarer-textteil",
    "options": [
      {
        "value": "fertige-versandbestaetigung",
        "label": "Eine Bestätigung, dass die Ware bereits versandt wurde",
        "feedback": "Der Text sagt ausdrücklich, dass noch keine bestätigte Versandangabe vorliegt. Er ist keine Versandbestätigung."
      },
      {
        "value": "ersatz-fuer-pruefung",
        "label": "Ein Ersatz für jede Prüfung des Auftrags",
        "feedback": "Auch vorbereitete Texte müssen zum aktuellen Auftrag passen. Sie ersetzen die Prüfung nicht."
      },
      {
        "value": "wiederverwendbarer-textteil",
        "label": "Ein Textbaustein, der noch zum konkreten Fall angepasst wird",
        "feedback": "Richtig. Der gespeicherte Textteil ist wiederverwendbar. Die Platzhalter müssen noch mit geprüften Angaben gefüllt werden."
      }
    ]
  },
  {
    "id": "q2",
    "prompt": "Wie füllt Lea die Platzhalter für den aktuellen Auftrag?",
    "correct": "gepruefte-falldaten",
    "options": [
      {
        "value": "gepruefte-falldaten",
        "label": "Mit Frau Yilmaz und U-42 aus dem geprüften aktuellen Vorgang",
        "feedback": "Richtig. Name und Auftragsnummer müssen zum aktuellen Kundenfall gehören."
      },
      {
        "value": "alte-kundendaten",
        "label": "Mit Namen und Nummer aus einer früheren Kundenantwort",
        "feedback": "Diese Angaben können zu einem anderen Kunden gehören. Nutze die geprüften Daten des aktuellen Vorgangs."
      },
      {
        "value": "klammern-stehenlassen",
        "label": "Sie lässt [Name] und [Auftragsnummer] unverändert stehen",
        "feedback": "Die markierten Stellen sind noch keine fertigen Angaben. Sie müssen vor dem Versand passend ersetzt werden."
      }
    ]
  },
  {
    "id": "q3",
    "prompt": "Der Versand ist noch nicht bestätigt. Was ist vor dem Versand der Antwort richtig?",
    "correct": "gesamttext-pruefen",
    "options": [
      {
        "value": "liefertermin-erfinden",
        "label": "Einen wahrscheinlichen Liefertermin als feste Zusage ergänzen",
        "feedback": "Ein vermuteter Termin ist keine geprüfte Angabe. Mache daraus keine feste Zusage."
      },
      {
        "value": "gesamttext-pruefen",
        "label": "Den ganzen Text prüfen und bei der bestätigten Information bleiben",
        "feedback": "Richtig. Der Kundentext muss zum Vorgang passen. Eine unbestätigte Versandangabe wird nicht zur Zusage."
      },
      {
        "value": "ungeprueft-absenden",
        "label": "Ohne Lesen senden, weil der Baustein schon vorbereitet war",
        "feedback": "Ein vorbereiteter Text kann für den einzelnen Fall unpassend sein. Lies und prüfe die gesamte Antwort."
      }
    ]
  }
];
  var LOCAL_TERMS = [
  {
    "begriff": "Textbaustein",
    "erklaerung": "Ein gespeicherter Textteil für wiederkehrende Inhalte. Vor der Verwendung wird er auf den konkreten Fall abgestimmt und geprüft."
  },
  {
    "begriff": "Platzhalter",
    "erklaerung": "Eine markierte Stelle, die noch mit einer konkreten Angabe gefüllt werden muss, zum Beispiel mit einem geprüften Namen oder einer Auftragsnummer."
  },
  {
    "begriff": "Textverarbeitungsprogramm",
    "erklaerung": "Ein Programm zum Schreiben, Bearbeiten und Gestalten von Texten. Wiederkehrende Textteile lassen sich damit vorbereiten und weiterverwenden."
  }
];

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, LOCAL_TERMS: LOCAL_TERMS, progress: progress };
  global.LF3_TEXTBAUSTEINE = api;
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
    LOCAL_TERMS.forEach(function (item) {
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
    var box = $("lektion-ergebnis");
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
    var host = $("lektion-fragen");
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
    if (global.LERNFORTSCHRITT) global.LERNFORTSCHRITT.benachrichtigen();
  }

  function resetAnswers() {
    state.answers = {};
    save();
    doc.querySelectorAll('#lektion-fragen input[type="radio"]').forEach(function (input) { input.checked = false; });
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
      resetAnswers();
      if (global.LERNFORTSCHRITT) global.LERNFORTSCHRITT.benachrichtigen();
      step("start");
    }
  });

  load();
  buildTerms();
  buildQuestions();
  update();
})(typeof window !== "undefined" ? window : globalThis);
