# OPERATION CLEAR PATH – unabhängige statische QA

**Prüfstand:** Worktree `/home/starnet/projects/Verwaltung-Ausbildung-rathaus-refit`, Branch `pre-dev/verwaltung-aktuell`, Basis-HEAD `fe7f8a2`. Ich habe den tatsächlichen `git diff` gelesen. Kein Browser eingesetzt. `node --test tests/*.test.js`: **520 bestanden, 0 fehlgeschlagen, 0 übersprungen**. `git diff --check`: ohne Befund.

## Bestanden

- **Personalamt-Navigation:** Die Buttons „Vorgang 1/2“ werden im Diff aus `js/rathaus-ui.js` entfernt; „Aktueller Vorgang: …“ bleibt dort stehen (Zeile 320). Genau eine Fallauswahl liegt in `#rathaus-unterleiste` (`js/rathaus-ui.js:1085–1096`). `js/rathaus-navigation.js:159–170` stellt Luca Berger und Noelle Kranz als auswählbare Vorgänge mit aktivem Merkmal bereit. Das Ämtermenü ist kein zweiter Vorgangswechsel. Beim Wechsel werden alter Fall gespeichert und neuer Fall geladen (`js/rathaus-ui.js:130–146`). Der Diff verändert keine Antwortschlüssel oder -struktur (`js/rathaus-ui.js:42–50, 110–127`).
- **Bürgerbüro-Auswertung:** Die Zeile enthält Schritt-Nr., Name, Symbol, Statuswort und „Schritt öffnen“ (wenn die Taskflow-API vorhanden ist): `js/rathaus-buergerbuero-ui.js:325–340`. Statuswort und Symbol basieren auf `a.bereiche[b.key].status`; auch `ist-richtig`/`ist-falsch` leiten sich daraus ab (`:328–335`). Keine bloße Umfärbung zur Kaschierung einer abweichenden Bewertung gefunden.
- **Überschrift:** `js/rathaus-aufgabenfluss.js:319–335` zeigt unter „Offene oder zu prüfende Schritte“ die Schritte, deren Status `istOffenStand(stand)` als offen einordnet. Das passt zur Liste. Der alte Wortlaut wurde im geänderten Test `tests/rathaus-buergerbuero-ui.test.js` ersetzt.
- **Lehrkraftbereich:** `module/rathaus.html:33–40` hat `<details>` ohne `open` (geschlossen beim Laden); Schalter und Warnhinweis bleiben da. Keine neue Zugriffskontrolle im Diff. Summary-Stil und Fokusregel: `css/rathaus.css:558–567`.
- **Neu-Markierung:** Genau drei `neu: true`: `lf1-dual`, `lf1-vertrag`, `lf1-beendigung` in `js/module-daten.js:80–107`. `js/startseite.js:35–36` gibt den Text „Neu“ unabhängig vom separat erzeugten Abschlusszeichen aus. Regressionstests `tests/clear-path-bewertung-neu.test.js:187–228` prüfen Zahl/Menge, sichtbaren Text und paralleles Abschlusszeichen.
- **P0 Vertrag:** Bei Kontrollantwortänderung aktualisiert `js/lf1-vertrag.js:204–216` nur `kontrolle-ergebnis`; die Vertragsübung bleibt stehen. Die Prüfung `tests/clear-path-bewertung-neu.test.js:106–127` führt den Ablauf tatsächlich aus (Ergebnis „Bestanden.“ → Antwort ändern → Hinweis; parallele Übungsbewertung bleibt gleich). Kein Textgleichheitstest.
- **P0 Dual:** `js/lf1-dual.js` rechnet sichtbare Ergebniszusammenfassungen in `render()` neu. `tests/clear-path-bewertung-neu.test.js:154–183` prüft durch reale Skriptausführung Auswahl → Auswertung → Antwortänderung, aktualisierten Score und veraltet-Hinweis sowie getrennte Übungs-/Kontrollauswertung. Das prüft Zustandsübergänge, nicht bloße Textgleichheit.
- **Lerntext/Schlüssel:** Neuer Satz in `module/lf1-dual.html:92`: „Aufgaben müssen dem Ausbildungszweck dienen und den körperlichen Kräften angemessen sein.“ Zwei Aussageformulierungen in `module/lf1-vertrag.html:62,65` wurden präzisiert. Die Optionswerte und Sollschlüssel in `js/lf1-vertrag.js:5–29` sind unverändert; ebenso wurde in `js/lf1-dual.js` keine Schlüsseländerung vorgenommen. Die Legenden-/Lerntextänderung verschiebt daher keinen Schlüssel.

## Offen

Nicht geprüft und ausdrücklich keine Abnahme: Browser-Klickpfade, Kontrast, schmales Fenster, Dark Mode, Tastatur, Fokus im laufenden Browser, Windows, Firefox und NVDA. Kein fachliches Gesamturteil über alle Lerninhalte.

## Sperrfehler

**Keine im geprüften statischen Umfang festgestellt.** Keine Schlüsseländerung; die geprüften Änderungen löschen nicht die jeweils unbetroffene Bewertung, und die Regressionstests zeigen keinen Lösungsinhalt vor Auswertung. Die offenen Browser-/Assistenztechnik-Prüfungen verhindern eine umfassende Freigabe.
