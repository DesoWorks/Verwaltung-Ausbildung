/* Lernfeld 4: Lagerung passend wählen. Lokale, wiederholbare Lernorientierung. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf4-lager.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
  {
    "id": "q1",
    "prompt": "Haftnotizen werden täglich gebraucht. Welche Lagerung passt?",
    "correct": "griffnah-regal",
    "options": [
      {
        "value": "keller-hinten",
        "label": "Im Keller ganz hinten, weil dort viel Platz frei ist",
        "feedback": "Freier Platz ist kein Kriterium. Täglich genutzte Ware muss schnell erreichbar sein."
      },
      {
        "value": "griffnah-regal",
        "label": "Im offenen Regal nahe am Arbeitsplatz, weil sie täglich gebraucht werden",
        "feedback": "Richtig. Das Kriterium ist hier der schnelle Zugriff auf täglich genutzte Ware."
      },
      {
        "value": "tresor-alles",
        "label": "Im abschließbaren Tresor, weil alles dorthin gehört",
        "feedback": "Ein Tresor wäre für Haftnotizen umständlich. Das Kriterium wäre hier der schnelle Zugriff."
      }
    ]
  },
  {
    "id": "q2",
    "prompt": "Tablet-Computer sind wertvoll. Welche Lagerung passt?",
    "correct": "abschliessbar",
    "options": [
      {
        "value": "flur-offen",
        "label": "Im offenen Regal im Flur, weil dort noch Platz ist",
        "feedback": "Im offenen Flurregal ist wertvolle Ware nicht geschützt. Freier Platz zählt hier nicht."
      },
      {
        "value": "tisch-offen",
        "label": "Auf dem Besprechungstisch, damit alle sie sehen",
        "feedback": "Auf dem Tisch liegt die Ware ungeschützt und im Weg. Wertvolle Ware braucht Schutz."
      },
      {
        "value": "abschliessbar",
        "label": "Im abschließbaren Schrank, weil die Ware wertvoll ist und geschützt werden soll",
        "feedback": "Richtig. Das Kriterium ist der Schutz wertvoller Ware."
      }
    ]
  },
  {
    "id": "q3",
    "prompt": "Druckerpapier verträgt keine Feuchtigkeit. Welche Lagerung passt?",
    "correct": "trocken-regal",
    "options": [
      {
        "value": "keller-feucht",
        "label": "Auf dem Boden im feuchten Keller, weil dort Platz ist",
        "feedback": "Feuchtigkeit schadet Papier. Dass der Platz frei ist, entscheidet nicht."
      },
      {
        "value": "eingang-offen",
        "label": "Offen im Eingangsbereich, weil dort gerade Platz ist",
        "feedback": "Ein freier Platz ist kein Kriterium. Das Papier braucht einen trockenen Lagerort."
      },
      {
        "value": "trocken-regal",
        "label": "In einem trockenen Raum auf einem Regal",
        "feedback": "Richtig. Das Kriterium ist die Feuchtigkeit: Papier gehört trocken gelagert."
      }
    ]
  }
];
  var LOCAL_TERMS = [
  {
    "begriff": "Lagerung",
    "erklaerung": "Waren aufbewahren, bis sie gebraucht werden. Die Lagerung soll zur Ware passen."
  },
  {
    "begriff": "Lagerart",
    "erklaerung": "Die Art, wie und wo Ware aufbewahrt wird, zum Beispiel im offenen Regal oder im abschließbaren Schrank."
  },
  {
    "begriff": "Auswahlkriterium",
    "erklaerung": "Ein Gesichtspunkt, nach dem man auswählt, zum Beispiel wie oft die Ware gebraucht wird, wie wertvoll sie ist oder ob sie Feuchtigkeit verträgt."
  }
];

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, LOCAL_TERMS: LOCAL_TERMS, progress: progress };
  global.LF4_LAGER = api;
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
