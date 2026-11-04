"use strict";

// Echte Browser-Regression für Fall B01 über file:// (Linux-Chrome, CDP). Kein node:test-Test.
// Prüft: vierte Option "Keine dieser Aussagen trifft zu", leer <> falsch, Invalidierung nach Änderung.
// Aufruf: node tests/browser-b01-regression-cdp.js

const { starteBrowser, pruefer } = require("./browser-cdp-helfer.js");

const HELFER = `
window.__knopf = (text) => { const k = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.trim() === text); if (!k || k.disabled) return false; k.click(); return true; };
window.__hat = (text) => document.getElementById('hauptinhalt').innerText.toLowerCase().includes(text.toLowerCase());
`;

(async () => {
  const { check } = pruefer("B01-Regression");
  const b = await starteBrowser({});
  try {
    await b.oeffne("module/rathaus.html");
    await b.ev("localStorage.clear()");
    await b.neuLaden();
    await b.ev("document.querySelector('[data-ansicht=\"buerger\"]').click()");
    await b.warte(250);
    await b.ev(HELFER);
    check("B01 öffnen", await b.ev("__knopf('Fall B01 öffnen')"));
    await b.warte(300);
    await b.ev(HELFER);

    const vierte = await b.ev("Array.from(document.querySelectorAll('input[type=radio]')).filter((i) => i.closest('label') && i.closest('label').innerText.includes('Keine dieser Aussagen trifft zu')).map((i) => i.type)");
    check("Vierte Einfachauswahl 'Keine dieser Aussagen trifft zu' ist eine Radiooption", vierte.length >= 1, vierte);

    check("Leer prüfen", await b.ev("__knopf('Auswertung prüfen')"));
    await b.warte(300);
    check("Leer: Abschluss gesperrt", await b.ev("document.getElementById('bb-abschluss-knopf').disabled === true"));
    check("Leer wird als unbeantwortet/offen geführt, nicht nur als falsch", await b.ev("__hat('offen') || __hat('nicht beantwortet') || __hat('unbeantwortet')"));

    // Eine Antwort ändern: bereits vorhandene Auswertung muss ungültig werden.
    await b.ev("(() => { const i = document.querySelector('#hauptinhalt input[type=radio]'); i.click(); })()");
    await b.warte(300);
    check("Nach Änderung: Abschluss weiterhin gesperrt (Auswertung entwertet)", await b.ev("document.getElementById('bb-abschluss-knopf').disabled === true"));
    check("Nach Änderung: Hinweis 'erneut prüfen'", await b.ev("__hat('erneut prüfen')"));

    // Speicher: B01 schreibt nur den eigenen Schlüssel, nicht den von B02.
    const keys = await b.ev("Object.keys(localStorage).join(',')");
    check("B01 legt keinen B02-Schlüssel an", !keys.includes("b02"), keys);

    check("Keine JavaScript-Ausnahmen", b.konsole.length === 0, b.konsole);
    console.log("B01-Regression im Browser bestanden.");
  } catch (e) {
    console.error("FEHLER:", e.message);
    process.exitCode = 1;
  } finally {
    await b.schliessen();
  }
})();
