// Project media viewer: click any image or video inside a project gallery to
// open it full-screen with zoom. The overlay is built once, lazily, on first
// open. Module scope keeps everything out of the global namespace.
//
// Zoom model (images only): the stage shows the media at its fit size
// (zoom 1). The image is scaled around its top-left corner with
// `transform: translate(panX, panY) scale(zoom)`, so panning and zoom-to-cursor
// are plain coordinate math. Video keeps its native controls and does not zoom.

let viewerEl = null;
let lastTrigger = null;

// Zoom/pan state for the image currently shown (fit size = zoom 1).
let zoom = 1;
let panX = 0;
let panY = 0;
let drag = null; // { pointerId, startX, startY, panX, panY }
let wasMoved = false;

const MAX_ZOOM = 5;
const TOGGLE_ZOOM = 2.5;

function ensureViewer() {
    if (viewerEl) return viewerEl;

    viewerEl = document.createElement("div");
    viewerEl.className = "project-viewer";
    viewerEl.hidden = true;

    const windowEl = document.createElement("div");
    windowEl.className = "viewer-window";

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "viewer-close";
    closeBtn.setAttribute("aria-label", "Close viewer");
    closeBtn.textContent = "\u00d7";
    windowEl.appendChild(closeBtn);

    const content = document.createElement("div");
    content.className = "viewer-content";

    const stage = document.createElement("div");
    stage.className = "viewer-stage";
    content.appendChild(stage);

    const toolbar = document.createElement("div");
    toolbar.className = "viewer-toolbar";

    const zoomOutBtn = document.createElement("button");
    zoomOutBtn.type = "button";
    zoomOutBtn.setAttribute("aria-label", "Zoom out");
    zoomOutBtn.textContent = "\u2212";

    const zoomLabel = document.createElement("span");
    zoomLabel.className = "viewer-zoom-label";
    zoomLabel.textContent = "\u00d71";

    const zoomInBtn = document.createElement("button");
    zoomInBtn.type = "button";
    zoomInBtn.setAttribute("aria-label", "Zoom in");
    zoomInBtn.textContent = "+";

    const resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.setAttribute("aria-label", "Reset zoom");
    resetBtn.textContent = "\u00d71";

    toolbar.append(zoomOutBtn, zoomLabel, zoomInBtn, resetBtn);
    content.appendChild(toolbar);

    windowEl.appendChild(content);
    viewerEl.appendChild(windowEl);
    document.body.appendChild(viewerEl);

    // --- interactions -------------------------------------------------------

    zoomOutBtn.addEventListener("click", () => zoomBy(1 / 1.35));
    zoomInBtn.addEventListener("click", () => zoomBy(1.35));
    resetBtn.addEventListener("click", resetZoom);

    // Mouse wheel zooms toward the cursor. preventDefault keeps the page from
    // scrolling while the overlay is open.
    stage.addEventListener(
        "wheel",
        (event) => {
            event.preventDefault();
            const img = stage.querySelector("img");
            if (!img) return;
            zoomAt(event.clientX, event.clientY, event.deltaY < 0 ? 1.12 : 1 / 1.12);
        },
        { passive: false }
    );

    // Drag to pan while zoomed. pointerup/pointercancel are on document so a
    // drag that leaves the stage still ends cleanly.
    stage.addEventListener("pointerdown", (event) => {
        const img = stage.querySelector("img");
        if (!img || zoom <= 1) return;
        wasMoved = false;
        drag = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            panX,
            panY,
        };
        stage.classList.add("dragging");
    });
    stage.addEventListener("pointermove", (event) => {
        if (!drag || drag.pointerId !== event.pointerId) return;
        const dx = event.clientX - drag.startX;
        const dy = event.clientY - drag.startY;
        if (Math.abs(dx) + Math.abs(dy) > 4) wasMoved = true;
        panX = clampPan(drag.panX + dx, stage.offsetWidth);
        panY = clampPan(drag.panY + dy, stage.offsetHeight);
        applyTransform();
    });
    const endDrag = (event) => {
        if (!drag || drag.pointerId !== event.pointerId) return;
        drag = null;
        stage.classList.remove("dragging");
    };
    document.addEventListener("pointerup", endDrag);
    document.addEventListener("pointercancel", endDrag);

    // Click toggles between fit size and a comfortable zoom level, unless the
    // pointer just dragged (wasMoved is set by pointermove before the click).
    stage.addEventListener("click", (event) => {
        if (wasMoved) return;
        const img = stage.querySelector("img");
        if (!img || event.target !== img) return;
        toggleZoom();
    });

    // Backdrop click (outside the floating window) closes the viewer.
    viewerEl.addEventListener("click", (event) => {
        if (!event.target.closest(".viewer-window")) closeViewer();
    });
    closeBtn.addEventListener("click", closeViewer);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeViewer();
    });

    return viewerEl;
}

function openViewer(trigger) {
    const overlay = ensureViewer();
    const windowEl = overlay.querySelector(".viewer-window");
    const stage = overlay.querySelector(".viewer-stage");

    // The stage gets the fit size; the media fills it, and zoom transforms
    // the image inside the stage (clipped by overflow: hidden).
    const rect = trigger.getBoundingClientRect();
    const scale = (2 * 4) / 3; // 2x gallery size, one third bigger than before
    let w = rect.width * scale;
    let h = rect.height * scale;
    const fit = Math.min(1, (window.innerWidth * 0.96) / w, (window.innerHeight * 0.9) / h);
    w *= fit;
    h *= fit;

    let mediaEl;
    if (trigger.tagName === "VIDEO") {
        // Clone the original so poster/type are preserved; the clone is the
        // only element that carries controls + autoplay. The gallery video may
        // load through <source> children, so resolve the real source and set
        // it explicitly to make the clone self-contained.
        const clone = trigger.cloneNode(false);
        clone.removeAttribute("controls");
        clone.removeAttribute("autoplay");
        clone.controls = true;
        clone.autoplay = true;
        const src = resolveMediaSrc(trigger);
        if (src) clone.src = src;
        stage.appendChild(clone);
        mediaEl = clone;
    } else {
        const img = document.createElement("img");
        img.src = trigger.currentSrc || trigger.src;
        img.alt = trigger.alt || "";
        img.draggable = false;
        stage.appendChild(img);
        mediaEl = img;
    }

    stage.style.width = w + "px";
    stage.style.height = h + "px";
    resetZoom();

    // Show at final layout so the window rect is measurable, then set the
    // scale origin to the clicked image's center and run the scale-in.
    overlay.hidden = false;
    windowEl.style.animation = "none";
    void windowEl.offsetWidth;

    const winRect = windowEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    windowEl.style.transformOrigin = (cx - winRect.left) + "px " + (cy - winRect.top) + "px";
    windowEl.style.animation = "";
    void windowEl.offsetWidth;

    lastTrigger = trigger;
}

function closeViewer() {
    if (!viewerEl || viewerEl.hidden) return;
    const windowEl = viewerEl.querySelector(".viewer-window");
    if (windowEl.classList.contains("viewer-closing")) return;

    // Pause and detach any video so its stream is released.
    const media = viewerEl.querySelector(".viewer-stage video");
    if (media) {
        media.pause();
        media.removeAttribute("src");
        media.load();
    }

    const finish = () => {
        if (viewerEl.hidden) return; // already finished
        windowEl.classList.remove("viewer-closing");
        windowEl.style.animation = "none";
        void windowEl.offsetWidth;
        windowEl.style.animation = "";
        windowEl.style.transformOrigin = "";

        const stage = viewerEl.querySelector(".viewer-stage");
        stage.style.width = "";
        stage.style.height = "";
        stage.classList.remove("zoomed", "dragging");
        stage.replaceChildren();
        zoom = 1;
        panX = 0;
        panY = 0;
        viewerEl.querySelector(".viewer-zoom-label").textContent = "\u00d71";

        viewerEl.hidden = true;
        if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
        lastTrigger = null;
    };

    // Play the scale-out animation, then finish cleanup. The timeout is a
    // fallback so the overlay can never get stuck if animationend is missed.
    windowEl.classList.add("viewer-closing");
    windowEl.addEventListener("animationend", finish, { once: true });
    window.setTimeout(finish, 350);
}

// --- zoom/pan helpers --------------------------------------------------------

// Resolve the actual source URL of an img/video. Gallery media may set it via
// the src attribute (images, most videos) or via a <source> child (video).
function resolveMediaSrc(media) {
    if (media.currentSrc) return media.currentSrc;
    const source = media.querySelector("source");
    if (source) return source.getAttribute("src");
    return media.getAttribute("src");
}

function stageEl() {
    return viewerEl.querySelector(".viewer-stage");
}

function applyTransform() {
    const img = stageEl().querySelector("img");
    if (img) img.style.transform = "translate(" + panX + "px, " + panY + "px) scale(" + zoom + ")";
}

// Keep the visible region inside the scaled image: with origin at 0 0 the
// image spans [pan, pan + size*zoom], so pan must stay in [-size*(zoom-1), 0].
function clampPan(value, size) {
    const maxPan = size * (zoom - 1);
    return Math.min(0, Math.max(-maxPan, value));
}

function syncZoomUI() {
    viewerEl.querySelector(".viewer-zoom-label").textContent =
        zoom === 1 ? "\u00d71" : "\u00d7" + (Math.round(zoom * 100) / 100).toString();
    stageEl().classList.toggle("zoomed", zoom > 1);
}

function resetZoom() {
    zoom = 1;
    panX = 0;
    panY = 0;
    applyTransform();
    syncZoomUI();
}

function zoomAt(clientX, clientY, factor) {
    const stage = stageEl();
    const img = stage.querySelector("img");
    if (!img) return;
    const next = Math.min(MAX_ZOOM, Math.max(1, zoom * factor));
    if (next === zoom) return;
    const f = next / zoom;
    const rect = stage.getBoundingClientRect();
    const cx = clientX - rect.left;
    const cy = clientY - rect.top;
    panX = clampPan(cx - (cx - panX) * f, stage.offsetWidth);
    panY = clampPan(cy - (cy - panY) * f, stage.offsetHeight);
    zoom = next;
    applyTransform();
    syncZoomUI();
}

function zoomBy(factor) {
    const stage = stageEl();
    const rect = stage.getBoundingClientRect();
    zoomAt(rect.left + stage.offsetWidth / 2, rect.top + stage.offsetHeight / 2, factor);
}

function toggleZoom() {
    const stage = stageEl();
    if (zoom > 1) {
        resetZoom();
    } else {
        const rect = stage.getBoundingClientRect();
        zoomAt(rect.left + stage.offsetWidth / 2, rect.top + stage.offsetHeight / 2, TOGGLE_ZOOM);
    }
}

// Event delegation: any img/video inside a .project-media-item that has a real
// source opens the viewer. Placeholder slots carry no source and are skipped.
document.addEventListener("click", (event) => {
    const media = event.target.closest(".project-media-item img, .project-media-item video");
    if (!media || !resolveMediaSrc(media)) return;
    event.preventDefault();
    openViewer(media);
});
