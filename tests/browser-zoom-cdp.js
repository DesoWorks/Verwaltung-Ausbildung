"use strict";

// ECHTER Browserzoom (Chrome-Profil partition.default_zoom_level), kein Viewport-Override.
// Prüft Rathaus (Bürgerbüro B01 und B02, Lehrkraft) auf horizontalen Überlauf und abgeschnittene Bedienelemente.
// Aufruf: node tests/browser-zoom-cdp.js

const { starteBrowser } = require("./browser-cdp-helfer.js");

const ANZEIGE = JSON.stringify({ text: 150, spacing: true, theme: "hell", ruhig: false });

const MESSEN = `(() => {
  const de = document.documentElement;
  // Der Skip-Link liegt absichtlich außerhalb, bis er den Fokus bekommt.
  const zu = Array.from(document.querySelectorAll('button, a:not(.skip-link), input, textarea, summary')).filter((e) => {
    const r = e.getBoundingClientRect();
    return r.width > 0 && (r.right > de.clientWidth + 1 || r.left < -1);
  }).map((e) => (e.textContent || e.name || e.tagName).trim().slice(0, 40));
  return { inner: window.innerWidth, dpr: window.devicePixelRatio, vv: window.visualViewport.scale,
           ueber: de.scrollWidth - de.clientWidth, ausserhalb: zu.slice(0, 5), anzahlAusserhalb: zu.length };
})()`;

(async () => {
  let fehler = 0;
  for (const zoom of [200, 400]) {
    for (const mitAnzeige of [false, true]) {
      const b = await starteBrowser({ breite: 1280, hoehe: 900, zoomProzent: zoom });
      try {
        await b.oeffne("module/rathaus.html");
        await b.ev("localStorage.clear()");
        if (mitAnzeige) await b.ev("localStorage.setItem('verwaltung-ausbildung.anzeige.v1', " + JSON.stringify(ANZEIGE) + ")");
        await b.neuLaden();
        const ansichten = [
          ["Stadt", ""],
          ["Bürgerbüro-Übersicht", "[...document.querySelectorAll('#rathaus-bereiche button')].find((k) => k.textContent === 'Bürgerbüro').click()"],
          ["Fall B01", "Array.from(document.querySelectorAll('button')).find(k=>k.textContent==='Fall B01 öffnen').click()"],
          ["Fall B02", "[...document.querySelectorAll('#rathaus-bereiche button')].find((k) => k.textContent === 'Bürgerbüro').click()"],
          ["Fall B02 offen", "Array.from(document.querySelectorAll('button')).find(k=>k.textContent==='Fall B02 öffnen').click()"],
          ["B03 Übersicht", "[...document.querySelectorAll('#rathaus-bereiche button')].find(k=>k.textContent==='Bürgerbüro').click()"],
          ["B03 offen", "Array.from(document.querySelectorAll('button')).find(k=>k.textContent==='Fall B03 öffnen').click(); document.querySelectorAll('#hauptinhalt details').forEach(d=>d.open=true)"],
          ["Lehrkraft", "document.getElementById('lehrkraft-schalter').click()"]
        ];
        for (const [name, js] of ansichten) {
          if (js) { await b.ev(js); await b.warte(300); }
          const m = await b.ev(MESSEN);
          const ok = m.ueber <= 0 && m.anzahlAusserhalb === 0 && Math.abs(m.vv - 1) < 0.01;
          if (!ok) fehler++;
          console.log((ok ? "OK   " : "FAIL ") + "Zoom " + zoom + "%" + (mitAnzeige ? " +Anzeige150/Abstand" : "") + " " + name + " " + JSON.stringify(m));
        }
        if (b.konsole.length) { fehler++; console.log("FAIL JS-Ausnahmen", b.konsole); }
      } finally { await b.schliessen(); }
    }
  }
  console.log(fehler ? "FEHLER: " + fehler : "Echter Browserzoom 200 %/400 %: alle Prüfungen bestanden.");
  process.exitCode = fehler ? 1 : 0;
})();
