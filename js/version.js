/* Zentrale Versionsangabe: nur bei einem bewusst veröffentlichten Stand ändern. */
(function (global) {
  "use strict";
  global.APP_VERSION = "0.1.15-alpha.1";

  function anzeigen() {
    document.querySelectorAll("[data-version]").forEach(function (element) {
      element.textContent = global.APP_VERSION;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", anzeigen);
  } else {
    anzeigen();
  }
})(typeof window !== "undefined" ? window : globalThis);
