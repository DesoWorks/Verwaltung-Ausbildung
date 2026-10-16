/* Lernzielkontrollen für Lernfeld 1–4. Der Browser-Schutz ersetzt keine
 * serverseitige Zugriffskontrolle. Jeder Stand gehört nur seiner Kontrolle. */
(function (global) {
  "use strict";
  var RESET_HASH = "863d93d7b197f636e4dcbff73aa415273f7e88c9db23565da882b24540e79e95";
  var FRAGEN = {
    lf1: [
      {
        text: "Mira beginnt ihre Ausbildung. Welcher Vertrag regelt ihre jetzige Rolle?",
        optionen: ["Der Ausbildungsvertrag.", "Automatisch schon ein späterer Arbeitsvertrag.", "Ein Kaufvertrag mit einem Lieferanten."],
        richtig: "a",
        hinweis: "Der Ausbildungsvertrag regelt das Ausbildungsverhältnis. Ein späteres Arbeitsverhältnis hat einen anderen Vertrag."
      },
      {
        text: "Mira ist unsicher, ob sie im Namen des Betriebs eine Zusage machen darf. Was tut sie zuerst?",
        optionen: ["Sie sagt zu, damit niemand warten muss.", "Sie fragt ihre Ausbilderin oder ihren Ausbilder und klärt ihren Handlungsrahmen.", "Sie lässt die Frage ungeklärt und unterschreibt trotzdem."],
        richtig: "b",
        hinweis: "Bei Unsicherheit über Aufgaben und Zusagen fragt Mira vorher nach. Ihre Stellung und ihre Befugnisse sind nicht dasselbe."
      },
      {
        text: "Der Betrieb will weniger Material verschwenden; Mira will schneller schreiben lernen. Wie ordnest du das ein?",
        optionen: ["Beides ist ausschließlich ein persönliches Lernziel.", "Beides ist ausschließlich ein Betriebsziel.", "Weniger Material verschwenden ist ein Betriebsziel; schneller schreiben lernen ist Miras persönliches Lernziel."],
        richtig: "c",
        hinweis: "Betriebsziele und persönliche Lernziele sind verschieden, können sich aber unterstützen."
      },
      {
        text: "Mira stellt den Betrieb vor. Wie geht sie mit Kundennamen und einem fremden Foto um?",
        optionen: ["Sie klärt, welche personenbezogenen Daten sie zeigen darf, nutzt das Foto nur mit erlaubter Nutzung und nennt die Quelle.", "Sie zeigt alles, weil der Vortrag kurz ist.", "Sie nennt eine Quelle; damit ist jede Bildnutzung automatisch erlaubt."],
        richtig: "a",
        hinweis: "Datenschutz und Urheberrecht gelten auch bei Präsentationen. Eine Quellenangabe allein ersetzt keine erlaubte Nutzung."
      },
      {
        text: "Mira prüft einen Tabellenkurs. Welches Ziel ist konkret und erreichbar?",
        optionen: ["Irgendwann alles über Tabellen wissen.", "Nach dem passenden Kurs eine einfache Auswertung ihrer Bestellliste selbst aufbauen.", "Den Kurs besuchen, ohne Thema, Termin oder Nutzen zu prüfen."],
        richtig: "b",
        hinweis: "Mira prüft Thema, Termin und Nutzen. Eine einfache Auswertung der eigenen Bestellliste ist ein konkretes Ziel für die Anwendung des Gelernten."
      }
    ],
    lf2: [
      {
        text: "Noah hat eine wichtige Auswertung, die heute gebraucht wird. Daneben möchte er eine gut lesbare Überschrift nur noch verschönern. Was hat Vorrang?",
        optionen: ["Immer die zuletzt eingefallene Aufgabe.", "Die weitere Verzierung der Überschrift.", "Die wichtige und dringende Auswertung; die unnötige Verfeinerung stellt er zurück."],
        richtig: "c",
        hinweis: "Wichtigkeit und Dringlichkeit bestimmen die Reihenfolge. Immer weiter zu verfeinern kann eine selbst ausgelöste Zeitfalle sein."
      },
      {
        text: "Noah muss sich zum Bildschirm verdrehen; ein Kabel liegt im Gehweg. Was passt?",
        optionen: ["Stuhl und Bildschirm passend einstellen lassen und das Kabel als Sicherheitsproblem ansprechen.", "Beides als reine Geschmacksfrage behandeln.", "Pausen auslassen, damit er schneller fertig wird."],
        richtig: "a",
        hinweis: "Ergonomie passt Arbeitsbedingungen an den Menschen an. Freie Wege gehören zur Arbeitssicherheit."
      },
      {
        text: "Nach einer Sitzung soll feststehen, was entschieden wurde, wer es erledigt und bis wann. Was hält Noah fest?",
        optionen: ["Nur die vorher geplanten Themen als Tagesordnung.", "Beschlüsse, Zuständigkeiten und Termine im Ergebnisprotokoll; ungeklärte Punkte getrennt.", "Nur seine Lieblingsbeiträge, ohne die Aufgaben zu nennen."],
        richtig: "b",
        hinweis: "Ein Ergebnisprotokoll hält Beschlüsse und Aufgaben fest. Offene Punkte bleiben als solche erkennbar; das Protokoll geht an die Teilnehmenden."
      },
      {
        text: "Eine Kundennachricht enthält persönliche Kontaktdaten. Wie gibt Noah sie weiter?",
        optionen: ["Vorsorglich an alle im Betrieb.", "In einen öffentlichen Ordner ohne Zugriffsschutz.", "Mit den nötigen Angaben an die zuständige Person über den freigegebenen Weg."],
        richtig: "c",
        hinweis: "Gezielte Weitergabe und geschützte Ablage machen Informationen auffindbar, ohne persönliche Daten unnötig zu verbreiten."
      },
      {
        text: "Im Team möchte eine Person eine kurze Übersicht, die andere ausführliche Hinweise. Wie finden sie einen passenden Kompromiss?",
        optionen: ["Sie erfragen die Gründe und prüfen eine kurze Übersicht mit verlinkten Details an Beispielfällen.", "Die lautere Person setzt sich ohne Begründung durch.", "Sie hören einander nicht mehr zu."],
        richtig: "a",
        hinweis: "Ein Kompromiss berücksichtigt die begründeten Anliegen und das gemeinsame Arbeitsziel. Sachliche Kommunikation hilft dabei."
      }
    ],
    lf3: [
      {
        text: "Eine Kundin fragt Lea: Was kosten 20 Ordner? Wie ordnet Lea die Nachricht ein?",
        optionen: ["Als bereits angenommenen Auftrag, den sie sofort ausliefert.", "Als Anfrage; sie prüft die nötigen Angaben und ihre Zuständigkeit vor einem Angebot.", "Als Rechnung für eine erledigte Lieferung."],
        richtig: "b",
        hinweis: "Eine Frage nach Preis oder Lieferzeit ist noch kein Auftrag. Lea prüft erst die Angaben und darf nichts ungeprüft zusagen."
      },
      {
        text: "In den erfundenen Übungsdaten kosten 12 Ordner 30 Euro. Was kosten 20 Ordner nach 10 Prozent Rabatt bei gleichem Stückpreis?",
        optionen: ["50 Euro.", "5 Euro.", "45 Euro."],
        richtig: "c",
        hinweis: "30 : 12 = 2,50 Euro je Ordner; 20 × 2,50 = 50 Euro. 10 Prozent davon sind 5 Euro, also bleiben 45 Euro."
      },
      {
        text: "Welches Dokument beschreibt die Artikel und Mengen einer konkreten Lieferung?",
        optionen: ["Der Lieferschein; er ist kein Zahlungsnachweis.", "Nur die Auftragsbestätigung, die jede tatsächlich angekommene Menge beweist.", "Die Rechnung, weil sie automatisch jede Zahlung bestätigt."],
        richtig: "a",
        hinweis: "Der Lieferschein beschreibt die Lieferung, die Auftragsbestätigung den angenommenen Auftrag und die Rechnung die Abrechnung."
      },
      {
        text: "Lea nutzt einen Textbaustein zum Bearbeitungsstand. Der Versand ist noch nicht bestätigt. Was ist richtig?",
        optionen: ["Einen Liefertermin aus einem alten Kundenfall übernehmen.", "Platzhalter mit geprüften Falldaten füllen und den ganzen Text ohne ungeprüfte Versandzusage lesen.", "Den Namen des vorigen Kunden stehen lassen."],
        richtig: "b",
        hinweis: "Ein Textbaustein spart Arbeit, ersetzt aber nicht die Prüfung von Name, Auftragsnummer und Aussage zum aktuellen Vorgang."
      },
      {
        text: "Ein Papier soll als Datei zum Lesen weitergegeben werden. Welche Kombination passt?",
        optionen: ["Drucken; dadurch wird aus Papier eine Datei.", "Kopieren; dadurch entsteht automatisch eine bearbeitbare Textdatei.", "Scannen und als PDF bereitstellen, wenn nur gelesen werden soll."],
        richtig: "c",
        hinweis: "Scannen macht aus Papier eine Datei. PDF passt zum Lesen; eine bearbeitbare Textdatei dient der weiteren Textbearbeitung."
      }
    ],
    lf4: [
      {
        text: "Der Ordnerschrank wirkt fast leer. Was klärt Tom vor einer Bestellung zuerst?",
        optionen: ["Bestand, Verbrauch und den Zeitpunkt, bis zu dem Nachschub gebraucht wird.", "Nur die Lieblingsfarbe eines Kollegen.", "Nichts; er bestellt sofort die größte angebotene Menge."],
        richtig: "a",
        hinweis: "Erst der geklärte Bedarf zeigt, ob und was beschafft werden muss. Das vermeidet unnötiges Material."
      },
      {
        text: "Der Bedarf steht fest. In einem passenden Angebot fehlt die Lieferzeit. Was tut Tom?",
        optionen: ["Er nimmt an, dass morgen geliefert wird.", "Er fragt die fehlende Lieferzeit nach, bevor eine Bestellung entschieden wird.", "Er ignoriert den benötigten Termin und vergleicht nur den Preis."],
        richtig: "b",
        hinweis: "Preis und Lieferzeit müssen zum konkreten Bedarf bekannt sein. Der niedrigste Preis allein reicht nicht als Entscheidung."
      },
      {
        text: "Für ein kurzes Projekt wird ein Kopierer gegen monatliches Entgelt genutzt und danach zurückgegeben. Welche Vertragsart ist das?",
        optionen: ["Ein Kaufvertrag, weil jede Nutzung Eigentum überträgt.", "Ein Werkvertrag über ein herzustellendes Regal.", "Ein Mietvertrag: Nutzung auf Zeit gegen Entgelt, ohne Eigentumsübergang."],
        richtig: "c",
        hinweis: "Bei der Miete bleibt es bei der zeitweisen Nutzung. Ob Mieten passt, hängt vom Bedarf sowie Nutzen und Risiken ab."
      },
      {
        text: "Bestellung und Lieferschein nennen zehn Packungen Papier. Tom zählt acht; eine Verpackung ist feucht. Was ist richtig?",
        optionen: ["Menge und sichtbaren Schaden festhalten, zuständig weitergeben und die betroffene Packung zur Klärung getrennt halten.", "Zehn eintragen, weil es auf dem Lieferschein steht.", "Alle Packungen ungeprüft auf dem feuchten Boden lagern."],
        richtig: "a",
        hinweis: "Entscheidend ist die tatsächliche Lieferung. Abweichungen werden dokumentiert; freigegebenes Papier wird am vorgesehenen trockenen Platz gelagert."
      },
      {
        text: "Zwölf Ordner wurden bestellt und geliefert; die Rechnung nennt fünfzehn. Wie geht Tom vor?",
        optionen: ["Sofort fünfzehn bezahlen, weil Rechnungen immer stimmen.", "Die Abweichung festhalten und vor der Zahlung klären.", "Ohne genannte Bedingung beliebig Skonto abziehen."],
        richtig: "b",
        hinweis: "Zur Rechnungskontrolle gehört der Abgleich mit Bestellung und Lieferung. Skonto setzt eine genannte Bedingung und die eingehaltene Frist voraus."
      }
    ]
  };

  async function passwortPasst(wort) {
    if (!wort) return false;
    var digest = await global.crypto.subtle.digest("SHA-256", new TextEncoder().encode(wort));
    var hex = Array.from(new Uint8Array(digest)).map(function (byte) {
      return byte.toString(16).padStart(2, "0");
    }).join("");
    return hex === RESET_HASH;
  }

  var api = { FRAGEN: FRAGEN, passwortPasst: passwortPasst };
  global.LERNZIELKONTROLLE = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (!global.document) return;

  var doc = global.document;
  var feld = doc.body.dataset.lernfeld;
  var fragen = FRAGEN[feld];
  if (!fragen) return;
  var key = "verwaltung-ausbildung." + feld + "-lernziel.v1";
  var state = { answers: {}, finish: false };
  var lesefehler = false;
  var beschaeftigt = false;
  function $(id) { return doc.getElementById(id); }
  var form = $("lernziel-form");
  var host = $("lernziel-fragen");
  var status = $("lernziel-status");
  var speicherhinweis = $("speicher-hinweis");
  var dialog = $("reset-dialog");
  var passwort = $("reset-passwort");
  var resetHinweis = $("reset-hinweis");

  function benachrichtigen() {
    if (global.LERNFORTSCHRITT) global.LERNFORTSCHRITT.benachrichtigen();
  }
  try {
    var raw = global.localStorage.getItem(key);
    if (raw !== null) {
      var saved = JSON.parse(raw);
      if (!saved || typeof saved.answers !== "object" || saved.answers === null
          || Array.isArray(saved.answers) || typeof saved.finish !== "boolean") throw new Error("Ungültiger Stand");
      state = { answers: saved.answers, finish: saved.finish };
    }
  } catch (_) {
    lesefehler = true;
    speicherhinweis.textContent = "Der gespeicherte Stand ist nicht lesbar und wird nicht überschrieben. Bitte die zuständige Ausbildungsperson um Prüfung oder Freigabe zum Zurücksetzen bitten.";
  }
  function speichern(next) {
    try {
      global.localStorage.setItem(key, JSON.stringify(next));
      state = next;
      speicherhinweis.textContent = "";
      return true;
    } catch (_) {
      speicherhinweis.textContent = "Der Stand konnte nicht gespeichert werden. Bitte Browserspeicher prüfen und erneut versuchen. Die Kontrolle wurde nicht abgegeben.";
      return false;
    }
  }
  function antwortenLesen() {
    var answers = {};
    fragen.forEach(function (_, index) {
      var id = "q" + (index + 1);
      var input = form.querySelector('input[name="' + id + '"]:checked');
      if (input) answers[id] = input.value;
    });
    return answers;
  }
  function anzeigen() {
    var richtig = 0;
    fragen.forEach(function (frage, index) {
      var id = "q" + (index + 1);
      var fieldset = $("frage-" + id);
      fieldset.disabled = state.finish || lesefehler || beschaeftigt;
      fieldset.querySelectorAll("input").forEach(function (input) {
        input.checked = state.answers[id] === input.value;
      });
      var feedback = $("hinweis-" + id);
      feedback.hidden = !state.finish;
      if (state.finish) {
        var stimmt = state.answers[id] === frage.richtig;
        if (stimmt) richtig += 1;
        feedback.textContent = (stimmt ? "Richtig. " : "Nicht richtig. ") + frage.hinweis;
      }
    });
    $("lernziel-abgeben").disabled = state.finish || lesefehler || beschaeftigt;
    status.textContent = lesefehler ? "Gespeicherter Stand bleibt unverändert."
      : state.finish ? "Abgegeben: " + richtig + " von " + fragen.length + " Antworten richtig. "
        + (richtig === fragen.length ? "Lernzielkontrolle bestanden. " : "Lernzielkontrolle noch nicht bestanden. ")
        + "Antworten und Ergebnis bleiben bis zum freigegebenen Zurücksetzen gesperrt."
      : "Noch nicht abgegeben. Deine Auswahl wird in diesem Browser gespeichert.";
  }
  fragen.forEach(function (frage, index) {
    var id = "q" + (index + 1);
    var fieldset = doc.createElement("fieldset");
    fieldset.id = "frage-" + id;
    fieldset.className = "quiz-frage";
    var legend = doc.createElement("legend");
    legend.textContent = (index + 1) + ". " + frage.text;
    fieldset.appendChild(legend);
    var options = doc.createElement("div");
    options.className = "quiz-optionen";
    frage.optionen.forEach(function (text, optionIndex) {
      var label = doc.createElement("label");
      label.className = "quiz-option";
      var input = doc.createElement("input");
      input.type = "radio";
      input.name = id;
      input.value = String.fromCharCode(97 + optionIndex);
      input.required = true;
      var span = doc.createElement("span");
      span.textContent = text;
      label.append(input, span);
      options.appendChild(label);
    });
    fieldset.appendChild(options);
    var feedback = doc.createElement("p");
    feedback.id = "hinweis-" + id;
    feedback.className = "quiz-erklaerung";
    fieldset.setAttribute("aria-describedby", feedback.id);
    feedback.hidden = true;
    fieldset.appendChild(feedback);
    host.appendChild(fieldset);
  });
  form.addEventListener("change", function () {
    if (state.finish || lesefehler || beschaeftigt) return;
    speichern({ answers: antwortenLesen(), finish: false });
  });
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (state.finish || lesefehler || beschaeftigt) return;
    if (!form.reportValidity()) return;
    if (speichern({ answers: antwortenLesen(), finish: true })) {
      anzeigen();
      benachrichtigen();
      status.focus();
    }
  });
  $("lernziel-reset").addEventListener("click", function () {
    passwort.value = "";
    resetHinweis.textContent = "";
    dialog.showModal();
    passwort.focus();
  });
  function schliessen() {
    if (beschaeftigt) return;
    passwort.value = "";
    dialog.close();
    $("lernziel-reset").focus();
  }
  $("reset-abbrechen").addEventListener("click", schliessen);
  dialog.addEventListener("cancel", function (event) {
    event.preventDefault();
    schliessen();
  });
  $("reset-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    if (beschaeftigt) return;
    var wort = passwort.value;
    passwort.value = "";
    if (!wort) {
      resetHinweis.textContent = "Kein Passwort eingegeben. Der Stand bleibt erhalten.";
      passwort.focus();
      return;
    }
    beschaeftigt = true;
    $("reset-bestaetigen").disabled = true;
    $("reset-abbrechen").disabled = true;
    anzeigen();
    try {
      if (await passwortPasst(wort)) {
        global.localStorage.removeItem(key);
        state = { answers: {}, finish: false };
        lesefehler = false;
        speicherhinweis.textContent = "";
        dialog.close();
        benachrichtigen();
      } else {
        resetHinweis.textContent = "Passwort nicht richtig. Der Stand bleibt erhalten.";
      }
    } catch (_) {
      resetHinweis.textContent = "Zurücksetzen nicht möglich. Der Stand bleibt erhalten. Bitte sicheren Browserkontext und Browserspeicher prüfen.";
    } finally {
      wort = "";
      beschaeftigt = false;
      $("reset-bestaetigen").disabled = false;
      $("reset-abbrechen").disabled = false;
      anzeigen();
      if (dialog.open) passwort.focus();
      else {
        status.textContent = "Diese Lernzielkontrolle wurde zurückgesetzt. Alle anderen Lernstände bleiben erhalten.";
        $("lernziel-reset").focus();
      }
    }
  });
  anzeigen();
})(typeof window !== "undefined" ? window : globalThis);