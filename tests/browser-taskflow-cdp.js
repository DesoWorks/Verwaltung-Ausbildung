"use strict";

// Prüft die gemeinsame Aufgabenoberfläche, nicht die Fachbewertung.
// Aufruf: node tests/browser-taskflow-cdp.js
const { starteBrowser, pruefer } = require("./browser-cdp-helfer.js");

(async () => {
  const { check } = pruefer("TASKFLOW");
  const b = await starteBrowser({ breite: 1280, hoehe: 900 });
  const oeffne = async (label) => {
    await b.ev("[...document.querySelectorAll('#rathaus-bereiche button')].find((k) => k.textContent === 'Bürgerbüro').click()");
    await b.warte(200);
    await b.ev("(() => { const k = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === " + JSON.stringify(label) + "); if (!k) return false; k.click(); return true; })()");
    await b.warte(250);
  };
  try {
    await b.oeffne("module/rathaus.html#buerger");
    await b.ev("localStorage.clear()");
    await b.neuLaden();
    await oeffne("Fall B04 öffnen");
    check("B04: Schritt 1 von 5, nicht künstlich sechs Schritte", await b.ev("document.body.innerText.includes('Schritt 1 von 5') && !document.body.innerText.includes('Schritt 1 von 6')"));
    check("B04: nur der erste Arbeitsbereich ist sichtbar", await b.ev("(() => { const panels = [...document.querySelectorAll('.aufgabenfluss-panel > *')]; return panels.filter((p) => !p.hidden).length === 1 && panels[0].innerText.includes('Mira Hoffmann'); })()"));
    check("B04: Aussage nur in der Fallakte, nicht noch einmal in der Karte", await b.ev("(() => { const satz = 'meine Daten gesperrt werden'; const karte = document.querySelector('.aufgabenfluss-karte'); const akte = document.querySelector('.aufgabenfluss-akte'); return karte && akte && !karte.innerText.includes(satz) && akte.textContent.includes(satz); })()"));
    check("B04: andere Schritte sind nicht im sichtbaren Kartentext", await b.ev("!document.querySelector('.aufgabenfluss-karte').innerText.includes('Welches Anliegen') || document.querySelector('.aufgabenfluss-karte').innerText.includes('Mira Hoffmann')"));
    check("B04: Einordnung steht nicht in der ersten Karte", await b.ev("!document.querySelector('.aufgabenfluss-karte').innerText.includes('Welche Rechtsgrundlage')"));
    check("Weiter ohne Sperre", await b.ev("(() => { const k = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Weiter'); if (!k || k.disabled) return false; k.click(); return true; })()"));
    await b.warte(150);
    check("Nach Weiter: Schritt 2 von 5", await b.ev("document.body.innerText.includes('Schritt 2 von 5')"));
    check("Zurück", await b.ev("(() => { const k = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === 'Zurück'); if (!k || k.disabled) return false; k.click(); return true; })()"));
    check("Chip springt ohne Sperre zu Antwort", await b.ev("(() => { const k = [...document.querySelectorAll('.aufgabenfluss-chip')].find((x) => x.textContent.includes('Antwort')); if (!k) return false; k.click(); return true; })()"));
    check("Antwortbereich sichtbar, Anliegenfrage nicht in der Karte", await b.ev("document.body.innerText.includes('Schritt 5 von 5') && !document.querySelector('.aufgabenfluss-karte').innerText.includes('Welches Anliegen hat Mira')"));
    check("Hilfen per Klick, ohne Lösungstext", await b.ev("(() => { const k = [...document.querySelectorAll('button')].find((x) => x.textContent.includes('Hilfen')); if (!k) return false; k.click(); const t = document.getElementById('b04-hilfen').innerText; return k.getAttribute('aria-expanded') === 'true' && t.length > 20 && !t.includes('Musterlösung') && !t.includes('unentgeltlich') && !t.includes('zwei Jahre') && !t.includes('anl-eigene-sperre'); })()"));
    check("Hilfe-Knopf ist ein Button mit Steuerung", await b.ev("(() => { const k = [...document.querySelectorAll('button')].find((x) => x.textContent.includes('Hilfen')); return k && k.getAttribute('aria-controls') === 'b04-hilfen'; })()"));
    check("Fortschritt unterscheidet Schritt und richtig bearbeitet", await b.ev("document.getElementById('b04-fortschritt-unterschied').textContent.includes('Schritt') && document.getElementById('b04-fortschritt-unterschied').textContent.includes('Bereichen richtig bearbeitet')"));
    check("Fallakte erreichbar", await b.ev("!!document.querySelector('.aufgabenfluss-akte summary')"));
    check("SicherheitsHinweis sichtbar", await b.ev("document.querySelector('.aufgabenfluss-hinweise').innerText.includes('Keine echte Eintragung')"));

    await b.oeffne("module/rathaus.html#buerger");
    await oeffne("Fall B01 öffnen");
    check("B01 behält sechs eigene Schritte", await b.ev("document.body.innerText.includes('Schritt 1 von 6') && [...document.querySelectorAll('.aufgabenfluss-chip')].some((k) => k.textContent.includes('6. Auswertung'))"));
    await b.oeffne("module/rathaus.html#buerger");
    await oeffne("Fall B03 öffnen");
    check("B03 hat fünf eigene Schritte", await b.ev("document.body.innerText.includes('Schritt 1 von 5') && [...document.querySelectorAll('.aufgabenfluss-chip')].length === 5"));
    check("B03: Aussage nur in der Fallakte", await b.ev("(() => { const satz = 'für mich persönlich in Papierform'; const karte = document.querySelector('.aufgabenfluss-karte'); const akte = document.querySelector('.aufgabenfluss-akte'); return karte && akte && !karte.innerText.includes(satz) && akte.textContent.includes(satz); })()"));

    for (const breite of [390, 1280]) {
      await b.call("Emulation.setDeviceMetricsOverride", { width: breite, height: 800, deviceScaleFactor: 1, mobile: breite < 500 });
      check("Kein Überlauf bei " + breite, await b.ev("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1"));
    }
    check("Keine JavaScript-Ausnahmen", b.konsole.length === 0, b.konsole);
    console.log("TASKFLOW-Browserprüfung bestanden.");
  } catch (e) {
    console.error("FEHLER:", e.message);
    process.exitCode = 1;
  } finally {
    await b.schliessen();
  }
})();
