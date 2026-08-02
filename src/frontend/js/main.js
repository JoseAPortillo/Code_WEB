// Bootstrap: wire scroll spy.
// Module scripts are deferred, so the DOM is fully parsed when this runs.
// No globals leak to window.

// Scroll spy para el nav
const navLinks = document.querySelectorAll(".topbar-nav a");
const sections = ["proyectos", "sobre-mi", "contacto"].map(id => document.getElementById(id));
const spy = new IntersectionObserver((entries) => {
    entries.forEach(en => {
        if (en.isIntersecting) {
            navLinks.forEach(a => a.classList.toggle("active-link", a.getAttribute("href") === "#" + en.target.id));
        }
    });
}, { rootMargin: "-40% 0px -55% 0px" });
sections.forEach(s => spy.observe(s));
