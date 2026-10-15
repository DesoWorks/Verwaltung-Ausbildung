/* Lernfeld 1: Ziele und Wirtschaftskreislauf. Quelle: lokale KMK-Arbeitskopie, Dokumentseite 9. */
(function (global) {
  "use strict";
  var KEY = "verwaltung-ausbildung.lf1-ziele.v1";
  var STEPS = ["start", "beispiel", "uebung", "abschluss"];
  var QUESTIONS = [
    {
      id: "q1",
      prompt: "Welche Aussage beschreibt ein Betriebsziel von Nordlicht?",
      correct: "ziele",
      options: [
        { value: "lernziel", label: "Ich möchte persönlich schneller schreiben lernen.", feedback: "Das ist ein persönliches Lernziel. Es kann helfen, ist aber nicht dasselbe wie ein Ziel des Betriebs." },
        { value: "ziele", label: "Der Betrieb möchte wirtschaftlich arbeiten und zufriedene Kunden behalten.", feedback: "Richtig. Das sind angestrebte Ergebnisse des Betriebs und damit Betriebsziele, keine persönlichen Lernziele." },
        { value: "zufall", label: "Der Betrieb arbeitet ohne angestrebtes Ergebnis einfach weiter.", feedback: "Ein Ziel beschreibt gerade ein angestrebtes Ergebnis. Zielloses Weiterarbeiten ist kein Betriebsziel." }
      ]
    },
    {
      id: "q2",
      prompt: "Nordlicht erledigt Büroarbeiten, ein anderer Betrieb stellt Papier her und ein Lieferdienst transportiert es. Was zeigt das?",
      correct: "arbeitsteilung",
      options: [
        { value: "selbstversorgung", label: "Nordlicht muss Papier und Transport zusätzlich selbst herstellen beziehungsweise erledigen.", feedback: "Gerade das ist nicht nötig: Verschiedene Beteiligte übernehmen unterschiedliche Teile der Arbeit." },
        { value: "gleicharbeit", label: "Alle beteiligten Betriebe erledigen genau dieselbe Arbeit.", feedback: "Im Beispiel sind die Aufgaben verschieden: Büroarbeit, Papierherstellung und Transport." },
        { value: "arbeitsteilung", label: "Verschiedene Betriebe übernehmen unterschiedliche Teile; Nordlicht macht nicht alles allein.", feedback: "Richtig. Diese Aufteilung und der Austausch der Ergebnisse kennzeichnen die arbeitsteilige Wirtschaft." }
      ]
    },
    {
      id: "q3",
      prompt: "Wie ist Nordlicht im erweiterten Wirtschaftskreislauf einzuordnen?",
      correct: "kreislauf",
      options: [
        { value: "kreislauf", label: "Der Betrieb tauscht Leistungen und Geld mit anderen aus; auch Haushalte, Banken, Staat und Ausland gehören zum Modell.", feedback: "Richtig. Der Betrieb steht im Austausch. Der erweiterte Wirtschaftskreislauf bildet weitere Beteiligte neben Unternehmen und Haushalten ab." },
        { value: "insel", label: "Der Betrieb ist eine geschlossene Insel ohne Austausch mit anderen.", feedback: "Schon Einkommen für Beschäftigte und Zahlungen von Kunden zeigen Verbindungen. Der Betrieb ist keine geschlossene Insel." },
        { value: "nurunternehmen", label: "Zum erweiterten Wirtschaftskreislauf gehören ausschließlich Unternehmen.", feedback: "Das Modell umfasst auch private Haushalte, Banken, Staat und Ausland, nicht nur Unternehmen." }
      ]
    }
  ];
  var LOCAL_TERMS = [
    { begriff: "Betriebsziel", erklaerung: "Ein angestrebtes Ergebnis des Betriebs, zum Beispiel wirtschaftlich zu arbeiten, Kunden zu halten oder Ressourcen zu schonen. Es ist nicht dasselbe wie ein persönliches Lernziel." },
    { begriff: "Arbeitsteilige Wirtschaft", erklaerung: "Eine Wirtschaft, in der verschiedene Beteiligte unterschiedliche Teile der Arbeit übernehmen und ihre Ergebnisse austauschen. Ein Betrieb stellt nicht alles selbst her." },
    { begriff: "Erweiterter Wirtschaftskreislauf", erklaerung: "Ein vereinfachtes Modell der Leistungs- und Geldströme zwischen Unternehmen, privaten Haushalten, Banken, Staat und Ausland. Es zeigt, dass ein Betrieb mit anderen Beteiligten verbunden ist." }
  ];
  var TERMS = LOCAL_TERMS.map(function (item) { return item.begriff; });

  function progress(state) {
    var answered = QUESTIONS.reduce(function (count, q) {
      return count + (state.answers && state.answers[q.id] === q.correct ? 1 : 0);
    }, 0);
    return Math.round((answered + (state.finish ? 1 : 0)) / (QUESTIONS.length + 1) * 100);
  }

  var api = { KEY: KEY, STEPS: STEPS, QUESTIONS: QUESTIONS, TERMS: TERMS, LOCAL_TERMS: LOCAL_TERMS, progress: progress };
  global.LF1_ZIELE = api;
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