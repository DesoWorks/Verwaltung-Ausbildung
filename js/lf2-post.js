/* Lernfeld 2: Post, Ablage und Datenschutz. Grundlage: lokaler KMK-Rahmenlehrplan, Seiten 10–11. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf2-post.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
    {
      id: "q1",
      prompt: "Noah erhält eine Nachricht zur laufenden Kundenbetreuung. Was macht er damit?",
      correct: "weitergeben",
      options: [
        { value: "verteilen", label: "Die vollständige Nachricht vorsorglich an alle Beschäftigten senden", feedback: "Nicht alle brauchen die Nachricht. Gib sie gezielt an die zuständige Person weiter und beachte dabei persönliche Daten." },
        { value: "weitergeben", label: "Anliegen und Bezug verständlich zusammenfassen und der zuständigen Person die nötigen Informationen geben", feedback: "Richtig. Die zuständige Person braucht den Bezug und die nötigen Informationen. Ein großer Verteiler ist dafür nicht nötig." },
        { value: "kuerzen", label: "Nur ein einzelnes Wort ohne Bezug weitergeben", feedback: "Ohne Zusammenhang kann die zuständige Person das Anliegen nicht bearbeiten. Gib den nötigen Bezug und Inhalt verständlich weiter." }
      ]
    },
    {
      id: "q2",
      prompt: "Noah soll eine vertrauliche Datei versenden. Im Betrieb ist dafür ein sicherer digitaler Weg freigegeben. Was passt?",
      correct: "versand",
      options: [
        { value: "oeffentlich", label: "Einen öffentlichen Link nutzen, weil das am schnellsten geht", feedback: "Schnelligkeit allein reicht nicht. Ein öffentlicher Link schützt die vertraulichen Inhalte hier nicht passend." },
        { value: "doppelt", label: "Die Datei zusätzlich drucken und per Brief senden, obwohl das nicht gebraucht wird", feedback: "Ein unnötiger zweiter Versand verbraucht Material und Arbeit. Nutze den passenden sicheren Weg statt vorsorglich alles doppelt zu senden." },
        { value: "versand", label: "Den freigegebenen Weg nutzen, die richtige empfangende Person prüfen und unnötigen Versand vermeiden", feedback: "Richtig. Die Versandart muss zum Zweck und zur Vertraulichkeit passen. Prüfe, an wen du sendest, und vermeide unnötigen Materialverbrauch." }
      ]
    },
    {
      id: "q3",
      prompt: "Noah legt ein Schriftstück mit persönlichen Kontaktdaten ab. Welche Lösung passt?",
      correct: "ablage",
      options: [
        { value: "ablage", label: "Den vorgesehenen Ordner mit verständlichem Namen nutzen und den Zugriff auf berechtigte Personen begrenzen", feedback: "Richtig. Eine geordnete Ablage macht das Schriftstück auffindbar. Begrenzter Zugriff schützt die persönlichen Daten." },
        { value: "offen", label: "Das Schriftstück offen für alle auslegen, damit es leicht zu finden ist", feedback: "Auffindbar heißt nicht öffentlich. Persönliche Daten gehören nur in den Zugriff der Personen, die damit arbeiten dürfen." },
        { value: "zufall", label: "Eine Datei ohne erkennbaren Namen in einem beliebigen privaten Ordner speichern", feedback: "Ein beliebiger privater Ordner ist keine gemeinsame betriebliche Ordnung. Nutze den vorgesehenen Ort und die vereinbarte Benennung." }
      ]
    }
  ];
  var LOCAL_TERMS = [
    { begriff: "Versandart", erklaerung: "Der Weg, auf dem du Informationen oder Schriftstücke verschickst, zum Beispiel digital oder als Brief. Er muss zum Zweck und zum Schutzbedarf passen." },
    { begriff: "Ablage", erklaerung: "Die vereinbarte Ordnung, in der du Schriftstücke und Dateien aufbewahrst und wiederfindest." },
    { begriff: "Datenschutz", erklaerung: "Der Schutz persönlicher Daten vor unpassender Nutzung und Weitergabe. Du gibst sie nur im vorgesehenen Rahmen an berechtigte Personen weiter." }
  ];
  var TERMS = LOCAL_TERMS.map(function (entry) { return entry.begriff; });

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, TERMS: TERMS, progress: progress };
  global.LF2_POST = api;
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
      var item = (global.GLOSSAR || []).concat(LOCAL_TERMS).find(function (entry) { return entry.begriff === term; });
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
    var box = $("post-ergebnis");
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
    var host = $("post-fragen");
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
    var box = $("post-ergebnis");
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
  }

  function resetAnswers() {
    state.answers = {};
    save();
    doc.querySelectorAll('#post-fragen input[type="radio"]').forEach(function (input) { input.checked = false; });
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
      save();
      if (global.LERNFORTSCHRITT) global.LERNFORTSCHRITT.benachrichtigen();
      step("start");
    }
  });

  load();
  buildTerms();
  buildQuestions();
  update();
})(typeof window !== "undefined" ? window : globalThis);
