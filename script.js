// Header shrink on scroll
(() => {
  const header = document.getElementById("header");
  if (!header) return;

  const updateHeader = () => {
    if (window.scrollY > 24) header.classList.add("shrink");
    else header.classList.remove("shrink");
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
})();

// Mobile navigation toggle
(() => {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  const closeNav = () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", () => closeNav());
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeNav();
  });
})();

// Smooth anchor scrolling with header offset
(() => {
  const links = document.querySelectorAll("a[href^='#']");
  const getHeaderOffset = () => {
    const header = document.getElementById("header");
    return header ? header.offsetHeight + 8 : 0;
  };

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const y =
        target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });
})();

// Active nav link based on visible section
(() => {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = [...document.querySelectorAll(".nav a[href^='#']")];
  if (!sections.length || !navLinks.length) return;

  const linkById = new Map(
    navLinks
      .filter((a) => !a.classList.contains("nav-btn"))
      .map((a) => [a.getAttribute("href")?.slice(1), a]),
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        if (!id) return;

        navLinks.forEach((a) => a.classList.remove("active"));
        const active = linkById.get(id);
        if (active) active.classList.add("active");
      });
    },
    { rootMargin: "-40% 0px -45% 0px", threshold: 0.01 },
  );

  sections.forEach((section) => observer.observe(section));
})();

// FAQ accordion
(() => {
  const questions = document.querySelectorAll(".faq-q");
  if (!questions.length) return;

  questions.forEach((button) => {
    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";

      questions.forEach((q) => {
        q.setAttribute("aria-expanded", "false");
        const answer = q.nextElementSibling;
        if (answer) answer.style.maxHeight = "";
      });

      if (!isOpen) {
        button.setAttribute("aria-expanded", "true");
        const answer = button.nextElementSibling;
        if (answer) answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });
})();

// Theme toggle (Dark / Light) with persistence
(() => {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  const STORAGE_KEY = "site-theme";
  const LIGHT_CLASS = "theme-light";

  const applyTheme = (theme) => {
    const isLight = theme === "light";
    document.body.classList.toggle(LIGHT_CLASS, isLight);
    toggle.textContent = isLight ? "☀️ Light" : "🌙 Dark";
    toggle.setAttribute(
      "aria-label",
      isLight ? "Perjungti į tamsų režimą" : "Perjungti į šviesų režimą",
    );
    toggle.setAttribute(
      "title",
      isLight ? "Perjungti į tamsų režimą" : "Perjungti į šviesų režimą",
    );
  };

  const saved = localStorage.getItem(STORAGE_KEY);
  const initialTheme = saved === "light" ? "light" : "dark";
  applyTheme(initialTheme);

  toggle.addEventListener("click", () => {
    const isLightNow = document.body.classList.contains(LIGHT_CLASS);
    const nextTheme = isLightNow ? "dark" : "light";
    applyTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
  });
})();
