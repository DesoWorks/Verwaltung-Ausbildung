/* Rathaus: Verzeichnis der gelesenen Rechtsgrundlagen. Reine Daten und Funktionen: kein DOM, kein Speicher, kein Netz.
 * Nur Bundesnormen, die am 06.11.2026 auf gesetze-im-internet.de gelesen wurden (nichtamtliche Fassung),
 * und die ausdrücklich markierte Übungsannahme Sonnenthal. Kein Landesgesetz wurde gelesen.
 * B02 (§ 18 BMG), B03 (BZRG, JVKostG) und B04 (§ 51 BMG) behalten ihre eigenen Karten; sie stehen hier nicht.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.RATHAUS_RECHTSVERZEICHNIS = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var PRUEFDATUM = "06.11.2026";
  var QUELLE = "gesetze-im-internet.de, nichtamtliche Fassung";

  // geltung: "bund" = gelesenes Bundesrecht, "land" = Landesrecht, "uebung" = fiktive Annahme der Übung.
  var EINTRAEGE = [
    {
      id: "bmg-1", norm: "§ 1 BMG", geltung: "bund",
      kurz: "Meldebehörden sind die Behörden, die das Landesrecht dazu bestimmt.",
      url: "https://www.gesetze-im-internet.de/bmg/__1.html", pruefdatum: PRUEFDATUM, faelle: ["b01"]
    },
    {
      id: "bmg-17", norm: "§ 17 Abs. 1 BMG", geltung: "bund",
      kurz: "Wer eine Wohnung bezieht, muss sich innerhalb von zwei Wochen nach dem Einzug bei der Meldebehörde anmelden.",
      url: "https://www.gesetze-im-internet.de/bmg/__17.html", pruefdatum: PRUEFDATUM, faelle: ["b01"]
    },
    {
      id: "bmg-19", norm: "§ 19 Abs. 1 und 2 BMG", geltung: "bund",
      kurz: "Der Wohnungsgeber wirkt bei der Anmeldung mit und bestätigt den Einzug. Erhält die meldepflichtige Person die Bestätigung nicht rechtzeitig, teilt sie das der Meldebehörde unverzüglich mit.",
      url: "https://www.gesetze-im-internet.de/bmg/__19.html", pruefdatum: PRUEFDATUM, faelle: ["b01"]
    },
    {
      id: "bmg-23", norm: "§ 23 Abs. 1 BMG", geltung: "bund",
      kurz: "Zur Anmeldung gehören Ausweis oder Pass sowie die Bestätigung des Wohnungsgebers oder das Zuordnungsmerkmal nach § 19 Abs. 4.",
      url: "https://www.gesetze-im-internet.de/bmg/__23.html", pruefdatum: PRUEFDATUM, faelle: ["b01"]
    },
    {
      id: "bmg-24", norm: "§ 24 Abs. 2 BMG", geltung: "bund",
      kurz: "Die meldepflichtige Person erhält unentgeltlich eine amtliche Bestätigung über die durchgeführte An- oder Abmeldung.",
      url: "https://www.gesetze-im-internet.de/bmg/__24.html", pruefdatum: PRUEFDATUM, faelle: ["b01"]
    },
    {
      id: "bbig-14", norm: "§ 14 Abs. 1 Nr. 4 BBiG", geltung: "bund",
      kurz: "Ausbildende haben Auszubildende zum Besuch der Berufsschule anzuhalten.",
      url: "https://www.gesetze-im-internet.de/bbig_2005/__14.html", pruefdatum: PRUEFDATUM, faelle: ["luca", "noelle"]
    },
    {
      id: "bbig-15", norm: "§ 15 Abs. 1 Satz 2 Nr. 1 BBiG", geltung: "bund",
      kurz: "Ausbildende haben Auszubildende für die Teilnahme am Berufsschulunterricht freizustellen.",
      url: "https://www.gesetze-im-internet.de/bbig_2005/__15.html", pruefdatum: PRUEFDATUM, faelle: ["luca", "noelle"]
    },
    {
      id: "uebung-sonnenthal", norm: "Übungsannahme Sonnenthal", geltung: "uebung",
      kurz: "In dieser Übung nimmt das Bürgerbüro Sonnenthal Meldesachen entgegen. Das ist eine erfundene Annahme, kein Landesrecht und keine geprüfte Landesnorm.",
      url: "", pruefdatum: PRUEFDATUM, faelle: ["b01"]
    }
  ];

  var GELTUNG_TEXT = { bund: "Bundesrecht", land: "Landesrecht", uebung: "Übungsannahme" };

  function kopie(eintrag) {
    return {
      id: eintrag.id, norm: eintrag.norm, geltung: eintrag.geltung, kurz: eintrag.kurz,
      url: eintrag.url, pruefdatum: eintrag.pruefdatum, faelle: eintrag.faelle.slice()
    };
  }

  function alle() {
    return EINTRAEGE.map(kopie);
  }

  function fuerFall(fallId) {
    return EINTRAEGE.filter(function (e) { return e.faelle.indexOf(fallId) !== -1; }).map(kopie);
  }

  function geltungText(geltung) {
    return GELTUNG_TEXT[geltung] || "";
  }

  return {
    PRUEFDATUM: PRUEFDATUM,
    QUELLE: QUELLE,
    alle: alle,
    fuerFall: fuerFall,
    geltungText: geltungText
  };
});
