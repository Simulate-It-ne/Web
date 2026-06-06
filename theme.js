(function () {
  var STORAGE_KEY = "simulate-it-theme";
  var root = document.documentElement;

  function storedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function getPreferred() {
    var saved = storedTheme();
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      var isDark = theme === "dark";
      btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      btn.textContent = isDark ? "\u2600" : "\u263E";
      btn.setAttribute("title", isDark ? "Light mode" : "Dark mode");
    });
  }

  function initThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var current = root.getAttribute("data-theme") || "light";
        applyTheme(current === "dark" ? "light" : "dark");
      });
    });
  }

  function setTvMode(on) {
    document.body.classList.toggle("tv-mode", on);
    document.documentElement.classList.toggle("tv-mode", on);
    document.querySelectorAll("[data-tv-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.setAttribute("aria-label", on ? "Exit TV mode" : "TV fullscreen mode");
      btn.setAttribute("title", on ? "Exit TV mode" : "TV mode");
    });
    document.querySelectorAll("[data-tv-exit]").forEach(function (btn) {
      btn.hidden = !on;
    });
    window.dispatchEvent(new CustomEvent("tv-mode-change", { detail: { active: on } }));
  }

  function exitTvMode() {
    setTvMode(false);
    if (document.fullscreenElement) {
      if (document.exitFullscreen) document.exitFullscreen().catch(function () {});
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  }

  function initTvMode() {
    var btn = document.querySelector("[data-tv-toggle]");
    if (!btn) return;

    btn.addEventListener("click", function () {
      var turningOn = !document.body.classList.contains("tv-mode");
      if (turningOn) {
        setTvMode(true);
        var el = document.documentElement;
        if (el.requestFullscreen) el.requestFullscreen().catch(function () {});
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      } else {
        exitTvMode();
      }
    });

    document.querySelectorAll("[data-tv-exit]").forEach(function (exitBtn) {
      exitBtn.addEventListener("click", exitTvMode);
    });

    function onFullscreenEnd() {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) setTvMode(false);
    }
    document.addEventListener("fullscreenchange", onFullscreenEnd);
    document.addEventListener("webkitfullscreenchange", onFullscreenEnd);
  }

  applyTheme(getPreferred());

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initThemeToggle();
      initTvMode();
    });
  } else {
    initThemeToggle();
    initTvMode();
  }
})();
