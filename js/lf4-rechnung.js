/* Lernfeld 4: Rechnung prüfen und Zahlung wählen. Lokale, wiederholbare Lernorientierung. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf4-rechnung.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
  {
    "id": "q1",
    "prompt": "Bestellt und geliefert wurden 12 Ordner, die Rechnung nennt 15. Was tut Tom?",
    "correct": "abweichung-melden",
    "options": [
      {
        "value": "einfach-zahlen",
        "label": "Die Rechnung unverändert bezahlen, weil sie schon gedruckt ist",
        "feedback": "Eine Rechnung ist kein Beweis, dass sie stimmt. Hier weichen 15 und 12 voneinander ab."
      },
      {
        "value": "nur-endbetrag",
        "label": "Nur den Endbetrag ansehen; die Menge ist nicht wichtig",
        "feedback": "Auch die Menge gehört zur Kontrolle. Sie ist hier der Grund für die Abweichung."
      },
      {
        "value": "abweichung-melden",
        "label": "Menge mit Bestellung und Lieferung vergleichen, die Abweichung festhalten und nachfragen, bevor bezahlt wird",
        "feedback": "Richtig. Die Rechnung wird mit Bestellung und Lieferung verglichen und die Abweichung wird vor der Zahlung geklärt."
      }
    ]
  },
  {
    "id": "q2",
    "prompt": "Die geprüfte Rechnung nennt: 2 % Skonto bei Zahlung bis zum 10. Tag. Heute ist Tag 8. Was ist passend?",
    "correct": "skonto-nutzen",
    "options": [
      {
        "value": "skonto-verspaetet",
        "label": "Erst am 15. Tag zahlen und trotzdem Skonto abziehen",
        "feedback": "Am 15. Tag ist die genannte Frist vorbei. Dann gilt der Skonto in diesem Beispiel nicht mehr."
      },
      {
        "value": "voll-spaeter",
        "label": "Den vollen Betrag erst später zahlen und den Skonto verfallen lassen",
        "feedback": "Damit verschenkt Tom den möglichen Skonto, obwohl Bedingung und Frist im Beispiel erfüllt sind."
      },
      {
        "value": "skonto-nutzen",
        "label": "Skonto abziehen, denn die Bedingung steht auf der Rechnung und die Frist ist eingehalten",
        "feedback": "Richtig. Die Bedingung steht auf der Rechnung und Tag 8 liegt vor Tag 10."
      }
    ]
  },
  {
    "id": "q3",
    "prompt": "Die Rechnung ist geprüft und nennt eine Bankverbindung. Der Betrieb zahlt Rechnungen per Überweisung. Wie bezahlt Tom?",
    "correct": "ueberweisung-bank",
    "options": [
      {
        "value": "bar-bote",
        "label": "Bargeld einer beliebigen Person mitgeben",
        "feedback": "Die Situation nennt eine Bankverbindung. Bargeld an eine beliebige Person passt nicht dazu."
      },
      {
        "value": "ueberweisung-bank",
        "label": "Per Überweisung auf die Bankverbindung der Rechnung, mit der Rechnungsnummer als Verwendungszweck",
        "feedback": "Richtig. Das passt zur Situation: Bankverbindung auf der Rechnung, Zahlung per Überweisung."
      },
      {
        "value": "zahlung-abwarten",
        "label": "Gar nicht zahlen, bis jemand nachfragt",
        "feedback": "Nicht zu zahlen, erledigt die Rechnung nicht. Wähle den Weg, den die Situation vorgibt."
      }
    ]
  }
];
  var LOCAL_TERMS = [
  {
    "begriff": "Rechnungskontrolle",
    "erklaerung": "Die Prüfung, ob Rechnung, Bestellung und Lieferung zusammenpassen, zum Beispiel bei Menge und Ware."
  },
  {
    "begriff": "Skonto",
    "erklaerung": "Ein Preisnachlass, wenn innerhalb einer genannten Frist bezahlt wird. Er gilt nur, wenn die Bedingung genannt ist und die Frist eingehalten wird."
  },
  {
    "begriff": "Bezahlsystem",
    "erklaerung": "Der Weg, auf dem eine Rechnung bezahlt wird, zum Beispiel per Überweisung. Welcher Weg passt, hängt von der Situation ab."
  }
];

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, LOCAL_TERMS: LOCAL_TERMS, progress: progress };
  global.LF4_RECHNUNG = api;
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
