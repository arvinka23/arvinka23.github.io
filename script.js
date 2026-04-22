const body = document.body;
const html = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const languageToggle = document.getElementById("languageToggle");
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

const state = {
    lang: "de",
    theme: "dark",
    content: null,
    projectFilter: "all"
};

const isPrototypePage = Boolean(document.getElementById("heroBadge"));

window.dataLayer = window.dataLayer || [];
const track = (event, details = {}) => {
    window.dataLayer.push({
        event,
        ts: new Date().toISOString(),
        ...details
    });
};

const getText = (value) => {
    if (value && typeof value === "object" && value.de && value.en) {
        return value[state.lang] || value.de;
    }
    return value || "";
};

const initLegacyPage = () => {
    const legacyThemeToggle = document.querySelector(".theme-toggle");
    const legacyThemeIcon = document.querySelector(".theme-icon");
    const legacyNavToggle = document.querySelector(".nav-toggle");
    const legacyNav = document.querySelector(".nav");
    const legacyNavLinks = document.querySelectorAll(".nav-links a");
    const legacyContactForm = document.getElementById("contactForm");
    const legacyFormLoading = document.getElementById("formLoading");
    const legacyYear = document.getElementById("year");

    const setLegacyTheme = (mode) => {
        body.classList.toggle("light-mode", mode === "light");
        if (legacyThemeIcon) {
            legacyThemeIcon.textContent = mode === "light" ? "☀️" : "🌙";
        }
        try {
            localStorage.setItem("theme", mode);
        } catch {
            // ignore storage failures
        }
    };

    const savedLegacyTheme = (() => {
        try {
            return localStorage.getItem("theme");
        } catch {
            return null;
        }
    })();
    setLegacyTheme(savedLegacyTheme || "dark");

    if (legacyThemeToggle) {
        legacyThemeToggle.addEventListener("click", () => {
            const nextTheme = body.classList.contains("light-mode") ? "dark" : "light";
            setLegacyTheme(nextTheme);
        });
    }

    if (legacyNavToggle && legacyNav) {
        legacyNavToggle.addEventListener("click", () => {
            legacyNav.classList.toggle("open");
        });
    }

    legacyNavLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href") || "";
            if (href.startsWith("#")) {
                event.preventDefault();
                const target = document.querySelector(href);
                target?.scrollIntoView({ behavior: "smooth" });
            }
            legacyNav?.classList.remove("open");
        });
    });

    if (legacyContactForm && legacyFormLoading) {
        legacyContactForm.addEventListener("submit", () => {
            legacyFormLoading.hidden = false;
        });
    }

    if (legacyYear) {
        legacyYear.textContent = String(new Date().getFullYear());
    }

    document.querySelectorAll(".project-preview img").forEach((img) => {
        const label = img.nextElementSibling;
        if (!label) return;
        img.addEventListener("load", () => { label.style.display = "none"; });
        img.addEventListener("error", () => {
            img.style.display = "none";
            label.style.display = "";
        });
    });
};

const setTheme = (theme) => {
    state.theme = theme;
    if (theme === "dark") {
        html.classList.add("dark");
        if (themeIcon) themeIcon.textContent = "🌙";
    } else {
        html.classList.remove("dark");
        if (themeIcon) themeIcon.textContent = "☀️";
    }
    try {
        localStorage.setItem("portfolio_theme", theme);
    } catch {
        // ignore storage failures
    }
};

const setLanguage = (lang) => {
    state.lang = lang;
    document.documentElement.lang = lang;
    if (languageToggle) {
        languageToggle.textContent = lang.toUpperCase();
    }
    try {
        localStorage.setItem("portfolio_lang", lang);
    } catch {
        // ignore storage failures
    }
    renderAll();
    track("language_toggle", { lang });
};

const createBadge = (text) => {
    const span = document.createElement("span");
    span.className = "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    span.textContent = text;
    return span;
};

const applyMotion = () => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries, io) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll("section article, .project-item, .social-item, .insight-item").forEach((el) => {
        el.classList.add("motion-enter");
        observer.observe(el);
    });
};

const renderNav = () => {
    if (!state.content) return;
    const nav = state.content.nav;
    document.querySelectorAll("[data-nav]").forEach((el) => {
        const key = el.getAttribute("data-nav");
        el.textContent = getText(nav[key]);
    });
};

const renderHero = () => {
    const hero = state.content.hero;
    const heroBadge = document.getElementById("heroBadge");
    const heroTitle = document.getElementById("heroTitle");
    const heroIntro = document.getElementById("heroIntro");
    const profileRole = document.getElementById("profileRole");
    const heroCtaProjects = document.getElementById("heroCtaProjects");
    const heroCtaContact = document.getElementById("heroCtaContact");
    const heroCtaCv = document.getElementById("heroCtaCv");
    const heroMetrics = document.getElementById("heroMetrics");

    heroBadge.textContent = getText(hero.badge);
    heroTitle.textContent = getText(hero.title);
    heroIntro.textContent = getText(hero.intro);
    profileRole.textContent = getText(hero.role);
    heroCtaProjects.textContent = getText(hero.ctaProjects);
    heroCtaContact.textContent = getText(hero.ctaContact);
    heroCtaCv.textContent = getText(hero.ctaCv);

    heroMetrics.innerHTML = "";
    hero.metrics.forEach((metric) => {
        const card = document.createElement("div");
        card.className = "rounded-xl border border-slate-200 p-4 dark:border-slate-700";
        card.innerHTML = `<p class="text-2xl font-extrabold">${metric.value}</p><p class="text-xs text-slate-500 dark:text-slate-400">${getText(metric.label)}</p>`;
        heroMetrics.appendChild(card);
    });
};

const createProjectCard = (project) => {
    const card = document.createElement("article");
    card.className = "project-item surface rounded-2xl border border-white/60 p-5 shadow-soft dark:border-slate-800/80";
    card.setAttribute("data-category", project.category);

    const titleRow = document.createElement("div");
    titleRow.className = "mb-3 flex items-center justify-between gap-3";

    const name = document.createElement("h3");
    name.className = "text-lg font-semibold";
    name.textContent = project.name;
    titleRow.appendChild(name);

    const status = document.createElement("span");
    status.className = "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    status.textContent = getText(project.status);
    titleRow.appendChild(status);
    card.appendChild(titleRow);

    const desc = document.createElement("p");
    desc.className = "mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300";
    desc.textContent = getText(project.description);
    card.appendChild(desc);

    const tags = document.createElement("div");
    tags.className = "mb-4 flex flex-wrap gap-2";
    project.tags.forEach((tag) => tags.appendChild(createBadge(tag)));
    card.appendChild(tags);

    const links = document.createElement("div");
    links.className = "flex flex-wrap gap-3";
    project.links.forEach((link) => {
        const a = document.createElement("a");
        a.href = link.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.className = "text-sm font-semibold text-accentA hover:underline";
        a.textContent = link.label;
        links.appendChild(a);
    });
    card.appendChild(links);

    return card;
};

const renderProjects = () => {
    const projects = state.content.projects;
    const projectsEyebrow = document.getElementById("projectsEyebrow");
    const projectsTitle = document.getElementById("projectsTitle");
    const projectFilters = document.getElementById("projectFilters");
    const projectsGrid = document.getElementById("projectsGrid");

    projectsEyebrow.textContent = getText(projects.eyebrow);
    projectsTitle.textContent = getText(projects.title);

    projectFilters.innerHTML = "";
    projects.filters.forEach((filter) => {
        const button = document.createElement("button");
        const active = state.projectFilter === filter.id;
        button.type = "button";
        button.className = active
            ? "rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-slate-900"
            : "rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300";
        button.textContent = getText(filter.label);
        button.addEventListener("click", () => {
            state.projectFilter = filter.id;
            renderProjects();
            track("project_filter", { filter: filter.id });
        });
        projectFilters.appendChild(button);
    });

    projectsGrid.innerHTML = "";
    const visibleItems = projects.items.filter((item) => state.projectFilter === "all" || item.category === state.projectFilter);
    visibleItems.forEach((project) => {
        projectsGrid.appendChild(createProjectCard(project));
    });
};

const renderAbout = () => {
    const about = state.content.about;
    document.getElementById("aboutEyebrow").textContent = getText(about.eyebrow);
    document.getElementById("aboutTitle").textContent = getText(about.title);
    document.getElementById("timelineTitle").textContent = getText(about.timelineTitle);

    const aboutParagraphs = document.getElementById("aboutParagraphs");
    aboutParagraphs.innerHTML = "";
    about.paragraphs.forEach((paragraph) => {
        const p = document.createElement("p");
        p.textContent = getText(paragraph);
        aboutParagraphs.appendChild(p);
    });

    const timelineList = document.getElementById("timelineList");
    timelineList.innerHTML = "";
    about.timeline.forEach((entry) => {
        const li = document.createElement("li");
        li.className = "relative";
        li.innerHTML = `
            <span class="absolute -left-[1.35rem] top-1 h-2.5 w-2.5 rounded-full bg-accentA"></span>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${entry.period}</p>
            <p class="mt-1 font-semibold">${entry.title}</p>
            <p class="text-sm text-slate-600 dark:text-slate-300">${getText(entry.description)}</p>
        `;
        timelineList.appendChild(li);
    });
};

const renderSkills = () => {
    const skills = state.content.skills;
    document.getElementById("skillsTagTitle").textContent = getText(skills.tagTitle);
    document.getElementById("skillsProgressTitle").textContent = getText(skills.progressTitle);
    document.getElementById("skillsToolsTitle").textContent = getText(skills.toolsTitle);

    const skillsTags = document.getElementById("skillsTags");
    skillsTags.innerHTML = "";
    skills.tags.forEach((tag) => skillsTags.appendChild(createBadge(tag)));

    const skillsProgress = document.getElementById("skillsProgress");
    skillsProgress.innerHTML = "";
    skills.progress.forEach((item) => {
        const wrapper = document.createElement("div");
        wrapper.className = "space-y-1";
        wrapper.innerHTML = `
            <div class="flex items-center justify-between text-sm">
                <span>${item.name}</span>
                <span class="text-slate-500 dark:text-slate-400">${item.level}%</span>
            </div>
            <div class="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                <div class="accent-line h-2 rounded-full" style="width:${item.level}%"></div>
            </div>
        `;
        skillsProgress.appendChild(wrapper);
    });

    const skillsTools = document.getElementById("skillsTools");
    skillsTools.innerHTML = "";
    skills.tools.forEach((tool) => {
        const toolCard = document.createElement("div");
        toolCard.className = "rounded-xl border border-slate-200 p-3 dark:border-slate-700";
        toolCard.innerHTML = `
            <p class="font-semibold">${tool.name}</p>
            <p class="text-sm text-slate-600 dark:text-slate-300">${getText(tool.description)}</p>
        `;
        skillsTools.appendChild(toolCard);
    });
};

const renderBlog = () => {
    const blog = state.content.blog;
    document.getElementById("blogEyebrow").textContent = getText(blog.eyebrow);
    document.getElementById("blogTitle").textContent = getText(blog.title);
    const blogInsights = document.getElementById("blogInsights");
    blogInsights.innerHTML = "";

    blog.items.forEach((item) => {
        const article = document.createElement("article");
        article.className = "insight-item surface rounded-2xl border border-white/60 p-5 shadow-soft dark:border-slate-800/80";
        const tags = item.tags.map((tag) => `<span class="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">${tag}</span>`).join("");
        article.innerHTML = `
            <h3 class="text-lg font-semibold">${getText(item.title)}</h3>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">${getText(item.excerpt)}</p>
            <div class="mt-3 flex flex-wrap gap-2">${tags}</div>
            <a href="${item.url}" class="mt-4 inline-block text-sm font-semibold text-accentA hover:underline">${state.lang === "de" ? "Artikel öffnen" : "Open article"}</a>
        `;
        blogInsights.appendChild(article);
    });
};

const renderContact = () => {
    const contact = state.content.contact;
    document.getElementById("contactEyebrow").textContent = getText(contact.eyebrow);
    document.getElementById("contactTitle").textContent = getText(contact.title);
    document.getElementById("contactIntro").textContent = getText(contact.intro);
    document.getElementById("contactEmailLink").textContent = getText(contact.emailLabel);
    document.getElementById("nameLabel").textContent = getText(contact.nameLabel);
    document.getElementById("emailLabel").textContent = getText(contact.emailFieldLabel);
    document.getElementById("messageLabel").textContent = getText(contact.messageLabel);
    document.getElementById("submitButton").textContent = getText(contact.submitLabel);

    const socialGrid = document.getElementById("socialGrid");
    socialGrid.innerHTML = "";
    state.content.socials.forEach((social) => {
        const link = document.createElement("a");
        link.href = social.url;
        if (social.url.startsWith("http")) {
            link.target = "_blank";
            link.rel = "noopener";
        }
        link.className = "social-item group rounded-xl border border-slate-200 p-3 transition hover:-translate-y-0.5 hover:border-accentA dark:border-slate-700 dark:hover:border-accentA";
        link.innerHTML = `
            <div class="mb-2 flex items-center justify-between">
                <span class="text-xs font-bold tracking-wide text-accentA">${social.icon}</span>
                <span class="text-[11px] text-slate-500 dark:text-slate-400">${social.handle}</span>
            </div>
            <p class="text-sm font-semibold">${social.label}</p>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">${getText(social.detail)}</p>
        `;
        socialGrid.appendChild(link);
    });
};

const renderFooter = () => {
    document.getElementById("footerText").textContent = getText(state.content.footer);
};

const renderGithubShell = () => {
    const github = state.content.github;
    document.getElementById("githubEyebrow").textContent = getText(github.eyebrow);
    document.getElementById("githubTitle").textContent = getText(github.title);
    document.getElementById("ghReposLabel").textContent = getText(github.reposLabel);
    document.getElementById("ghFollowersLabel").textContent = getText(github.followersLabel);
    document.getElementById("ghEventsLabel").textContent = getText(github.eventsLabel);
    document.getElementById("ghRecentTitle").textContent = getText(github.recentTitle);
    document.getElementById("ghLoading").textContent = getText(github.loading);
};

const toEventText = (event) => {
    const repo = event.repo?.name || "unknown/repo";
    if (event.type === "PushEvent") {
        const commits = event.payload?.commits?.length || 0;
        return `${commits} commit${commits === 1 ? "" : "s"} → ${repo}`;
    }
    if (event.type === "CreateEvent") {
        return `Created ${event.payload?.ref_type || "item"} → ${repo}`;
    }
    if (event.type === "WatchEvent") {
        return `Starred → ${repo}`;
    }
    return `${event.type.replace("Event", "")} → ${repo}`;
};

const renderGithubData = (profile, events) => {
    document.getElementById("ghRepos").textContent = String(profile.public_repos ?? "—");
    document.getElementById("ghFollowers").textContent = String(profile.followers ?? "—");
    document.getElementById("ghEvents").textContent = String(events.length);

    const ghEventList = document.getElementById("ghEventList");
    ghEventList.innerHTML = "";
    events.slice(0, 6).forEach((event) => {
        const li = document.createElement("li");
        li.className = "rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-700";
        li.innerHTML = `
            <p class="font-semibold">${toEventText(event)}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">${new Date(event.created_at).toLocaleString(state.lang === "de" ? "de-CH" : "en-GB")}</p>
        `;
        ghEventList.appendChild(li);
    });
};

const renderGithubFallback = () => {
    document.getElementById("ghRepos").textContent = "—";
    document.getElementById("ghFollowers").textContent = "—";
    document.getElementById("ghEvents").textContent = "—";
    const ghEventList = document.getElementById("ghEventList");
    ghEventList.innerHTML = "";
    const li = document.createElement("li");
    li.className = "rounded-lg border border-slate-200 p-3 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400";
    li.textContent = getText(state.content.github.fallback);
    ghEventList.appendChild(li);
};

const loadGithub = async () => {
    const username = state.content.githubUsername;
    try {
        const [profileResponse, eventsResponse] = await Promise.all([
            fetch(`https://api.github.com/users/${encodeURIComponent(username)}`),
            fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=30`)
        ]);
        if (!profileResponse.ok || !eventsResponse.ok) throw new Error("GitHub API error");
        const profile = await profileResponse.json();
        const events = await eventsResponse.json();
        if (!Array.isArray(events)) throw new Error("Invalid event data");
        renderGithubData(profile, events);
        track("github_loaded", { events: events.length });
    } catch {
        renderGithubFallback();
        track("github_failed");
    }
};

const setupContactForm = () => {
    if (!contactForm || !formStatus) return;
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const honeypot = contactForm.querySelector('input[name="company"]');
        if (honeypot && honeypot.value.trim()) {
            formStatus.textContent = getText(state.content.contact.statusSpam);
            track("contact_spam_blocked");
            return;
        }

        const submitButton = document.getElementById("submitButton");
        if (submitButton) submitButton.disabled = true;
        formStatus.textContent = getText(state.content.contact.statusSending);
        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: { Accept: "application/json" }
            });
            if (!response.ok) throw new Error("Form submit failed");
            contactForm.reset();
            formStatus.textContent = getText(state.content.contact.statusSuccess);
            track("contact_success");
        } catch {
            formStatus.textContent = getText(state.content.contact.statusError);
            track("contact_error");
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    });
};

const setupControls = () => {
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const next = state.theme === "dark" ? "light" : "dark";
            setTheme(next);
            track("theme_toggle", { theme: next });
        });
    }

    if (languageToggle) {
        languageToggle.addEventListener("click", () => {
            const next = state.lang === "de" ? "en" : "de";
            setLanguage(next);
        });
    }

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener("click", () => {
            const isOpen = !mobileMenu.classList.contains("hidden");
            mobileMenu.classList.toggle("hidden");
            mobileMenuToggle.setAttribute("aria-expanded", String(!isOpen));
        });
        mobileMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                mobileMenu.classList.add("hidden");
                mobileMenuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    document.querySelectorAll("[data-track]").forEach((element) => {
        element.addEventListener("click", () => {
            track("cta_click", { label: element.getAttribute("data-track") });
        });
    });
};

const renderAll = () => {
    if (!state.content) return;
    renderNav();
    renderHero();
    renderProjects();
    renderAbout();
    renderSkills();
    renderGithubShell();
    renderBlog();
    renderContact();
    renderFooter();
    applyMotion();
};

const bootstrap = async () => {
    if (!isPrototypePage) {
        initLegacyPage();
        return;
    }

    try {
        if (window.__PORTFOLIO_CONTENT__) {
            state.content = window.__PORTFOLIO_CONTENT__;
        } else {
            const contentResponse = await fetch("content/portfolio-content.json");
            if (!contentResponse.ok) throw new Error("Content loading failed");
            state.content = await contentResponse.json();
        }
    } catch {
        if (window.__PORTFOLIO_CONTENT__) {
            state.content = window.__PORTFOLIO_CONTENT__;
        } else {
            const errorBox = document.createElement("div");
            errorBox.className = "mx-auto my-6 max-w-4xl rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300";
            errorBox.textContent = "Content konnte nicht geladen werden. Bitte Seite neu laden oder Cache leeren.";
            document.body.prepend(errorBox);
            return;
        }
    }

    const savedTheme = (() => {
        try {
            return localStorage.getItem("portfolio_theme");
        } catch {
            return null;
        }
    })();
    setTheme(savedTheme || "dark");

    const savedLang = (() => {
        try {
            return localStorage.getItem("portfolio_lang");
        } catch {
            return null;
        }
    })();
    if (savedLang === "de" || savedLang === "en") {
        state.lang = savedLang;
    }
    if (languageToggle) {
        languageToggle.textContent = state.lang.toUpperCase();
    }

    setupControls();
    setupContactForm();
    renderAll();
    await loadGithub();
};

bootstrap();

