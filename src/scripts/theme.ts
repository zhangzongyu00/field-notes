// The old "theme" key mixed manual choices with automatic system updates.
const THEME_KEY = "theme-preference";
const SYSTEM = "system";
const LIGHT = "light";
const DARK = "dark";
const preferences = [SYSTEM, LIGHT, DARK] as const;
type ThemePreference = (typeof preferences)[number];
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

function getPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === LIGHT || stored === DARK) return stored;
  } catch {
    // Keep automatic mode available when browser storage is restricted.
  }
  return SYSTEM;
}

let preference = getPreference();

function getNextPreference(): ThemePreference {
  return preferences[
    (preferences.indexOf(preference) + 1) % preferences.length
  ];
}

function reflect(targetDocument: Document = document): void {
  const themeValue =
    preference === SYSTEM ? (systemTheme.matches ? DARK : LIGHT) : preference;
  const root = targetDocument.documentElement;
  root.setAttribute("data-theme", themeValue);
  root.classList.toggle("dark", themeValue === DARK);

  const button = targetDocument.querySelector<HTMLButtonElement>("#theme-btn");
  if (button) {
    button.dataset.mode = preference;
    const currentLabel = button.dataset[preference];
    const nextLabel = button.dataset[getNextPreference()];
    const label = `${currentLabel}；${button.dataset.switchTo}${nextLabel}`;
    button.setAttribute("aria-label", label);
    button.title = label;
  }

  // Fill <meta name="theme-color"> with the computed background colour so
  // Android's browser chrome matches the page background.
  const bg = window.getComputedStyle(document.body).backgroundColor;
  targetDocument
    .querySelector("meta[name='theme-color']")
    ?.setAttribute("content", bg);
}

function setup(): void {
  reflect();
  document.querySelector("#theme-btn")?.addEventListener("click", () => {
    preference = getNextPreference();
    try {
      localStorage.setItem(THEME_KEY, preference);
    } catch {
      // Manual selection still works for this visit without browser storage.
    }
    reflect();
  });
}

setup();

// Re-run after View Transitions navigation.
document.addEventListener("astro:after-swap", setup);

// Set the incoming page's theme before View Transitions swaps the document.
document.addEventListener("astro:before-swap", event => {
  reflect((event as { newDocument: Document }).newDocument);
});

// Automatic updates never overwrite a manual preference or persist a colour.
systemTheme.addEventListener("change", () => {
  if (preference === SYSTEM) reflect();
});

window.addEventListener("storage", event => {
  if (event.key === THEME_KEY || event.key === null) {
    preference = getPreference();
    reflect();
  }
});
