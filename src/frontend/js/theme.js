// Theme toggle with localStorage persistence.
// The anti-FOUC snippet in <head> reads jap-theme before first paint; this
// module only wires the toggle button (FOUC-safe by construction).
// No globals leak to window.

export function initTheme() {
    const themeToggle = document.getElementById("themeToggle");
    if (!themeToggle) return;

    themeToggle.addEventListener("click", () => {
        const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem("jap-theme", next); } catch {}
    });
}
