/* Lernfeld 4: Bedarf vor der Bestellung. Eine kleine, wiederholbare Lernorientierung. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf4-bedarf.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
    {
      id: "q1",
      prompt: "Eine Kollegin sagt: „Wir brauchen Stifte in zwölf Farben, die sehen schöner aus.“ Im Schrank liegen noch genug blaue und schwarze Stifte. Was liegt vor?",
      correct: "wunsch",
      options: [
        { value: "bedarf", label: "Ein Bedarf, weil die Stifte für die Arbeit nötig sind", feedback: "Die Arbeit läuft mit den vorhandenen Stiften. Die zwölf Farben wären nur schöner. Das ist kein Bedarf." },
        { value: "wunsch", label: "Ein Wunsch, die Arbeit läuft auch ohne", feedback: "Richtig: Blaue und schwarze Stifte reichen noch. Die zwölf Farben sind ein Wunsch." },
        { value: "voreilig", label: "Eine voreilige Bestellung, die schon gelaufen ist", feedback: "Es wurde noch nichts bestellt. Die Kollegin äußert einen Wunsch." }
      ]
    },
    {
      id: "q2",
      prompt: "Jonas hat Kopierpapier bestellt, ohne in den Schrank zu schauen. Jetzt stehen dort sechs volle Pakete. Was war das Problem?",
      correct: "voreilig",
      options: [
        { value: "voreilig", label: "Er hat bestellt, bevor er Bestand und Bedarf geklärt hat", feedback: "Richtig: Hätte Jonas zuerst nachgesehen, hätte er gewusst, dass genug da ist." },
        { value: "zuwenig", label: "Er hat zu wenig bestellt", feedback: "Im Schrank stehen sechs volle Pakete. Es ist zu viel da, nicht zu wenig." },
        { value: "bedarf", label: "Es gab keinen Bedarf an Kopierpapier im Büro", feedback: "Papier wird im Büro gebraucht. Das Problem ist, dass Jonas den vorhandenen Bestand nicht geprüft hat." }
      ]
    },
    {
      id: "q3",
      prompt: "Jonas sieht, dass die Ordner im Schrank knapp werden. Was tut er zuerst?",
      correct: "klaeren",
      options: [
        { value: "sofort", label: "Er bestellt sofort einen sehr großen Karton, damit es nie wieder knapp wird", feedback: "Das ist voreilig. Jonas weiß noch nicht, wie viel fehlt und bis wann. Zu viel Vorrat kostet Geld und Platz." },
        { value: "klaeren", label: "Er prüft, was noch da ist und was bis wann gebraucht wird", feedback: "Richtig: Erst Bestand, Verbrauch und Zeitpunkt klären, dann weiß Jonas den Bedarf." },
        { value: "anbieter", label: "Er sucht zuerst den günstigsten Anbieter", feedback: "Der Preis ist erst dran, wenn klar ist, was gebraucht wird. Zuerst klärt Jonas den Bedarf." }
      ]
    }
  ];
  var TERMS = ["Bedarf", "ökonomisches Prinzip", "Beschaffung"];

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, TERMS: TERMS, progress: progress };
  global.LF4_BEDARF = api;
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
    var box = $("bedarf-ergebnis");
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
    var host = $("bedarf-fragen");
    QUESTIONS.forEach(function (q, index) {
      var field = doc.createElement("fieldset");
      var legend = doc.createElement("legend");
      var group = doc.createElement("div");
      field.className = "bedarf-frage";
      legend.textContent = (index + 1) + ". " + q.prompt;
      field.appendChild(legend);
      group.className = "bedarf-optionen";
      q.options.forEach(function (option) {
        var label = doc.createElement("label");
        var input = doc.createElement("input");
        var text = doc.createElement("span");
        input.type = "radio";
        input.name = q.id;
        input.value = option.value;
        if (state.answers[q.id] === option.value) input.checked = true;
        label.className = "bedarf-option";
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
      feedback.className = "bedarf-feedback";
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
    var box = $("bedarf-ergebnis");
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
    doc.querySelectorAll('#bedarf-fragen input[type="radio"]').forEach(function (input) { input.checked = false; });
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
      doc.querySelectorAll('#bedarf-fragen input[type="radio"]').forEach(function (input) { input.checked = false; });
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
