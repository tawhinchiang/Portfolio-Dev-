document.documentElement.classList.add("js-enabled");

const MOBILE_BREAKPOINT = 860;
const PROJECTS_INITIAL_LIMIT = 6;
const THEME_STORAGE_KEY = "portfolio-theme";
const LANGUAGE_STORAGE_KEY = "portfolio-language";
const SUPPORTED_LANGUAGES = ["pt", "en", "es"];
const DEFAULT_LANGUAGE = "en";
const WHATSAPP_PHONE = "5563992014547";

const projectLinks = {
    panificadora: [
        {
            labelKey: "featured.viewProject",
            url: "https://panificadora-landing-completo.vercel.app/",
            primary: true
        }
    ],
    adivinhe: [
        {
            labelKey: "featured.sourceCode",
            url: "https://github.com/tawhinchiang/adivinhe",
            primary: true
        }
    ],
    hairday: [
        {
            labelKey: "featured.sourceCode",
            url: "https://github.com/tawhinchiang/HairDay",
            primary: true
        }
    ],
    zingen: [
        {
            labelKey: "featured.sourceCode",
            url: "https://github.com/tawhinchiang/Projeto-Zingen",
            primary: true
        }
    ],
    refund: [
        {
            labelKey: "featured.sourceCode",
            url: "https://github.com/tawhinchiang/refund-template-main",
            primary: true
        }
    ],
    travelgram: [
        {
            labelKey: "featured.sourceCode",
            url: "https://github.com/tawhinchiang/Travelgram",
            primary: true
        }
    ],
    "tech-news": [
        {
            labelKey: "featured.sourceCode",
            url: "https://github.com/tawhinchiang/Portal-de-Noticias",
            primary: true
        }
    ],
    receita: [
        {
            labelKey: "featured.sourceCode",
            url: "https://github.com/tawhinchiang/pagina_receitas",
            primary: true
        }
    ],
    turismo: [
        {
            labelKey: "projects.viewGithub",
            url: "https://github.com/tawhinchiang",
            primary: true
        }
    ],
    "barbearia-saas": [
        {
            labelKey: "featured.sourceCode",
            url: "https://github.com/tawhinchiang/BARBEARIASAAS",
            primary: true
        }
    ]
};

let currentLanguage = "pt";

function getStoredValue(key) {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function storeValue(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch {
        return;
    }
}

function getTranslationValue(key, language = currentLanguage) {
    const dictionary = window.portfolioTranslations?.[language];

    return key.split(".").reduce((value, part) => value?.[part], dictionary);
}

function translate(key, replacements = {}) {
    const value = getTranslationValue(key);

    if (typeof value !== "string") {
        return key;
    }

    return Object.entries(replacements).reduce(
        (text, [name, replacement]) => text.replaceAll(`{${name}}`, replacement),
        value
    );
}

function normalizeLanguage(language) {
    return language?.toLowerCase().split("-")[0];
}

function detectBrowserLanguage() {
    const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
    const detectedLanguage = browserLanguages
        .map(normalizeLanguage)
        .find(language => SUPPORTED_LANGUAGES.includes(language));

    return detectedLanguage || DEFAULT_LANGUAGE;
}

function getInitialLanguage() {
    const storedLanguage = getStoredValue(LANGUAGE_STORAGE_KEY);

    return SUPPORTED_LANGUAGES.includes(storedLanguage) ? storedLanguage : detectBrowserLanguage();
}

function updateTranslatedText() {
    document.querySelectorAll("[data-i18n]").forEach(element => {
        const translation = getTranslationValue(element.dataset.i18n);

        if (typeof translation === "string") {
            element.textContent = translation;
        }
    });
}

function updateTranslatedAttributes() {
    document.querySelectorAll("[data-i18n-aria-label]").forEach(element => {
        element.setAttribute("aria-label", translate(element.dataset.i18nAriaLabel));
    });

    document.querySelectorAll("[data-i18n-content]").forEach(element => {
        element.setAttribute("content", translate(element.dataset.i18nContent));
    });

    document.querySelectorAll("[data-i18n-alt]").forEach(element => {
        element.setAttribute("alt", translate(element.dataset.i18nAlt));
    });
}

function createWhatsAppUrl() {
    const message = encodeURIComponent(translate("contact.whatsappMessage"));
    return `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
}

function updateWhatsAppLinks() {
    const url = createWhatsAppUrl();
    document.querySelectorAll("[data-whatsapp-link]").forEach(link => {
        link.href = url;
    });
}

function updateStructuredProfile() {
    const element = document.querySelector("[data-structured-profile]");

    if (!element) {
        return;
    }

    try {
        const profile = JSON.parse(element.textContent);
        profile.jobTitle = translate("meta.jobTitle");
        element.textContent = JSON.stringify(profile);
    } catch {
        return;
    }
}

function applyLanguage(language, shouldStore = false) {
    if (!SUPPORTED_LANGUAGES.includes(language)) {
        return;
    }

    currentLanguage = language;
    document.documentElement.lang = getTranslationValue("locale");
    document.title = translate("meta.title");
    updateTranslatedText();
    updateTranslatedAttributes();
    updateWhatsAppLinks();
    updateStructuredProfile();

    const selector = document.querySelector("[data-language-select]");
    if (selector) {
        selector.value = language;
    }

    if (shouldStore) {
        storeValue(LANGUAGE_STORAGE_KEY, language);
    }

    document.dispatchEvent(new CustomEvent("portfolio:languagechange", {
        detail: { language }
    }));
}

function initializeLanguage() {
    const selector = document.querySelector("[data-language-select]");

    applyLanguage(getInitialLanguage());

    selector?.addEventListener("change", event => {
        applyLanguage(event.target.value, true);
    });
}

function getPreferredTheme() {
    const storedTheme = getStoredValue(THEME_STORAGE_KEY);

    if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function updateThemeControl(theme, button) {
    const isLightTheme = theme === "light";
    const icon = button.querySelector("[data-theme-icon]");

    button.setAttribute("aria-label", translate(isLightTheme ? "accessibility.themeDark" : "accessibility.themeLight"));
    icon.textContent = isLightTheme ? "☾" : "☀";
}

function applyTheme(theme, button) {
    const themeColor = document.querySelector('meta[name="theme-color"]');

    document.documentElement.dataset.theme = theme;
    themeColor?.setAttribute("content", theme === "light" ? "#f7f8fa" : "#0d0f14");
    updateThemeControl(theme, button);
}

function initializeTheme() {
    const button = document.querySelector("[data-theme-toggle]");

    if (!button) {
        return;
    }

    applyTheme(getPreferredTheme(), button);

    button.addEventListener("click", () => {
        const currentTheme = document.documentElement.dataset.theme;
        const nextTheme = currentTheme === "light" ? "dark" : "light";

        applyTheme(nextTheme, button);
        storeValue(THEME_STORAGE_KEY, nextTheme);
    });

    document.addEventListener("portfolio:languagechange", () => {
        updateThemeControl(document.documentElement.dataset.theme, button);
    });
}

function setMenuState(isOpen, toggle, navigation) {
    toggle.setAttribute("aria-expanded", String(isOpen));
    navigation.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("menu-is-open", isOpen);
}

function initializeMobileMenu() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const navigation = document.querySelector("[data-navigation]");

    if (!toggle || !navigation) {
        return;
    }

    toggle.addEventListener("click", () => {
        const isOpen = toggle.getAttribute("aria-expanded") === "true";
        setMenuState(!isOpen, toggle, navigation);
    });

    navigation.addEventListener("click", event => {
        if (event.target.closest("a")) {
            setMenuState(false, toggle, navigation);
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            setMenuState(false, toggle, navigation);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > MOBILE_BREAKPOINT) {
            setMenuState(false, toggle, navigation);
        }
    });
}

function initializeHeaderState() {
    const header = document.querySelector("[data-site-header]");

    if (!header) {
        return;
    }

    const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 24);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
}

function setActiveNavigationLink(sectionId, links) {
    links.forEach(link => {
        const isActive = link.getAttribute("href") === `#${sectionId}`;
        link.classList.toggle("is-active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

function initializeScrollSpy() {
    const sections = document.querySelectorAll("[data-page-section]");
    const links = document.querySelectorAll("[data-nav-link]");

    if (!sections.length || !links.length || !("IntersectionObserver" in window)) {
        return;
    }

    const observer = new IntersectionObserver(entries => {
        const visibleEntry = entries
            .filter(entry => entry.isIntersecting)
            .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (visibleEntry) {
            setActiveNavigationLink(visibleEntry.target.id, links);
        }
    }, {
        rootMargin: "-25% 0px -60% 0px",
        threshold: [0.05, 0.2, 0.5]
    });

    sections.forEach(section => observer.observe(section));
}

function activateTab(tabId, tabs, panels, shouldFocus = false) {
    tabs.forEach(tab => {
        const isSelected = tab.dataset.tab === tabId;

        tab.setAttribute("aria-selected", String(isSelected));
        tab.tabIndex = isSelected ? 0 : -1;

        if (isSelected && shouldFocus) {
            tab.focus();
        }
    });

    panels.forEach(panel => {
        panel.hidden = panel.dataset.tabPanel !== tabId;
    });
}

function getNextTabIndex(currentIndex, key, lastIndex) {
    const indexes = {
        ArrowRight: currentIndex === lastIndex ? 0 : currentIndex + 1,
        ArrowLeft: currentIndex === 0 ? lastIndex : currentIndex - 1,
        Home: 0,
        End: lastIndex
    };

    return indexes[key];
}

function initializeTabs() {
    document.querySelectorAll("[data-tabs]").forEach(tabGroup => {
        const tabs = [...tabGroup.querySelectorAll("[data-tab]")];
        const panels = [...tabGroup.querySelectorAll("[data-tab-panel]")];

        if (!tabs.length || !panels.length) {
            return;
        }

        activateTab(tabs[0].dataset.tab, tabs, panels);

        tabs.forEach((tab, index) => {
            tab.addEventListener("click", () => activateTab(tab.dataset.tab, tabs, panels));

            tab.addEventListener("keydown", event => {
                const nextIndex = getNextTabIndex(index, event.key, tabs.length - 1);

                if (nextIndex === undefined) {
                    return;
                }

                event.preventDefault();
                activateTab(tabs[nextIndex].dataset.tab, tabs, panels, true);
            });
        });
    });
}

function projectMatchesFilter(card, activeFilter) {
    return activeFilter === "all" || card.dataset.categories.split(" ").includes(activeFilter);
}

function updateFilterButtons(buttons, activeFilter) {
    buttons.forEach(button => {
        const isActive = button.dataset.projectFilter === activeFilter;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

function initializeProjectFilters() {
    const buttons = [...document.querySelectorAll("[data-project-filter]")];
    const cards = [...document.querySelectorAll("[data-project-card]")];
    const showMoreButton = document.querySelector("[data-show-more]");
    const status = document.querySelector("[data-filter-status]");

    if (!buttons.length || !cards.length || !showMoreButton || !status) {
        return;
    }

    let activeFilter = "all";
    let showAllProjects = false;

    const renderProjects = () => {
        const matchingCards = cards.filter(card => projectMatchesFilter(card, activeFilter));
        const shouldLimit = activeFilter === "all" && !showAllProjects;

        cards.forEach(card => {
            const matchingIndex = matchingCards.indexOf(card);
            const exceedsLimit = shouldLimit && matchingIndex >= PROJECTS_INITIAL_LIMIT;
            card.hidden = matchingIndex === -1 || exceedsLimit;
        });

        showMoreButton.hidden = activeFilter !== "all" || showAllProjects || matchingCards.length <= PROJECTS_INITIAL_LIMIT;
        status.textContent = translate(matchingCards.length === 1 ? "projects.foundOne" : "projects.foundMany", {
            count: matchingCards.length
        });
        updateFilterButtons(buttons, activeFilter);
    };

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            activeFilter = button.dataset.projectFilter;
            showAllProjects = false;
            renderProjects();
        });
    });

    showMoreButton.addEventListener("click", () => {
        showAllProjects = true;
        renderProjects();
    });

    document.addEventListener("portfolio:languagechange", renderProjects);
    renderProjects();
}

function getProjectDetails(projectId) {
    const details = getTranslationValue(`caseStudies.${projectId}`);

    return details ? { ...details, links: projectLinks[projectId] || [] } : null;
}

function createDialogLink(link) {
    const anchor = document.createElement("a");

    anchor.className = `button button-small ${link.primary ? "button-primary" : "button-ghost"}`;
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    anchor.textContent = translate(link.labelKey);

    return anchor;
}

function fillProjectDialog(project, dialog) {
    dialog.querySelector("[data-dialog-title]").textContent = project.title;
    dialog.querySelector("[data-dialog-problem]").textContent = project.problem;
    dialog.querySelector("[data-dialog-solution]").textContent = project.solution;
    dialog.querySelector("[data-dialog-learning]").textContent = project.learning;

    const technologies = dialog.querySelector("[data-dialog-technologies]");
    const actions = dialog.querySelector("[data-dialog-actions]");

    technologies.replaceChildren(...project.technologies.map(technology => {
        const tag = document.createElement("span");
        tag.textContent = technology;
        return tag;
    }));

    actions.replaceChildren(...project.links.map(createDialogLink));
}

function initializeProjectDialog() {
    const dialog = document.querySelector("[data-project-modal]");
    const closeButton = dialog?.querySelector("[data-dialog-close]");
    const openButtons = document.querySelectorAll("[data-project-dialog]");
    let lastTrigger = null;

    if (!dialog || !closeButton || !openButtons.length) {
        return;
    }

    const refreshOpenDialog = () => {
        const project = getProjectDetails(dialog.dataset.projectId);
        if (dialog.open && project) {
            fillProjectDialog(project, dialog);
        }
    };

    openButtons.forEach(button => {
        button.addEventListener("click", () => {
            const projectId = button.dataset.projectDialog;
            const project = getProjectDetails(projectId);

            if (!project) {
                return;
            }

            lastTrigger = button;
            dialog.dataset.projectId = projectId;
            fillProjectDialog(project, dialog);
            dialog.showModal();
        });
    });

    closeButton.addEventListener("click", () => dialog.close());

    dialog.addEventListener("click", event => {
        if (event.target === dialog) {
            dialog.close();
        }
    });

    dialog.addEventListener("close", () => lastTrigger?.focus());
    document.addEventListener("portfolio:languagechange", refreshOpenDialog);
}

function copyWithFallback(text) {
    const temporaryInput = document.createElement("textarea");

    temporaryInput.value = text;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";
    document.body.appendChild(temporaryInput);
    temporaryInput.select();
    const wasCopied = document.execCommand("copy");
    temporaryInput.remove();

    if (!wasCopied) {
        throw new Error("Copy command failed");
    }
}

async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return;
        } catch {
            copyWithFallback(text);
            return;
        }
    }

    copyWithFallback(text);
}

function showToast(message) {
    const toast = document.querySelector("[data-toast]");

    if (!toast) {
        return;
    }

    window.clearTimeout(showToast.timeoutId);
    toast.textContent = message;
    toast.classList.add("is-visible");

    showToast.timeoutId = window.setTimeout(() => {
        toast.classList.remove("is-visible");
    }, 2600);
}

function initializeEmailCopy() {
    const button = document.querySelector("[data-copy-email]");

    if (!button) {
        return;
    }

    button.addEventListener("click", async () => {
        try {
            await copyText(button.dataset.email);
            showToast(translate("contact.emailCopied"));
        } catch {
            showToast(translate("contact.emailError"));
        }
    });
}

function initializeRevealAnimations() {
    const elements = document.querySelectorAll("[data-reveal]");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        elements.forEach(element => element.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    elements.forEach(element => observer.observe(element));
}

function initializePortfolio() {
    initializeLanguage();
    initializeTheme();
    initializeMobileMenu();
    initializeHeaderState();
    initializeScrollSpy();
    initializeTabs();
    initializeProjectFilters();
    initializeProjectDialog();
    initializeEmailCopy();
    initializeRevealAnimations();
}

initializePortfolio();
