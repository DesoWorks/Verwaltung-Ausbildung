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
      },
      {
        text: "Mira sucht bei Uferblick eine Übersicht über Abteilungen, Stellen und Berichtswege. Was braucht sie?",
        optionen: ["Eine Liste der Schritte vom Auftrag bis zum Versand.", "Eine Übersicht der angebotenen Dienstleistungen.", "Eine Darstellung der Aufbauorganisation."],
        richtig: "c",
        hinweis: "Die Aufbauorganisation zeigt Abteilungen, Stellen und Berichtswege. Die zeitliche Folge von Arbeitsschritten beschreibt dagegen einen Prozess."
      },
      {
        text: "Eine Anfrage wird angenommen, intern bearbeitet und beantwortet. Welcher Begriff beschreibt diese Folge?",
        optionen: ["Geschäftsprozess.", "Aufbauorganisation.", "Leistungsspektrum."],
        richtig: "a",
        hinweis: "Ein Geschäftsprozess verbindet Arbeitsschritte zu einem Ergebnis für Kunden oder den Betrieb."
      },
      {
        text: "Mira arbeitet in der Auftragsbearbeitung. Was bestimmt, welche Verträge sie für Uferblick unterschreiben darf?",
        optionen: ["Allein die Zugehörigkeit zur Auftragsbearbeitung.", "Der Umfang ihrer tatsächlich erteilten Vertretungsvollmacht.", "Allein die Höhe des Bestellwerts, unabhängig von einer Vollmacht."],
        richtig: "b",
        hinweis: "Eine Stelle im Betrieb und eine Vertretungsvollmacht sind nicht dasselbe. Der konkrete Handlungsrahmen muss geklärt sein."
      },
      {
        text: "Mira hat Schwierigkeiten mit einer Ausbildungsaufgabe. Wer ist dafür ihre erste Ansprechperson?",
        optionen: ["Die Kundin, deren Auftrag bearbeitet wird.", "Der Lieferant des Büromaterials.", "Ihre Ausbilderin oder ihr Ausbilder."],
        richtig: "c",
        hinweis: "Fragen zur Ausbildungsaufgabe klärt Mira zuerst mit ihrer Ausbilderin oder ihrem Ausbilder, nicht mit externen Beteiligten."
      },
      {
        text: "Welche Aufgabe hat die Jugend- und Auszubildendenvertretung im Unterschied zur Ausbilderin?",
        optionen: ["Sie ersetzt die fachliche Anleitung bei jeder Ausbildungsaufgabe.", "Sie vertritt die Interessen der Jugendlichen und Auszubildenden.", "Sie legt allein Änderungen am Ausbildungsvertrag fest."],
        richtig: "b",
        hinweis: "Die Jugend- und Auszubildendenvertretung vertritt Interessen. Sie ist weder die Ausbilderin noch kann sie allein den Vertrag ändern."
      },
      {
        text: "Mira versteht eine Regel ihres Ausbildungsvertrags nicht. Wie klärt sie deren Bedeutung?",
        optionen: ["Sie fragt bei der zuständigen Ausbildungsperson nach und zieht die einschlägigen Vertrags- und Gesetzesregeln heran.", "Sie übernimmt ohne weitere Prüfung die Regel aus dem Vertrag einer Bekannten.", "Sie behandelt die unklare Regel bis zum Ausbildungsende als aufgehoben."],
        richtig: "a",
        hinweis: "Unklare Pflichten werden geklärt, nicht ignoriert. Mira muss nicht alle Paragraphen auswendig kennen, sollte aber wissen, wo sie nachfragt und nachliest."
      },
      {
        text: "Eine Kollegin nennt Mira eine tarifliche Regelung. Was muss Mira vor der Übertragung auf ihre Ausbildung prüfen?",
        optionen: ["Ob die Kollegin schon länger im Betrieb arbeitet.", "Ob der betreffende Tarifvertrag für ihr Ausbildungsverhältnis gilt.", "Ob derselbe Beruf auch in anderen Betrieben ausgebildet wird."],
        richtig: "b",
        hinweis: "Ein Tarifvertrag gilt nicht automatisch in jedem Betrieb oder für jedes Ausbildungsverhältnis. Seine Anwendbarkeit muss geprüft werden."
      },
      {
        text: "Welche Aussage beschreibt ein Betriebsziel von Uferblick und kein persönliches Lernziel von Mira?",
        optionen: ["Mira möchte ihre Tippgeschwindigkeit erhöhen.", "Mira möchte eine Tabellenfunktion sicher anwenden.", "Uferblick möchte wirtschaftlich arbeiten und zufriedene Kunden behalten."],
        richtig: "c",
        hinweis: "Ein Betriebsziel betrifft ein angestrebtes Ergebnis des Betriebs. Persönliche Lernziele betreffen Miras eigene Kompetenzentwicklung."
      },
      {
        text: "Uferblick erledigt Büroarbeiten, ein anderer Betrieb stellt Papier her und ein Lieferdienst transportiert es. Was zeigt das?",
        optionen: ["Arbeitsteilung: Verschiedene Betriebe übernehmen unterschiedliche Aufgaben und tauschen Leistungen aus.", "Aufbauorganisation: Die drei Betriebe sind dadurch automatisch Abteilungen von Uferblick.", "Eigenversorgung: Uferblick stellt dadurch alle benötigten Güter selbst her."],
        richtig: "a",
        hinweis: "In einer arbeitsteiligen Wirtschaft übernimmt nicht jeder Betrieb alle Aufgaben selbst. Die Beteiligten ergänzen sich durch Austausch."
      },
      {
        text: "Welche Beteiligten gehören im erweiterten Wirtschaftskreislauf neben Unternehmen zum Modell?",
        optionen: ["Nur die Beschäftigten der eigenen Abteilung.", "Nur Lieferanten und Kunden, die selbst Unternehmen sind.", "Private Haushalte, Banken, Staat und Ausland."],
        richtig: "c",
        hinweis: "Der erweiterte Wirtschaftskreislauf beschreibt Leistungs- und Geldströme zwischen Unternehmen, Haushalten, Banken, Staat und Ausland."
      },
      {
        text: "Mira findet eine Zahl zur Betriebsgröße auf einer Webseite ohne Absender und Datum. Wie geht sie damit um?",
        optionen: ["Sie sucht eine nachvollziehbare, aktuelle Quelle oder fragt im Betrieb nach, bevor sie die Zahl verwendet.", "Sie nutzt die Zahl als aktuellen Wert, weil sie in einem Suchergebnis steht.", "Sie ersetzt sie durch eine eigene Schätzung und bezeichnet diese als Betriebsangabe."],
        richtig: "a",
        hinweis: "Absender und Aktualität helfen, eine Information zu beurteilen. Ein Suchtreffer oder eine Schätzung ersetzt keine geprüfte Quelle."
      },
      {
        text: "Mira soll das Leistungsspektrum von Uferblick vorstellen. Welche Information passt dazu?",
        optionen: ["Die persönlichen Lernwünsche der Auszubildenden.", "Die Waren und Dienstleistungen, die Uferblick anbietet.", "Die Reihenfolge der nächsten Urlaubstermine."],
        richtig: "b",
        hinweis: "Das Leistungsspektrum umfasst die angebotenen Waren und Dienstleistungen, nicht persönliche Wünsche oder interne Terminlisten."
      },
      {
        text: "Mira möchte ein Foto einer Kollegin mit Namen auf einer Folie zeigen. Was ist vor der Verwendung zu klären?",
        optionen: ["Ob eine kleine Schriftgröße den Namen ausreichend versteckt.", "Ob das Foto schon auf ihrem eigenen Gerät gespeichert ist.", "Ob die Kollegin und der Betrieb mit der vorgesehenen Verwendung einverstanden sind."],
        richtig: "c",
        hinweis: "Foto und Name sind personenbezogene Angaben. Vor der Nutzung ist zu klären, ob diese Verwendung erlaubt ist. Die Bildgröße löst die Datenschutzfrage nicht."
      },
      {
        text: "Mira hat fünf Minuten, sechs Zuhörende und einen Bildschirm. Welche Präsentationsform passt zu diesen Bedingungen?",
        optionen: ["Ein ausführlicher Vortrag mit vielen vollgeschriebenen Folien für eine halbe Stunde.", "Eine kurze digitale Präsentation mit wenigen gut lesbaren Folien.", "Ein umfangreiches Skript, das sie während der fünf Minuten vollständig vorliest."],
        richtig: "b",
        hinweis: "Die Präsentationsform muss zu Zeit, Raum, Technik und Zuhörenden passen. Wenige klare Folien unterstützen einen kurzen Vortrag."
      },
      {
        text: "Wozu legt Mira vor ihrer Präsentation Kriterien wie Verständlichkeit, Zeitrahmen und Quellenangaben fest?",
        optionen: ["Damit sie den Vortrag anschließend anhand nachvollziehbarer Maßstäbe bewerten kann.", "Damit allein die Zahl der Folien über die Qualität entscheidet.", "Damit Rückmeldungen der Zuhörenden durch ihre persönliche Meinung ersetzt werden."],
        richtig: "a",
        hinweis: "Ein Kriterienkatalog macht die Bewertung nachvollziehbar und hilft, konkrete Verbesserungen für den nächsten Vortrag zu finden."
      },
      {
        text: "Die Rückmeldung lautet: Miras Folien waren verständlich, aber der Vortrag dauerte doppelt so lange wie vereinbart. Welche Schlussfolgerung passt?",
        optionen: ["Die Verständlichkeit macht die vereinbarte Dauer für die Bewertung bedeutungslos.", "Sie behält die klare Darstellung bei und kürzt beziehungsweise übt für den vereinbarten Zeitrahmen.", "Sie ergänzt weitere Folien, damit das Zeitproblem weniger auffällt."],
        richtig: "b",
        hinweis: "Eine Bewertung berücksichtigt mehrere Kriterien. Gute Verständlichkeit bleibt eine Stärke; die überschrittene Zeit ist ein konkreter Verbesserungsbedarf."
      },
      {
        text: "Mira überlegt, einen Tabellenkurs zu besuchen. Welche Angaben braucht sie für eine begründete Entscheidung?",
        optionen: ["Thema, Termin und Nutzen für ihre Aufgabe sowie die Abstimmung mit der zuständigen Person.", "Nur den Kurstitel; der Termin lässt sich nach der Anmeldung prüfen.", "Nur die Zahl der Teilnehmenden; der Bezug zur eigenen Aufgabe ist nachrangig."],
        richtig: "a",
        hinweis: "Ein Lernangebot soll fachlich und zeitlich passen und bei der eigenen Aufgabe helfen. Die Entscheidung wird mit der zuständigen Person besprochen."
      },
      {
        text: "Mira hat einen Tabellenkurs abgeschlossen. Woran zeigt sich der Nutzen für ihre Arbeit am ehesten?",
        optionen: ["Sie hat die Teilnahmebestätigung abgelegt, ohne die Inhalte erneut zu verwenden.", "Sie kann den Namen des Kurses nennen, prüft aber keine Anwendung im Alltag.", "Sie wertet ihre Bestellliste mit dem Gelernten aus und überprüft das Ergebnis."],
        richtig: "c",
        hinweis: "Der berufliche Nutzen entsteht durch die Anwendung des Gelernten auf die eigene Aufgabe, nicht allein durch die Teilnahme."
      },
      {
        text: "Welche Haltung entspricht lebenslangem Lernen im Büroberuf?",
        optionen: ["Nach der Ausbildung nur bekannte Verfahren verwenden, auch wenn sich Aufgaben ändern.", "Neue Kenntnisse ausschließlich für Teilnahmebescheinigungen sammeln.", "Bei veränderten Aufgaben gezielt dazulernen und die Kenntnisse in der Arbeit nutzen."],
        richtig: "c",
        hinweis: "Lebenslanges Lernen bedeutet, berufliche Kenntnisse fortlaufend weiterzuentwickeln und anzuwenden, auch nach Ende der Ausbildung."
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
      },
      {
        text: "Noah liest während einer Arbeitsphase ständig private Nachrichten. Wie ist das einzuordnen?",
        optionen: ["Als notwendige Erholungspause, unabhängig von Häufigkeit und Anlass.", "Als Zeitdieb, weil es Zeit verbraucht, ohne zur Aufgabe beizutragen.", "Als von außen vorgegebener Besprechungstermin."],
        richtig: "b",
        hinweis: "Ständiges Lesen privater Nachrichten trägt nicht zur Aufgabe bei und kann ein Zeitdieb sein. Eine bewusst geplante Pause ist etwas anderes."
      },
      {
        text: "Noah hat eine Erholungspause bewusst eingeplant. Welche Aussage trifft zu?",
        optionen: ["Sie ist kein Zeitdieb; geplante Erholung gehört zu einer sinnvollen Arbeitsorganisation.", "Sie ist wie jede Unterbrechung unnötiger Zeitverlust.", "Sie ersetzt die Entscheidung über die Reihenfolge dringender Aufgaben."],
        richtig: "a",
        hinweis: "Geplante Erholung unterscheidet sich von Zeitdieben. Pausen sind nicht mit unnötigen Ablenkungen gleichzusetzen."
      },
      {
        text: "Eine wichtige Aufgabe hat erst nächste Woche ihren Termin; eine wichtige Auswertung wird heute benötigt. Wie ordnet Noah beide ein?",
        optionen: ["Beide sofort gleichzeitig bearbeiten, weil sie wichtig sind.", "Die Aufgabe für nächste Woche zuerst bearbeiten, weil mehr Zeit zur Verfügung steht.", "Die heutige Auswertung zuerst bearbeiten und für die andere Aufgabe rechtzeitig Arbeitszeit einplanen."],
        richtig: "c",
        hinweis: "Das Eisenhower-Prinzip unterscheidet Wichtigkeit und Dringlichkeit. Wichtige, noch nicht dringende Aufgaben werden eingeplant."
      },
      {
        text: "Um 11 Uhr beginnt eine Sitzung. Um 9:30 Uhr fehlen noch deren Unterlagen; auch die nicht dringende Ablage ist offen. Was hilft Noah?",
        optionen: ["Unterlagen und Ablage ständig im Wechsel bearbeiten.", "Die nötigen Schritte für die Sitzungsunterlagen ordnen und damit beginnen.", "Zuerst die gesamte Ablage abschließen, unabhängig von der verbleibenden Vorbereitungszeit."],
        richtig: "b",
        hinweis: "Eine kurze Checkliste hilft, die rechtzeitig benötigten Unterlagen gezielt vorzubereiten. Unnötige Aufgabenwechsel kosten Zeit."
      },
      {
        text: "Während Noah dringende Unterlagen vorbereitet, kommt eine nicht eilige telefonische Auskunftsbitte. Wie reagiert er passend?",
        optionen: ["Einen Rückruf nach der Vorbereitung freundlich vereinbaren und die nötigen Angaben notieren.", "Die gesamte Auskunft sofort bearbeiten, auch wenn dadurch die Sitzungsunterlagen fehlen.", "Ohne Vereinbarung davon ausgehen, dass die anrufende Person später noch einmal anruft."],
        richtig: "a",
        hinweis: "Ein vereinbarter und notierter Rückruf berücksichtigt das Anliegen, ohne die dringende Aufgabe unnötig zu unterbrechen."
      },
      {
        text: "Noahs Bildschirm blendet durch einfallendes Licht. Welche Veränderung passt zur Ergonomie?",
        optionen: ["Die Schrift verkleinern, damit weniger Bildschirmfläche gebraucht wird.", "Die Körperhaltung dauerhaft an die Blendung anpassen und sich seitlich verdrehen.", "Bildschirm und Lichtverhältnisse so anpassen, dass eine passende Haltung ohne störende Blendung möglich ist."],
        richtig: "c",
        hinweis: "Ergonomie passt den Arbeitsplatz an den Menschen an. Eine dauerhafte Fehlhaltung ist keine geeignete Lösung gegen Blendung."
      },
      {
        text: "Noah steht seit Tagen unter starkem Druck; seine Pausen fallen immer wieder aus. Welche Einordnung ist angemessen?",
        optionen: ["Es liegt allein durch diese Beschreibung bereits eine bestimmte medizinische Diagnose vor.", "Es handelt sich um eine anhaltende Belastung, die er anspricht und für die er Unterstützung sucht.", "Es ist nur eine kurze Ablenkung ohne Anlass, die Arbeitsbedingungen zu besprechen."],
        richtig: "b",
        hinweis: "Anhaltender Druck und ausfallende Pausen sind ernst zu nehmende Belastungen. Daraus folgt keine automatische Diagnose; Unterstützung ist sinnvoll."
      },
      {
        text: "Noah wird wiederholt vor anderen lächerlich gemacht und ausgegrenzt. Welcher erste Schritt ist sinnvoll?",
        optionen: ["Eine vertrauenswürdige betriebliche Anlaufstelle ansprechen, etwa die Ausbilderin.", "Die Situation nur durch eigene Mehrarbeit auszugleichen versuchen.", "Mit öffentlicher Abwertung der anderen Person reagieren."],
        richtig: "a",
        hinweis: "Wiederholte Ausgrenzung sollte Noah nicht allein bewältigen müssen. Eine vertrauenswürdige Anlaufstelle kann unterstützen."
      },
      {
        text: "Eine Kundenbesprechung findet einmal statt, die Teamsitzung jeden Montag. Wie trägt Noah sie passend ein?",
        optionen: ["Beide als Serientermin, damit sie im Kalender gleich aussehen.", "Beide nur als einzelne Notiz ohne Datum und Wiederholung.", "Die Kundenbesprechung als Einzeltermin und die Teamsitzung als Serientermin."],
        richtig: "c",
        hinweis: "Ein Einzeltermin ist einmalig. Ein Serientermin bildet regelmäßige Wiederholungen ab."
      },
      {
        text: "Welche Angaben braucht Noah, um eine Teamsitzung sinnvoll vorzubereiten?",
        optionen: ["Nur den Sitzungstitel; Zugang und Unterlagen klären sich während der Besprechung.", "Ziel, Themen, Beteiligte, Zeit, Raum oder Zugang sowie die benötigten Unterlagen.", "Bereits festgelegte Beschlüsse, obwohl die Beratung noch nicht stattgefunden hat."],
        richtig: "b",
        hinweis: "Eine gute Vorbereitung klärt organisatorische Bedingungen und Arbeitsgrundlagen. Ergebnisse werden nicht vor der tatsächlichen Entscheidung erfunden."
      },
      {
        text: "Was unterscheidet eine Tagesordnung von einem Ergebnisprotokoll?",
        optionen: ["Die Tagesordnung nennt geplante Themen; das Ergebnisprotokoll hält tatsächliche Beschlüsse und Aufgaben fest.", "Die Tagesordnung beweist bereits, welche Entscheidungen die Sitzung getroffen hat.", "Das Ergebnisprotokoll enthält nur geplante Themen, die Tagesordnung dagegen alle Beschlüsse."],
        richtig: "a",
        hinweis: "Die Tagesordnung dient der Vorbereitung. Das Ergebnisprotokoll dokumentiert, was tatsächlich entschieden und vereinbart wurde."
      },
      {
        text: "Für eine Besprechung sollen die einzelnen Beiträge und die Entwicklung der Diskussion nachvollziehbar bleiben. Welche Protokollart passt?",
        optionen: ["Eine Tagesordnung ohne nachträgliche Ergänzung.", "Ein Ergebnisprotokoll, das ausschließlich Beschlüsse nennt.", "Ein Verlaufsprotokoll."],
        richtig: "c",
        hinweis: "Ein Verlaufsprotokoll beschreibt den Gesprächsablauf und einzelne Beiträge ausführlicher als ein Ergebnisprotokoll."
      },
      {
        text: "Ein Thema wurde in der Sitzung besprochen, aber nicht entschieden. Wie hält Noah es im Protokoll fest?",
        optionen: ["Als offenen Punkt, getrennt von den Beschlüssen.", "Als angenommenen Beschluss, damit die Liste vollständig wirkt.", "Als erledigte Aufgabe ohne weiteren Klärungsbedarf."],
        richtig: "a",
        hinweis: "Ungeklärte Themen bleiben als offene Punkte erkennbar. Sie werden weder zu Beschlüssen noch zu erledigten Aufgaben umgedeutet."
      },
      {
        text: "Noah hat das Sitzungsprotokoll fertiggestellt. Wer soll es nach der Lektion erhalten?",
        optionen: ["Nur Noah selbst, weil er die Ergebnisse aufgeschrieben hat.", "Die Teilnehmenden der Besprechung über den vorgesehenen internen Weg.", "Alle externen Kontakte des Betriebs, unabhängig vom Inhalt."],
        richtig: "b",
        hinweis: "Die Teilnehmenden brauchen die festgehaltenen Ergebnisse und Aufgaben. Eine ungezielte externe Verteilung ist nicht vorgesehen."
      },
      {
        text: "Noah gibt eine Kundenbetreuungsnachricht intern weiter. Welche Zusammenfassung hilft der zuständigen Person?",
        optionen: ["Ein einzelnes Stichwort ohne Bezug zum Vorgang.", "Die komplette private Kontaktliste, auch wenn sie für das Anliegen nicht benötigt wird.", "Anliegen, Bezug zum Vorgang und die für die Bearbeitung notwendigen Angaben."],
        richtig: "c",
        hinweis: "Eine hilfreiche Weitergabe ist verständlich und enthält die nötigen Informationen, ohne unnötig persönliche Daten zu verbreiten."
      },
      {
        text: "Für eine vertrauliche Datei ist im Betrieb ein sicherer digitaler Versandweg freigegeben. Was prüft Noah vor dem Senden zusätzlich?",
        optionen: ["Nur, ob er die Datei zusätzlich ausdrucken kann.", "Ob die empfangende Person richtig ist und dieser Versand tatsächlich benötigt wird.", "Ob ein öffentlicher Link leichter weiterverbreitet werden könnte."],
        richtig: "b",
        hinweis: "Auch bei einem freigegebenen Weg müssen Empfänger und Versandbedarf stimmen. Unnötiger oder falsch adressierter Versand bleibt problematisch."
      },
      {
        text: "Welche Ablage verbindet Auffindbarkeit und Schutz persönlicher Kontaktdaten?",
        optionen: ["Der vorgesehene Ordner mit verständlichem Dateinamen und Zugriff nur für Berechtigte.", "Ein öffentlicher Ordner mit verständlichem Namen, damit auch Außenstehende suchen können.", "Ein beliebiger privater Ordner mit einem Namen ohne Bezug zum Vorgang."],
        richtig: "a",
        hinweis: "Eine klare Ablagestruktur erleichtert das Finden. Zugriffsschutz begrenzt gleichzeitig die Einsicht in personenbezogene Daten."
      },
      {
        text: "Noah widerspricht einem Vorschlag im Team. Welche Formulierung ist sachlich und wertschätzend?",
        optionen: ["Wer so eine lange Übersicht will, versteht unsere Arbeit nicht.", "Wir übernehmen deinen Vorschlag, obwohl die nötigen Angaben fehlen; darüber sprechen wir nicht weiter.", "Eine kurze Übersicht erleichtert das Zuordnen. Wie können wir die nötigen Details ergänzen?"],
        richtig: "c",
        hinweis: "Wertschätzende Kommunikation begründet die eigene Sicht und sucht eine gemeinsame Lösung, ohne andere abzuwerten oder Probleme zu verschweigen."
      },
      {
        text: "Zwei Teammitglieder haben unterschiedliche Wünsche für eine gemeinsame Kundenmappe. Was ist der sinnvollste erste Schritt?",
        optionen: ["Die Wünsche getrennt umsetzen und die unterschiedlichen Fassungen nicht abstimmen.", "Die Gründe erfragen und die Anforderungen an das gemeinsame Ergebnis klären.", "Sofort abstimmen, ohne den Zweck der jeweiligen Hinweise zu kennen."],
        richtig: "b",
        hinweis: "Kooperation beginnt beim gemeinsamen Ziel. Erst wenn die Gründe und Anforderungen bekannt sind, lässt sich eine begründete Lösung finden."
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
      },
      {
        text: "Eine Kundin bittet Lea ausdrücklich um ein Angebot. Wie heißt das Angebot, das darauf antwortet?",
        optionen: ["Unverlangtes Angebot.", "Verlangtes Angebot.", "Auftragsbestätigung."],
        richtig: "b",
        hinweis: "Ein verlangtes Angebot folgt auf die Anfrage eines Kunden. Eine Auftragsbestätigung hat einen anderen Zweck."
      },
      {
        text: "Uferblick schickt einer möglichen Kundin von sich aus ein Angebot, ohne vorherige Anfrage. Wie wird es eingeordnet?",
        optionen: ["Als unverlangtes Angebot.", "Als verlangtes Angebot.", "Als Bestellung der Kundin."],
        richtig: "a",
        hinweis: "Ohne vorausgehende Kundenanfrage handelt es sich um ein unverlangtes Angebot. Dadurch liegt noch keine Bestellung vor."
      },
      {
        text: "Lea erstellt ein Angebot als Brief nach außen. Welche Gestaltung passt?",
        optionen: ["Eine interne Rechentabelle ohne erkennbaren Adressaten oder Geschäftsbriefaufbau.", "Eine persönliche Notiz ohne eindeutigen Bezug zum Angebot.", "Ein normgerecht gestalteter Geschäftsbrief mit klaren Angaben zum Angebot."],
        richtig: "c",
        hinweis: "Ein Angebot als Brief ist ein Geschäftsbrief. Aufbau und Formatierung folgen den üblichen Regeln für solche Schreiben."
      },
      {
        text: "Leas Angebot liegt der Kundin vor, wurde aber noch nicht angenommen. Welcher nächste Schritt passt zum Ablauf der Lektion?",
        optionen: ["Die Auslieferung als bereits bestätigten Auftrag beauftragen.", "Die Annahme abwarten und noch keine Lieferung auslösen.", "Eine Rechnung für die noch nicht beauftragte Lieferung versenden."],
        richtig: "b",
        hinweis: "Ein versandtes Angebot ist noch kein angenommener Auftrag. Im geübten Ablauf wird die Annahme vor der Auslieferung abgewartet."
      },
      {
        text: "Die Kundin hat das Angebot angenommen. Welche Angaben gibt Lea an die Auslieferung weiter?",
        optionen: ["Artikel, Menge und den vereinbarten Liefertermin vollständig.", "Nur die Artikelbezeichnung; die übrigen Angaben bleiben in ihrer privaten Notiz.", "Einen früheren als den vereinbarten Termin, ohne die Machbarkeit abzustimmen."],
        richtig: "a",
        hinweis: "Die Auslieferung braucht die vollständigen Auftragsdaten. Ungeprüfte neue Zusagen dürfen den vereinbarten Termin nicht ersetzen."
      },
      {
        text: "Lea soll schriftlich festhalten, welchen Auftrag Uferblick angenommen hat. Welches Dokument passt?",
        optionen: ["Ein Lieferschein, der eine spätere tatsächliche Lieferung beschreibt.", "Eine Rechnung zur Abrechnung der Lieferung.", "Eine Auftragsbestätigung."],
        richtig: "c",
        hinweis: "Die Auftragsbestätigung hält den angenommenen Auftrag fest. Lieferschein und Rechnung erfüllen andere Aufgaben."
      },
      {
        text: "Die Lieferung soll abgerechnet werden. Welches Dokument erstellt Lea zu diesem Zweck?",
        optionen: ["Eine neue unverbindliche Anfrage.", "Eine Rechnung.", "Eine Tagesordnung."],
        richtig: "b",
        hinweis: "Die Rechnung dient der Abrechnung. Eine Anfrage bittet um Informationen oder ein Angebot; eine Tagesordnung plant eine Besprechung."
      },
      {
        text: "Eine Kundin legt einen Lieferschein vor. Was lässt sich daraus allein nicht ableiten?",
        optionen: ["Dass der Rechnungsbetrag bereits bezahlt wurde.", "Welche Artikel der Lieferschein dieser Lieferung zuordnet.", "Welche Mengen auf dem Lieferschein zur Lieferung genannt werden."],
        richtig: "a",
        hinweis: "Ein Lieferschein beschreibt die Lieferung, ist aber kein Zahlungsnachweis."
      },
      {
        text: "In den erfundenen Übungsdaten kosten 12 Ordner 30 Euro. Wie hoch ist der Preis je Ordner?",
        optionen: ["3,60 Euro.", "25,00 Euro.", "2,50 Euro."],
        richtig: "c",
        hinweis: "Der Stückpreis ergibt sich aus 30 Euro geteilt durch 12 Ordner: 2,50 Euro je Ordner."
      },
      {
        text: "Lea berechnet mit dem Stückpreis von 2,50 Euro den Preis für acht Ordner, ohne Rabatt oder weitere Kosten. Welcher Betrag stimmt?",
        optionen: ["10,50 Euro.", "20,00 Euro.", "24,00 Euro."],
        richtig: "b",
        hinweis: "Acht Ordner mal 2,50 Euro je Ordner ergeben 20 Euro. Menge und Stückpreis werden multipliziert."
      },
      {
        text: "Ein Übungspreis beträgt vor Rabatt 80 Euro. Welcher Betrag bleibt nach 10 Prozent Rabatt ohne weitere Kosten?",
        optionen: ["72 Euro.", "70 Euro.", "88 Euro."],
        richtig: "a",
        hinweis: "10 Prozent von 80 Euro sind 8 Euro. Der Rabatt wird abgezogen: 80 minus 8 ergibt 72 Euro."
      },
      {
        text: "Lea hat für 20 Ordner zu je 2,50 Euro nach 10 Prozent Rabatt nur 4,50 Euro errechnet. Was zeigt der Überschlag?",
        optionen: ["Das Ergebnis passt, weil ein Rabatt den Preis ungefähr auf ein Zehntel senkt.", "Das Ergebnis muss stimmen, wenn es mit einem Taschenrechner ermittelt wurde.", "Das Ergebnis ist unplausibel: Von etwa 50 Euro geht nur ein kleiner Teil ab; richtig sind 45 Euro."],
        richtig: "c",
        hinweis: "Ein Überschlag prüft die Größenordnung. Zehn Prozent Rabatt lassen neunzig Prozent des Ausgangspreises übrig."
      },
      {
        text: "Lea verwendet für eine Rückrufbitte ein Formular. Was kennzeichnet dieses Formular?",
        optionen: ["Jede Person schreibt den gesamten Aufbau beim Ausfüllen neu.", "Es enthält festen Text und vorgesehene Felder für die konkreten Angaben.", "Es kann nur einen Namen enthalten, aber keine Telefonnummer."],
        richtig: "b",
        hinweis: "Ein Formular verbindet eine feste Vorlage mit ausfüllbaren Feldern, etwa für Name, Telefonnummer und Anliegen."
      },
      {
        text: "Warum schützt Lea den festen Text eines Formulars gegen versehentliche Änderungen?",
        optionen: ["Damit die Vorlage beim Ausfüllen erhalten bleibt, während die Formularfelder weiter nutzbar sind.", "Damit auch die vorgesehenen Felder grundsätzlich nicht mehr ausgefüllt werden können.", "Damit nur die Schriftgröße, nicht aber der Inhalt des Festtexts erhalten bleibt."],
        richtig: "a",
        hinweis: "Der Schreibschutz soll den festen Vorlagentext erhalten. Er soll nicht das Eintragen in die vorgesehenen Formularfelder verhindern."
      },
      {
        text: "Im ausgefüllten Rückrufformular fehlt die Telefonnummer. Was tut Lea vor der Weitergabe?",
        optionen: ["Sie übernimmt ungeprüft eine Nummer aus einem anderen Kundenfall.", "Sie entfernt das Feld aus der Vorlage und sendet den Rest.", "Sie prüft die Angaben und ergänzt die zum aktuellen Vorgang gehörende Telefonnummer."],
        richtig: "c",
        hinweis: "Vor der Weitergabe müssen die für den Rückruf nötigen aktuellen Angaben vollständig sein. Fremde Falldaten sind kein Ersatz."
      },
      {
        text: "Ein gespeicherter Antworttext enthält [Name] und [Auftragsnummer]. Was bedeuten diese Markierungen?",
        optionen: ["Sie bestätigen, dass die Ware bereits versandt wurde.", "Es sind Platzhalter, die mit geprüften Daten des aktuellen Vorgangs gefüllt werden müssen.", "Es sind Angaben, die bei jeder Kundin unverändert im versandten Text stehen bleiben."],
        richtig: "b",
        hinweis: "Ein Textbaustein wird auf den konkreten Fall abgestimmt. Platzhalter müssen vor der Verwendung durch die passenden geprüften Angaben ersetzt werden."
      },
      {
        text: "Eine bearbeitbare Textdatei soll als Papierbrief vorliegen. Welcher Vorgang passt?",
        optionen: ["Drucken.", "Scannen.", "Eine Papierkopie anfertigen, ohne die Datei zu öffnen."],
        richtig: "a",
        hinweis: "Drucken bringt eine Datei auf Papier. Scannen macht aus Papier eine Datei, Kopieren aus Papier wieder Papier."
      },
      {
        text: "Lea hat einen Brief nur auf Papier und braucht eine weitere Papierausfertigung. Welcher Vorgang erzeugt diese unmittelbar?",
        optionen: ["Scannen ohne anschließenden Ausdruck.", "Die Datei in ein anderes Format umbenennen.", "Kopieren."],
        richtig: "c",
        hinweis: "Kopieren erzeugt aus einer Papiervorlage wieder Papier. Ein Scan allein erzeugt dagegen eine Datei."
      },
      {
        text: "Eine umfangreiche interne Unterlage wird nur zum Lesen benötigt. Welche Lösung spart Papier und Energie?",
        optionen: ["Für alle Personen grundsätzlich sämtliche Seiten einseitig ausdrucken.", "Wenn passend digital lesen lassen; sonst nur benötigte Seiten möglichst beidseitig drucken und unnötigen Gerätebetrieb vermeiden.", "Vorsorglich zusätzliche Papierexemplare erstellen und das Gerät dauerhaft eingeschaltet lassen."],
        richtig: "b",
        hinweis: "Bedarfsgerechtes digitales Bereitstellen, begrenztes beidseitiges Drucken und das Vermeiden unnötigen Gerätebetriebs sparen Ressourcen."
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
      },
      {
        text: "Im Schrank liegen genug blaue und schwarze Stifte. Eine Kollegin möchte zusätzlich zwölf Farben, obwohl die Arbeit sie nicht erfordert. Wie ordnet Tom das ein?",
        optionen: ["Als gesicherten Bedarf, weil jede gewünschte Variante bestellt werden muss.", "Als Wunsch, der vom notwendigen betrieblichen Bedarf zu unterscheiden ist.", "Als bereits wirksame Bestellung beim Lieferanten."],
        richtig: "b",
        hinweis: "Ein Wunsch ist nicht automatisch ein betrieblicher Bedarf. Vor einer Beschaffung wird geklärt, was für die Arbeit tatsächlich benötigt wird."
      },
      {
        text: "Tom sucht eine Bezugsquelle für zehn blaue A4-Ordner mit acht Zentimetern Rückenbreite bis Freitag. Welche Anfrage an den Händler hilft gezielt?",
        optionen: ["Die festgelegte Ausführung, Menge und den Termin nennen und Preis sowie Lieferzeit erfragen.", "Nur nach beliebigen Ordnern fragen, ohne Ausführung oder Termin zu nennen.", "Eine andere Farbe bestellen, weil sie auf der Startseite des Händlers gezeigt wird."],
        richtig: "a",
        hinweis: "Die Suche nach einer Bezugsquelle richtet sich nach dem geklärten Bedarf. Ausführung, Menge, Termin, Preis und Lieferzeit müssen zusammenpassen."
      },
      {
        text: "Ein Angebot nennt passende Ordner und den richtigen Liefertermin, enthält aber keinen Preis. Was fehlt Tom für die Entscheidung?",
        optionen: ["Eine erneute Bestätigung des bereits bekannten Liefertermins statt der Preisangabe.", "Nur die Farbe des Händlerlogos.", "Der Preis für die angefragte Menge; er muss vor der Bestellung geklärt werden."],
        richtig: "c",
        hinweis: "Ein passender Termin ersetzt keine Preisangabe. Tom fragt den Preis für die konkrete Menge nach."
      },
      {
        text: "Welche Angaben gehören in Toms sachgerechte Anfrage an einen Lieferanten?",
        optionen: ["Nur eine allgemeine Bitte um günstige Ware.", "Was benötigt wird, welche Menge, bis wann und an welchen Ort geliefert werden soll.", "Nur ein Wunschpreis, ohne Artikel, Menge oder Lieferort."],
        richtig: "b",
        hinweis: "Eine klare Anfrage beschreibt den Beschaffungsbedarf so vollständig, dass ein passendes Angebot erstellt werden kann."
      },
      {
        text: "Tom schreibt: Bitte senden Sie uns ein Angebot für zehn Ordner. Welche Wirkung hat diese Anfrage?",
        optionen: ["Sie ist unverbindlich und noch keine Bestellung.", "Sie verpflichtet den Lieferanten bereits zur Auslieferung.", "Sie bestätigt schon den Eingang der Ware."],
        richtig: "a",
        hinweis: "Eine Anfrage bittet um ein Angebot. Sie ist von einer Bestellung und von der Bestätigung eines Wareneingangs zu unterscheiden."
      },
      {
        text: "Tom vergleicht Angebote für Kopierpapier. Welches Merkmal ist ein qualitatives Kriterium?",
        optionen: ["Der Preis in Euro.", "Die Lieferzeit in Tagen.", "Die Eigenschaft als Recyclingpapier."],
        richtig: "c",
        hinweis: "Recyclingpapier ist ein qualitatives Merkmal. Preis und Lieferzeit werden im Beispiel dagegen zahlenmäßig verglichen."
      },
      {
        text: "Angebot 1 ist vier Euro günstiger; Angebot 2 bietet Recyclingpapier und eine frühere Lieferung. Wie entscheidet Tom begründet?",
        optionen: ["Er nimmt stets das zuerst eingegangene Angebot.", "Er vergleicht beide nach denselben bedarfsbezogenen Kriterien und wägt Preis, Eigenschaften und Lieferzeit ab.", "Er nimmt stets das teurere Angebot, weil der Preis allein die Qualität beweist."],
        richtig: "b",
        hinweis: "Ein Angebotsvergleich nutzt einheitliche Kriterien und den konkreten Bedarf. Weder Reihenfolge noch Preis allein begründen jede Entscheidung."
      },
      {
        text: "Tom plant den Bestellzeitpunkt für regelmäßig verbrauchtes Papier. Welche Größen muss er zusammen betrachten?",
        optionen: ["Vorhandenen Bestand und Verbrauch, Lieferzeit, benötigten Lieferzeitpunkt und einen nötigen Puffer.", "Nur den Tag, an dem der Schrank vollständig leer sein wird.", "Nur den niedrigsten Stückpreis, unabhängig vom Liefertermin."],
        richtig: "a",
        hinweis: "Der Bestand muss bis zur rechtzeitigen Lieferung reichen. Lieferzeit und ein nötiger Puffer werden bei der Planung berücksichtigt."
      },
      {
        text: "Welche Aussage zur optimalen Bestellmenge passt?",
        optionen: ["Die größte technisch bestellbare Menge ist immer die beste.", "Der niedrigste Stückpreis entscheidet allein, auch wenn kein Lagerplatz vorhanden ist.", "Bestell- und Lagerkosten werden abgewogen; die Menge muss zusätzlich zu den betrieblichen Grenzen passen."],
        richtig: "c",
        hinweis: "Eine optimale Menge ist ein günstiger Ausgleich unter bestimmten Annahmen. Lagerraum und andere betriebliche Grenzen bleiben zu beachten."
      },
      {
        text: "Ein Diagramm zeigt bei 40 Packungen die niedrigsten Modellkosten von drei Varianten. Was folgt daraus?",
        optionen: ["40 Packungen sind unabhängig von Verbrauch und Lagerraum für jeden Betrieb optimal.", "40 Packungen sind unter den Modellannahmen günstiger; vor der Entscheidung werden die betrieblichen Bedingungen geprüft.", "Die größte der drei Mengen muss trotzdem gewählt werden, weil große Bestellungen immer günstiger sind."],
        richtig: "b",
        hinweis: "Ein Diagramm unterstützt die Entscheidung innerhalb seiner Daten und Annahmen. Es ersetzt die Prüfung der tatsächlichen Bedingungen nicht."
      },
      {
        text: "Uferblick erwirbt 20 Ordner gegen Bezahlung. Welche Vertragsart liegt vor?",
        optionen: ["Kaufvertrag.", "Dienstvertrag.", "Mietvertrag."],
        richtig: "a",
        hinweis: "Beim Kauf werden Sachen gegen Geld erworben. Miete betrifft die Nutzung auf Zeit; ein Dienstvertrag betrifft eine Tätigkeit."
      },
      {
        text: "Für Uferblick soll ein Regal nach Maß hergestellt werden. Geschuldet ist das fertige Regal. Welche Vertragsart passt?",
        optionen: ["Ein Dienstvertrag über eine Tätigkeit ohne vereinbartes fertiges Ergebnis.", "Ein Mietvertrag über die vorübergehende Nutzung des Regals.", "Ein Werkvertrag über das herzustellende Ergebnis."],
        richtig: "c",
        hinweis: "Beim Werkvertrag steht das vereinbarte fertige Werk im Mittelpunkt, hier das nach Maß hergestellte Regal."
      },
      {
        text: "Eine Beratung zur Büroorganisation wird für zwei Tage vereinbart. Geschuldet ist die Tätigkeit, kein fertiges Werk. Welche Vertragsart passt?",
        optionen: ["Werkvertrag.", "Dienstvertrag.", "Kaufvertrag."],
        richtig: "b",
        hinweis: "Ein Dienstvertrag betrifft eine vereinbarte Tätigkeit. Ein Werkvertrag schuldet dagegen ein bestimmtes herzustellendes Ergebnis."
      },
      {
        text: "Uferblick braucht einen Kopierer täglich über mehrere Jahre. Welche Überlegung ergänzt den Vergleich mit einer Miete sinnvoll?",
        optionen: ["Einen Kauf prüfen und Nutzen, Risiken und Gesamtkosten über die Nutzungszeit vergleichen.", "Nur den ersten Monatsbetrag betrachten; spätere Zahlungen bleiben unbeachtet.", "Miete ohne Vergleich wählen, weil sie unabhängig von der Dauer immer günstiger ist."],
        richtig: "a",
        hinweis: "Bei dauerhaftem Bedarf ist ein Kauf zu prüfen. Der Vergleich mit einer Miete betrachtet nicht nur einen Monatsbetrag, sondern die Nutzung über die Zeit."
      },
      {
        text: "Wertvolle Tablet-Computer sollen bis zur Ausgabe gelagert werden. Welcher Lagerplatz passt?",
        optionen: ["Ein offenes Regal im frei zugänglichen Flur.", "Ein ungesicherter Besprechungstisch.", "Ein geeigneter abschließbarer Schrank."],
        richtig: "c",
        hinweis: "Die Lagerung soll zur Ware passen. Wertvolle Geräte brauchen einen geschützten Lagerplatz."
      },
      {
        text: "Haftnotizen werden täglich gebraucht und benötigen keinen besonderen Zugangsschutz. Welche Lagerung erleichtert die Arbeit?",
        optionen: ["Ganz hinten in einem entfernten Lagerraum, obwohl arbeitsplatznah Platz vorhanden ist.", "An einem geeigneten, gut erreichbaren Regalplatz nahe dem Arbeitsplatz.", "Im ausschließlich für Wertgegenstände vorgesehenen Tresor."],
        richtig: "b",
        hinweis: "Die Nutzungshäufigkeit ist ein Auswahlkriterium für den Lagerplatz. Häufig benötigtes Material soll passend und gut erreichbar liegen."
      },
      {
        text: "Die Ware trifft erst nach dem vereinbarten Liefertermin ein. Welche Störung beschreibt Tom damit?",
        optionen: ["Eine Nicht-Rechtzeitig-Lieferung.", "Allein wegen des späteren Termins eine Beschädigung der Ware.", "Einen Mengenrabatt."],
        richtig: "a",
        hinweis: "Eine Nicht-Rechtzeitig-Lieferung betrifft den verfehlten vereinbarten Termin. Eine beschädigte oder mangelhafte Ware ist eine andere Störung."
      },
      {
        text: "Drei von zehn pünktlich gelieferten Kartons sind nass und unbrauchbar. Welche Meldung ist sachgerecht?",
        optionen: ["Es ist eine Verspätung; Tom meldet nur, dass die Lieferung zu spät sei.", "Es ist keine Störung, weil die Kartons rechtzeitig ankamen.", "Es ist eine Schlechtleistung; Tom beschreibt Anzahl und Schaden konkret und schlägt Ersatz für die betroffenen Kartons vor."],
        richtig: "c",
        hinweis: "Auch pünktlich gelieferte Ware kann mangelhaft sein. Eine sachliche Meldung beschreibt den Mangel genau und nennt einen Lösungsvorschlag."
      },
      {
        text: "Eine geprüfte Übungsrechnung über 100 Euro erlaubt zwei Prozent Skonto bei Zahlung bis Tag 10. Tom zahlt an Tag 8. Welcher Betrag passt ohne weitere Kosten?",
        optionen: ["100 Euro abzüglich zehn Euro, weil die Frist zehn Tage beträgt.", "98 Euro, weil die genannte Skontobedingung und die Frist eingehalten werden.", "102 Euro, weil Skonto ein Aufschlag für frühe Zahlung ist."],
        richtig: "b",
        hinweis: "Zwei Prozent von 100 Euro sind zwei Euro. Bei erfüllter Bedingung werden sie abgezogen: Der Zahlbetrag beträgt 98 Euro."
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
  var key = "verwaltung-ausbildung." + feld + "-lernziel.v2";
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