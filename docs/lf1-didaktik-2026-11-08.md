# LF1-A und LF1-B – didaktische Prüfung

Stand: 08.11.2026 · Terminus · Auftrag von Rick, Curriculum Forge II.
Geprüfter Ausgangsstand: `pre-dev/verwaltung-aktuell`, HEAD `74baabe986eccb874907a619d6cf673f9c3a5977`; Arbeitsbaum zu Beginn sauber. Nur dieses Dokument und der Personalamt-Vorschlag werden geschrieben. Keine Textkorrektur eingebaut, kein Commit. Parallelentwicklung LF1-C ist nicht Gegenstand dieser Prüfung.

Methode: Lerntext, alle Aufgaben und Auswertungswege der vier beauftragten Dateien vollständig gelesen; Codepfade nachvollzogen, zwei Zustandsprüfungen mit Node ausgeführt. Keine Browser-/Windows-Sichtprüfung. Keine Normseite neu geöffnet; dies ist ausdrücklich keine neue Rechtsprüfung oder Fachfreigabe. Zeilen beziehen sich auf den oben genannten Stand.

## Ergebnis

LF1-A hat einen nachvollziehbaren Aufbau mit Erklärung, Beispiel, Übung und Transfer. LF1-B vermittelt die abgefragten Kernaussagen überwiegend vorher, ist aber deutlich knapper. Vorrangig zu bearbeiten sind veraltete sichtbare Auswertungen, unklare Fallformulierungen und der wenig nachvollziehbare Abschluss in LF1-B. Kein größerer Umbau wurde begonnen.

## Priorität 1 – Rückmeldung und Lernfortschritt

### D1: LF1-B zeigt nach einer geänderten Kontrollantwort weiter das alte Ergebnis
- Fundstelle: `js/lf1-vertrag.js:82–88,204–212,225–228`, `module/lf1-vertrag.html:94` (`kontrolle-ergebnis`).
- Pfad: Lernkontrolle auswerten → beispielsweise „3 von 3. Bestanden.“ → eine Antwort ändern. `setKontrolle` verwirft intern die Bewertung, der change-Handler leert aber ausschließlich `vertrag-ergebnis`. Das alte Kontrollresultat bleibt sichtbar, obwohl `lcSubmitted=false` gilt. Kein erneutes Rendern oder Löschen von `kontrolle-ergebnis` im Handler vorhanden.
- Gegenprüfung: Die interne Invalidierung ist vorhanden; gerade deshalb ist der verbliebene sichtbare Erfolg irreführend. Vor der allerersten Auswertung wird hingegen keine Auflösung ausgegeben.
- Vorschlag (Codearbeit separat): Nur den betroffenen Ergebnisbereich auf „Antwort geändert – bitte erneut auswerten“ setzen, alte Auflösung ausblenden. Nicht pauschal die Vertragsauswertung bei einer Kontrollantwort löschen.

### D2: LF1-A aktualisiert einzelne Aufgaben, aber nicht die sichtbare Zusammenfassung
- Fundstelle: `js/lf1-dual.js:329–333,415–440,485–497`, Aufgaben A1–A5 und K1–K4.
- Pfad: Abschnitt auswerten → Antwort ändern. `render()` aktualisiert Blockstatus und Prozentwert; `zusammenfassung()` läuft nur beim Auswerten. Deshalb kann „5 von 5 aktuell richtig“ stehen bleiben, während ein Block bereits „Antwort geändert – bitte erneut auswerten“ meldet.
- Gegenprüfung: Die Einzelaufgabe entfernt tatsächlich ihre alte Auflösung; betroffen ist die Zusammenfassung, nicht die gesamte Bewertung.
- Vorschlag: Nach Änderung eine vorhandene Zusammenfassung als veraltet markieren oder mit dem aktuellen Stand neu berechnen. Kein fachlicher Umbau notwendig.

### D3: LF1-B macht den Gesamtabschluss und dessen Wiederaufnahme nicht verständlich
- Fundstelle: `js/lf1-vertrag.js:103–105,136–154,218–238`; `module/lf1-vertrag.html:69–95`.
- Sichtbar: „6 von 6 Zeilen stimmen.“ und separat „3 von 3. Bestanden.“; eine gemeinsame Abschlussmeldung oder Prozentanzeige fehlt in diesen Dateien. LF1-A zeigt dagegen Fortschritt und Abschlussstatus (`module/lf1-dual.html:59,172`, `js/lf1-dual.js:268–270,432–441`).
- Reproduziert mit Node: Alle Sollantworten setzen, beide Bereiche auswerten, speichern, laden. Vor Speicherung `mastered=true`; gespeichert ebenfalls true; nach `laden()` `mastered=false`, `lcSubmitted=false`, Antworten erhalten. Beim Seitenstart werden die Ergebnisfelder geleert. Das Wiederaufnahmeverhalten erklärt die Seite nicht.
- Grenze: Ein möglicherweise abweichendes Katalogabzeichen wurde nicht untersucht; kein behaupteter Browserbefund dazu.
- Vorschlag: Gesamtabschluss sichtbar machen und konsistent wiederherstellen oder deutlich erklären, warum erneute Auswertung nötig ist. Dies ist Zustands-/UI-Arbeit, keine kleine Textkorrektur.

## Priorität 2 – konkrete Lerntext- und Aufgabenbefunde

### D4: LF1-A K4 fragt ein im eigenen Lerntext nicht erklärtes Zusatzkriterium ab
- Fundstelle: `js/lf1-dual.js:97–104`, K4: „Was lässt sich aus dem gelesenen § 14 Absatz 3 BBiG ableiten?“ Die Sollantwort enthält „den körperlichen Kräften angemessen“.
- Gegenprüfung: `module/lf1-dual.html:87` erklärt den Ausbildungszweck; Quelle Q2 in Zeile 112 nennt Absatz 3, gibt dieses zweite Kriterium aber nicht wieder. Der externe Link könnte es vermitteln, die Seite verspricht jedoch in Zeile 76, Begriffe selbst zu erklären.
- Kleiner Textvorschlag für Zeile 87, nach Abgleich mit der bereits vorhandenen Quellenprüfung: Alt „Aufgaben müssen dem Ausbildungszweck dienen.“ → Neu „Aufgaben müssen dem Ausbildungszweck dienen und den körperlichen Kräften der auszubildenden Person angemessen sein.“ Keine neue Rechtsprüfung durch diesen Bericht.

### D5: LF1-B materials und record_support lassen entscheidende Fallangaben offen
- `module/lf1-vertrag.html:62`: Alt „Nela soll das Fachbuch selbst kaufen.“ → Vorschlag „Für eine betriebliche Ausbildungsaufgabe wird ein Fachbuch benötigt. Nela soll die Kosten dafür selbst tragen.“ Grund: Der vorhandene Lerntext spricht nur pauschal von Mitteln; die Aufgabe sagt weder Ausbildungszweck noch Kostentragung eindeutig. Selbst kaufen kann auch Kauf mit Erstattung bedeuten. `js/lf1-vertrag.js:12,39` erwartet dennoch eindeutig clarify.
- `module/lf1-vertrag.html:65`: Alt „Der Betrieb sagt zu, den Nachweis am Arbeitsplatz durchzusehen.“ → Vorschlag „Der Betrieb sagt zu, den Ausbildungsnachweis regelmäßig durchzusehen.“ Grund: In Text und Erklärung (`html:40`, `js:40`) ist Regelmäßigkeit entscheidend; „am Arbeitsplatz“ ersetzt sie nicht. Die Sollwertung fits ist dadurch im bisherigen Wortlaut schwächer begründet.
- Vor Umsetzung fachlich mit dem vorhandenen Quellenstand abgleichen. Keine ungesicherte Rechtskorrektur eingebaut.

### D6: LF1-B beginnt mit einem nicht aufgelösten Gesetzesverweis statt einer Erklärung
- Fundstelle `module/lf1-vertrag.html:28–30`, erster Wissensabschnitt. Alt „Für bestehende Ausbildungsverhältnisse gilt § 4 Absatz 5 BBiG, sofern die neue Verordnung nichts anderes bestimmt.“ sagt Lernenden nicht, was gilt.
- Textvorschlag, angelehnt an die schon vorhandene Erklärung in LF1-A (`module/lf1-dual.html:113`): „Für eine bereits laufende Ausbildung gelten grundsätzlich die bisherigen Vorschriften weiter, sofern die neue Verordnung nichts anderes bestimmt (§ 4 Absatz 5 BBiG).“ Quellenabgleich bleibt vor Umsetzung erforderlich.
- Größerer, nur dokumentierter Umbau: Den Übergangsabschnitt hinter Dauer/Form/Probezeit setzen. Die Aufgaben zu Nelas neuem Vertrag fragen Übergangsrecht nicht ab. LF1-A erläutert es bereits ausführlich in Q3; die zweite, kürzere Fassung liefert aktuell keinen neuen Lernschritt.

### D7: LF1-A Hilfen nennen teils praktisch schon die richtige Option
- A2 (`js/lf1-dual.js:27,31`): Hilfe 2 „Erklären und Rückmeldung sind auch Teil betrieblicher Ausbildung“ wiederholt fast den Kern von Option b.
- A5 (`js/lf1-dual.js:61,64`): Hilfe 2 nennt Ausbildungsperson und Klärung vor Versand – genau die Sollhandlung.
- Gegenprüfung: Kein Lösungsbuchstabe und kein Richtig-Status werden vorab ausgegeben; es sind freiwillige Hilfen. Die Anforderung „Hilfen ohne Lösung“ wird inhaltlich dennoch nur eingeschränkt erfüllt.
- Vorschlag A5 Hilfe 2: Alt „Kläre Auftrag und Unterstützung mit der zuständigen Ausbildungsperson, bevor etwas hinausgeht.“ → Neu „Vergleiche die Folgen der drei Handlungen: Welche ermöglicht eine Rückfrage, bevor ein Fehler nach außen gelangt?“
- Vorschlag A2 Hilfe 2: Alt „Erklären und Rückmeldung sind auch Teil betrieblicher Ausbildung.“ → Neu „Prüfe, ob Erklärungen nur an einem Lernort stattfinden können.“

### D8: LF1-B Auswertung ist gesammelt statt an der fehlerhaften Zeile
- Fundstelle `js/lf1-vertrag.js:200–202,220–228`: Erklärungen werden zu einem Absatz verbunden; keine Zeilennummer, Markierung oder Rücksprung. Inhaltlich hilfreich sind die konkreten Erläuterungen zu Probezeit und Nachweis; bei mehreren Fehlern muss man die passende Frage selbst wiederfinden.
- Vorschlag als größerer UI-Umbau: Fehler je vorhandener Aufgaben-ID ausgeben und an die jeweilige Frage anbinden. Keine neuen Aufgaben nötig.

## Weitere geprüfte Kriterien / bewusst keine pauschalen Mängel

- Erklärung vor Abfrage: LF1-A erklärt Lernorte und drei Dokumenttypen (`html:87–107`), zeigt Alex als Beispiel (`126–133`) und fragt dies in A1–A5/K1–K3 ab. Ausnahme K4 siehe D4. LF1-B erklärt Dauer, Probezeit, Vergütung, Nachweis und Prüfungsende vor den dazugehörigen Fragen (`html:31–42`).
- Verständlichkeit: Fiktive Namen und konkrete Bürohandlungen in LF1-A; unnötig einfache Ablenkantworten begrenzen allerdings die Aussagekraft der Kontrolle: K2 „Speiseplan“ (`js:82`) und K1 „Farbe der Versandtaste“ (`js:72`). Realistischere Verwechslungen wären ein späterer Aufgabenumbau, kein Freigabeblocker aus diesem Befund allein.
- Wiederholung zwischen A/B: Betriebspflichten werden in A allgemein, in B am Vertrag behandelt; das ist sinnvolle Vertiefung, keine unnötige Doppelung. Konkrete unnötige Wiederholung beim Übergangsrecht siehe D6.
- Vereinfachung: LF1-A weist ausdrücklich „Betrieb nur Praxis, Schule nur Theorie“ zurück (`html:88`) und nennt den dritten Lernort (§ 2, Zeile 89). Das ist keine von uns zu meldende Zweier-Verkürzung. LF1-B „Hier lernst du, was in einem Ausbildungsvertrag stehen muss“ (`html:23`) ist weiter als die Auswahl; Textvorschlag: „Hier lernst du ausgewählte Inhalte und Regeln zum Ausbildungsvertrag kennen.“
- Hilfen LF1-B: Zwei gestufte, allgemeine Lesestrategien (`js:30–33`) verraten keine Lösung; sie helfen bei einem konkreten Fachmissverständnis allerdings nur begrenzt. Kein Wunsch nach weiteren pauschalen Hilfetexten ohne Aufgabe.
- Auswertung erst nach Knopf: LF1-A `ansicht()` und LF1-B Click-Handler halten beim frischen Versuch Ergebnis-/Lösungstexte zurück. Node-Prüfung LF1-A K1 bestätigt: vor Auswertung null, nach Auswertung Auflösung, nach Antwortänderung wieder null. Die Auswertung des ausdrücklich vorgeführten Beispiels in LF1-A ist kein vorzeitig ausgewerteter eigener Versuch.

## Prüfung und Übergabe

Ausgeführt: `node` mit Assertions gegen die exportierten APIs von `js/lf1-dual.js` und `js/lf1-vertrag.js` (Auflösungsgating A; Speichern/Laden eines vollständigen Erfolgs B). Exit 0; Befunde D1/D2 zusätzlich durch die vollständigen Event-/Renderpfade belegt, nicht als Browserreproduktion bezeichnet.
Nächste Freigabeentscheidung bei Rick: kleine Textkorrekturen D4–D7/Einleitungsversprechen bündeln; Zustandskorrekturen D1–D3 und aufgabenbezogene Rückmeldung D8 separat implementieren und testen lassen. Windows-Sichtprüfung bleibt offen.
