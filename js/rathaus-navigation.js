/* Virtuelles Rathaus, Navigationsmodell. Reine Funktionen: kein DOM, kein localStorage.
 * Die Lehrkraftansicht gehört keinem Amt. Eine zentrale Lehrkraftverwaltung ist nicht Teil dieser Stufe.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.RATHAUS_NAVIGATION = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var ANSICHTEN = ["stadt", "personal", "post", "akte", "vorgang", "nachschlagen", "buerger", "buerger-karte", "lehrkraft"];
  var HASH_ANSICHTEN = ["stadt", "personal", "post", "akte", "vorgang", "nachschlagen", "buerger", "buerger-karte"];
  var PERSONAL_ANSICHTEN = ["personal", "post", "akte", "vorgang", "nachschlagen"];
  var BUERGER_ANSICHTEN = ["buerger", "buerger-karte"];
  var STADT_LABEL = "Rathaus Sonnenthal";
  var RUECK_LABEL = "Zurück zur Rathausübersicht";
  // Sichtbare Namen der Vorgänge in der Pfadnavigation und in der Fallleiste.
  var VORGANG_LABEL = { b01: "B01", b02: "B02", b03: "B03", b04: "B04", luca: "Luca Berger", noelle: "Noelle Kranz" };
  var BUERGER_MODI = { "fall": "B01", "fall-b02": "B02", "fall-b03": "B03", "fall-b04": "B04" };

  // Ämter stehen alphabetisch nach sichtbarem Titel (deutsche Sortierung). Neue Ämter einfach ergänzen:
  // aemter() sortiert selbst. Geplante und benutzbare Ämter werden nicht getrennt vorsortiert.
  var AEMTER = [
    { id: "buergerbuero", titel: "Bürgerbüro", benutzbar: true, ansicht: "buerger", beschreibung: "Schalter und Anliegen der Einwohnerschaft. Erster Fall: Anmeldung nach einem Zuzug." },
    { id: "ordnungsamt", titel: "Ordnungsamt", benutzbar: false, ansicht: null, beschreibung: "Ordnung und Genehmigungen." },
    { id: "personal", titel: "Personalamt", benutzbar: true, ansicht: "personal", beschreibung: "Ausbildungsverhältnisse, Akten und der erste bearbeitbare Vorgang." },
    { id: "stadtkasse", titel: "Stadtkasse", benutzbar: false, ansicht: null, beschreibung: "Zahlungen und Gebühren." }
  ];

  var TITEL = {
    stadt: "Stadtübersicht",
    personal: "Personalamt",
    post: "Posteingang",
    akte: "Ausbildungsakte",
    vorgang: "Vorgang",
    nachschlagen: "Nachschlagen",
    buerger: "Bürgerbüro",
    "buerger-karte": "Nachschlagen",
    lehrkraft: "Lehrkraftansicht"
  };

  function istAnsicht(wert) {
    return typeof wert === "string" && ANSICHTEN.indexOf(wert) !== -1;
  }

  function hashZuAnsicht(hash) {
    if (typeof hash !== "string") return null;
    var name = hash.charAt(0) === "#" ? hash.slice(1) : hash;
    return HASH_ANSICHTEN.indexOf(name) !== -1 ? name : null;
  }

  function aemter() {
    var vergleich = typeof Intl === "object" && Intl.Collator
      ? new Intl.Collator("de", { numeric: true, sensitivity: "base" }).compare
      : function (a, b) { return a < b ? -1 : (a > b ? 1 : 0); };
    return AEMTER.slice().sort(function (a, b) { return vergleich(a.titel, b.titel); }).map(function (amt) {
      return {
        id: amt.id,
        titel: amt.titel,
        benutzbar: amt.benutzbar,
        ansicht: amt.ansicht,
        beschreibung: amt.beschreibung
      };
    });
  }

  // Zweites Argument nur für das Bürgerbüro: "uebersicht" zeigt die Fallübersicht, sonst gilt Fall B01.
  // Drittes Argument (optional): Name des aktuellen Arbeitsschritts. Nur mit nicht-leerem Text kommt ein viertes
  // Glied dazu; das bisher letzte Glied wird dann zum Link auf die aktuelle Ansicht.
  // Viertes Argument (optional, nur Personalamt): "luca" oder "noelle" für den Vorgangsnamen.
  function brotkrumen(ansicht, modus, schrittLabel, vorgang) {
    var krumen = grundKrumen(ansicht, modus, vorgang);
    if (typeof schrittLabel === "string" && schrittLabel.trim() && krumen.length > 1) {
      var letztes = krumen[krumen.length - 1];
      if (letztes.ziel === null) {
        letztes.ziel = ansicht;
        if (modus) letztes.modus = modus;
      }
      krumen.push({ label: schrittLabel.trim(), ziel: null });
    }
    return krumen;
  }

  function grundKrumen(ansicht, modus, vorgang) {
    var stadt = { label: STADT_LABEL, ziel: "stadt" };
    if (ansicht === "stadt") return [{ label: STADT_LABEL, ziel: null }];
    if (ansicht === "lehrkraft") return [stadt, { label: TITEL.lehrkraft, ziel: null }];
    if (ansicht === "personal") return [stadt, { label: TITEL.personal, ziel: null }];
    if (ansicht === "buerger") {
      if (modus === "uebersicht") return [stadt, { label: TITEL.buerger, ziel: null }];
      var vorgangLabel = BUERGER_MODI[modus] || VORGANG_LABEL.b01;
      return [stadt, { label: TITEL.buerger, ziel: "buerger", modus: "uebersicht" }, { label: vorgangLabel, ziel: null }];
    }
    if (ansicht === "buerger-karte") {
      return [stadt, { label: TITEL.buerger, ziel: "buerger", modus: "uebersicht" }, { label: TITEL["buerger-karte"], ziel: null }];
    }
    if (ansicht === "post" || ansicht === "akte" || ansicht === "vorgang" || ansicht === "nachschlagen") {
      var personLabel = (ansicht === "akte" || ansicht === "vorgang") && VORGANG_LABEL[vorgang] && (vorgang === "luca" || vorgang === "noelle")
        ? VORGANG_LABEL[vorgang] + " · " + TITEL[ansicht] : TITEL[ansicht];
      return [stadt, { label: TITEL.personal, ziel: "personal" }, { label: personLabel, ziel: null }];
    }
    return [{ label: STADT_LABEL, ziel: null }];
  }

  // Genau ein Zurück: immer die Elternebene, unabhängig vom Browserverlauf.
  // Fall, Karte und Posteingang gehen zum Amt, das Amt geht zur Stadt. Zweites Argument wie bei brotkrumen().
  function rueckziel(ansicht, modus) {
    if (!istAnsicht(ansicht) || ansicht === "stadt") return null;
    if (PERSONAL_ANSICHTEN.indexOf(ansicht) !== -1 && ansicht !== "personal") {
      return { ansicht: "personal", modus: null, label: "Zurück zum Personalamt" };
    }
    if (ansicht === "buerger-karte" || (ansicht === "buerger" && (modus === "fall" || modus === "fall-b02" || modus === "fall-b03" || modus === "fall-b04"))) {
      return { ansicht: "buerger", modus: "uebersicht", label: "Zurück zum Bürgerbüro" };
    }
    return { ansicht: "stadt", modus: null, label: RUECK_LABEL };
  }

  // Name des Amts, in dem die Ansicht liegt, sonst null.
  function amtTitel(ansicht) {
    var ebene = leistenEbene(ansicht);
    if (ebene === "personal") return TITEL.personal;
    if (ebene === "buerger") return TITEL.buerger;
    return null;
  }

  // Eintraege des kompakten Ämtermenüs: Stadtübersicht, dann die Ämter alphabetisch. Nicht benutzbare
  // Ämter haben ansicht null und werden als "In Kürze" angezeigt, nicht als Knopf.
  function bereichsMenue(ansicht) {
    var ebene = leistenEbene(ansicht);
    var menue = [{ id: "stadt", label: "Stadtübersicht", ansicht: "stadt", benutzbar: true, aktuell: ebene === "stadt" }];
    aemter().forEach(function (amt) {
      var ziel = amt.ansicht;
      menue.push({
        id: amt.id, label: amt.titel, ansicht: ziel, benutzbar: amt.benutzbar,
        aktuell: amt.benutzbar && ((ziel === "personal" && ebene === "personal") || (ziel === "buerger" && ebene === "buerger"))
      });
    });
    return menue;
  }

  // Beschriftung der Menüschaltfläche: wo bin ich gerade?
  function bereichsMenueTitel(ansicht) {
    return amtTitel(ansicht) || (ansicht === "lehrkraft" ? TITEL.lehrkraft : TITEL.stadt);
  }

  // Kompakte Fallübersicht des aktuellen Amts oder null (Stadt, Lehrkraft). Zweites Argument wie bei brotkrumen().
  function fallUebersicht(ansicht, modus, aktiverFall) {
    var amt = amtTitel(ansicht);
    if (!amt) return null;
    var eintraege = personalUnternavigation(ansicht, aktiverFall);
    if (!eintraege.length) eintraege = buergerUnternavigation(ansicht, modus);
    var aktuell = eintraege.filter(function (e) { return e.aktuell; })[0];
    return { amt: amt, eintraege: eintraege, aktuellLabel: aktuell ? aktuell.label : "" };
  }

  // Sichtbare Fallleiste im Personalamt: die zwei Vorgänge. Posteingang, Akte, Vorgang und Nachschlagen
  // bleiben als Arbeitsflächen erhalten, stehen aber nicht mehr als gleichrangige Menüpunkte da.
  function personalUnternavigation(ansicht, aktiverFall) {
    if (PERSONAL_ANSICHTEN.indexOf(ansicht) === -1) return [];
    var aktiv = aktiverFall === "noelle" ? "noelle" : "luca";
    return [
      { ansicht: "personal", fall: "luca", label: VORGANG_LABEL.luca },
      { ansicht: "personal", fall: "noelle", label: VORGANG_LABEL.noelle }
    ].map(function (eintrag) {
      eintrag.aktuell = eintrag.fall === aktiv;
      return eintrag;
    });
  }

  // Kompakte Unternavigation des Bürgerbüros mit Textlabels. Zweites Argument wie bei brotkrumen().
  function buergerUnternavigation(ansicht, modus) {
    if (BUERGER_ANSICHTEN.indexOf(ansicht) === -1) return [];
    var fallB02 = ansicht === "buerger" && modus === "fall-b02";
    var fallB03 = ansicht === "buerger" && modus === "fall-b03";
    var fallB04 = ansicht === "buerger" && modus === "fall-b04";
    var fall = ansicht === "buerger" && modus !== "uebersicht" && !fallB02 && !fallB03 && !fallB04;
    return [
      { ansicht: "buerger", modus: "fall", label: VORGANG_LABEL.b01, aktuell: fall },
      { ansicht: "buerger", modus: "fall-b02", label: VORGANG_LABEL.b02, aktuell: fallB02 },
      { ansicht: "buerger", modus: "fall-b03", label: VORGANG_LABEL.b03, aktuell: fallB03 },
      { ansicht: "buerger", modus: "fall-b04", label: VORGANG_LABEL.b04, aktuell: fallB04 }
    ];
  }

  // Aktuelle Rathausebene für die Leiste: "stadt", "personal", "buerger" oder null (Lehrkraftansicht).
  function leistenEbene(ansicht) {
    if (ansicht === "stadt") return "stadt";
    if (PERSONAL_ANSICHTEN.indexOf(ansicht) !== -1) return "personal";
    if (BUERGER_ANSICHTEN.indexOf(ansicht) !== -1) return "buerger";
    return null;
  }

  // Die Sieben-Schritte-Anzeige gehört zu genau einem Vorgang. Sie erscheint nur in Akte und Vorgang,
  // nicht in Stadtübersicht, Amtsübersicht, Posteingang (zwei Vorgänge), Nachschlagekarte oder Lehrkraftansicht.
  var FORTSCHRITT_ANSICHTEN = ["akte", "vorgang"];
  function fortschrittSichtbar(ansicht) {
    return FORTSCHRITT_ANSICHTEN.indexOf(ansicht) !== -1;
  }

  // Lehrkraftmodus umschalten. Gibt nur die zwei betroffenen Felder zurück und verändert nichts.
  function lehrkraftUmschalten(ansicht, lehrkraftAn) {
    if (!lehrkraftAn) return { lehrkraft: true, ansicht: "lehrkraft" };
    return { lehrkraft: false, ansicht: ansicht === "lehrkraft" || !istAnsicht(ansicht) ? "stadt" : ansicht };
  }

  // Gespeicherte Ansicht nach dem Laden: keine gesperrte Lehrkraftansicht ohne Lehrkraftmodus.
  function ansichtNachLaden(ansicht, lehrkraftAn) {
    if (!istAnsicht(ansicht)) return "stadt";
    if (ansicht === "lehrkraft" && !lehrkraftAn) return "stadt";
    return ansicht;
  }

  return {
    ANSICHTEN: ANSICHTEN.slice(),
    HASH_ANSICHTEN: HASH_ANSICHTEN.slice(),
    istAnsicht: istAnsicht,
    hashZuAnsicht: hashZuAnsicht,
    aemter: aemter,
    brotkrumen: brotkrumen,
    rueckziel: rueckziel,
    amtTitel: amtTitel,
    bereichsMenue: bereichsMenue,
    bereichsMenueTitel: bereichsMenueTitel,
    fallUebersicht: fallUebersicht,
    personalUnternavigation: personalUnternavigation,
    buergerUnternavigation: buergerUnternavigation,
    leistenEbene: leistenEbene,
    fortschrittSichtbar: fortschrittSichtbar,
    lehrkraftUmschalten: lehrkraftUmschalten,
    ansichtNachLaden: ansichtNachLaden
  };
});
