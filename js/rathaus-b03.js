/* Bürgerbüro B03: reine Falllogik. Keine echten Anträge, Registerzugriffe oder Zahlungen.
 * Fachvertrag: docs/rathaus-double-shift-b03-plan-2026-11-04.md.
 * Quellen erneut geprüft am 05.11.2026; siehe quellen/bzrg-b03-2026-11-05.md.
 */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.RATHAUS_B03 = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  var FALL_ID = 'b03';
  var SPEICHER_SCHLUESSEL = 'verwaltung-ausbildung.rathaus.buergerbuero.b03.v1';
  var BEWERTUNGSSTAND = 'b03-2026-11-05-r1';
  function opt(id, text, richtig) { return { id: id, text: text, richtig: !!richtig }; }
  function einzel(frage, optionen) { return { art: 'einzel', frage: frage, optionen: optionen }; }
  var KATALOG = {
    anliegen: einzel('Welches Anliegen hat Robin?', [
      opt('eigen-privat', 'Eigenantrag für einen privaten Arbeitgeber', true),
      opt('behoerdenzeugnis', 'Führungszeugnis zur direkten Vorlage bei einer Behörde'),
      opt('fremde-person', 'Auskunft über eine andere Person')
    ]),
    daten: { art: 'status', frage: 'Vergleiche Antragsangaben und Identitätsdokument.',
      status: [{ id: 'vorhanden-stimmt', text: 'liegt vor und stimmt' }, { id: 'fehlt', text: 'fehlt' }, { id: 'widerspruch', text: 'widerspricht den Unterlagen' }],
      optionen: [
        { id: 'name', text: 'Name, Geburtsname und Vorname', erwartet: 'vorhanden-stimmt' },
        { id: 'geburt', text: 'Geburtsdatum und Geburtsort', erwartet: 'vorhanden-stimmt' },
        { id: 'anschrift', text: 'Anschrift', erwartet: 'vorhanden-stimmt' },
        { id: 'staatsangehoerigkeit', text: 'Staatsangehörigkeit', erwartet: 'vorhanden-stimmt' }
      ] },
    identitaet: einzel('Wie ist der Identitätsabgleich zu bewerten?', [
      opt('nachgewiesen', 'Gültiges Übungsdokument und Antragsangaben stimmen überein; Identität nachgewiesen', true),
      opt('keine-identitaet', 'Bei persönlicher Vorsprache ist keine Prüfung nötig'),
      opt('vollmacht-genuegt', 'Eine Vollmacht ersetzt die persönliche Antragstellung und Identitätsprüfung')
    ]),
    art: einzel('Welche Art passt zum belegten Anliegen?', [
      opt('einfach', 'Einfaches Führungszeugnis für private Zwecke', true),
      opt('erweitert-immer', 'Erweitertes Führungszeugnis, weil ein Arbeitgeber immer mehr Angaben erhält'),
      opt('registerkopie', 'Vollständige Kopie des Bundeszentralregisters')
    ]),
    empfaenger: einzel('An wen geht die gewünschte Papierfassung?', [
      opt('antragsteller', 'An Robin als antragstellende Person', true),
      opt('arbeitgeber-direkt', 'Unmittelbar an den privaten Arbeitgeber'),
      opt('schalter', 'An den Übungsschalter zur sofortigen Aushändigung')
    ]),
    weg: einzel('Welcher Antragsweg passt zur heutigen Vorsprache?', [
      opt('persoenlich-meldebehoerde', 'Persönlicher Antrag am vorgegebenen zuständigen Schalter der Meldebehörde', true),
      opt('polizeidienststelle', 'Nur die Polizeidienststelle nimmt den Antrag an'),
      opt('digital-am-schalter-ausstellen', 'Am Schalter sofort ein amtliches digitales Zeugnis ausstellen')
    ]),
    regeln: { art: 'mehrfach', frage: 'Welche Regeln sind fachlich richtig?', optionen: [
      opt('identitaet-pruefen', 'Die Identität ist bei der Antragstellung nachzuweisen', true),
      opt('bzrg30', '§ 30 BZRG ist die Antragsgrundlage für diesen Fall', true),
      opt('bfj-erteilt', 'Das Bundesamt für Justiz erteilt das Zeugnis, nicht der Übungsschalter', true),
      opt('digital-online-auf-wunsch', 'Digitales Ergebnis auf Verlangen bei elektronischem Antrag nach §§ 30c/30d BZRG, über das Nutzerkonto', true),
      opt('digital-unmoeglich', 'Ein digitales Führungszeugnis ist gesetzlich nicht möglich'),
      opt('erweitert-ohne-nachweis', 'Für erweitert genügt jeder Arbeitgeberwunsch ohne passende Voraussetzungen und schriftliche Aufforderung')
    ] },
    gebuehr: einzel('Welche Gebühr ist im vorgegebenen Normalfall anzusetzen?', [
      opt('13-normalfall', '13 Euro nach Nr. 1130 der Anlage zum JVKostG', true),
      opt('kostenlos-immer', 'Für berufliche Zwecke immer kostenlos'),
      opt('kommunal-frei', 'Eine frei erfundene Sonnenthaler Pauschale')
    ]),
    befreiung: einzel('Wie ist eine Gebührenbefreiung hier einzuordnen?', [
      opt('nicht-beantragt', 'Nicht beantragt und im Sachverhalt nicht belegt; Befreiungen sind grundsätzlich gesondert zu prüfen', true),
      opt('immer-befreit', 'Der private Berufszweck bewirkt automatisch Befreiung'),
      opt('nie-befreit', 'Gebührenbefreiungen gibt es nie')
    ]),
    vorbereitung: einzel('Was ist die nächste sachgerechte Handlung?', [
      opt('antrag-vorbereiten', 'Nach Daten- und Identitätsprüfung den passenden Antrag vorbereiten, nicht als ausgestellt melden', true),
      opt('bereits-ausgestellt', 'Das Führungszeugnis als bereits ausgestellt verbuchen'),
      opt('garantiert-ohne-eintrag', 'Ohne Registerprüfung ein Zeugnis ohne Eintrag garantieren')
    ]),
    bausteine: { art: 'mehrfach', frage: 'Welche Bausteine gehören in die Antwort an Robin?', optionen: [
      opt('zweck-bestaetigen', 'Für Ihr belegtes Anliegen passt das einfache Führungszeugnis für private Zwecke.', true),
      opt('antrag-nach-pruefung', 'Nach der Identitäts- und Datenprüfung bereiten wir den Antrag vor; das BfJ erteilt das Zeugnis.', true),
      opt('gebuehr-13', 'Im vorgegebenen Normalfall beträgt die Gebühr 13 Euro.', true),
      opt('versand-an-person', 'Die gewünschte Papierfassung wird an Sie gesandt, nicht direkt an den privaten Arbeitgeber.', true),
      opt('keine-garantie', 'Inhalt und Fertigstellungsdatum werden nicht garantiert.', true),
      opt('nur-uebung', 'Hier wird nur geübt: kein echter Antrag, keine Zahlung und keine Ausstellung.', true),
      opt('digital-alternative', 'Ein digitales Ergebnis können Sie alternativ elektronisch nach §§ 30c/30d BZRG beantragen.'),
      opt('arbeitgeber-direkt', 'Wir schicken es direkt an Ihren privaten Arbeitgeber.'),
      opt('bereits-ausgestellt', 'Ihr Zeugnis ist hier bereits ausgestellt.'),
      opt('sofort-garantiert', 'Sie erhalten es garantiert heute ohne Eintrag.')
    ] }
  };
  // Der optionale Hinweis auf den digitalen Weg ist zulässig, aber keine versteckte Antwortpflicht.
  KATALOG.bausteine.optionen.filter(function (o) { return o.id === 'digital-alternative'; })[0].optional = true;
  var BEREICHE = [
    { key: 'anliegen', name: 'Anliegen', felder: ['anliegen'] },
    { key: 'unterlagen', name: 'Unterlagen', felder: ['daten', 'identitaet'] },
    { key: 'regeln', name: 'Regeln', felder: ['art', 'empfaenger', 'weg', 'regeln'] },
    { key: 'vorbereitung', name: 'Vorbereitung', felder: ['gebuehr', 'befreiung', 'vorbereitung'] },
    { key: 'antwort', name: 'Antwort', felder: ['bausteine'] }
  ];
  function kopie(x) { return JSON.parse(JSON.stringify(x)); }
  function objekt(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
  function ids(feld) { return KATALOG[feld].optionen.map(function (o) { return o.id; }); }
  function ungueltigeWerte(e) {
    if (!objekt(e)) return ['eingabe'];
    var falsch = Object.keys(e).filter(function (k) { return k !== 'freitext' && !KATALOG[k]; });
    Object.keys(KATALOG).forEach(function (f) {
      var w = e[f], kat = KATALOG[f];
      if (w === undefined || w === null) return;
      if (kat.art === 'einzel') {
        if (w !== '' && (typeof w !== 'string' || ids(f).indexOf(w) < 0)) falsch.push(f);
      } else if (kat.art === 'mehrfach') {
        if (!Array.isArray(w) || w.some(function (v) { return ids(f).indexOf(v) < 0; })) falsch.push(f);
      } else if (!objekt(w) || Object.keys(w).some(function (k) {
        return ids(f).indexOf(k) < 0 || kat.status.every(function (s) { return s.id !== w[k]; });
      })) falsch.push(f);
    });
    if (e.freitext !== undefined && typeof e.freitext !== 'string') falsch.push('freitext');
    return falsch;
  }
  function normalisiere(e) {
    e = objekt(e) ? e : {};
    var n = {};
    Object.keys(KATALOG).forEach(function (f) {
      var kat = KATALOG[f];
      if (kat.art === 'einzel') n[f] = ids(f).indexOf(e[f]) >= 0 ? e[f] : null;
      else if (kat.art === 'mehrfach') n[f] = Array.isArray(e[f]) ? ids(f).filter(function (id) { return e[f].indexOf(id) >= 0; }) : [];
      else {
        n[f] = {};
        kat.optionen.forEach(function (o) {
          if (objekt(e[f]) && kat.status.some(function (s) { return s.id === e[f][o.id]; })) n[f][o.id] = e[f][o.id];
        });
      }
    });
    n.freitext = typeof e.freitext === 'string' ? e.freitext.slice(0, 2000) : '';
    return n;
  }
  function eingabeVersion(e) { return JSON.stringify(normalisiere(e)); }
  function feldZustand(f, n) {
    var kat = KATALOG[f], w = n[f];
    if (kat.art === 'einzel') return { gegeben: !!w, voll: !!w, falsch: !!w && !kat.optionen.some(function (o) { return o.id === w && o.richtig; }) };
    if (kat.art === 'status') return {
      gegeben: Object.keys(w).length > 0,
      voll: kat.optionen.every(function (o) { return !!w[o.id]; }),
      falsch: kat.optionen.some(function (o) { return w[o.id] && w[o.id] !== o.erwartet; })
    };
    return {
      gegeben: w.length > 0,
      voll: kat.optionen.filter(function (o) { return o.richtig; }).every(function (o) { return w.indexOf(o.id) >= 0; }),
      falsch: kat.optionen.some(function (o) { return !o.richtig && !o.optional && w.indexOf(o.id) >= 0; })
    };
  }
  function auswertung(e) {
    var invalid = ungueltigeWerte(e), n = normalisiere(e), bereiche = {}, sperren = [];
    BEREICHE.forEach(function (b) {
      var z = b.felder.map(function (f) { return feldZustand(f, n); });
      var status = invalid.some(function (f) { return b.felder.indexOf(f) >= 0; }) ? 'ungueltig'
        : !z.some(function (s) { return s.gegeben; }) ? 'offen'
        : z.some(function (s) { return s.falsch; }) ? 'falsch'
        : z.some(function (s) { return !s.voll; }) ? 'unvollstaendig' : 'richtig';
      var texte = { richtig: 'Richtig bearbeitet.', offen: 'Noch nicht beantwortet. Keine Auswahl ist keine richtige Antwort.',
        unvollstaendig: 'Es fehlen noch Angaben. Prüfe alle Aufgaben in diesem Abschnitt.',
        falsch: 'Mindestens eine gewählte Einordnung passt nicht zur Akte oder widerspricht den geprüften Regeln. Richtige Zusatzantworten gleichen das nicht aus.',
        ungueltig: 'Unbekannte oder beschädigte Eingabe. Bitte diesen Abschnitt neu bearbeiten.' };
      var hinweise = [texte[status]];
      b.felder.forEach(function (f, i) {
        var feldStatus = z[i];
        if (invalid.indexOf(f) >= 0) hinweise.push(KATALOG[f].frage + ' – ungültige Angabe; bitte neu wählen.');
        else if (!feldStatus.gegeben) hinweise.push(KATALOG[f].frage + ' – noch nicht beantwortet.');
        else if (feldStatus.falsch) hinweise.push(KATALOG[f].frage + ' – Einordnung mit Akte und Nachschlagekarte vergleichen.');
        else if (!feldStatus.voll) hinweise.push(KATALOG[f].frage + ' – noch nicht vollständig.');
      });
      bereiche[b.key] = { status: status, hinweise: hinweise };
      if (status === 'falsch' || status === 'ungueltig') sperren.push(b.name + ': ' + texte[status]);
    });
    if (invalid.length) sperren.push('Ungültige Eingabewerte: Bitte die Angaben neu prüfen.');
    var ok = !invalid.length && BEREICHE.every(function (b) { return bereiche[b.key].status === 'richtig'; });
    return { fallId: FALL_ID, bewertungsstand: BEWERTUNGSSTAND, eingabeVersion: eingabeVersion(e),
      bereiche: bereiche, sperren: sperren, bestanden: ok, darfAbschliessen: ok,
      freitext: { text: n.freitext, automatischGeprueft: false } };
  }
  function lichter() {
    if (typeof require === 'function') {
      try { return require('./rathaus-lichter.js'); } catch (err) { /* Browser: globales Modul */ }
    }
    return (typeof globalThis !== 'undefined' && globalThis.RATHAUS_LICHTER) || null;
  }

  // Frageblock-Daten für die Rückmeldelichter, abgeleitet aus dem fachlich geprüften Katalog. Freitext fehlt bewusst.
  function lichtDaten(eingaben) {
    var L = lichter();
    return L ? L.ausKatalog(KATALOG, normalisiere(eingaben)) : { felder: {}, antworten: {} };
  }
  function lichtFelder() { return lichtDaten({}).felder; }
  function lichtAntworten(eingaben) { return lichtDaten(eingaben).antworten; }
  function filtereLichtStand(roh, eingaben) {
    var L = lichter();
    return L ? L.filtereStand(roh, lichtAntworten(eingaben)) : {};
  }

  function bereinigeGespeichert(roh) {
    var obj = roh;
    if (typeof roh === 'string') { try { obj = JSON.parse(roh); } catch (_) { obj = null; } }
    var e = normalisiere(obj && obj.eingaben);
    var leer = { verworfen: true, eingaben: e, letzteAuswertung: null, abgeschlossen: false, lichtStand: {} };
    if (!objekt(obj) || obj.fallId !== FALL_ID || obj.bewertungsstand !== BEWERTUNGSSTAND || ungueltigeWerte(obj.eingaben).length) return leer;
    var lichtStand = filtereLichtStand(obj.lichtStand, e);
    var a = obj.letzteAuswertung ? auswertung(e) : null;
    // Eine abweichende Gesamtauswertung verwirft nur Auswertung und Abschluss, nicht die gültigen Eingaben und Lichter.
    if (a && obj.letzteAuswertung.eingabeVersion !== a.eingabeVersion) a = null;
    return { verworfen: false, eingaben: e, letzteAuswertung: a, abgeschlossen: obj.abgeschlossen === true && !!a && a.darfAbschliessen, lichtStand: lichtStand };
  }
  function fallDaten() {
    return { titel: 'Führungszeugnis für einen privaten Arbeitgeber',
      anliegenText: 'Mein neuer privater Arbeitgeber braucht ein einfaches Führungszeugnis. Ich möchte es für mich persönlich in Papierform beantragen.',
      uebungsannahme: 'Sonnenthal ist fiktiv. Der Bürgerbüroschalter ist in diesem Fall als zuständige Meldebehörde vorgegeben; keine ungeprüfte Landes-Sonderzuständigkeit wird bewertet.',
      hinweis: 'Nur fiktive Akten. Kein echter Antrag, keine Zahlung, keine Ausstellung. Keine echten Zeugnisse oder Angaben zu Vorstrafen eingeben.' };
  }
  function hilfe(stufe) {
    return ['', 'Trenne zuerst Zweck, Art des Zeugnisses und Empfänger.',
      'Lies das Arbeitgeberschreiben und die Nachschlagekarte zu §§ 30/30a BZRG. Ein privater Arbeitgeber ist keine Behörde.',
      'Prüfe Identität und Daten, bereite den passenden Antrag vor und erkläre Normalgebühr und Zustellung. Antragstellung ist noch keine Ausstellung.'][stufe] || '';
  }
  function nachschlagen() {
    return { titel: 'Nachschlagekarte Führungszeugnis (B03)', themen: [
      { titel: 'Antrag (§ 30 BZRG)', text: 'Ab 14 Jahren auf Antrag. Im Inland persönlich oder schriftlich mit amtlich/öffentlich beglaubigter Unterschrift bei der Meldebehörde; Identität nachweisen. Keine Vertretung durch Bevollmächtigte. Das Privatzeugnis wird nur an die antragstellende Person übersandt.' },
      { titel: 'Einfach und erweitert (§ 30a BZRG)', text: 'Erweitert setzt eine gesetzliche Grundlage oder die dort genannten Tätigkeiten im Zusammenhang mit Minderjährigen voraus, außerdem eine schriftliche Aufforderung mit Bestätigung der Voraussetzungen. Die vorliegende gewöhnliche Bürotätigkeit begründet das nicht. Erweitert ist keine vollständige Registerkopie.' },
      { titel: 'Digital (§§ 30c/30d BZRG)', text: 'Elektronischer Antrag mit elektronischem Identitätsnachweis. Digitales Ergebnis auf Verlangen, außer beim Behördenzeugnis; Bereitstellung nur über das Nutzerkonto. Online beantragt heißt nicht automatisch digital ausgestellt. Hier wird der gewünschte Papierweg bearbeitet.' },
      { titel: 'Gebühr (JVKostG)', text: 'Nr. 1130: 13 Euro. Vorbemerkung 1.1.3 nennt gesetzliche Nichterhebungsfälle; § 10 ermöglicht ausnahmsweise Ermäßigung/Absehen. Beruflicher Zweck allein macht den Antrag nicht kostenlos. Hier ist keine Befreiung beantragt oder belegt.' },
      { titel: 'Zuständigkeit und Grenzen', text: 'Bundesrecht regelt Antrag und Gebühr; das BfJ erteilt. Baden-Württemberg ist der örtliche Referenzrahmen, Sonnenthals Schalter eine Übungsannahme. Keine Zusage über Inhalt oder Bearbeitungsdauer. Arbeitgeber-Datenschutz, Sonderfälle und Registerinhalte werden nicht bewertet.' }
    ], quelle: 'Geprüft 05.11.2026. Lokale Quellen: quellen/bzrg-b03-2026-11-05.md. Keine Rechtsberatung.' };
  }
  function lehrkraft() {
    return { warnung: 'Die lokale Lehrkraftansicht ist keine Zugriffssicherung.',
      sachverhalt: 'Robin Keller, geboren 08.06.1998 in Freiburg im Breisgau, Geburtsname Keller, deutsch, alleinige Wohnung Rosenweg 12, 00000 Sonnenthal. Gültiges fiktives Identitätsdokument und Antragsdaten stimmen überein. Sonnental Büroservice GmbH verlangt für kaufmännische Sachbearbeitung ohne Minderjährigenbetreuung ein einfaches Privatführungszeugnis. Eigenantrag, persönlich, Papierfassung, keine Befreiung beantragt.',
      musterantwort: 'Für Ihr Anliegen passt das einfache Führungszeugnis für private Zwecke. Nach dem Identitäts- und Datenabgleich bereiten wir den Antrag vor. Die Gebühr beträgt im vorgegebenen Normalfall 13 Euro. Das BfJ erteilt das Zeugnis; die Papierfassung geht an Sie. Eine digitale Alternative ist elektronisch nach §§ 30c/30d BZRG möglich. Wir garantieren weder Inhalt noch Fertigstellungsdatum. Hier wird nur geübt.',
      loesungen: Object.keys(KATALOG).map(function (f) {
        var k = KATALOG[f];
        return { feld: k.frage, richtig: k.optionen.filter(function (o) { return o.richtig || o.erwartet; }).map(function (o) { return o.text + (o.erwartet ? ': liegt vor und stimmt' : ''); }).join('; ') };
      }),
      kriterien: ['Alle fünf Bereiche richtig, keine falschen Zusatzoptionen oder Widersprüche.', 'Jede Pflicht ist sichtbar; digitaler Antwortbaustein ist optional.', 'Freitext wird nie automatisch fachlich bewertet. Jede Änderung entwertet Auswertung und Abschluss.', 'Keine Aussage über den tatsächlichen Registerinhalt und keine echte Ausstellung.'],
      quellen: nachschlagen() };
  }
  return { FALL_ID: FALL_ID, SPEICHER_SCHLUESSEL: SPEICHER_SCHLUESSEL, BEWERTUNGSSTAND: BEWERTUNGSSTAND,
    BEREICHE: kopie(BEREICHE), katalog: function () { return kopie(KATALOG); }, normalisiere: normalisiere,
    eingabeVersion: eingabeVersion, auswertung: auswertung, bereinigeGespeichert: bereinigeGespeichert,
    lichtFelder: lichtFelder, lichtAntworten: lichtAntworten,
    fallDaten: fallDaten, hilfe: hilfe, nachschlagen: nachschlagen, lehrkraft: lehrkraft,
    resetText: function () { return 'Nur B03 mit Robin Keller zurücksetzen? B01, B02, Luca, Noelle und Anzeige bleiben unverändert.'; } };
}));
