/* Lernfeld 1: Fortbildung und lebenslanges Lernen. Lokale, wiederholbare Lernorientierung. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf1-fortbildung.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
  {
    "id": "q1",
    "prompt": "Mira sieht einen Kursaushang „Tabellen im Büroalltag“. Was tut sie zuerst?",
    "correct": "pruefen-passt",
    "options": [
      {
        "value": "sofort-anmelden",
        "label": "Sofort anmelden, weil Fortbildung immer gut ist",
        "feedback": "Nicht jedes Angebot passt zur eigenen Aufgabe. Prüfe zuerst, ob Thema und Termin passen und was es dir bringt."
      },
      {
        "value": "pruefen-passt",
        "label": "Thema, Termin und Nutzen für die eigene Aufgabe prüfen und mit der zuständigen Person sprechen",
        "feedback": "Richtig. Erst prüfen und besprechen, dann entscheiden."
      },
      {
        "value": "aushang-uebergehen",
        "label": "Den Aushang übergehen, weil in der Ausbildung nichts weiter zu erkunden ist",
        "feedback": "Der Plan nennt das Erkunden von Möglichkeiten beruflicher Fort- und Weiterbildung. Ein Angebot nur zu übergehen, erkundet nichts."
      }
    ]
  },
  {
    "id": "q2",
    "prompt": "Welche Aussage ist ein realistisches Ziel und kein bloßer Wunsch?",
    "correct": "ziel-konkret",
    "options": [
      {
        "value": "wunsch-alles",
        "label": "Irgendwann alles in Tabellen perfekt können",
        "feedback": "Das ist ein Wunsch. Er sagt nicht, was genau erreicht sein soll, und lässt sich kaum überprüfen."
      },
      {
        "value": "wunsch-leitung",
        "label": "Nächstes Jahr die ganze Abteilung leiten",
        "feedback": "Das ist weit weg und hängt nicht von diesem Kurs ab. Ein realistisches Ziel ist näher und überprüfbar."
      },
      {
        "value": "ziel-konkret",
        "label": "Nach dem Kurs eine einfache Auswertung der Bestellliste selbst aufbauen",
        "feedback": "Richtig. Das Ziel ist konkret, bezieht sich auf die eigene Aufgabe und ist erreichbar."
      }
    ]
  },
  {
    "id": "q3",
    "prompt": "Mira hat den Kurs besucht. Was bringt ihr den größten Nutzen für ihre Aufgabe?",
    "correct": "gelerntes-nutzen",
    "options": [
      {
        "value": "unterlagen-ablegen",
        "label": "Die Kursunterlagen ablegen und nicht mehr ansehen",
        "feedback": "So bleibt das Gelernte ungenutzt. Probiere es bei deiner Aufgabe aus."
      },
      {
        "value": "gelerntes-nutzen",
        "label": "Das Gelernte anwenden, zum Beispiel die Bestellliste mit einer Tabelle auswerten",
        "feedback": "Richtig. Der Nutzen entsteht, wenn das Gelernte bei der eigenen Aufgabe angewendet wird."
      },
      {
        "value": "nur-erzaehlen",
        "label": "Nur erzählen, dass sie dabei war, und nichts anwenden",
        "feedback": "Dabeigewesen zu sein reicht nicht. Wende an, was du gelernt hast."
      }
    ]
  }
];
  var LOCAL_TERMS = [
  {
    "begriff": "Fort- und Weiterbildung",
    "erklaerung": "Lernangebote im Berufsleben, mit denen man seine beruflichen Kenntnisse erweitert. Man prüft, ob ein Angebot zur eigenen Aufgabe passt."
  },
  {
    "begriff": "Realistisches Ziel",
    "erklaerung": "Ein Ziel, das konkret ist und mit den eigenen Möglichkeiten erreichbar scheint. Ein bloßer Wunsch bleibt dagegen vage."
  },
  {
    "begriff": "Lebenslanges Lernen",
    "erklaerung": "Die Haltung, auch im Beruf immer weiter dazuzulernen und das Gelernte in der eigenen Arbeit zu nutzen."
  }
];

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, LOCAL_TERMS: LOCAL_TERMS, progress: progress };
  global.LF1_FORTBILDUNG = api;
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
