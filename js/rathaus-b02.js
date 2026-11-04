/* Rathaus – Bürgerbüro, Fall B02: Meldebescheinigung für die eigene Person. Kern und Bewertung.
 * Reine Funktionen: kein DOM, kein Browser-Speicher, kein Netzzugriff.
 * Fachliche Grundlage: docs/rathaus-foundation-b02-plan-2026-11-04.md und
 * docs/rathaus-double-shift-fachfreigabe-2026-11-04.md. Lokale Quellenkarte: quellen/bmg-b02-2026-11-04.md.
 * Eigener Speicher, eigener Bewertungsstand. Es entsteht nie eine echte Bescheinigung.
 */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  root.RATHAUS_B02 = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var FALL_ID = 'b02';
  var SPEICHER_SCHLUESSEL = 'verwaltung-ausbildung.rathaus.buergerbuero.b02.v1';
  var BEWERTUNGSSTAND = 'b02-2026-11-04-r1';
  var QUELLEN_DATEI = 'quellen/bmg-b02-2026-11-04.md';
  var UEBUNGSANNAHME = 'Das Bürgerbüro Sonnenthal ist in dieser Übung der zuständige Schalter für Meldebescheinigungen. ' +
    'Das ist eine Übungsannahme und keine geprüfte Landesnorm.';
  var FREITEXT_MAX = 2000;

  function opt(id, text, richtig) {
    return { id: id, text: text, richtig: !!richtig };
  }

  var STATUS = [
    { id: 'vorhanden-stimmt', text: 'liegt vor und stimmt' },
    { id: 'fehlt', text: 'fehlt' },
    { id: 'widerspruch', text: 'liegt vor, widerspricht aber den Unterlagen' }
  ];

  var KATALOG = {
    anliegen: {
      art: 'einzel',
      frage: 'Worum geht es bei dem Anliegen?',
      optionen: [
        opt('eigene-meldebescheinigung', 'Eine Meldebescheinigung für die eigene Person', true),
        opt('anmeldung', 'Eine neue Anmeldung nach einem Umzug', false),
        opt('auskunft-dritte', 'Eine Auskunft über eine andere Person', false),
        opt('wohnungsgeberbestaetigung', 'Eine Bestätigung des Wohnungsgebers', false)
      ]
    },
    angaben: {
      art: 'status',
      frage: 'Wie ist der Stand der vier Antragsangaben im Vergleich mit Ausweis und Übungsregisterauszug?',
      status: STATUS,
      optionen: [
        { id: 'familienname', text: 'Familienname', erwartet: 'vorhanden-stimmt' },
        { id: 'vorname', text: 'Vorname', erwartet: 'vorhanden-stimmt' },
        { id: 'geburtsdatum', text: 'Geburtsdatum', erwartet: 'vorhanden-stimmt' },
        { id: 'anschrift', text: 'Derzeitige alleinige Anschrift', erwartet: 'vorhanden-stimmt' }
      ]
    },
    identitaet: {
      art: 'einzel',
      frage: 'Wie gehst du mit der Identitätsprüfung um?',
      optionen: [
        opt('abgleich-passt', 'Ausweis, Antrag und Übungsregister abgleichen; sie passen zusammen', true),
        opt('nicht-pruefen', 'Nicht prüfen, die Person ist ja persönlich da', false),
        opt('trotz-abweichung-ausgeben', 'Auch bei einer Abweichung ausgeben', false),
        opt('wohnungsgeber-neu-verlangen', 'Zuerst eine neue Wohnungsgeberbestätigung verlangen', false)
      ]
    },
    umfang: {
      art: 'einzel',
      frage: 'Welchen Umfang hat die einfache Meldebescheinigung?',
      optionen: [
        opt('einfach-abs1', 'Nur die Daten nach § 18 Abs. 1 BMG, die im Register stehen', true),
        opt('alle-zusatzdaten', 'Alle möglichen Zusatzdaten aus dem Register', false),
        opt('alle-haushaltsmitglieder', 'Auch die Daten aller Personen im Haushalt', false),
        opt('nur-name', 'Nur den Namen, ohne Anschrift', false)
      ]
    },
    regeln: {
      art: 'mehrfach',
      frage: 'Welche Regeln gehören zum Fall?',
      optionen: [
        opt('antrag-eigene-person', 'Die betroffene Person beantragt die Bescheinigung über sich selbst', true),
        opt('bmg18', 'Rechtsgrundlage ist § 18 BMG (Bundesrecht)', true),
        opt('umfang-nach-antrag', 'Zusätzliche Daten gibt es nur, wenn sie beantragt werden', true),
        opt('schriftliche-gebuehr-pruefen', 'Eine Gebühr für die schriftliche Bescheinigung richtet sich nach der örtlichen Regelung und wird geprüft, ohne einen Betrag zu nennen', true),
        opt('elektronisch-kostet-immer', 'Auch die elektronische Bescheinigung kostet immer eine Gebühr', false)
      ]
    },
    aussagen: {
      art: 'einzel',
      frage: 'Welche dieser Aussagen trifft im Fall von Alex Weber zu?',
      optionen: [
        opt('neue-anmeldung-noetig', 'Alex Weber muss sich zuerst neu anmelden', false),
        opt('wohnungsgeberbestaetigung-immer', 'Für jede Meldebescheinigung ist eine Wohnungsgeberbestätigung nötig', false),
        opt('schriftlich-immer-kostenlos', 'Die schriftliche Bescheinigung ist immer kostenlos', false),
        opt('keine', 'Keine dieser Aussagen trifft zu.', true)
      ]
    },
    vorbereitung: {
      art: 'einzel',
      frage: 'Wie wird die weitere Bearbeitung vorbereitet?',
      optionen: [
        opt('ausstellung-vorbereiten', 'Eine Übungsbescheinigung mit den passenden Registerdaten vorbereiten und die örtliche Gebührenregel prüfen', true),
        opt('schon-ausgehaendigt', 'Die Bescheinigung als bereits ausgehändigt eintragen', false),
        opt('anmeldung-erledigt', 'Eine Anmeldung als erledigt eintragen', false),
        opt('ohne-abgleich-ausgeben', 'Die Bescheinigung ohne Datenabgleich ausgeben', false)
      ]
    },
    bausteine: {
      art: 'mehrfach',
      frage: 'Welche Bausteine gehören in die Antwort an Alex Weber?',
      optionen: [
        { id: 'anliegen', text: 'Ich habe verstanden: Sie brauchen für sich einen Nachweis, dass Sie in Sonnenthal gemeldet sind.', erforderlich: true },
        { id: 'vorbereitung', text: 'Nach dem Abgleich Ihrer Daten bereiten wir eine einfache schriftliche Bescheinigung vor.', erforderlich: true },
        { id: 'nur-umfang', text: 'Die Bescheinigung enthält nur die Angaben, die Sie beantragt haben.', erforderlich: true },
        { id: 'gebuehr-pruefen', text: 'Ob und in welcher Höhe für die schriftliche Bescheinigung eine Gebühr anfällt, prüfen wir anhand der örtlichen Regelung.', erforderlich: true },
        { id: 'uebung', text: 'Das ist eine Übung. Es wurde noch keine echte Bescheinigung ausgegeben.', erforderlich: true },
        { id: 'gebuehr-fest', text: 'Die Bescheinigung kostet immer eine feste Gebühr.', verboten: true },
        { id: 'anmeldung-abgeschlossen', text: 'Ihre Anmeldung ist damit abgeschlossen.', verboten: true },
        { id: 'zusatzdaten', text: 'Wir nehmen vorsichtshalber alle Zusatzdaten mit auf.', verboten: true },
        { id: 'bereits-ausgegeben', text: 'Ihre Bescheinigung haben wir Ihnen bereits ausgehändigt.', verboten: true },
        { id: 'sofort-zusage', text: 'Sie erhalten die Bescheinigung garantiert sofort.', verboten: true }
      ]
    }
  };

  // Jedes Feld gehört genau einem Bereich.
  var BEREICH_FELDER = {
    anliegen: ['anliegen'],
    unterlagen: ['angaben', 'identitaet'],
    regeln: ['umfang', 'regeln', 'aussagen'],
    vorbereitung: ['vorbereitung'],
    antwort: ['bausteine']
  };
  var BEREICH_NR = { anliegen: 1, unterlagen: 2, regeln: 3, vorbereitung: 4, antwort: 5 };
  var BEREICH_NAME = { anliegen: 'Anliegen', unterlagen: 'Unterlagen', regeln: 'Regeln', vorbereitung: 'Vorbereitung', antwort: 'Antwort' };

  // Widerspruchssperren: (Feld, Wert) -> Text. Sie gelten unabhängig von weiteren richtigen Antworten.
  var SPERREN = [
    { feld: 'anliegen', wert: 'auskunft-dritte', text: 'Eine Auskunft über Dritte wurde als Anliegen gewählt, obwohl es um die eigene Person geht.' },
    { feld: 'umfang', wert: 'alle-haushaltsmitglieder', text: 'Es wurden Daten Dritter in den Umfang aufgenommen.' },
    { feld: 'umfang', wert: 'alle-zusatzdaten', text: 'Es wurden ungefragt Zusatzdaten in den Umfang aufgenommen.' },
    { feld: 'bausteine', wert: 'zusatzdaten', text: 'Die Antwort kündigt ungefragt Zusatzdaten an.' },
    { feld: 'vorbereitung', wert: 'schon-ausgehaendigt', text: 'Die Vorbereitung wurde als bereits erfolgte Aushändigung behandelt.' },
    { feld: 'bausteine', wert: 'bereits-ausgegeben', text: 'Die Antwort behauptet, die Bescheinigung sei schon ausgegeben.' },
    { feld: 'identitaet', wert: 'trotz-abweichung-ausgeben', text: 'Eine Ausgabe trotz abweichender Daten wurde als richtig gewählt.' },
    { feld: 'vorbereitung', wert: 'ohne-abgleich-ausgeben', text: 'Die Ausgabe ohne Datenabgleich wurde als richtig gewählt.' },
    { feld: 'aussagen', wert: 'schriftlich-immer-kostenlos', text: 'Es wurde eine feste Gebührenaussage gewählt (immer kostenlos).' },
    { feld: 'regeln', wert: 'elektronisch-kostet-immer', text: 'Es wurde eine feste Gebührenaussage gewählt (elektronisch immer gebührenpflichtig).' },
    { feld: 'bausteine', wert: 'gebuehr-fest', text: 'Die Antwort nennt eine feste Gebühr, die nicht belegt ist.' },
    { feld: 'bausteine', wert: 'anmeldung-abgeschlossen', text: 'Die Antwort spricht von einer Anmeldung, die es in diesem Fall nicht gibt.' }
  ];

  function kopie(x) { return JSON.parse(JSON.stringify(x)); }
  function katalog() { return kopie(KATALOG); }
  function istText(x) { return typeof x === 'string'; }
  function istObjekt(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
  function ids(feld) { return KATALOG[feld].optionen.map(function (o) { return o.id; }); }
  function statusIds() { return STATUS.map(function (s) { return s.id; }); }
  function feldNamen() { return Object.keys(KATALOG); }

  function fallDaten() {
    return {
      fallId: FALL_ID,
      titel: 'Ein Nachweis über die eigene Meldung',
      bewertungsstand: BEWERTUNGSSTAND,
      person: { name: 'Alex Weber', geburtsdatum: '14.02.1997', anschrift: 'Lindenweg 8, 00000 Sonnenthal', fiktiv: true },
      vorsprache: '18.11.2026',
      anliegenText: 'Ich brauche für mich einen Nachweis, dass ich hier gemeldet bin. Eine einfache schriftliche Meldebescheinigung reicht.',
      uebungsannahme: UEBUNGSANNAHME,
      hinweis: 'Es wird keine echte Bescheinigung ausgestellt. Alle Personen, Dokumente und die Postleitzahl 00000 sind erfunden.',
      quelle: QUELLEN_DATEI
    };
  }

  function normalisiere(eingabe) {
    var e = istObjekt(eingabe) ? eingabe : {};
    var out = {};
    feldNamen().forEach(function (feld) {
      var art = KATALOG[feld].art;
      if (art === 'einzel') {
        out[feld] = istText(e[feld]) && ids(feld).indexOf(e[feld]) >= 0 ? e[feld] : null;
      } else if (art === 'mehrfach') {
        var liste = Array.isArray(e[feld]) ? e[feld] : [];
        out[feld] = [];
        liste.forEach(function (v) {
          if (istText(v) && ids(feld).indexOf(v) >= 0 && out[feld].indexOf(v) < 0) out[feld].push(v);
        });
      } else {
        out[feld] = {};
        var roh = istObjekt(e[feld]) ? e[feld] : {};
        ids(feld).forEach(function (id) {
          if (istText(roh[id]) && statusIds().indexOf(roh[id]) >= 0) out[feld][id] = roh[id];
        });
      }
    });
    out.freitext = istText(e.freitext) ? e.freitext.slice(0, FREITEXT_MAX) : '';
    return out;
  }

  function eingabeVersion(eingabe) {
    var n = normalisiere(eingabe);
    var teile = feldNamen().map(function (feld) {
      var art = KATALOG[feld].art;
      if (art === 'einzel') return feld + '=' + (n[feld] || '-');
      if (art === 'mehrfach') return feld + '=' + n[feld].slice().sort().join(',');
      return feld + '=' + ids(feld).map(function (id) { return id + ':' + (n[feld][id] || '-'); }).join(',');
    });
    teile.push('freitext=' + n.freitext);
    return teile.join('|');
  }

  /* Meldet Felder mit unbekannten Werten in der ROHEN Eingabe (vor der Normalisierung). */
  function ungueltigeWerte(eingabe) {
    var e = istObjekt(eingabe) ? eingabe : {};
    var liste = [];
    feldNamen().forEach(function (feld) {
      var art = KATALOG[feld].art;
      var w = e[feld];
      if (w === undefined || w === null) return;
      if (art === 'einzel') {
        if (w !== '' && !(istText(w) && ids(feld).indexOf(w) >= 0)) liste.push(feld);
      } else if (art === 'mehrfach') {
        if (!Array.isArray(w)) { liste.push(feld); return; }
        if (w.some(function (v) { return !(istText(v) && ids(feld).indexOf(v) >= 0); })) liste.push(feld);
      } else if (!istObjekt(w)) {
        liste.push(feld);
      } else if (Object.keys(w).some(function (k) { return ids(feld).indexOf(k) < 0 || statusIds().indexOf(w[k]) < 0; })) {
        liste.push(feld);
      }
    });
    return liste;
  }

  function bereichErgebnis(status, hinweise, sperren) {
    return { status: status, hinweise: hinweise || [], sperren: sperren || [] };
  }

  /* Pro Feld: { gegeben, vollstaendig, falsch }. Alles aus dem Katalog, ohne Rückgabe der Lösung. */
  function feldZustand(feld, n) {
    var kat = KATALOG[feld];
    if (kat.art === 'einzel') {
      var w = n[feld];
      var o = kat.optionen.filter(function (x) { return x.id === w; })[0];
      return { gegeben: !!w, vollstaendig: !!w, falsch: !!o && !o.richtig };
    }
    if (kat.art === 'status') {
      var gegeben = kat.optionen.filter(function (d) { return n[feld][d.id]; }).length;
      return {
        gegeben: gegeben > 0,
        vollstaendig: gegeben === kat.optionen.length,
        falsch: kat.optionen.some(function (d) { return n[feld][d.id] && n[feld][d.id] !== d.erwartet; }),
        // Abweichend von der Mehrheitslogik: ein falscher Status ist erst falsch, wenn alle Zeilen beantwortet sind.
        nurVollstaendigFalsch: true
      };
    }
    var gew = n[feld];
    var soll = kat.optionen.filter(function (x) { return x.richtig || x.erforderlich; }).map(function (x) { return x.id; });
    var verboten = kat.optionen.filter(function (x) { return !(x.richtig || x.erforderlich); }).map(function (x) { return x.id; });
    return {
      gegeben: gew.length > 0,
      vollstaendig: soll.every(function (id) { return gew.indexOf(id) >= 0; }),
      falsch: gew.some(function (id) { return verboten.indexOf(id) >= 0; })
    };
  }

  function pruefeBereich(key, n, ungueltig) {
    var felder = BEREICH_FELDER[key];
    var abschnitt = BEREICH_NR[key] + ' (' + BEREICH_NAME[key] + ')';
    if (felder.some(function (f) { return ungueltig.indexOf(f) >= 0; })) {
      return bereichErgebnis('ungueltig', ['Mindestens eine Angabe im Abschnitt ' + abschnitt + ' ist ungültig.']);
    }
    var zustaende = felder.map(function (f) { return feldZustand(f, n); });
    var sperren = SPERREN.filter(function (s) {
      if (felder.indexOf(s.feld) < 0) return false;
      var w = n[s.feld];
      return Array.isArray(w) ? w.indexOf(s.wert) >= 0 : w === s.wert;
    }).map(function (s) { return s.text; });

    if (!zustaende.some(function (z) { return z.gegeben; })) {
      return bereichErgebnis('offen', ['Im Abschnitt ' + abschnitt + ' ist noch nichts ausgewählt.']);
    }
    var fehlt = zustaende.some(function (z) { return !z.vollstaendig; });
    var falschGewaehlt = zustaende.some(function (z) { return z.falsch && !z.nurVollstaendigFalsch; }) ||
      (zustaende.every(function (z) { return z.vollstaendig; }) && zustaende.some(function (z) { return z.falsch; }));
    var hinweise = [];
    if (fehlt) {
      hinweise.push('Im Abschnitt ' + abschnitt + ' fehlen noch Angaben. Keine Auswahl gilt nicht als Antwort.');
      if (falschGewaehlt) hinweise.push('Außerdem stimmt im Abschnitt ' + abschnitt + ' mindestens eine bereits gewählte Antwort nicht.');
      return bereichErgebnis('unvollstaendig', hinweise, sperren);
    }
    if (falschGewaehlt) {
      hinweise.push('Im Abschnitt ' + abschnitt + ' ist alles beantwortet, aber mindestens eine Einordnung stimmt noch nicht. Prüfe diesen Abschnitt erneut.');
      return bereichErgebnis('falsch', hinweise, sperren);
    }
    return bereichErgebnis('richtig', ['Der Abschnitt ' + abschnitt + ' ist richtig bearbeitet.']);
  }

  function auswertung(eingabe) {
    var ungueltig = ungueltigeWerte(eingabe);
    var n = normalisiere(eingabe);
    var bereiche = {};
    var sperren = [];
    var bestanden = true;
    Object.keys(BEREICH_FELDER).forEach(function (key) {
      bereiche[key] = pruefeBereich(key, n, ungueltig);
      sperren = sperren.concat(bereiche[key].sperren);
      if (bereiche[key].status !== 'richtig') bestanden = false;
    });
    return {
      fallId: FALL_ID,
      bewertungsstand: BEWERTUNGSSTAND,
      eingabeVersion: eingabeVersion(eingabe),
      bereiche: bereiche,
      sperren: sperren,
      bestanden: bestanden,
      darfAbschliessen: bestanden && sperren.length === 0 && ungueltig.length === 0,
      // Der Freitext wird nie fachlich bewertet.
      freitext: { text: n.freitext, automatischGeprueft: false }
    };
  }

  function hilfe(stufe) {
    if (stufe === 1) {
      return 'Geht es um einen neuen Einzug oder um einen Nachweis über bereits gespeicherte Daten? Suche zuerst das Anliegen.';
    }
    if (stufe === 2) {
      return 'Vergleiche die Antragsdaten mit den Übungsunterlagen. Lies § 18 Abs. 1 BMG und unterscheide schriftliche von elektronischer Erteilung bei den Gebühren.';
    }
    if (stufe === 3) {
      return 'Bearbeitungsgerüst: Anliegen bestätigen, Daten und Identität abgleichen, den passenden Umfang vorbereiten, ungeklärte Gebühren benennen und nichts als bereits ausgegeben behaupten.';
    }
    return '';
  }

  function lehrkraft() {
    return {
      warnung: 'Diese lokale Lehrkraftansicht ist keine Zugriffssicherung.',
      sachverhalt: 'Alex Weber (fiktiv, geboren 14.02.1997), alleinige Wohnung Lindenweg 8, 00000 Sonnenthal, beantragt am ' +
        '18.11.2026 persönlich eine einfache schriftliche Meldebescheinigung für sich. Ausweis und Übungsregisterauszug ' +
        'stimmen überein. Kein Doktorgrad im Übungsregister, keine Vertretung, keine weiteren Personen, keine Sonder- oder ' +
        'Sperrkonstellation, keine Zusatzdaten nach § 18 Abs. 2 BMG. Das Dokument ist nur Lernmaterial.',
      lernziele: [
        'Das Anliegen von einer Anmeldung und von einer Auskunft über Dritte unterscheiden.',
        'Benötigte Angaben und die Identitätsklärung zuordnen.',
        'Umfang und Rechtsgrundlage (§ 18 BMG) erkennen.',
        'Eine ehrliche nächste Handlung formulieren, ohne erfundene Gebühren oder Zusagen.'
      ],
      typischeFehler: [
        'Das Anliegen mit der Anmeldung (§ 17 und § 23 BMG) verwechseln.',
        'Eine Wohnungsgeberbestätigung verlangen, obwohl keine Anmeldung ansteht.',
        'Zusatzdaten oder Daten anderer Personen aufnehmen.',
        'Eine Gebühr nennen oder pauschal „immer kostenlos“ oder „immer gebührenpflichtig“ sagen.',
        'Die Vorbereitung mit der tatsächlichen Aushändigung gleichsetzen.',
        'Die Meldebestätigung nach einer Anmeldung (§ 24 BMG) mit der Meldebescheinigung auf Antrag (§ 18 BMG) verwechseln.'
      ],
      musterantwort: 'Sie benötigen für sich eine einfache schriftliche Meldebescheinigung. Die Angaben stimmen in unseren ' +
        'Übungsunterlagen überein. Ich bereite den Nachweis mit den dafür vorgesehenen Daten vor. Welche Gebühr für die ' +
        'schriftliche Bescheinigung gilt, muss anhand der örtlichen Regelung geprüft werden. Eine echte Bescheinigung wird ' +
        'in dieser Übung nicht ausgestellt.',
      loesungen: [
        { feld: 'Anliegen', richtig: 'Meldebescheinigung für die eigene Person', bezug: '§ 18 Abs. 1 BMG (Antrag der betroffenen Person)' },
        { feld: 'Angaben (vier Zeilen)', richtig: 'Familienname, Vorname, Geburtsdatum, derzeitige alleinige Anschrift: jeweils „liegt vor und stimmt“', bezug: '§ 18 Abs. 1 BMG; Fallakte' },
        { feld: 'Identität', richtig: 'Ausweis, Antrag und Übungsregister abgleichen, sie passen zusammen', bezug: 'Arbeitsaufgabe; Q6 (Ausweis kann bei persönlicher Vorsprache verlangt werden), kein Verweis auf § 10 Abs. 1' },
        { feld: 'Umfang', richtig: 'Einfache Bescheinigung mit den Daten nach § 18 Abs. 1 BMG', bezug: '§ 18 Abs. 1 und 2 BMG (Zusatzdaten nur auf Antrag)' },
        { feld: 'Regeln', richtig: 'Antrag der eigenen Person; § 18 BMG; Umfang nach Antrag; Gebühr für schriftliche Erteilung örtlich prüfen', bezug: '§ 18 Abs. 1 bis 3 BMG' },
        { feld: 'Aussagen', richtig: 'Keine dieser Aussagen trifft zu.', bezug: 'Fallakte' },
        { feld: 'Vorbereitung', richtig: 'Übungsbescheinigung mit den passenden Registerdaten vorbereiten, Gebührenregel prüfen', bezug: 'Vorbereitung ist keine Ausstellung' },
        { feld: 'Antwort', richtig: 'Fünf Bausteine: Anliegen, Vorbereitung nach Abgleich, nur beantragter Umfang, Gebühr prüfen, Übungshinweis', bezug: 'Alle fünf verbotenen Bausteine bleiben ungewählt' }
      ],
      kriterien: [
        'Anliegen: genau die eigene Meldebescheinigung.',
        'Unterlagen: vier Angaben stimmen, die Identität passt zusammen.',
        'Regeln: einfacher Umfang, vier richtige Regeln, die Einfachfrage „Keine dieser Aussagen trifft zu.“.',
        'Vorbereitung: vorbereiten, nicht aushändigen.',
        'Antwort: alle fünf erforderlichen Bausteine und kein verbotener.',
        'Unbeantwortet ist nie richtig. Falsche Alternativen werden nicht durch richtige Zusatzantworten ausgeglichen.',
        'Freitext wird gespeichert und angezeigt, aber nie automatisch bewertet. Die Rückmeldung gibt die Lehrkraft.'
      ],
      quellen: {
        datei: QUELLEN_DATEI,
        normen: ['§ 18 BMG (Abs. 1 bis 4)', '§ 1 BMG', '§ 10 Abs. 2 und 3 BMG', '§ 11 Abs. 2 Nr. 1 bis 3 BMG'],
        uebungsannahme: UEBUNGSANNAHME,
        luecke: 'Nicht geprüft: Der amtliche aktuelle Volltext des baden-württembergischen Landesrechts zur Meldebehörde ' +
          '(AGBMG) wurde nicht verifiziert. Eine Sonderzuständigkeit wird in diesem Fall nicht bewertet. Es gibt keine ' +
          'Sonnenthaler Gebührensatzung; Beträge werden nicht bewertet.'
      }
    };
  }

  function nachschlagen() {
    return {
      titel: 'Nachschlagekarte Meldebescheinigung (B02)',
      themen: [
        { titel: 'Antrag und Inhalt (§ 18 Abs. 1 BMG)', text: 'Die Meldebehörde erteilt auf Antrag der betroffenen Person eine Meldebescheinigung, schriftlich oder elektronisch. Sie nennt Familienname, Vornamen, Geburtsdatum und die derzeitige Anschrift; der Doktorgrad nur, wenn er gespeichert ist. Das ist Bundesrecht.' },
        { titel: 'Zusatzdaten (§ 18 Abs. 2 BMG)', text: 'Weitere Daten gibt es nur auf Antrag. Im Fall B02 wurden keine beantragt.' },
        { titel: 'Elektronische Bescheinigung (§ 18 Abs. 3 BMG)', text: 'Die elektronisch erteilte Meldebescheinigung ist nach dem Bundesrecht unentgeltlich. Das gilt nicht automatisch für die schriftliche.' },
        { titel: 'Verweise (§ 18 Abs. 4 BMG)', text: 'Absatz 4 verweist auf § 10 Abs. 2 und 3 und auf § 11 Abs. 2 Nr. 1 bis 3 BMG. Er verweist nicht pauschal auf § 10 Abs. 1. Diese Sonderfälle gehören nicht zum Fall B02.' },
        { titel: 'Zuständigkeit', text: 'Wer Meldebehörde ist, bestimmt das Landesrecht (§ 1 BMG). In dieser Übung ist das Bürgerbüro Sonnenthal der Schalter; das ist eine Übungsannahme. Der amtliche aktuelle Text des Landesrechts wurde nicht verifiziert.' },
        { titel: 'Praxis in Baden-Württemberg', text: 'Ein Antrag ist formfrei. Bei persönlicher Vorsprache kann ein Ausweis verlangt werden. Das ist eine Leistungsbeschreibung, keine Gesetzesnorm.' },
        { titel: 'Gebühren', text: 'Für Sonnenthal gibt es in dieser Übung keine Gebührensatzung. Richtig ist: örtliche Regelung prüfen, keinen Betrag nennen, nichts versprechen.' },
        { titel: 'Grenzen', text: 'Das ist eine Lernübung, keine Rechtsberatung. Es wird keine echte Bescheinigung ausgestellt und nichts an eine Behörde übermittelt.' }
      ],
      quelle: 'Quelle: lokale Datei ' + QUELLEN_DATEI + '. ' + UEBUNGSANNAHME
    };
  }

  function leereSicht(verworfen, eingaben) {
    return { verworfen: verworfen, eingaben: eingaben, letzteAuswertung: null, abgeschlossen: false };
  }

  function bereinigeGespeichert(roh) {
    var obj = roh;
    if (istText(roh)) {
      try { obj = JSON.parse(roh); } catch (err) { return leereSicht(true, normalisiere({})); }
    }
    if (!istObjekt(obj)) return leereSicht(true, normalisiere({}));
    var eingaben = normalisiere(obj.eingaben);
    if (obj.fallId !== FALL_ID || obj.bewertungsstand !== BEWERTUNGSSTAND) {
      return leereSicht(true, eingaben);
    }
    // Unbekannte Werte in den ROHEN gespeicherten Eingaben (vor der Normalisierung) verwerfen Auswertung und
    // Abschluss. Die bereinigten Eingaben bleiben erhalten, damit nichts verloren geht.
    if (ungueltigeWerte(obj.eingaben).length) return leereSicht(true, eingaben);
    // Eine gespeicherte Auswertung oder ein Abschluss wird nie übernommen, sondern neu berechnet.
    var neu = obj.letzteAuswertung ? auswertung(eingaben) : null;
    var alt = obj.letzteAuswertung && obj.letzteAuswertung.eingabeVersion;
    if (neu && (!istText(alt) || alt !== neu.eingabeVersion)) neu = null;
    return {
      verworfen: false,
      eingaben: eingaben,
      letzteAuswertung: neu,
      abgeschlossen: obj.abgeschlossen === true && !!neu && neu.darfAbschliessen
    };
  }

  function resetText() {
    return 'Dies setzt nur den Übungsfall B02 mit Alex Weber zurück. B01, Luca, Noelle und die Anzeige-Einstellungen ' +
      'bleiben unverändert.';
  }

  return {
    FALL_ID: FALL_ID,
    SPEICHER_SCHLUESSEL: SPEICHER_SCHLUESSEL,
    BEWERTUNGSSTAND: BEWERTUNGSSTAND,
    BEREICHE: Object.keys(BEREICH_FELDER).map(function (k) { return { key: k, name: BEREICH_NAME[k], nr: BEREICH_NR[k], felder: BEREICH_FELDER[k].slice() }; }),
    fallDaten: fallDaten,
    katalog: katalog,
    normalisiere: normalisiere,
    eingabeVersion: eingabeVersion,
    auswertung: auswertung,
    hilfe: hilfe,
    lehrkraft: lehrkraft,
    nachschlagen: nachschlagen,
    bereinigeGespeichert: bereinigeGespeichert,
    resetText: resetText
  };
}));
