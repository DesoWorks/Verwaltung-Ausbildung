/* Bürgerbüro B04: reine Falllogik. Keine echten Anträge, Registerzugriffe oder Eintragungen.
 * Fachvertrag: docs/rathaus-expansion-b04-plan-2026-11-05.md.
 * Bundesrecht: § 51 BMG, gelesen am 05.11.2026 (https://www.gesetze-im-internet.de/bmg/__51.html).
 * Der Schalter „Bürgerbüro Sonnenthal“ ist eine Übungsannahme. Keine Landes-Sonderzuständigkeit wird bewertet.
 */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.RATHAUS_B04 = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  var FALL_ID = 'b04';
  var SPEICHER_SCHLUESSEL = 'verwaltung-ausbildung.rathaus.buergerbuero.b04.v1';
  var BEWERTUNGSSTAND = 'b04-2026-11-05-r1';
  function opt(id, text, richtig) { return { id: id, text: text, richtig: !!richtig }; }
  function einzel(frage, optionen) { return { art: 'einzel', frage: frage, optionen: optionen }; }
  var KATALOG = {
    anliegen: einzel('Welches Anliegen hat Mira Hoffmann?', [
      opt('anl-eigene-sperre', 'Auskunftssperre für die eigene Person im Melderegister', true),
      opt('anl-anmeldung', 'Anmeldung einer neuen Wohnung'),
      opt('anl-bescheinigung', 'Meldebescheinigung für die eigene Person'),
      opt('anl-zeugnis', 'Führungszeugnis für einen Arbeitgeber')
    ]),
    daten: { art: 'status', frage: 'Vergleiche Antragsangaben, Identitätsdokument und Akte.',
      status: [{ id: 'vorhanden-stimmt', text: 'liegt vor und stimmt' }, { id: 'fehlt', text: 'fehlt' }, { id: 'widerspruch', text: 'widerspricht den Unterlagen' }],
      optionen: [
        { id: 'name', text: 'Name und Vorname', erwartet: 'vorhanden-stimmt' },
        { id: 'geburt', text: 'Geburtsdatum', erwartet: 'vorhanden-stimmt' },
        { id: 'anschrift', text: 'Anschrift Lindenstraße 4', erwartet: 'vorhanden-stimmt' },
        { id: 'notiz', text: 'Fiktive polizeiliche Notiz über Bedrohung und Nachstellung', erwartet: 'vorhanden-stimmt' }
      ] },
    identitaet: einzel('Wie ist der Identitätsabgleich zu bewerten?', [
      opt('id-nachgewiesen', 'Gültiges Übungsdokument und Antragsangaben stimmen überein; Identität nachgewiesen', true),
      opt('id-unnoetig', 'Bei Gefahr ist keine Identitätsprüfung nötig'),
      opt('id-telefon', 'Eine telefonische Zusage der Person genügt')
    ]),
    tatsachen: einzel('Rechtfertigen die vorgelegten Angaben die Annahme einer Gefahr?', [
      opt('tat-ja', 'Ja: Die Notiz über Bedrohung und Nachstellung enthält Tatsachen, die die Annahme einer Gefahr durch eine Auskunft rechtfertigen', true),
      opt('tat-unbehagen', 'Ein bloßes Unbehagen ohne Tatsachen würde immer genügen'),
      opt('tat-nein', 'Nein: Privatsphäre allein ist kein Grund, die Notiz ist unerheblich')
    ]),
    grundlage: einzel('Welche Rechtsgrundlage trägt die Auskunftssperre?', [
      opt('gr-bmg51-1', '§ 51 Abs. 1 BMG (Bundesrecht)', true),
      opt('gr-bzrg30', '§ 30 BZRG (Führungszeugnis)'),
      opt('gr-satzung', 'Eine Gebührensatzung der Stadt Sonnenthal'),
      opt('gr-kulanz', 'Keine Grundlage, reine Kulanz des Schalters')
    ]),
    gebuehr: einzel('Welche Gebühr fällt für die Eintragung an?', [
      opt('geb-unentgeltlich', 'Unentgeltlich; es gibt keinen kommunalen Betrag', true),
      opt('geb-wie-bescheinigung', 'Gebühr wie bei einer Meldebescheinigung'),
      opt('geb-pauschale', 'Eine Sonnenthaler Pauschale für Schutzmaßnahmen')
    ]),
    dauer: einzel('Wie lange gilt die Sperre?', [
      opt('dauer-zwei-jahre', 'Befristet auf zwei Jahre; Verlängerung auf Antrag oder von Amts wegen möglich', true),
      opt('dauer-unbefristet', 'Unbefristet, bis die Person widerruft'),
      opt('dauer-ein-jahr', 'Ein Jahr, nicht verlängerbar')
    ]),
    wirkung: einzel('Was bewirkt die Sperre in dieser Übung?', [
      opt('wirk-einfache-auskunft', 'Eine einfache Melderegisterauskunft an Dritte unterbleibt, wenn die Gefahr nicht ausgeschlossen werden kann; andere Behördenübermittlungen werden hier nicht bewertet', true),
      opt('wirk-keine-behoerde', 'Keine Behörde darf die Daten mehr erhalten'),
      opt('wirk-nur-hinweis', 'Es wird nur ein Vermerk angelegt, die Auskunft bleibt möglich')
    ]),
    entscheidung: einzel('Wie lautet die sachgerechte Entscheidung?', [
      opt('ent-sperre-vorbereiten', 'Auskunftssperre vorbereiten und Eintragung veranlassen', true),
      opt('ent-ablehnen', 'Antrag pauschal ablehnen, weil die Anschrift bekannt ist'),
      opt('ent-ohne-tatsachen', 'Sperre ohne Prüfung der Tatsachen gewähren')
    ]),
    naechster: einzel('Was ist die nächste sachgerechte Handlung?', [
      opt('nae-vorbereiten', 'Eintragung vorbereiten, nicht als im echten Register erledigt buchen', true),
      opt('nae-eingetragen', 'Die Sperre als bereits im echten Register eingetragen melden'),
      opt('nae-gebuehr', 'Zuerst eine Gebühr kassieren')
    ]),
    dritte: einzel('Wie wird die Anfrage der dritten Person (Jonas Brandt) beantwortet?', [
      opt('dri-neutral', 'Neutrale Mitteilung: Die gewünschte Auskunft kann nicht erteilt werden; keine Anschrift, kein Hinweis auf eine Sperre', true),
      opt('dri-anschrift', 'Die Anschrift mitteilen, weil die Person gemeldet ist'),
      opt('dri-sperre', 'Mitteilen, dass für Mira Hoffmann eine Auskunftssperre besteht'),
      opt('dri-nicht-gemeldet', 'Mitteilen, dass keine Person dieses Namens gemeldet ist')
    ]),
    bausteine: { art: 'mehrfach', frage: 'Welche Bausteine gehören in die Antwort an Mira Hoffmann?', optionen: [
      opt('bau-sperre', 'Für Ihr Anliegen bereiten wir eine Auskunftssperre nach § 51 Abs. 1 BMG vor.', true),
      opt('bau-unentgeltlich', 'Die Auskunftssperre ist unentgeltlich.', true),
      opt('bau-zwei-jahre', 'Die Sperre wird auf zwei Jahre befristet und kann verlängert werden.', true),
      opt('bau-neutral', 'Anfragenden Personen teilen wir neutral mit, dass keine Auskunft erteilt wird; Ihre Anschrift und die Sperre nennen wir nicht.', true),
      opt('bau-grenze', 'Wie die Sperre bei anderen Datenübermittlungen an Behörden wirkt, wird hier nicht zugesagt.', true),
      opt('bau-uebung', 'Hier wird nur geübt: keine echte Eintragung im Melderegister.', true),
      opt('bau-bereits', 'Ihre Sperre ist im Melderegister bereits eingetragen.'),
      opt('bau-gebuehr', 'Für die Eintragung berechnen wir eine Gebühr.'),
      opt('bau-keine-behoerde', 'Keine Behörde erhält Ihre Daten mehr.'),
      opt('bau-unbefristet', 'Die Sperre gilt unbefristet.')
    ] }
  };
  var BEREICHE = [
    { key: 'anliegen', name: 'Anliegen', felder: ['anliegen'] },
    { key: 'unterlagen', name: 'Unterlagen', felder: ['daten', 'identitaet', 'tatsachen'] },
    { key: 'einordnung', name: 'Einordnung', felder: ['grundlage', 'gebuehr', 'dauer', 'wirkung'] },
    { key: 'entscheidung', name: 'Entscheidung', felder: ['entscheidung', 'naechster'] },
    { key: 'antwort', name: 'Antwort', felder: ['dritte', 'bausteine'] }
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
      falsch: kat.optionen.some(function (o) { return !o.richtig && w.indexOf(o.id) >= 0; })
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
    return { titel: 'Auskunftssperre im Melderegister',
      anliegenText: 'Mein früherer Partner hat mich bedroht und versucht, meine Anschrift über eine private Melderegisterauskunft zu bekommen. Ich möchte, dass meine Daten gesperrt werden.',
      uebungsannahme: 'Sonnenthal ist fiktiv. Der Bürgerbüroschalter ist in diesem Fall als zuständige Meldebehörde vorgegeben; keine ungeprüfte Landes-Sonderzuständigkeit wird bewertet. Die Sonnenthaler Gebührenlage ist nicht erfunden: Die Sperre ist unentgeltlich.',
      hinweis: 'Nur fiktive Akten. Keine echte Eintragung im Melderegister. Keine echten Bedrohungen, Anzeigen oder Anschriften eingeben.' };
  }
  function hilfe(stufe) {
    return ['', 'Trenne zuerst Anliegen, Gefahr durch eine Auskunft und die Frage, wer was erfahren darf.',
      'Lies die Nachschlagekarte zu § 51 Abs. 1, 2 und 4 BMG. Es geht nur um die einfache Melderegisterauskunft an Dritte.',
      'Prüfe Identität und Tatsachen, bereite die Sperre unentgeltlich auf zwei Jahre vor und beantworte die dritte Person neutral. Vorbereiten ist noch keine Eintragung.'][stufe] || '';
  }
  function nachschlagen() {
    return { titel: 'Nachschlagekarte Auskunftssperre (B04)', themen: [
      { titel: 'Voraussetzung (§ 51 Abs. 1 BMG)', text: 'Liegen Tatsachen vor, die die Annahme rechtfertigen, dass der betroffenen oder einer anderen Person durch eine Melderegisterauskunft Gefahr für Leben, Gesundheit, persönliche Freiheit oder ähnliche schutzwürdige Interessen erwachsen kann, trägt die Meldebehörde auf Antrag oder von Amts wegen unentgeltlich eine Auskunftssperre ein. Ähnliche Interessen sind insbesondere der Schutz vor Bedrohungen, Beleidigungen und unbefugten Nachstellungen. Bloßes Unbehagen ohne Tatsachen genügt nicht.' },
      { titel: 'Wirkung (§ 51 Abs. 2 BMG)', text: 'Kann die Gefahr nach Anhörung nicht ausgeschlossen werden, ist eine Melderegisterauskunft nicht zulässig. Die ersuchende Stelle erhält eine Mitteilung, die nicht verraten darf, ob keine Daten vorhanden sind oder eine Sperre besteht. Keine Anschrift, kein Hinweis auf die Sperre.' },
      { titel: 'Dauer (§ 51 Abs. 4 BMG)', text: 'Die Sperre wird auf zwei Jahre befristet und kann auf Antrag oder von Amts wegen verlängert werden. Vor einer Aufhebung ist die betroffene Person zu unterrichten, soweit sie erreichbar ist.' },
      { titel: 'Kosten', text: 'Die Eintragung ist nach § 51 Abs. 1 BMG unentgeltlich. Sonnenthal hat in dieser Übung keine Gebührensatzung dafür; ein kommunaler Betrag wird nicht erfunden.' },
      { titel: 'Zuständigkeit und Grenzen', text: 'Bundesrecht regelt die Sperre; der Schalter „Bürgerbüro Sonnenthal“ ist eine Übungsannahme. Ob die Sperre Datenübermittlungen an Behörden nach anderen Vorschriften des BMG stoppt, wird hier nicht bewertet und nicht zugesagt. Eine Eintragung im echten Register findet in der Übung nicht statt.' }
    ], quelle: 'Geprüft 05.11.2026 unter https://www.gesetze-im-internet.de/bmg/__51.html. Plan: docs/rathaus-expansion-b04-plan-2026-11-05.md. Keine Rechtsberatung.' };
  }
  function lehrkraft() {
    return { warnung: 'Die lokale Lehrkraftansicht ist keine Zugriffssicherung.',
      sachverhalt: 'Mira Hoffmann, 34, alleinige Wohnung Lindenstraße 4, 00000 Sonnenthal, ist bereits gemeldet. Sie beantragt am Schalter eine Auskunftssperre, weil ein früherer Partner sie bedroht und versucht hat, ihre Anschrift über eine private Melderegisterauskunft zu erhalten. In der fiktiven Akte liegt eine polizeiliche Notiz über Bedrohung und Nachstellung. Identität und Anschrift stimmen mit dem Übungsdokument überein. Die fiktive Privatperson Jonas Brandt hat eine Melderegisterauskunft zu Mira Hoffmann angefragt.',
      musterantwort: 'Für Ihr Anliegen bereiten wir eine Auskunftssperre nach § 51 Abs. 1 BMG vor. Die Sperre ist unentgeltlich und wird auf zwei Jahre befristet; sie kann verlängert werden. Anfragenden Personen teilen wir neutral mit, dass keine Auskunft erteilt wird, ohne Ihre Anschrift und ohne Hinweis auf die Sperre. Wie die Sperre bei anderen Datenübermittlungen an Behörden wirkt, sagen wir hier nicht zu. Hier wird nur geübt: keine echte Eintragung im Melderegister.',
      loesungen: Object.keys(KATALOG).map(function (f) {
        var k = KATALOG[f];
        return { feld: k.frage, richtig: k.optionen.filter(function (o) { return o.richtig || o.erwartet; }).map(function (o) { return o.text + (o.erwartet ? ': liegt vor und stimmt' : ''); }).join('; ') };
      }),
      kriterien: ['Alle fünf Bereiche richtig, keine falschen Zusatzoptionen oder Widersprüche.', 'Die Sperre wird vorbereitet, nicht als bereits im echten Register eingetragen ausgegeben.', 'Die dritte Person erhält weder Anschrift noch Hinweis auf die Sperre.', 'Keine Aussage, andere Behörden dürften die Daten nicht erhalten.', 'Freitext wird nie automatisch fachlich bewertet. Jede Änderung entwertet Auswertung und Abschluss.'],
      quellen: nachschlagen() };
  }
  return { FALL_ID: FALL_ID, SPEICHER_SCHLUESSEL: SPEICHER_SCHLUESSEL, BEWERTUNGSSTAND: BEWERTUNGSSTAND,
    BEREICHE: kopie(BEREICHE), katalog: function () { return kopie(KATALOG); }, normalisiere: normalisiere,
    eingabeVersion: eingabeVersion, auswertung: auswertung, bereinigeGespeichert: bereinigeGespeichert,
    lichtFelder: lichtFelder, lichtAntworten: lichtAntworten,
    fallDaten: fallDaten, hilfe: hilfe, nachschlagen: nachschlagen, lehrkraft: lehrkraft,
    resetText: function () { return 'Nur B04 mit Mira Hoffmann zurücksetzen? B01, B02, B03, Luca, Noelle und Anzeige bleiben unverändert.'; } };
}));
