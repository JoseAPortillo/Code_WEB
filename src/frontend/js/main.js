// Bootstrap: import modules, wire theme + directory, scroll spy, initial render.
// Module scripts are deferred, so the DOM is fully parsed when this runs —
// element lookups in imported modules are safe. No globals leak to window.

import { initTheme } from "./theme.js";
import { initDirectory, renderCategories, bindCategoryEvents, renderCards } from "./directory.js";

initTheme();
initDirectory();

// Scroll spy para el nav
const navLinks = document.querySelectorAll(".topbar-nav a");
const sections = ["proyectos", "sobre-mi", "faq", "contacto"].map(id => document.getElementById(id));
const spy = new IntersectionObserver((entries) => {
    entries.forEach(en => {
        if (en.isIntersecting) {
            navLinks.forEach(a => a.classList.toggle("active-link", a.getAttribute("href") === "#" + en.target.id));
        }
    });
}, { rootMargin: "-40% 0px -55% 0px" });
sections.forEach(s => spy.observe(s));

renderCategories();
bindCategoryEvents();
renderCards();
