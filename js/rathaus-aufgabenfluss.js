/* Gemeinsame Aufgabenoberfläche für die Bürgerbüro-Fälle.
 * Zeichnet nur die Hülle: ein Bereich sichtbar, Schritte aus dem Fall, Hilfen, Zurück und Weiter.
 * Bewertet nichts und schreibt nicht in die Fall-Speicher. Der sichtbare Schritt liegt in einem eigenen Schlüssel.
 */
(function () {
  "use strict";

  function leeren(knoten) {
    if (!knoten) return;
    knoten.textContent = "";
    while (knoten.children && knoten.children.length) knoten.removeChild(knoten.children[0]);
  }

  function el(tag, klasse, text) {
    var n = document.createElement(tag);
    if (klasse) n.className = klasse;
    if (text) n.textContent = text;
    return n;
  }

  function schrittSchluessel(fallId) {
    // Nicht „b01“ im Schlüssel: bestehende Prüfungen suchen genau diese Teilzeichenkette im Fallspeicher.
    return "verwaltung-ausbildung.rathaus.aufgabenfluss.sicht." + String(fallId || "").replace(/^b0/, "buerger-0");
  }

  function liesSchritt(fallId, max) {
    try {
      var roh = window.localStorage.getItem(schrittSchluessel(fallId));
      var n = Number(roh);
      if (!Number.isInteger(n) || n < 0 || n >= max) return 0;
      return n;
    } catch (fehler) {
      return 0;
    }
  }

  function schreibSchritt(fallId, n) {
    try {
      window.localStorage.setItem(schrittSchluessel(fallId), String(n));
    } catch (fehler) { /* Der Fallstand bleibt. Nur die Ansicht startet wieder bei Schritt 1. */ }
  }

  function loescheSchritt(fallId) {
    try {
      var key = schrittSchluessel(fallId);
      if (window.localStorage.getItem(key) === null) return;
      window.localStorage.removeItem(key);
    } catch (fehler) {}
  }

  function mount(host, cfg) {
    var schritte = cfg.schritte || [];
    var index = liesSchritt(cfg.fallId, schritte.length);
    var hilfeOffen = false;

    var wurzel = el("section", "aufgabenfluss");
    wurzel.setAttribute("data-fall", cfg.fallId || "");

    var kopf = el("header", "aufgabenfluss-kopf");
    kopf.appendChild(el("p", "aufgabenfluss-kicker", cfg.kicker || ""));
    var zeile = el("div", "aufgabenfluss-titelzeile");
    var titel = el("h2", "aufgabenfluss-titel", cfg.titel || "");
    titel.id = "ansicht-titel";
    titel.tabIndex = -1;
    var badge = el("p", "aufgabenfluss-badge");
    zeile.appendChild(titel);
    zeile.appendChild(badge);
    kopf.appendChild(zeile);
    var unterschied = el("p", "nur-lesen aufgabenfluss-unterschied");
    unterschied.id = (cfg.fallId || "fall") + "-fortschritt-unterschied";
    kopf.appendChild(unterschied);

    var leiste = el("div", "aufgabenfluss-leiste");
    leiste.setAttribute("aria-hidden", "true");
    kopf.appendChild(leiste);

    var nav = el("nav", "aufgabenfluss-nav");
    nav.setAttribute("aria-label", "Aufgabenbereiche von " + (cfg.fallId || "diesem Fall"));
    kopf.appendChild(nav);
    wurzel.appendChild(kopf);

    var hinweise = el("div", "aufgabenfluss-hinweise");
    (cfg.hinweise || []).forEach(function (text) {
      if (text) hinweise.appendChild(el("p", "rathaus-hinweis", text));
    });
    if (cfg.vorKarte) cfg.vorKarte(hinweise);
    wurzel.appendChild(hinweise);

    if (cfg.akte && typeof cfg.akte.fuellen === "function") {
      var akte = el("details", "aufgabenfluss-akte");
      var summary = el("summary", "", cfg.akte.titel || "Fallakte");
      akte.appendChild(summary);
      var akteInhalt = el("div", "aufgabenfluss-akte-inhalt");
      cfg.akte.fuellen(akteInhalt);
      akte.appendChild(akteInhalt);
      wurzel.appendChild(akte);
    }

    var karte = el("article", "aufgabenfluss-karte");
    var schrittLabel = el("h3", "aufgabenfluss-schrittlabel", "");
    schrittLabel.id = (cfg.fallId || "fall") + "-schrittlabel";
    schrittLabel.tabIndex = -1;
    karte.appendChild(schrittLabel);
    var panelHost = el("div", "aufgabenfluss-panel");
    var auswertungsHinweis = el("p", "rathaus-meta", "Die Auswertung steht direkt unter dieser Karte und bleibt erreichbar.");
    auswertungsHinweis.hidden = true;
    karte.appendChild(panelHost);
    karte.appendChild(auswertungsHinweis);

    var hilfePanel = el("div", "aufgabenfluss-hilfe-panel");
    hilfePanel.id = (cfg.fallId || "fall") + "-hilfen";
    hilfePanel.hidden = true;
    hilfePanel.setAttribute("role", "region");
    hilfePanel.setAttribute("aria-label", "Hilfen zum aktuellen Schritt");
    if (cfg.hilfeKnoten) hilfePanel.appendChild(cfg.hilfeKnoten);
    if (typeof cfg.hilfeFuellen === "function") cfg.hilfeFuellen(hilfePanel);
    karte.appendChild(hilfePanel);

    var fuss = el("div", "aufgabenfluss-fuss");
    var hilfeKnopf = el("button", "knopf aufgabenfluss-hilfen");
    hilfeKnopf.type = "button";
    var birne = el("span", "aufgabenfluss-birne", "💡");
    birne.setAttribute("aria-hidden", "true");
    hilfeKnopf.appendChild(birne);
    hilfeKnopf.appendChild(document.createTextNode("Hilfen"));
    hilfeKnopf.setAttribute("aria-expanded", "false");
    hilfeKnopf.setAttribute("aria-controls", hilfePanel.id);
    fuss.appendChild(hilfeKnopf);

    var bewegung = el("div", "aufgabenfluss-bewegung");
    var zurueck = el("button", "knopf", "Zurück");
    zurueck.type = "button";
    var weiter = el("button", "knopf knopf-haupt", "Weiter");
    weiter.type = "button";
    bewegung.appendChild(zurueck);
    bewegung.appendChild(weiter);
    fuss.appendChild(bewegung);
    karte.appendChild(fuss);
    wurzel.appendChild(karte);

    var unten = el("div", "aufgabenfluss-unten");
    (cfg.untenKnoten || []).forEach(function (k) { if (k) unten.appendChild(k); });
    if (typeof cfg.untenFuellen === "function") cfg.untenFuellen(unten);
    wurzel.appendChild(unten);
    host.appendChild(wurzel);

    var panels = schritte.map(function (schritt) {
      var panel = schritt.panel || el("section", "aufgabenfluss-bereich");
      if (!schritt.panel) panel.className = "aufgabenfluss-bereich";
      if (typeof schritt.fuellen === "function") schritt.fuellen(panel);
      if (schritt.immerSichtbar) unten.appendChild(panel);
      else panelHost.appendChild(panel);
      return panel;
    });

    function richtigZahl() {
      var n = typeof cfg.richtig === "function" ? cfg.richtig() : 0;
      return typeof n === "number" && n >= 0 ? n : 0;
    }

    function bewertete() {
      return cfg.bewertete || schritte.length;
    }

    function gehe(neu, fokus) {
      if (neu < 0 || neu >= schritte.length || neu === index && fokus) {
        if (neu === index && fokus) fokusAufSchritt();
        return;
      }
      if (neu < 0 || neu >= schritte.length) return;
      index = neu;
      schreibSchritt(cfg.fallId, index);
      zeichne();
      if (hilfeOffen && typeof cfg.hilfeAktualisieren === "function") cfg.hilfeAktualisieren(hilfePanel, index);
      if (fokus) fokusAufSchritt();
      if (typeof cfg.onSchritt === "function") cfg.onSchritt(index);
    }

    function fokusAufSchritt() {
      var ziel = schrittLabel;
      if (schritte[index] && schritte[index].fokus) ziel = schritte[index].fokus;
      if (ziel && typeof ziel.focus === "function") ziel.focus();
    }

    function zeichne() {
      var richtig = richtigZahl();
      var von = bewertete();
      var schritt = schritte[index] || { name: "" };
      badge.textContent = richtig + " / " + von;
      badge.setAttribute("aria-label", richtig + " von " + von + " Bereichen richtig bearbeitet");
      unterschied.textContent = "Schritt " + (index + 1) + " von " + schritte.length +
        ". Getrennt davon: " + richtig + " von " + von + " Bereichen richtig bearbeitet.";
      schrittLabel.textContent = "Schritt " + (index + 1) + " von " + schritte.length + " · " + schritt.name;

      leeren(leiste);
      schritte.forEach(function (_, i) {
        leiste.appendChild(el("span", "aufgabenfluss-segment" + (i <= index ? " ist-position" : "")));
      });

      leeren(nav);
      schritte.forEach(function (s, i) {
        var chip = el("button", "knopf aufgabenfluss-chip" + (i === index ? " ist-aktiv" : ""));
        chip.type = "button";
        chip.textContent = (i + 1) + ". " + s.name;
        if (i === index) chip.setAttribute("aria-current", "step");
        var stand = "noch nicht geprüft";
        if (typeof cfg.bereichStatus === "function") stand = cfg.bereichStatus(s, i) || stand;
        chip.setAttribute("aria-label", (i + 1) + ". " + s.name + ", " + stand + (i === index ? ", aktueller Schritt" : ""));
        chip.addEventListener("click", function () { gehe(i, true); });
        nav.appendChild(chip);
      });

      panels.forEach(function (panel, i) {
        panel.hidden = schritte[i] && schritte[i].immerSichtbar ? false : i !== index;
      });
      auswertungsHinweis.hidden = !(schritte[index] && schritte[index].immerSichtbar);
      zurueck.disabled = index <= 0;
      weiter.disabled = index >= schritte.length - 1;
      zurueck.setAttribute("aria-label", index <= 0 ? "Kein vorheriger Bereich" : "Vorherigen Bereich öffnen");
      weiter.setAttribute("aria-label", index >= schritte.length - 1 ? "Kein weiterer Bereich" : "Nächsten Bereich öffnen");
    }

    hilfeKnopf.addEventListener("click", function () {
      hilfeOffen = !hilfeOffen;
      hilfePanel.hidden = !hilfeOffen;
      hilfeKnopf.setAttribute("aria-expanded", hilfeOffen ? "true" : "false");
      if (hilfeOffen && typeof cfg.hilfeAktualisieren === "function") cfg.hilfeAktualisieren(hilfePanel, index);
      if (hilfeOffen) {
        var erstes = hilfePanel.querySelector ? hilfePanel.querySelector("button, a, input, textarea, [tabindex]") : null;
        if (erstes && typeof erstes.focus === "function") erstes.focus();
        else if (typeof hilfePanel.focus === "function") {
          hilfePanel.tabIndex = -1;
          hilfePanel.focus();
        }
      }
    });
    zurueck.addEventListener("click", function () { gehe(index - 1, true); });
    weiter.addEventListener("click", function () { gehe(index + 1, true); });

    zeichne();
    return {
      gehe: gehe,
      aktualisiere: zeichne,
      schritt: function () { return index; },
      loescheSchritt: function () { loescheSchritt(cfg.fallId); },
      hilfeOffen: function () { return hilfeOffen; },
      titel: titel
    };
  }

  var api = { mount: mount, loescheSchritt: loescheSchritt, schrittSchluessel: schrittSchluessel };
  window.RATHAUS_AUFGABENFLUSS = api;
  if (typeof module === "object" && module.exports) module.exports = api;
})();
