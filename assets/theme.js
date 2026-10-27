/* Light/dark toggle shared by every page. Include in <head> so the theme applies before paint. */
(function () {
  var root = document.documentElement;
  try { var t = localStorage.getItem("hn-theme"); if (t === "light" || t === "dark") root.setAttribute("data-theme", t); } catch (e) {}
  function isDark() {
    var t = root.getAttribute("data-theme");
    return t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  window.hnIsDark = isDark;
  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("theme-btn");
    if (!btn) return;
    var sync = function () { btn.textContent = isDark() ? "Light" : "Dark"; };
    btn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("hn-theme", next); } catch (e) {}
      sync();
    });
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", sync);
    sync();
  });
})();
