/* Lernfeld 2: Im Team einen Kompromiss finden. Lokale, wiederholbare Lernorientierung. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf2-team.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
  {
    "id": "q1",
    "prompt": "Samira möchte eine kurze Mappe, Ben ausführliche Hinweise. Was hilft zuerst?",
    "correct": "gruende-erfragen",
    "options": [
      {
        "value": "mehrheit-sofort",
        "label": "Sofort abstimmen, ohne die Gründe zu hören",
        "feedback": "Eine Abstimmung allein zeigt noch nicht, warum die Vorschläge wichtig sind. Erst die Gründe klären hilft, eine passende gemeinsame Lösung zu finden."
      },
      {
        "value": "gruende-erfragen",
        "label": "Nach den Gründen und den Anforderungen an die gemeinsame Mappe fragen",
        "feedback": "Richtig. Wenn beide die Gründe verstehen, können sie eine Lösung für das gemeinsame Arbeitsziel entwickeln."
      },
      {
        "value": "eigenen-wunsch-durchsetzen",
        "label": "Den eigenen Wunsch ohne Rücksprache durchsetzen",
        "feedback": "Das berücksichtigt die andere Person und die gemeinsame Aufgabe nicht. Beide sollten ihre Gründe austauschen."
      }
    ]
  },
  {
    "id": "q2",
    "prompt": "Welche Lösung ist im Beispiel ein begründeter Kompromiss?",
    "correct": "uebersicht-mit-details",
    "options": [
      {
        "value": "uebersicht-mit-details",
        "label": "Kurze Startübersicht und verlinkte Details für besondere Fälle",
        "feedback": "Richtig. Die Lösung berücksichtigt schnelle Orientierung und ausführliche Informationen. Beide passen ihren ursprünglichen Vorschlag an."
      },
      {
        "value": "ben-gibt-auf",
        "label": "Ben schweigt und verzichtet auf alle notwendigen Hinweise",
        "feedback": "Aufgeben ist hier keine gemeinsam entwickelte Lösung. Für schwierige Fälle werden die Hinweise weiterhin benötigt."
      },
      {
        "value": "zwei-unabgestimmte-mappen",
        "label": "Beide erstellen dauerhaft verschiedene, nicht abgestimmte Kundenmappen",
        "feedback": "Das verfehlt die gemeinsame Aufgabe. Das Team soll mit derselben abgestimmten Mappe arbeiten können."
      }
    ]
  },
  {
    "id": "q3",
    "prompt": "Wie vertritt Samira ihre Meinung wertschätzend?",
    "correct": "sachlich-begruenden",
    "options": [
      {
        "value": "person-abwerten",
        "label": "„Dein Vorschlag ist unsinnig, du verstehst die Arbeit nicht.“",
        "feedback": "Das wertet Ben ab und erklärt keinen sachlichen Grund. Die gemeinsame Arbeit wird dadurch nicht besser."
      },
      {
        "value": "nur-zustimmen",
        "label": "Ohne Erklärung immer zustimmen, obwohl wichtige Anforderungen fehlen",
        "feedback": "Kooperation verlangt nicht, die eigene begründete Meinung zu verschweigen. Wichtige Anforderungen müssen besprochen werden."
      },
      {
        "value": "sachlich-begruenden",
        "label": "„Die kurze Übersicht hilft uns beim Zuordnen. Wie verbinden wir sie mit deinen Detailhinweisen?“",
        "feedback": "Richtig. Samira erklärt ihren Grund und bezieht Bens Anliegen ein, ohne ihn abzuwerten."
      }
    ]
  }
];
  var LOCAL_TERMS = [
  {
    "begriff": "Kooperation",
    "erklaerung": "Zusammenarbeit an einem gemeinsamen Ziel. Die Beteiligten stimmen ihre Beiträge aufeinander ab und unterstützen das gemeinsame Ergebnis."
  },
  {
    "begriff": "Kompromiss",
    "erklaerung": "Eine gemeinsam vereinbarte Lösung, bei der unterschiedliche Anliegen berücksichtigt werden und Beteiligte von ursprünglichen Forderungen abrücken."
  },
  {
    "begriff": "Wertschätzende Kommunikation",
    "erklaerung": "Ein respektvoller Austausch, bei dem man zuhört, sachlich begründet und andere Personen nicht abwertet, auch wenn man anderer Meinung ist."
  }
];

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, LOCAL_TERMS: LOCAL_TERMS, progress: progress };
  global.LF2_TEAM = api;
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
