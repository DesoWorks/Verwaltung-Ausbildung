/* Lernfeld 4: Vertragsarten beim Beschaffen. Eine kleine, wiederholbare Lernorientierung. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf4-miete.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
    {
      id: "q1",
      prompt: "Elbblick braucht einen Kopierer nur für drei Monate und gibt ihn danach zurück. Welche Vertragsart passt?",
      correct: "miete",
      options: [
        { value: "kauf", label: "Ein Kaufvertrag, weil danach das Gerät dem Betrieb gehört", feedback: "Beim Kauf geht die Sache in das Eigentum über. Hier soll sie zurückgegeben werden." },
        { value: "miete", label: "Ein Mietvertrag, weil die Sache nur auf Zeit genutzt wird", feedback: "Richtig. Bei der Miete wird eine Sache auf Zeit gegen Entgelt überlassen und danach zurückgegeben." },
        { value: "werk", label: "Ein Werkvertrag, weil der Kopierer ein Ergebnis herstellt", feedback: "Ein Werkvertrag schuldet ein herzustellendes Ergebnis. Hier geht es um die zeitweise Nutzung eines Geräts." }
      ]
    },
    {
      id: "q2",
      prompt: "Die Abteilung braucht den Kopierer dauerhaft, jeden Tag, über Jahre. Was passt eher?",
      correct: "kauf-dauer",
      options: [
        { value: "miete-immer", label: "Trotzdem mieten, weil Miete immer günstiger ist", feedback: "Das stimmt nicht allgemein. Bei dauerhaftem Bedarf kann ein Kauf sinnvoller sein. Die Lektion legt keinen festen Preis fest." },
        { value: "kauf-dauer", label: "Einen Kauf prüfen, weil der Bedarf nicht nur vorübergehend ist", feedback: "Richtig. Die Miete passt zur zeitweisen Nutzung. Bei dauerhaftem Bedarf gehört ein Kauf in die Prüfung." },
        { value: "gar-nicht", label: "Weder mieten noch kaufen, weil ein Kopierer kein Sachgut ist", feedback: "Ein Kopierer ist ein Sachgut. Die Frage ist nur, ob er gekauft oder für eine Zeit gemietet wird." }
      ]
    },
    {
      id: "q3",
      prompt: "Mira vergleicht die Miete mit dem Kauf. Worauf achtet sie außer dem Monatspreis?",
      correct: "nutzen-risiko",
      options: [
        { value: "nur-monat", label: "Nur auf den Monatspreis, alles andere ist egal", feedback: "Der Plan nennt Nutzen und Risiken. Rückgabe, Pflege und die Summe über die Nutzungszeit gehören dazu." },
        { value: "nutzen-risiko", label: "Auf Nutzen und Risiko: zeitweiser Bedarf, Rückgabe und die Summe über die Zeit", feedback: "Richtig. Die Miete deckt den kurzen Bedarf. Risiko bleiben Rückgabe, Pflege und eine Summe, die über die Zeit höher sein kann als ein Kauf." },
        { value: "paragraph", label: "Zuerst einen Paragraphen auswendig lernen", feedback: "Diese Lektion nennt keine Gesetzestexte. Es geht um die Entscheidung zwischen Miete und Kauf." }
      ]
    }
  ];
  var LOCAL_TERMS = [
    { begriff: "Mietvertrag", erklaerung: "Ein Vertrag über die Nutzung einer Sache auf Zeit gegen Entgelt. Die Sache geht nicht in das Eigentum über und wird zurückgegeben." },
    { begriff: "Kaufvertrag", erklaerung: "Ein Vertrag über eine Sache gegen Geld. Danach gehört die Sache dem Käufer." },
    { begriff: "Nutzen und Risiko", erklaerung: "Was die Entscheidung bringt und was schiefgehen kann. Bei der Miete ist der Nutzen die zeitweise Nutzung, das Risiko sind Rückgabe, Pflege und die Summe über die Zeit." }
  ];

  function progress(state) {
    var answered = QUESTIONS.reduce(function (n, q) {
      return n + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, LOCAL_TERMS: LOCAL_TERMS, progress: progress };
  global.LF4_MIETE = api;
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
    var box = $("uebung-ergebnis");
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
    var host = $("uebung-fragen");
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
    var box = $("uebung-ergebnis");
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
    doc.querySelectorAll('#uebung-fragen input[type="radio"]').forEach(function (input) { input.checked = false; });
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
