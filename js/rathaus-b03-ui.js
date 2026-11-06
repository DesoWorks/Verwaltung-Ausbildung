/* B03-Oberfläche: isolierter Speicher, DOM-Beschriftungen, keine Netzaktionen. */
(function () {
  'use strict';
  var b = window.RATHAUS_B03;
  var modell, host, refs, flussApi, meldung = '';
  function el(tag, klasse, text) {
    var n = document.createElement(tag);
    if (klasse) n.className = klasse;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function knopf(text, fn) {
    var n = el('button', 'knopf', text); n.type = 'button'; n.addEventListener('click', fn); return n;
  }
  function liste(ziel, punkte) {
    var ul = el('ul'); punkte.forEach(function (p) { ul.appendChild(el('li', '', p)); }); ziel.appendChild(ul);
  }
  function leer() { return { eingaben: b.normalisiere({}), letzteAuswertung: null, abgeschlossen: false }; }
  function laden() {
    try { var roh = localStorage.getItem(b.SPEICHER_SCHLUESSEL); return roh ? b.bereinigeGespeichert(roh) : leer(); }
    catch (_) { meldung = 'Speicher nicht lesbar. Dieser Stand bleibt nur bis zum Verlassen der Seite.'; return leer(); }
  }
  function speichern() {
    try {
      localStorage.setItem(b.SPEICHER_SCHLUESSEL, JSON.stringify({ fallId: b.FALL_ID, bewertungsstand: b.BEWERTUNGSSTAND,
        eingaben: modell.eingaben, letzteAuswertung: modell.letzteAuswertung, abgeschlossen: modell.abgeschlossen }));
      meldung = ''; return true;
    } catch (_) { meldung = 'Speichern nicht möglich. Kein dauerhaft gespeicherter Abschluss; Stand gilt nur bis zum Verlassen.'; return false; }
  }
  function status() {
    if (refs.meldung) {
      refs.meldung.textContent = meldung;
      refs.meldung.hidden = !meldung;
    }
    if (flussApi) flussApi.aktualisiere();
  }
  function richtigAnzahl() {
    var a = modell.letzteAuswertung;
    if (!a) return 0;
    return b.BEREICHE.filter(function (x) { return a.bereiche[x.key].status === 'richtig'; }).length;
  }
  function geaendert() {
    var alt = !!modell.letzteAuswertung || modell.abgeschlossen;
    modell.letzteAuswertung = null; modell.abgeschlossen = false;
    speichern(); auswertung(); status();
    if (alt) refs.live.textContent = 'Eingaben geändert. Auswertung und Abschluss gelten nicht mehr. Bitte erneut prüfen.';
  }
  function aufklappen(ziel, titel, text) {
    var d = el('details', 'rathaus-aufklapp');
    d.appendChild(el('summary', '', titel)); d.appendChild(el('p', 'rathaus-dokument', text)); ziel.appendChild(d);
  }
  function option(ziel, typ, name, wert, text, checked, fn) {
    var label = el('label', 'rathaus-option'), input = el('input');
    input.type = typ; input.name = name; input.value = wert; input.checked = checked;
    input.addEventListener('change', function () { fn(input.checked); geaendert(); });
    label.appendChild(input); label.appendChild(el('span', '', text)); ziel.appendChild(label);
  }
  function frage(ziel, feld) {
    var k = b.katalog()[feld];
    function set(titel) { var n = el('fieldset', 'rathaus-gruppe'); n.appendChild(el('legend', '', titel)); ziel.appendChild(n); return n; }
    if (k.art === 'status') {
      k.optionen.forEach(function (o) {
        var s = set(o.text + ': Stand der Angabe');
        k.status.forEach(function (v) {
          option(s, 'radio', 'b3-' + feld + '-' + o.id, v.id, v.text, modell.eingaben[feld][o.id] === v.id,
            function () { modell.eingaben[feld][o.id] = v.id; });
        });
      });
    } else {
      var s = set(k.frage);
      s.appendChild(el('p', 'rathaus-meta', k.art === 'einzel' ? 'Wähle genau eine Antwort.' : 'Mehrere Antworten möglich. Richtige Zusatzantworten heilen keine falschen Aussagen.'));
      k.optionen.forEach(function (o) {
        var multi = k.art === 'mehrfach';
        option(s, multi ? 'checkbox' : 'radio', 'b3-' + feld, o.id, o.text,
          multi ? modell.eingaben[feld].indexOf(o.id) >= 0 : modell.eingaben[feld] === o.id,
          function (an) {
            if (!multi) modell.eingaben[feld] = o.id;
            else {
              modell.eingaben[feld] = modell.eingaben[feld].filter(function (id) { return id !== o.id; });
              if (an) modell.eingaben[feld].push(o.id);
            }
          });
      });
    }
  }
  function auswertung() {
    var ziel = refs.ergebnis; ziel.textContent = '';
    var h = el('h3', '', 'Auswertung'); h.tabIndex = -1; ziel.appendChild(h);
    ziel.appendChild(knopf('Auswertung prüfen', function () {
      modell.letzteAuswertung = b.auswertung(modell.eingaben); modell.abgeschlossen = false;
      modell.verworfen = false; speichern(); auswertung(); status();
      refs.ergebnis.querySelector('h3').focus(); refs.live.textContent = 'Auswertung aktualisiert.';
    }));
    var a = modell.letzteAuswertung;
    if (a) {
      var worte = { richtig: 'Richtig', falsch: 'Noch nicht richtig', offen: 'Noch offen', unvollstaendig: 'Noch unvollständig', ungueltig: 'Ungültig' };
      b.BEREICHE.forEach(function (x) {
        var r = a.bereiche[x.key];
        ziel.appendChild(el('h4', '', x.name + ': ' + worte[r.status])); liste(ziel, r.hinweise);
      });
      if (a.sperren.length) liste(ziel, a.sperren);
    } else ziel.appendChild(el('p', '', 'Noch keine gültige Auswertung. Fehlende Antworten gelten nicht als richtig.'));
    var p = el('p', modell.abgeschlossen ? 'rathaus-ok' : 'rathaus-hinweis', modell.abgeschlossen
      ? 'Übungsfall B03 abgeschlossen. Kein echter Antrag und keine Ausstellung.'
      : 'Abschluss erst nach vollständiger richtiger Bearbeitung und aktueller Auswertung.');
    p.id = 'b3-abschluss-status'; ziel.appendChild(p);
    var ab = knopf('Übungsfall abschließen', function () {
      var neu = b.auswertung(modell.eingaben);
      if (!modell.letzteAuswertung || !neu.darfAbschliessen || modell.letzteAuswertung.eingabeVersion !== neu.eingabeVersion) return;
      modell.abgeschlossen = true;
      if (!speichern()) modell.abgeschlossen = false;
      auswertung(); status(); refs.ergebnis.querySelector('#b3-abschluss-status').tabIndex = -1;
      refs.ergebnis.querySelector('#b3-abschluss-status').focus();
    });
    ab.id = 'b3-abschluss-knopf'; ab.disabled = !a || !a.darfAbschliessen || modell.abgeschlossen;
    ab.setAttribute('aria-describedby', p.id); ziel.appendChild(ab);
  }
  var SCHRITT_HILFE = [
    'Trenne Zweck, Art des Zeugnisses und Empfänger, bevor du eine Art festlegst.',
    'Öffne die Fallakte und vergleiche Identitätsdokument und Antragsdaten. Ein Arbeitgeberwunsch ersetzt die Prüfung nicht.',
    'Die Nachschlagekarte unterscheidet einfach, erweitert und den digitalen Weg. Ein privater Arbeitgeber ist keine Behörde.',
    'Antrag vorbereiten ist noch keine Ausstellung und keine Zahlung.',
    'Die gewünschte Papierfassung und der Übungsrahmen gehören in die Antwort. Der Entwurf wird nicht automatisch bewertet.'
  ];
  function zeichne(ziel) {
    host = ziel; refs = {}; flussApi = null;
    if (!modell) modell = laden();
    var daten = b.fallDaten();
    var fluss = window.RATHAUS_AUFGABENFLUSS;
    if (!fluss) {
      ziel.appendChild(el('p', 'rathaus-fehler', 'Die Aufgabenoberfläche ist nicht geladen.'));
      return;
    }
    var schrittHinweis = el('p', 'rathaus-meta', '');
    var hilfe = el('div', '');
    hilfe.appendChild(schrittHinweis);
    hilfe.appendChild(el('p', 'rathaus-meta', 'Gestufte Hilfen, von allgemein bis konkret. Eine fertige Antwort steht hier nicht.'));
    [1, 2].forEach(function (stufe) { aufklappen(hilfe, 'Hilfestufe ' + stufe, b.hilfe(stufe)); });
    aufklappen(hilfe, 'Hilfestufe 3', 'Prüfe die Fallakte. Sie nennt das Recht, nicht die anzukreuzende Zeile.');
    var karte = b.nachschlagen();
    refs.meldung = el('p', 'rathaus-fehler'); refs.meldung.setAttribute('role', 'alert');
    refs.live = el('p', 'nur-lesen'); refs.live.setAttribute('role', 'status'); refs.live.setAttribute('aria-live', 'polite');
    refs.ergebnis = el('section', 'rathaus-etappe');
    var reset = knopf('Fall B03 zurücksetzen', function () {
      if (!window.confirm(b.resetText())) return;
      try { localStorage.removeItem(b.SPEICHER_SCHLUESSEL); } catch (_) {
        meldung = 'Zurücksetzen nicht möglich. Speicher wurde nicht gelöscht.'; status(); return;
      }
      if (window.RATHAUS_AUFGABENFLUSS) window.RATHAUS_AUFGABENFLUSS.loescheSchritt('b03');
      modell = leer(); meldung = ''; host.textContent = ''; zeichne(host); host.querySelector('h2').focus();
    });
    flussApi = fluss.mount(ziel, {
      fallId: 'b03',
      kicker: 'Bürgerbüro · Fall B03',
      titel: 'Fall B03: ' + daten.titel,
      hinweise: [daten.uebungsannahme, daten.hinweis].concat(modell.verworfen
        ? ['Der gespeicherte Stand ist beschädigt oder veraltet. Kein alter Abschluss wird übernommen. Bereinigte Eingaben bitte erneut prüfen.'] : []),
      bewertete: b.BEREICHE.length,
      richtig: richtigAnzahl,
      bereichStatus: function (s) {
        var a = modell.letzteAuswertung;
        if (!a || !a.bereiche[s.id]) return 'noch nicht geprüft';
        return { richtig: 'richtig', falsch: 'noch nicht richtig', offen: 'noch offen', unvollstaendig: 'noch unvollständig', ungueltig: 'ungültig' }[a.bereiche[s.id].status] || 'offen';
      },
      rueckmeldung: function (s) {
        var a = modell.letzteAuswertung;
        if (!a || !a.bereiche[s.id]) return null;
        var bereich = b.BEREICHE.filter(function (x) { return x.key === s.id; })[0];
        var kat = b.katalog();
        var ergebnis = { hinweise: (a.bereiche[s.id].hinweise || []).slice(), mehrfach: [] };
        (bereich ? bereich.felder : []).forEach(function (f) {
          var k = kat[f], w = modell.eingaben[f];
          if (!k || k.art !== 'mehrfach' || !Array.isArray(w)) return;
          if (!k.optionen.every(function (o) { return typeof o.richtig === 'boolean'; })) return;
          var gewaehlt = k.optionen.filter(function (o) { return w.indexOf(o.id) >= 0; });
          ergebnis.mehrfach.push({
            frage: k.frage,
            richtig: gewaehlt.filter(function (o) { return o.richtig; }).map(function (o) { return o.text; }),
            falsch: gewaehlt.filter(function (o) { return !o.richtig && !o.optional; }).map(function (o) { return o.text; }),
            fehlt: k.optionen.filter(function (o) { return o.richtig && w.indexOf(o.id) < 0; }).map(function (o) { return o.text; })
          });
        });
        return ergebnis;
      },
      schritte: b.BEREICHE.map(function (x, i) {
        return { id: x.key, name: x.name, fuellen: function (s) {
          if (i === 0) {
            s.appendChild(fluss.grundlagen({
              id: 'b3',
              einfuehrung: 'Bevor du entscheidest: Lies zuerst die Grundlagen zum Führungszeugnis. Die Fragen weiter unten werden bewertet.',
              themen: karte.themen.map(function (t) { return { titel: t.titel, text: t.text }; }),
              bedeutung: 'Welche Art Zeugnis möglich ist, hängt vom Zweck und von einer gesetzlichen Grundlage ab, nicht vom Wunsch des Empfängers.',
              beispiel: 'Ein privater Arbeitgeber ist keine Behörde. Ein gewöhnlicher Bürojob begründet kein erweitertes Zeugnis. Die Einzelheiten stehen in der Nachschlagekarte.',
              hinweis: karte.quelle + ' Die Nachschlagekarte bleibt in der Fallakte nachschlagbar.'
            }));
            s.appendChild(el('p', 'rathaus-meta', 'Die vollständige Aussage von Robin Keller steht in der Fallakte, nicht noch einmal in dieser Karte.'));
            aufklappen(s, 'Rückfrage: Für wen und wofür?', 'Für mich selbst. Die private Sonnental Büroservice GmbH verlangt ein einfaches Führungszeugnis für kaufmännische Sachbearbeitung. Keine Betreuung Minderjähriger.');
            aufklappen(s, 'Rückfrage: Papier oder digital? Gebührenbefreiung?', 'Heute persönlich als Papierfassung. Keine Gebührenbefreiung beantragt; im Übungsfall keine Befreiungsgründe belegt.');
          }
          if (i === 1) {
            aufklappen(s, 'Identitätsdokument und Antragsdaten öffnen', 'Nur fiktive Übungsdaten: Robin Keller, Geburtsname Keller, geboren 08.06.1998 in Freiburg im Breisgau, deutsch. Alleinige Wohnung Rosenweg 12, 00000 Sonnenthal. Gültiges Identitätsdokument im Original und Antragsdaten stimmen überein.');
            aufklappen(s, 'Arbeitgeberschreiben öffnen', 'Fiktive Sonnental Büroservice GmbH: Bitte legen Sie ein einfaches Führungszeugnis für private Zwecke vor. Tätigkeit: kaufmännische Sachbearbeitung, keine Betreuung Minderjähriger.');
          }
          x.felder.forEach(function (f) { frage(s, f); });
          if (i === 4) {
            var label = el('label', 'rathaus-feldname', 'Eigener Antwortentwurf (freiwillig, nicht automatisch bewertet)');
            label.htmlFor = 'b3-freitext'; s.appendChild(label);
            var t = el('textarea', 'rathaus-freitext-gross'); t.id = 'b3-freitext'; t.rows = 4; t.maxLength = 2000;
            t.value = modell.eingaben.freitext; t.setAttribute('aria-describedby', 'b3-freitext-hilfe');
            t.addEventListener('input', function () { modell.eingaben.freitext = t.value.slice(0, 2000); geaendert(); }); s.appendChild(t);
            var feldHilfe = el('p', 'rathaus-meta', 'Wird lokal gespeichert, aber nicht fachlich automatisch geprüft. Rückmeldung durch die Lehrkraft.');
            feldHilfe.id = 'b3-freitext-hilfe'; s.appendChild(feldHilfe);
          }
        } };
      }),
      akte: { titel: 'Fallakte', fuellen: function (p) {
        p.appendChild(el('p', '', daten.anliegenText));
        p.appendChild(el('p', 'rathaus-meta', 'Unterlagen und Rechtsgrenzen bleiben hier erreichbar, ohne die Antworten zu löschen.'));
        aufklappen(p, 'Identitätsdokument und Antragsdaten', 'Nur fiktive Übungsdaten: Robin Keller, Geburtsname Keller, geboren 08.06.1998 in Freiburg im Breisgau, deutsch. Alleinige Wohnung Rosenweg 12, 00000 Sonnenthal.');
        aufklappen(p, 'Arbeitgeberschreiben', 'Fiktive Sonnental Büroservice GmbH verlangt ein einfaches Führungszeugnis für kaufmännische Sachbearbeitung ohne Betreuung Minderjähriger.');
        karte.themen.forEach(function (t) { aufklappen(p, t.titel, t.text); });
      } },
      hilfeKnoten: hilfe,
      hilfeAktualisieren: function () { schrittHinweis.textContent = SCHRITT_HILFE[flussApi.schritt()] || ''; },
      untenFuellen: function (unten) {
        unten.appendChild(refs.meldung);
        unten.appendChild(refs.live);
        unten.appendChild(refs.ergebnis);
        unten.appendChild(reset);
      }
    });
    auswertung();
    status();
  }
  function zeichneLehrkraft(ziel) {
    var l = b.lehrkraft(); ziel.appendChild(el('h3', '', 'Bürgerbüro B03: Robin Keller'));
    ziel.appendChild(el('p', 'rathaus-hinweis', l.warnung)); ziel.appendChild(el('p', '', l.sachverhalt));
    ziel.appendChild(el('h4', '', 'Musterlösung und Bewertungskriterien'));
    liste(ziel, l.loesungen.map(function (x) { return x.feld + ': ' + x.richtig; }));
    ziel.appendChild(el('p', '', l.musterantwort)); liste(ziel, l.kriterien);
    ziel.appendChild(el('p', '', l.quellen.quelle));
  }
  window.RATHAUS_B03_UI = { zeichne: zeichne, zeichneLehrkraft: zeichneLehrkraft };
}());
