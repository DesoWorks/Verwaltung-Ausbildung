# DOUBLE SHIFT – Abnahmematrix

Terminus · 04.11.2026. Dies ist die Prüfvorgabe, **kein Testnachweis**. Ergebnisse und exakt geprüfter Commit werden im gemeinsamen Übergabebericht und unabhängigen GLaDOS-Bericht geführt.

| ID | Erwartung | Geeigneter Nachweis |
|---|---|---|
| P0-1 | Vorherige Overflow-Ursache benannt; keine globale overflow-x-hidden-Verschleierung | konkreter DOM-/Breitenbefund und CSS-Diff |
| P0-2 | 320/360/400 px, große Schrift und Abstände, keine abgeschnittenen Inhalte | Browser: document/client/scroll-Breite sowie Controls/Ansichten prüfen, Sichtbeleg |
| P0-3 | 200/400 % Browserzoom | gemessene Layoutbreite/DPR gegenüber Zoom100, echter Browserzoom getrennt von Emulation |
| B01-1 | vierte Einfachauswahl erforderlich; leer/falsch blockiert, Sollfall abschließbar | Kern-/UI-Regression und Browserinteraktionen |
| B01-2 | alte/änderte Auswertung ungültig | Legacyfixture und nachträgliche Auswahl/Freitextänderung |
| B02-1 | fiktive Alex-Weber-Akte, Rückfragen, Daten-/Identitätsprüfung, Rechts-/Umfangseinordnung | fachlicher Vergleich mit verbindlichem Plan und UI |
| B02-2 | alle fünf Bereiche richtig → tatsächlicher Abschluss | kompletter Browsererfolg mit Eingaben, nicht bloß lokal gespeichertem Erfolgsfixture |
| B02-3 | jedes Pflichtfeld fehlt/falsch/unbekannt → kein Bestehen; richtige+verbotene Kombination gesperrt | automatisierte Matrix, Browserstichprobe leer/falsch |
| B02-4 | jede Änderung inkl. Freitext invalidiert, auch nach Reload | UI/Browser und Speicherreadback |
| B02-5 | eigene Speicherstände, Fallwechsel, Nur-B02-Reset | B01/Luca/Noelle/Anzeige vor/nach auf Erhalt prüfen; Navigationsmetadaten nicht fälschlich als Lernverlust werten |
| B02-6 | beschädigte/veraltete/fremde manipulierte Stände sicher | JSON-/ID-/Versions-/Ergebnisfixtures, sichtbare Meldung |
| B02-7 | Hilfen/Karte/Lehrkraft richtig, keine Musterlösung in Lernansicht | Lehrkraftmodus an/aus und Darstellung je Fall |
| A11Y-1 | Anzeige & Lesen plattformweit inkl. B02 persistent | Größen/Abstände/hell-dunkel-kontrast/ruhig über Ansichten und Reload |
| A11Y-2 | Tastatur, Fokus, Labels, schmale Navigation | echte Keyevents, Fokusziel nach Bewertung/Navigieren; gerenderte Kontrollnamen |
| REG-1 | Luca und Noelle weiterhin funktionsfähig | bestehende Kern-/UI-Tests und Browser-Nutzerpfade |
| OFF-1 | gesamte Anwendung ohne Server über file:// | isolierter Browser, lokale Ressourcen; keine Onlinequelle zur Fallbearbeitung nötig |
| WIN-1 | direkt entpackbar/startbar, achtteilige Anleitung, ZIP Größe+SHA-256 | Archivprüfung, Inhalt gegen geprüften Gitcommit, separater Starttest des extrahierten Pakets |
| WIN-2 | Windows und NVDA | nur als bestanden melden, wenn tatsächlich in diesen Umgebungen geprüft; sonst offen |

Keine pauschale Barrierefreiheitszertifizierung. Automatisierte DOM-Modelle, reale Browserprüfung, direkter Dateibetrieb, Windows und NVDA sind verschiedene Belegarten. Eigenprüfung ersetzt keine unabhängige QA. Nach Reparaturen gezielt auf neuem Commit nachprüfen, nicht unbesehen den alten QA-Stand auf neue Änderungen übertragen.
