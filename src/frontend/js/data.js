// Single source of truth for directory data (categories + projects).
// Entity-encoded strings (m&aacute;ster, &oacute;n, &iacute;a) are preserved
// verbatim — the innerHTML render path decodes them at render time.

export const CATEGORIES = [
    { id: "all", label: "Todo", icon: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>' },
    { id: "ia", label: "IA", icon: '<svg viewBox="0 0 24 24"><path d="M12 2l2.4 4.8L19.2 9l-4.8 2.2L12 16l-2.4-4.8L4.8 9l4.8-2.2z"/></svg>' },
    { id: "fullstack", label: "Fullstack", icon: '<svg viewBox="0 0 24 24"><path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/><path d="M8 9l3 3-3 3"/></svg>' },
    { id: "backend", label: "Backend", icon: '<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="10" rx="1.5"/><path d="M6 12h.01M9 12h.01"/></svg>' },
    { id: "tools", label: "Herramientas", icon: '<svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5 5L3 18v3h3l6.7-6.7a4 4 0 0 0 5-5L14 13l-3-3z"/></svg>' },
];

export const PROJECTS = [
    {
        name: "Cuqui",
        initials: "CU",
        category: "ia",
        accent: "var(--accent)",
        featured: true,
        description: "Timer de cocina controlado por voz. App mobile y web, presentada como trabajo de fin de m&aacute;ster.",
        tier: "TFM",
        tierText: "Proyecto de fin de m&aacute;ster en desarrollo con IA de Big School. Pendiente de nota.",
        tags: ["ia", "voz", "mobile", "web"],
        link: "https://github.com/JoseAPortillo"
    },
    {
        name: "App Escritorio MVP",
        initials: "MV",
        category: "fullstack",
        accent: "var(--blue)",
        featured: false,
        description: "MVP que corre en web desde un servidor local. El objetivo es escalarlo a aplicaci&oacute;n de escritorio.",
        tier: "En desarrollo",
        tierText: "MVP funcional en web; el siguiente paso es llevarlo a escritorio.",
        tags: ["web", "mvp", "local"],
        link: "https://github.com/JoseAPortillo"
    },
    {
        name: "Videovigilancia",
        initials: "VIG",
        category: "backend",
        accent: "var(--cyan)",
        featured: false,
        description: "Sistema de videovigilancia en funcionamiento, con servidor local desplegado en una Raspberry Pi 3B+.",
        tier: "En producci&oacute;n",
        tierText: "Operativo con servidor local en una Raspberry Pi 3B+.",
        tags: ["raspberry-pi", "local", "video"],
        link: "https://github.com/JoseAPortillo"
    },
    {
        name: "Pipeline Manager",
        initials: "PM",
        category: "tools",
        accent: "var(--purple)",
        featured: false,
        description: "Herramienta de gesti&oacute;n del pipeline de producci&oacute;n: asignaci&oacute;n de tareas y seguimiento entre departamentos. Qued&oacute; a medio camino y la retomar&eacute;.",
        tier: "Pendiente",
        tierText: "No pude terminarla, pero la subo a GitHub pronto para que se vea su funcionalidad.",
        tags: ["python", "tools", "pipeline"],
        link: "https://github.com/JoseAPortillo"
    }
];
