/* Renders the table of contents from window.NOTEBOOK (contents.js). */
(function () {
  "use strict";
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var host = document.getElementById("contents");
  window.NOTEBOOK.parts.forEach(function (part, pi) {
    var sec = document.createElement("section");
    sec.className = "part";
    var items = part.topics.map(function (tp, ti) {
      var n = (pi + 1) + "." + (ti + 1);
      var inner = '<span class="n">' + n + '</span><span class="t">' + esc(tp.t) + '</span>' +
        (tp.href ? '<span class="go">Open →</span>' : '<span class="go">later</span>') +
        '<span class="d">' + esc(tp.d) + '</span>';
      return "<li>" + (tp.href ? '<a href="' + esc(tp.href) + '">' + inner + "</a>" : '<div class="soon">' + inner + "</div>") + "</li>";
    }).join("");
    sec.innerHTML = "<h2>" + esc(part.title) + "</h2><p>" + esc(part.intro) + '</p><ol class="toc">' + items + "</ol>";
    host.appendChild(sec);
  });
})();
