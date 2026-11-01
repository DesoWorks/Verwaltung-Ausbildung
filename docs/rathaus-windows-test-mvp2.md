# Rathaus MVP 2: Windows-Testanleitung für den Commander

Stand: Bürgerbüro B01 (Samira Yilmaz, Anmeldung nach Zuzug), Commit-ID: `<COMMIT-ID, trägt Rick nach dem Commit ein>`

Diese Anleitung ist eine Prüfliste für den manuellen Test. Sie behauptet keine bestandene Abnahme. Eine NVDA-Abnahme und eine Windows-Abnahme sind mit dieser Datei **nicht** erfolgt.

## Vorbereitung

1. Internet am Rechner ausschalten (WLAN aus oder Kabel ziehen). Die Seite braucht kein Netz.
2. Im Ordner `Verwaltung-Ausbildung-rathaus` die Datei `module/rathaus.html` per Doppelklick im Browser öffnen. Die Adresse beginnt mit `file://`. Es läuft kein Server.
3. Notiere den Browser (Edge, Chrome, Firefox) und die Fensterbreite.

## Schritte

1. **Anzeige & Lesen.** Öffne die Seite „Anzeige & Lesen“, stelle Textgröße und Kontrast um und kehre zum Rathaus zurück. Erwartung: Die Einstellung gilt auch im Bürgerbüro, Text bleibt lesbar, nichts wird abgeschnitten.
2. **Schmales Fenster.** Ziehe das Fenster auf etwa 400 Pixel Breite. Erwartung: Die Navigation bleibt beschriftet und benutzbar, die Bürgerbüro-Leiste „Übersicht, Fall B01, Nachschlagen“ steht in einer Zeile, die sechs Schrittknöpfe stehen in zwei Spalten.
3. **Lehrkraft: Luca gegen Noelle.** Schalte die Lehrkraftansicht ein. Erwartung: Luca Berger und Noelle Kranz stehen wie bisher da, zusätzlich als dritter Fall „Bürgerbüro B01: Samira Yilmaz“ mit der Warnung, dass dies keine echte Zugriffssicherung ist. Schalte die Lehrkraftansicht wieder aus.
4. **B01 Erfolg.** Stadtübersicht, Bürgerbüro, „Fall B01 öffnen“. Stelle Rückfragen, öffne alle vier Unterlagen (sie öffnen sich direkt auf der Seite, kein Upload) und fülle die sechs Bereiche aus: Zuzug; Einzugsdatum 09.11.; keine weitere Wohnung; Ausweis passt, Mietvertrag kein Ersatz, Bestätigung und Zuordnungsmerkmal fehlen; Regeln zu Anmeldung, Wohnungsgeber, Zuständigkeit und Ortskarte; Vorbereitung „Mitteilung aufnehmen und klären“; Antwortbausteine Anliegen, Nachweis fehlt, Mitteilung aufgenommen, nächster Schritt, nicht abgeschlossen. Klicke „Auswertung prüfen“. Erwartung: Drei Bereiche richtig, „Übungsfall abschließen“ ist aktiv. Nach dem Abschluss steht dort, dass keine Anmeldung durchgeführt wurde.
5. **Mietvertrag-Fehlversuch.** Setze den Mietvertrag auf „liegt vor und passt“ und prüfe erneut. Erwartung: Der Bereich Unterlagen ist nicht richtig, der Abschluss ist gesperrt und nennt den Grund.
6. **Baustein „Anmeldung abgeschlossen“.** Korrigiere den Mietvertrag, hake zusätzlich den Baustein „Anmeldung abgeschlossen“ an und prüfe. Erwartung: Der Bereich Antwort ist nicht richtig, der Abschluss ist gesperrt. Ändere ein Feld nach einer Prüfung. Erwartung: Die Auswertung gilt sofort nicht mehr, der Abschluss ist gesperrt, bis du erneut prüfst.
7. **Freitext bleibt Entwurf.** Schreibe im Bereich Antwort einen eigenen Text. Lade die Seite neu. Erwartung: Der Text ist noch da und trägt den Hinweis „Entwurf, nicht automatisch geprüft“. Er macht keinen Bereich „richtig“.
8. **Reset nur B01.** Wähle „Fall B01 zurücksetzen“ und brich die Rückfrage ab. Erwartung: nichts ändert sich. Wiederhole und bestätige. Erwartung: Nur Fall B01 ist leer.
9. **Luca und Noelle danach.** Öffne das Personalamt. Erwartung: Der Stand von Luca und Noelle ist unverändert da. B02 und B03 stehen in der Fallübersicht mit „geplant, noch nicht startbar“ und lassen sich nicht anklicken. Ordnungsamt und Stadtkasse haben weiterhin keine Aktion.

## Zu melden

Browser und Version, Fensterbreite, Schritt, was erwartet war, was passiert ist. Bei einer Speichermeldung („Speichern nicht möglich“) zusätzlich, ob der Browser Daten für `file://` blockiert.

## Grenzen

- Sonnenthal ist eine fiktive Stadt. Die Übungsannahmen zum kommunalen Ablauf stehen im Fall und in der Lehrkraftansicht.
- Keine NVDA-Abnahme, keine Windows-Abnahme, keine Rechtsberatung.
