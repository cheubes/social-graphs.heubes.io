(() => {
  const STORAGE_KEY = "sg-lang";
  const DEFAULT_LANG = "en";

  function isFrenchPath(path) {
    return path === "/fr" || path.startsWith("/fr/");
  }

  function pathForLang(path, targetLang) {
    const isFr = isFrenchPath(path);
    if (targetLang === "fr") {
      return isFr ? path : "/fr" + path;
    }
    return isFr ? path.slice(3) || "/" : path;
  }

  function detectBrowserLang() {
    const raw = (navigator.language || navigator.userLanguage || "").slice(0, 2).toLowerCase();
    return raw === "fr" ? "fr" : DEFAULT_LANG;
  }

  const currentPath = window.location.pathname;
  const currentLang = isFrenchPath(currentPath) ? "fr" : DEFAULT_LANG;
  const storedLang = localStorage.getItem(STORAGE_KEY);
  const preferredLang = storedLang || detectBrowserLang();

  if (!storedLang) {
    localStorage.setItem(STORAGE_KEY, preferredLang);
  }

  if (preferredLang !== currentLang) {
    const targetPath = pathForLang(currentPath, preferredLang);
    window.location.replace(targetPath + window.location.search + window.location.hash);
    return;
  }

  window.sgLang = currentLang;

  const langFlags = document.querySelectorAll(".sg-lang-flag");

  function updateLangSwitcherLinks() {
    langFlags.forEach((link) => {
      const targetLang = link.dataset.lang;
      if (!targetLang) return;
      link.href = pathForLang(window.location.pathname, targetLang);
    });
  }

  updateLangSwitcherLinks();
  window.addEventListener("sg:urlchange", updateLangSwitcherLinks);
  window.addEventListener("popstate", updateLangSwitcherLinks);

  langFlags.forEach((link) => {
    const targetLang = link.dataset.lang;
    if (!targetLang) return;
    link.addEventListener("click", () => {
      localStorage.setItem(STORAGE_KEY, targetLang);
    });
  });
})();
