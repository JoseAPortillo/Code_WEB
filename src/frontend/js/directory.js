// Directory rendering: categories, cards, search, "/" shortcut, empty state.
// The innerHTML render path is preserved exactly (entity-encoded strings in
// description/tierText/name decode at render time). esc() is applied to the
// same data-derived fields as before: initials, tier, tags, aria-label name.
// No globals leak to window.

import { CATEGORIES, PROJECTS } from "./data.js";

const state = {
    category: "all",
    query: ""
};

const resultsCount = document.getElementById("results-count");
const resourceGrid = document.getElementById("resourceGrid");
const searchInput = document.getElementById("searchInput");
const sidebar = document.getElementById("categorySidebar");
const mobileCats = document.getElementById("mobileCategories");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function renderCategories() {
    const items = CATEGORIES.map(c => `
        <button class="category-button ${c.id === state.category ? "active" : ""}" data-category="${c.id}">
            <span class="category-icon">${c.icon}</span>
            <span>${c.label}</span>
            <small>${c.id === "all" ? PROJECTS.length : PROJECTS.filter(p => p.category === c.id).length}</small>
        </button>`).join("");
    sidebar.innerHTML = items;
    mobileCats.innerHTML = items;
}

export function renderCards() {
    const q = state.query.toLowerCase().trim();
    const filtered = PROJECTS.filter(p => {
        const inCategory = state.category === "all" || p.category === state.category;
        const haystack = (p.name + " " + p.description + " " + p.tags.join(" ") + " " + p.tier).toLowerCase();
        const inQuery = q === "" || haystack.includes(q);
        return inCategory && inQuery;
    });

    resultsCount.textContent = filtered.length;

    if (filtered.length === 0) {
        resourceGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <span>&Oslash;</span>
                <h3>No hay nada por este rinc&oacute;n.</h3>
                <p>Prueba otra b&uacute;squeda o explora todas las categor&iacute;as.</p>
                <button id="clearFilters">Limpiar filtros</button>
            </div>`;
        document.getElementById("clearFilters").addEventListener("click", () => {
            state.category = "all";
            state.query = "";
            searchInput.value = "";
            renderCategories();
            renderCards();
        });
        return;
    }

    resourceGrid.innerHTML = filtered.map(p => `
        <article class="resource-card ${p.featured ? "is-featured" : ""}" style="--card-accent: ${p.accent}" data-category="${p.category}">
            ${p.featured ? '<div class="featured-corner">&#10022;</div>' : ""}
            <div class="card-topline">
                <span class="resource-logo">${esc(p.initials)}</span>
                <h3>${p.name}</h3>
                <span class="card-arrow">&#8599;</span>
            </div>
            <div class="card-body">
                <p>${p.description}</p>
                <div class="free-tier">
                    <span>${esc(p.tier)}</span>
                    <p>${p.tierText}</p>
                </div>
            </div>
            <div class="card-footer">
                <div class="tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>
            </div>
            <a class="card-link" href="${p.link}" target="_blank" rel="noopener" aria-label="Ver proyecto ${esc(p.name)}"></a>
        </article>`).join("");
}

export function bindCategoryEvents() {
    document.querySelectorAll("[data-category]").forEach(btn => {
        btn.addEventListener("click", () => {
            state.category = btn.dataset.category;
            renderCategories();
            bindCategoryEvents();
            renderCards();
        });
    });
}

export function initDirectory() {
    searchInput.addEventListener("input", (e) => {
        state.query = e.target.value;
        renderCards();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "/" && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
    });
}
