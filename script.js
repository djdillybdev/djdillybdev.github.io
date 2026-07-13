const root = document.documentElement;
root.classList.add("js");

const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];

function selectProject(tab, moveFocus = false) {
  tabs.forEach((item) => {
    const active = item === tab;
    item.setAttribute("aria-selected", String(active));
    item.tabIndex = active ? 0 : -1;
  });
  panels.forEach((panel) => {
    panel.hidden = panel.dataset.projectPanel !== tab.dataset.project;
  });
  if (moveFocus) tab.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectProject(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    selectProject(tabs[next], true);
  });
});
selectProject(tabs[0]);

const revealItems = [...document.querySelectorAll(".reveal")];

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const navLinks = [...document.querySelectorAll('.nav nav a[href^="#"]')];
const sections = navLinks.map((link) => document.querySelector(link.hash)).filter(Boolean);
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.removeAttribute("aria-current"));
      document.querySelector(`.nav nav a[href="#${entry.target.id}"]`)?.setAttribute("aria-current", "location");
    });
  }, { rootMargin: "-25% 0px -65%", threshold: 0 });
  sections.forEach((section) => sectionObserver.observe(section));
}

const timeline = document.querySelector(".timeline");
function updateRoute() {
  if (!timeline) return;
  const rect = timeline.getBoundingClientRect();
  const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.72 - rect.top) / rect.height));
  timeline.style.setProperty("--route-progress", progress);
}
updateRoute();
addEventListener("scroll", updateRoute, { passive: true });
addEventListener("resize", updateRoute);
