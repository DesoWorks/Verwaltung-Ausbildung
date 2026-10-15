/* Lernfeld 4: Wareneingang prüfen und einlagern. Lokale, wiederholbare Lernorientierung. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf4-wareneingang.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
  {
    "id": "q1",
    "prompt": "Bestellung und Lieferschein nennen zehn Packungen. Was prüft Noah zusätzlich?",
    "correct": "lieferung-abgleichen",
    "options": [
      {
        "value": "nur-lieferschein-lesen",
        "label": "Nur die zehn auf dem Lieferschein; Nachzählen ist unnötig",
        "feedback": "Der Lieferschein zeigt nicht sicher, was tatsächlich angekommen ist. Die Ware muss mit den Angaben verglichen werden."
      },
      {
        "value": "lieferung-abgleichen",
        "label": "Artikel, tatsächliche Menge und sichtbaren Zustand der gelieferten Packungen",
        "feedback": "Richtig. Erst der Abgleich mit der tatsächlichen Lieferung zeigt eine Fehlmenge oder sichtbare Schäden."
      },
      {
        "value": "sofort-einlagern",
        "label": "Nichts weiter, die Packungen kommen sofort ins normale Lager",
        "feedback": "Ohne Prüfung können Fehlmengen und Schäden unbemerkt bleiben. Erst prüfen, dann passend einlagern."
      }
    ]
  },
  {
    "id": "q2",
    "prompt": "Noah zählt acht Packungen; eine Verpackung ist sichtbar feucht. Was ist passend?",
    "correct": "abweichung-dokumentieren",
    "options": [
      {
        "value": "abweichung-dokumentieren",
        "label": "Menge und sichtbaren Zustand festhalten und mit Bestellbezug zuständig weitergeben",
        "feedback": "Richtig. Die zuständige Person braucht konkrete Beobachtungen, um den Fall nach dem betrieblichen Ablauf zu klären."
      },
      {
        "value": "zehn-bestaetigen",
        "label": "Zehn unbeschädigte Packungen melden, weil das im Lieferschein steht",
        "feedback": "Das entspricht nicht der Beobachtung. Melde acht Packungen und die sichtbare feuchte Verpackung."
      },
      {
        "value": "schaden-verschweigen",
        "label": "Die feuchte Packung zwischen die anderen legen und nichts sagen",
        "feedback": "So bleibt die Abweichung ungeklärt. Halte sie fest und gib sie an die zuständige Person weiter."
      }
    ]
  },
  {
    "id": "q3",
    "prompt": "Wo lagert Noah die geprüften und zur Einlagerung freigegebenen Papierpackungen?",
    "correct": "trocken-vorgesehen",
    "options": [
      {
        "value": "feuchter-boden",
        "label": "Auf einem feuchten Bodenplatz, weil dort gerade Raum ist",
        "feedback": "Feuchtigkeit ist für Papier ungeeignet. Ein freier Platz ist nicht automatisch ein geeigneter Lagerplatz."
      },
      {
        "value": "ungeprueft-vermischen",
        "label": "Zusammen mit der klärungsbedürftigen Packung ohne Kennzeichnung",
        "feedback": "Die betroffene Packung soll nach dem betrieblichen Ablauf zur Klärung bereitliegen und nicht ungeprüft im normalen Bestand verschwinden."
      },
      {
        "value": "trocken-vorgesehen",
        "label": "Am vorgesehenen trockenen Lagerplatz unter Beachtung der Lagerhinweise",
        "feedback": "Richtig. Der Lagerplatz passt zu Druckerpapier und zu den betrieblichen Vorgaben."
      }
    ]
  }
];
  var LOCAL_TERMS = [
  {
    "begriff": "Wareneingang",
    "erklaerung": "Das Eintreffen bestellter Waren im Betrieb. Dabei wird geprüft, ob die tatsächliche Lieferung zu den vereinbarten Angaben passt."
  },
  {
    "begriff": "Abweichung beim Wareneingang",
    "erklaerung": "Ein festgestellter Unterschied zwischen vereinbarter und tatsächlich eingetroffener Lieferung, zum Beispiel eine Fehlmenge oder eine sichtbare Beschädigung."
  },
  {
    "begriff": "Sachgerechte Lagerung",
    "erklaerung": "Waren so aufzubewahren, dass ihr Zustand und ihre Nutzbarkeit erhalten bleiben. Der Lagerplatz muss zu den Eigenschaften der Ware und den betrieblichen Vorgaben passen."
  }
];

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, LOCAL_TERMS: LOCAL_TERMS, progress: progress };
  global.LF4_WARENEINGANG = api;
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
