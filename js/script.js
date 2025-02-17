// Select elements
const hamBurger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links a");
const navItems = document.querySelectorAll(".nav-links li");

// Navigation links
const homeLink = document.querySelectorAll('a[href="#home"]');
const aboutLink = document.querySelectorAll('a[href="#about"]');

// Sections
const sections = {
  home: document.querySelector("#home"),
  about: document.querySelector("#about"),
  projects: document.querySelector("#projects"),
  contact: document.querySelector("#contact"),
};

// About section child
const aboutChild = {
  childHome: document.querySelector(".about-home"),
  childSkills: document.querySelector(".about-skills"),
};

// Additional elements to show/hide
const haLinks = {
  homeLinks: [...document.querySelectorAll(".home-links")].map((el) => ({
    el,
  })),
  aboutLinks: [...document.querySelectorAll(".about-links")].map((el) => ({
    el,
  })),
};

// Track if About section has been shown
let aboutShown = false;

// Hide About section elements at the start
hideElements([sections.about, ...haLinks.aboutLinks.map((item) => item.el)]);

// Toggle mobile menu
hamBurger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  hamBurger.classList.toggle("active");
});

// Close menu when clicking a link
links.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    hamBurger.classList.remove("active");
  });
});

// Function to apply animation to nav items
function animateNavItems() {
  navItems.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateX(30px)";
    item.style.animation = `fadeLeft 0.8s forwards`;
    item.style.transition = "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)";
    item.style.animationDelay = `${0.08 * index + 0.1}s`;
  });
}

// Show Home section (only if About is shown)
homeLink.forEach((link) => {
  link.addEventListener("click", () => {
    if (aboutShown == false) return;

    showElements([
      { el: sections.home, display: "flex" },
      { el: sections.projects },
      { el: sections.contact },
      ...haLinks.homeLinks.map((item) => ({ el: item.el })),
    ]);

    hideElements([
      sections.about,
      ...haLinks.aboutLinks.map((item) => item.el),
    ]);

    animateNavItems();
  });
});

// Show About section
aboutLink.forEach((link) => {
  link.addEventListener("click", () => {
    aboutShown = true;
    showElements([
      { el: sections.about },
      { el: aboutChild.childHome, display: "flex" },
      { el: aboutChild.childSkills },
      ...haLinks.aboutLinks.map((item) => ({ el: item.el })),
    ]);

    hideElements([
      sections.home,
      sections.projects,
      sections.contact,
      ...haLinks.homeLinks.map((item) => item.el),
    ]);

    animateNavItems();
  });
});

// Functions
function showElements(elements) {
  elements.forEach(({ el, display = "block" }) => (el.style.display = display));
}

function hideElements(elements) {
  elements.forEach((el) => (el.style.display = "none"));
}
