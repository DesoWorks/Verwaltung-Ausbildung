/* Lernfeld 1: Eine Präsentation vorbereiten und bewerten. Lokale, wiederholbare Kurzlektion. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf1-praesentation.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
  {
    "id": "q1",
    "prompt": "Jonas hat fünf Minuten, einen Bildschirm im Raum und sechs Zuhörende. Welche Form passt?",
    "correct": "form-kurz-bildschirm",
    "options": [
      {
        "value": "form-folienflut",
        "label": "Eine lange Präsentation mit sehr vielen Folien, damit nichts fehlt",
        "feedback": "Dafür reicht die Zeit nicht. Die Rahmenbedingungen sind fünf Minuten, also muss die Form kurz und klar sein."
      },
      {
        "value": "form-kurz-bildschirm",
        "label": "Eine kurze digitale Präsentation mit wenigen Folien am Bildschirm",
        "feedback": "Richtig. Die Form passt zu Zeit, Raum und Technik."
      },
      {
        "value": "form-ablesen",
        "label": "Den Bildschirm ignorieren und einen langen Text vom Zettel ablesen",
        "feedback": "Der Bildschirm ist vorhanden und kann helfen. Reines Ablesen nutzt die Rahmenbedingungen nicht und ist für Zuhörende schwer."
      }
    ]
  },
  {
    "id": "q2",
    "prompt": "Jonas möchte eine Kundenliste mit Namen und ein fremdes Foto aus dem Internet zeigen. Was tut er?",
    "correct": "schutz-namen-quelle",
    "options": [
      {
        "value": "schutz-alles-zeigen",
        "label": "Beides unverändert zeigen, weil die Zuhörenden im Betrieb arbeiten",
        "feedback": "Namen von Kundinnen und Kunden sind personenbezogene Daten. Auch im Betrieb gehören sie nicht ohne Grund auf eine Folie."
      },
      {
        "value": "schutz-bild-ohne-quelle",
        "label": "Die Namen weglassen, das Foto aber ohne Quellenangabe nutzen",
        "feedback": "Beim Foto fehlt etwas. Ein fremdes Bild nutzt man nur, wenn es erlaubt ist, und man nennt die Quelle."
      },
      {
        "value": "schutz-namen-quelle",
        "label": "Die Namen weglassen, das Foto nur nutzen, wenn es erlaubt ist, und die Quelle nennen",
        "feedback": "Richtig. So achtet Jonas Datenschutz und Urheberrecht."
      }
    ]
  },
  {
    "id": "q3",
    "prompt": "Der Vortrag ist vorbei. Wie bewertet Jonas ihn am besten?",
    "correct": "katalog-kriterien-liste",
    "options": [
      {
        "value": "katalog-bauchgefuehl",
        "label": "Nur danach, ob ihm der Vortrag gefallen hat",
        "feedback": "Das Bauchgefühl allein ist schwer nachzuvollziehen. Ein Kriterienkatalog macht die Bewertung überprüfbar."
      },
      {
        "value": "katalog-feedback-weglassen",
        "label": "Die Rückmeldung der anderen ignorieren, damit er sich nicht ärgert",
        "feedback": "Rückmeldung hilft bei der nächsten Präsentation. Der Kriterienkatalog soll gerade zum Nachdenken und Verbessern dienen."
      },
      {
        "value": "katalog-kriterien-liste",
        "label": "Anhand der vorher festgelegten Kriterien, zum Beispiel verständlich, Zeit eingehalten, Quellen genannt",
        "feedback": "Richtig. Ein Kriterienkatalog macht die Bewertung nachvollziehbar."
      }
    ]
  }
];
  var LOCAL_TERMS = [
  {
    "begriff": "Präsentationsform",
    "erklaerung": "Die Art, wie Ergebnisse gezeigt werden, zum Beispiel digital am Bildschirm, am Plakat oder mündlich. Sie richtet sich nach Zeit, Raum, Technik und Zuhörenden."
  },
  {
    "begriff": "Datenschutz und Urheberrecht",
    "erklaerung": "Angaben zu einzelnen Personen gehören nur in eine Präsentation, wenn das erlaubt und nötig ist. Fremde Bilder oder Texte nutzt man nur, wenn es erlaubt ist, und nennt die Quelle."
  },
  {
    "begriff": "Kriterienkatalog",
    "erklaerung": "Eine Liste von Punkten, nach denen man etwas bewertet, zum Beispiel eine Präsentation. So wird die Bewertung nachvollziehbar."
  }
];

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, LOCAL_TERMS: LOCAL_TERMS, progress: progress };
  global.LF1_PRAESENTATION = api;
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
