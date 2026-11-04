"use strict";

// Echte Browserprüfung (file://, Linux-Chrome, CDP): defekter B02-Speicherstand und sichtbarer Hinweis.
// Weg: index -> Virtuelles Rathaus -> Bürgerbüro -> Fall B02 -> defekter Speicher -> Neuladen.
// Aufruf: node tests/browser-b02-speicher-cdp.js   (kein node:test-Test)

const { starteBrowser, pruefer } = require("./browser-cdp-helfer.js");

const SCHLUESSEL = "verwaltung-ausbildung.rathaus.buergerbuero.b02.v1";
const HELFER = `
window.__knopf = (text) => { const k = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.trim() === text); if (!k || k.disabled) return false; k.click(); return true; };
window.__hinweis = () => document.getElementById('b02-verworfen-hinweis');
window.__fallHinweis = () => { const h = document.getElementById('b2-verworfen-hinweis'); return !!h && !h.hidden && h.getBoundingClientRect().height > 0; };
`;

(async () => {
  const { check } = pruefer("B02-Speicher-Browser");
  const b = await starteBrowser({ breite: 1280, hoehe: 900 });
  try {
    await b.oeffne("index.html");
    await b.ev("localStorage.clear()");
    check("Startseite verlinkt das Virtuelle Rathaus",
      await b.ev("Array.from(document.querySelectorAll('a')).some((a) => /Virtuelles Rathaus/.test(a.textContent) && /module\\/rathaus\\.html/.test(a.getAttribute('href')))"));
    await b.ev("Array.from(document.querySelectorAll('a')).find((a) => /module\\/rathaus\\.html/.test(a.getAttribute('href'))).click()");
    await b.warte(800);
    check("Rathaus geöffnet (file://)", await b.ev("location.protocol === 'file:' && /rathaus\\.html/.test(location.pathname)"));
    await b.ev(HELFER);
    await b.ev("document.querySelector('[data-ansicht=\"buerger\"]').click()");
    await b.warte(250);
    await b.ev(HELFER);
    check("Sauberer Start: kein Hinweis in der Übersicht", await b.ev("!__hinweis()"));
    check("Fall B02 öffnen", await b.ev("__knopf('Fall B02 öffnen')"));
    await b.warte(250);
    await b.ev(HELFER);
    check("Sauberer Start: kein Hinweis im Fall", !(await b.ev("__fallHinweis()")));

    // Defekten Speicher setzen und neu laden: Landung auf der Übersicht.
    await b.ev("localStorage.setItem(" + JSON.stringify(SCHLUESSEL) + ", '{broken')");
    await b.neuLaden();
    await b.ev(HELFER);
    check("Nach Neuladen: Bürgerbüro-Übersicht sichtbar", await b.ev("document.getElementById('hauptinhalt').innerText.includes('Fallübersicht')"));
    check("Übersicht zeigt B02 weiterhin als nicht begonnen", await b.ev("document.getElementById('hauptinhalt').innerText.toLowerCase().includes('stand: noch nicht begonnen')"));
    const text = await b.ev("(__hinweis() || {}).innerText || ''");
    check("Übersicht zeigt sichtbaren Hinweis zu B02", /nicht gelesen werden/i.test(text) && /B02/i.test(text), text);
    check("Hinweis hat role=status und ist sichtbar", await b.ev("__hinweis().getAttribute('role') === 'status' && __hinweis().getBoundingClientRect().height > 0"));
    check("Rohwert bleibt ohne Reset erhalten (keine stille Löschung)", await b.ev("localStorage.getItem(" + JSON.stringify(SCHLUESSEL) + ") === '{broken'"));

    // Fallansicht: Hinweis bleibt, kein falscher Abschluss.
    check("Fall B02 öffnen (defekter Stand)", await b.ev("__knopf('Fall B02 öffnen')"));
    await b.warte(250);
    await b.ev(HELFER);
    check("Fallansicht zeigt Hinweis", await b.ev("__fallHinweis()"));
    check("Fallansicht: Abschluss gesperrt", await b.ev("document.getElementById('b2-abschluss-knopf').disabled === true"));
    check("Rohwert nach reinem Ansehen unverändert", await b.ev("localStorage.getItem(" + JSON.stringify(SCHLUESSEL) + ") === '{broken'"));

    // Gezielter Reset entfernt Speicher und Hinweis.
    await b.ev("window.confirm = () => true");
    check("B02 zurücksetzen", await b.ev("__knopf('Fall B02 zurücksetzen')"));
    await b.warte(300);
    check("Nach Reset kein B02-Schlüssel", await b.ev("localStorage.getItem(" + JSON.stringify(SCHLUESSEL) + ") === null"));
    check("Nach Reset Hinweis im Fall weg", !(await b.ev("__fallHinweis()")));
    await b.ev("__knopf('Zur Bürgerbüro-Übersicht')");
    await b.warte(250);
    await b.ev(HELFER);
    check("Nach Reset Hinweis in der Übersicht weg", await b.ev("!__hinweis()"));

    // Weitere verworfene Zustände: falscher Fall/Bewertungsstand und Nicht-Objekt.
    for (const roh of ['"text"', '[]', JSON.stringify({ fallId: "b02", bewertungsstand: "alt", eingaben: {}, abgeschlossen: true })]) {
      await b.ev("localStorage.setItem(" + JSON.stringify(SCHLUESSEL) + ", " + JSON.stringify(roh) + ")");
      await b.neuLaden();
      await b.ev(HELFER);
      check("Verworfener Rohwert " + roh.slice(0, 20) + " -> Hinweis, kein Abschluss",
        await b.ev("!!__hinweis() && !document.getElementById('hauptinhalt').innerText.toLowerCase().includes('stand: übungsfall abgeschlossen')"));
    }
    // Reflow mit sichtbarem Hinweis (Viewport-Emulation, kein echter Zoom).
    for (const breite of [320, 400]) {
      await b.call("Emulation.setDeviceMetricsOverride", { width: breite, height: 800, deviceScaleFactor: 1, mobile: false });
      await b.warte(200);
      check("Hinweis ohne horizontalen Überlauf bei " + breite + " px (emuliert)",
        await b.ev("document.documentElement.scrollWidth - document.documentElement.clientWidth") <= 0);
    }
    await b.call("Emulation.clearDeviceMetricsOverride");
    await b.ev("localStorage.removeItem(" + JSON.stringify(SCHLUESSEL) + ")");
    await b.neuLaden();
    await b.ev(HELFER);
    check("Ohne Speicher wieder kein Hinweis", await b.ev("!__hinweis()"));

    check("Keine JavaScript-Ausnahmen", b.konsole.length === 0, b.konsole);
    console.log("B02-Speicher-Browserprüfung vollständig bestanden.");
  } catch (e) {
    console.error("FEHLER:", e.message);
    process.exitCode = 1;
  } finally {
    await b.schliessen();
  }
})();
