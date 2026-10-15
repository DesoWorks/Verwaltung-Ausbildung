/* Lernfeld 4: Bestellmenge und Lieferzeitpunkt. Quelle: lokale KMK-Arbeitskopie, Dokumentseite 13. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf4-menge.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
    {
      id: "q1",
      prompt: "Was bestimmt, wann der Betrieb bestellen muss, damit die Lieferung rechtzeitig eintrifft?",
      correct: "zeitpunkt",
      options: [
        { value: "wunschdatum", label: "Nur das gewünschte Lieferdatum; die Lieferzeit spielt keine Rolle.", feedback: "Ein Wunschdatum reicht nicht. Die Bestellung muss früh genug erfolgen, und der Bestand muss bis zur Lieferung reichen." },
        { value: "zufallstag", label: "Ein beliebiger Tag, unabhängig vom vorhandenen Bestand.", feedback: "Wenn der Bestand vorher aufgebraucht ist, kommt die Lieferung zu spät. Der Bestelltag darf nicht beliebig sein." },
        { value: "zeitpunkt", label: "Vorhandener Bestand, Lieferzeit und ein nötiger Puffer müssen zum geplanten Lieferzeitpunkt passen.", feedback: "Richtig. Der Bestellzeitpunkt hängt mit Bestand und Lieferzeit zusammen. Ein Wunschdatum allein sichert keine rechtzeitige Lieferung." }
      ]
    },
    {
      id: "q2",
      prompt: "Welche Aussage zur optimalen Bestellmenge passt?",
      correct: "menge",
      options: [
        { value: "groesste", label: "Die größte mögliche Bestellung ist immer optimal.", feedback: "Große Bestellungen binden Geld und Lagerplatz. Die größte Menge ist nicht automatisch sinnvoll." },
        { value: "menge", label: "Bestell- und Lagerkosten werden abgewogen; die Menge muss auch zu den betrieblichen Grenzen passen.", feedback: "Richtig. Gesucht ist ein sinnvoller Ausgleich. Weder die größte noch die beim Stückpreis billigste Menge ist automatisch optimal." },
        { value: "stueckpreis", label: "Es zählt ausschließlich der niedrigste Preis je Packung.", feedback: "Der Stückpreis allein berücksichtigt weder Lagerkosten noch Bestellaufwand und betriebliche Grenzen." }
      ]
    },
    {
      id: "q3",
      prompt: "Das Diagramm zeigt bei 40 Packungen die niedrigsten Modellkosten der drei Varianten. Was folgt daraus?",
      correct: "diagramm",
      options: [
        { value: "diagramm", label: "40 Packungen sind unter den dargestellten Annahmen günstiger; vor der Entscheidung werden die betrieblichen Bedingungen geprüft.", feedback: "Richtig. Das Diagramm unterstützt die Entscheidung. Es ersetzt weder die Prüfung der Annahmen noch von Lagerplatz, Mitteln und Lieferbedingungen." },
        { value: "automatismus", label: "Das Diagramm entscheidet allein; der Betrieb muss nichts mehr prüfen.", feedback: "Ein Diagramm entscheidet nicht selbst. Die Daten und die betrieblichen Bedingungen müssen weiterhin geprüft werden." },
        { value: "immer40", label: "40 Packungen sind für jeden Betrieb und jeden Zeitraum automatisch optimal.", feedback: "Die Modellwerte gelten nur für das Beispiel und die untersuchten Varianten. Andere Annahmen können zu einer anderen Menge führen." }
      ]
    }
  ];
  var LOCAL_TERMS = [
    { begriff: "Bestellzeitpunkt", erklaerung: "Der Zeitpunkt, an dem eine Bestellung ausgelöst wird. Er wird so geplant, dass der Bestand unter Berücksichtigung der Lieferzeit und eines nötigen Puffers bis zur Lieferung reicht." },
    { begriff: "Optimale Bestellmenge", erklaerung: "Eine Bestellmenge, die unter den jeweiligen Annahmen einen günstigen Ausgleich zwischen Bestell- und Lagerkosten erreicht. Betriebliche Grenzen müssen zusätzlich passen; die größte Menge ist nicht automatisch optimal." },
    { begriff: "Diagramm", erklaerung: "Eine bildliche Darstellung von Daten, die Unterschiede und Zusammenhänge sichtbar macht. Sie unterstützt eine Entscheidung, ersetzt aber nicht die Prüfung der Daten, Annahmen und betrieblichen Bedingungen." }
  ];
  var TERMS = LOCAL_TERMS.map(function (item) { return item.begriff; });

  function progress(state) {
    var answered = QUESTIONS.reduce(function (count, q) {
      return count + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, TERMS: TERMS, LOCAL_TERMS: LOCAL_TERMS, progress: progress };
  global.LF4_MENGE = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (!global.document) return;

  var doc = global.document;
  var state = { answers: {}, finish: false };
  function $(id) { return doc.getElementById(id); }

  function load() {
    try {
      var saved = JSON.parse(global.localStorage.getItem(KEY) || "null");
      if (!saved || typeof saved !== "object") return;
      QUESTIONS.forEach(function (q) {
        var value = saved.answers && saved.answers[q.id];
        if (q.options.some(function (option) { return option.value === value; })) state.answers[q.id] = value;
      });
      state.finish = saved.finish === true;
    } catch (e) { /* Ein unlesbarer Speicherstand darf die Lektion nicht blockieren. */ }
  }

  function save() {
    try { global.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* Auch ohne Speicher nutzbar. */ }
  }

  function notify() {
    if (global.LERNFORTSCHRITT) global.LERNFORTSCHRITT.benachrichtigen();
  }

  function update() {
    var n = progress(state);
    $("fortschritt-balken").style.width = n + "%";
    $("fortschritt-text").textContent = "Fortschritt: " + n + " %";
    var correct = QUESTIONS.filter(function (q) { return state.answers[q.id] === q.correct; }).length;
    $("abschluss-status").textContent = correct === QUESTIONS.length
      ? "Alle drei Antworten passen. Prüfe deine Auswahl in der Übung; du kannst sie jederzeit wiederholen."
      : "Die Übung ist noch nicht vollständig richtig. Du kannst sie ohne Zeitdruck wiederholen.";
  }

  function step(id) {
    if (STEPS.indexOf(id) === -1) return;
    STEPS.forEach(function (name) { $(name).hidden = name !== id; });
    doc.querySelectorAll(".schritt-knopf").forEach(function (button) {
      if (button.dataset.ziel === id) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    if (id === "abschluss") { state.finish = true; save(); notify(); }
    update();
    $("hauptinhalt").focus();
    global.scrollTo(0, 0);
  }

  function buildTerms() {
    LOCAL_TERMS.forEach(function (item) {
      var details = doc.createElement("details");
      var summary = doc.createElement("summary");
      var text = doc.createElement("p");
      details.className = "fachwort-hinweis";
      summary.textContent = item.begriff;
      text.textContent = item.erklaerung;
      details.append(summary, text);
      $("fachwoerter-liste").appendChild(details);
    });
  }

  function clearResult() {
    $("lektion-ergebnis").hidden = true;
    $("lektion-ergebnis").textContent = "";
    QUESTIONS.forEach(function (q) {
      $("feedback-" + q.id).hidden = true;
      $("feedback-" + q.id).textContent = "";
    });
  }

  function buildQuestions() {
    QUESTIONS.forEach(function (q, index) {
      var field = doc.createElement("fieldset");
      var legend = doc.createElement("legend");
      var group = doc.createElement("div");
      field.className = "lern-frage";
      legend.textContent = (index + 1) + ". " + q.prompt;
      field.appendChild(legend);
      group.className = "lern-optionen";
      q.options.forEach(function (option) {
        var label = doc.createElement("label");
        var input = doc.createElement("input");
        var text = doc.createElement("span");
        input.type = "radio";
        input.name = q.id;
        input.value = option.value;
        input.setAttribute("aria-describedby", "feedback-" + q.id);
        input.checked = state.answers[q.id] === option.value;
        label.className = "lern-option";
        text.textContent = option.label;
        label.append(input, text);
        input.addEventListener("change", function () {
          state.answers[q.id] = input.value;
          clearResult();
          save();
          update();
          notify();
        });
        group.appendChild(label);
      });
      field.appendChild(group);
      var feedback = doc.createElement("p");
      feedback.id = "feedback-" + q.id;
      feedback.className = "lern-feedback";
      feedback.hidden = true;
      feedback.setAttribute("aria-live", "polite");
      field.appendChild(feedback);
      $("lektion-fragen").appendChild(field);
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
      var feedback = option ? option.feedback : "Noch nicht beantwortet. Wähle eine Antwort und prüfe erneut.";
      var row = doc.createElement("p");
      row.textContent = (isCorrect ? "Richtig: " : value ? "Noch nicht richtig: " : "Nicht beantwortet: ")
        + "Aufgabe " + (index + 1) + ". " + feedback;
      box.appendChild(row);
      if (isCorrect) correct += 1;
      if (!value) unanswered += 1;
      $("feedback-" + q.id).textContent = feedback;
      $("feedback-" + q.id).hidden = false;
      state.answers[q.id] = value;
    });
    heading.textContent = correct === QUESTIONS.length ? "Alle Antworten richtig"
      : unanswered === QUESTIONS.length ? "Noch nichts ausgewählt"
        : correct ? "Teilweise richtig" : "Noch nicht richtig";
    var summary = doc.createElement("p");
    summary.textContent = unanswered
      ? (unanswered === 1 ? "Eine Aufgabe ist noch unbeantwortet." : unanswered + " Aufgaben sind noch unbeantwortet.")
      : correct === QUESTIONS.length ? "Du hast alle drei Situationen passend eingeordnet."
        : "Lies die Hinweise und versuche es erneut. Es gibt keinen Zeitdruck.";
    box.appendChild(summary);
    box.hidden = false;
    save();
    update();
    notify();
  }

  function resetAnswers() {
    state.answers = {};
    doc.querySelectorAll('#lektion-fragen input[type="radio"]').forEach(function (input) { input.checked = false; });
    clearResult();
    save();
    update();
    notify();
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
      state.finish = false;
      resetAnswers();
      step("start");
    }
  });
  load();
  buildTerms();
  buildQuestions();
  update();
})(typeof window !== "undefined" ? window : globalThis);