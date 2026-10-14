/* Zentrale, dateipfadbasierte Navigation fuer den Offline-Start. */
(function () {
  "use strict";
  var body = document.body;
  var page = body.getAttribute("data-page") || "overview";
  var base = body.getAttribute("data-base") || "";
  var modules = window.MODULE_DATEN || [];
  var tools = window.MODULE_TOOLS || [];

  var host = document.createElement("div");
  host.className = "site-navigation";
  var toggle = document.createElement("button");
  toggle.type = "button"; toggle.className = "nav-toggle"; toggle.textContent = "Menü";
  toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-controls", "site-nav");
  var nav = document.createElement("nav"); nav.id = "site-nav"; nav.className = "site-nav"; nav.setAttribute("aria-label", "Hauptnavigation");
  var title = document.createElement("p"); title.className = "site-nav-title"; title.textContent = "Lernplattform"; nav.appendChild(title);
  var list = document.createElement("ul");
  function item(entry) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    var label = document.createElement("span"); label.textContent = entry.label; a.appendChild(label); a.href = entry.href;
    a.setAttribute("data-progress-id", entry.id);
    if (entry.page === page) a.setAttribute("aria-current", "page");
    aktualisiereMarkierung(a, entry.id);
    li.appendChild(a); return li;
  }
  function aktualisiereMarkierung(a, id) {
    var mark = a.querySelector(".abschlusszeichen");
    var fertig = window.LERNFORTSCHRITT && window.LERNFORTSCHRITT.abgeschlossen(id);
    if (fertig && !mark) a.appendChild(window.LERNFORTSCHRITT.abschlusszeichen());
    else if (!fertig && mark) mark.remove();
  }
  function softBreak(text) {
    return String(text).replace(/([\p{L}\p{N}])([^\p{L}\p{N}])/gu, "$1\u200b$2");
  }
  function markGroupSummary(summary, details, label) {
    function update() {
      summary.setAttribute("aria-expanded", String(details.open));
      summary.setAttribute("aria-label", label + (details.open ? " – schließen" : " – öffnen"));
    }
    update();
    details.addEventListener("toggle", update);
  }
  list.appendChild(item({ id: "overview", label: "Themenübersicht", href: base + "index.html", page: "overview" }));
  var entryData = (window.MODULE_EINSTIEG || [])[0];
  if (entryData && entryData.status === "verfuegbar" && entryData.datei) {
    var entryItem = item({ id: entryData.id, label: entryData.titel, href: base + entryData.datei, page: entryData.page });
    entryItem.classList.add("nav-topic", "nav-entry");
    list.appendChild(entryItem);
  }
  modules.forEach(function (yearData) {
    var group = document.createElement("li"); group.className = "nav-category";
    var details = document.createElement("details");
    details.open = (yearData.module || []).some(function (m) {
      return m.page === page || (m.unterthemen || []).some(function (u) { return u.page === page; });
    });
    var summary = document.createElement("summary"); summary.textContent = softBreak(yearData.titel); markGroupSummary(summary, details, yearData.titel); details.appendChild(summary);
    var sub = document.createElement("ul");
    (yearData.module || []).forEach(function (m) {
      if (m.id === "einstieg") return;
      var groupLi = document.createElement("li"); groupLi.className = "nav-topic nav-learning-group";
      var field = document.createElement("details"); field.className = "nav-learning-details";
      field.open = m.page === page || (m.unterthemen || []).some(function (u) { return u.page === page; });
      field.setAttribute("data-learning-field", m.id);
      var heading = document.createElement("summary"); heading.className = "nav-learning-field";
      var label = document.createElement("span"); label.className = "nav-learning-field-label";
      label.textContent = softBreak((m.lernfeld ? m.lernfeld + " · " : "") + m.titel);
      heading.appendChild(label);
      markGroupSummary(heading, field, label.textContent);
      field.appendChild(heading);
      if (m.unterthemen && m.unterthemen.length) {
        var topics = document.createElement("ul");
        m.unterthemen.forEach(function (u) {
          var available = u.status === "verfuegbar" && u.datei;
          if (available) {
            var entry = item({ id: u.id, label: u.titel, href: base + u.datei, page: u.page });
            entry.classList.add("nav-topic"); topics.appendChild(entry);
          } else {
            var planned = document.createElement("li"); planned.className = "nav-planned nav-topic";
            planned.setAttribute("aria-disabled", "true"); planned.textContent = u.titel + " — In Kürze"; topics.appendChild(planned);
          }
        });
        field.appendChild(topics);
      } else if (m.status !== "verfuegbar") {
        var planned = document.createElement("div"); planned.className = "nav-planned";
        planned.setAttribute("aria-disabled", "true"); planned.textContent = "In Kürze"; field.appendChild(planned);
      }
      groupLi.appendChild(field);
      sub.appendChild(groupLi);
    });
    details.appendChild(sub); group.appendChild(details); list.appendChild(group);
  });
  if (tools.length) {
    var toolsGroup = document.createElement("li"); toolsGroup.className = "nav-category nav-tools";
    var toolsDetails = document.createElement("details");
    toolsDetails.open = tools.some(function (tool) { return tool.page === page; });
    var toolsSummary = document.createElement("summary"); toolsSummary.textContent = "Tools & Nachschlagen"; markGroupSummary(toolsSummary, toolsDetails, toolsSummary.textContent); toolsDetails.appendChild(toolsSummary);
    var toolsList = document.createElement("ul");
    tools.forEach(function (tool) {
      var toolEntry = item({ id: tool.id, label: tool.titel, href: base + tool.datei, page: tool.page });
      toolEntry.classList.add("nav-topic"); toolsList.appendChild(toolEntry);
    });
    toolsDetails.appendChild(toolsList); toolsGroup.appendChild(toolsDetails); list.appendChild(toolsGroup);
  }
  var glossaryEntry = item({ id: "glossary", label: "Wörter & Begriffe", href: base + "glossar.html", page: "glossary" });
  list.appendChild(glossaryEntry); nav.appendChild(list);
  var optionsHost = document.createElement("div"); optionsHost.className = "nav-options"; optionsHost.id = "nav-options"; nav.appendChild(optionsHost);
  host.append(toggle, nav);
  var header = body.querySelector("header.kopf");
  if (header && header.nextSibling) body.insertBefore(host, header.nextSibling);
  else if (header) body.appendChild(host);
  else body.insertBefore(host, body.firstChild);
  function closeMenu() { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }
  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open)); nav.classList.toggle("is-open", open);
    if (open) nav.querySelector("a") && nav.querySelector("a").focus();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { closeMenu(); toggle.focus(); }
  });
  document.addEventListener("click", function (event) {
    if (toggle.getAttribute("aria-expanded") === "true" && !host.contains(event.target)) closeMenu();
  });
  nav.addEventListener("click", function (event) { if (event.target.closest("a")) closeMenu(); });
  var glossaryLink = nav.querySelector('a[href*="glossar.html"]');
  if (glossaryLink) glossaryLink.href += "?von=" + encodeURIComponent(location.pathname.slice(location.pathname.lastIndexOf("/") + 1) || "index.html");
  window.addEventListener("lernfortschritt-geaendert", function () {
    nav.querySelectorAll("[data-progress-id]").forEach(function (a) {
      aktualisiereMarkierung(a, a.getAttribute("data-progress-id"));
    });
  });
})();
