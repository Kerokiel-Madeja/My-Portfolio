// Select elements
const hamBurger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links a");
const navItems = document.querySelectorAll(".nav-links li");
const header = document.querySelector("header");
const scrollProgress = document.querySelector(".scroll-progress");

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

// Header scroll effect and progress indicator
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  // Header scroll effect
  if (currentScroll > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  // Scroll progress indicator
  const windowHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (currentScroll / windowHeight) * 100;
  scrollProgress.style.width = scrolled + "%";

  lastScroll = currentScroll;
});

// Toggle mobile menu
hamBurger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  hamBurger.classList.toggle("active");
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!navLinks.contains(e.target) && !hamBurger.contains(e.target)) {
    navLinks.classList.remove("active");
    hamBurger.classList.remove("active");
  }
});

// Close menu when clicking a link
links.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    hamBurger.classList.remove("active");
  });
});

// Keyboard navigation
hamBurger.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    hamBurger.click();
  }
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

// Smart navigation: Handle Projects and Contact links from any section
const projectsLinks = document.querySelectorAll('a[href="#projects"]');
const contactLinks = document.querySelectorAll('a[href="#contact"]');

projectsLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    // If we're in About section, switch back to home view first
    if (aboutShown && sections.home.style.display === "none") {
      e.preventDefault(); // Prevent default scroll

      // Fade out About section
      sections.about.style.opacity = "0";
      sections.about.style.transform = "translateY(-20px)";

      setTimeout(() => {
        // Switch to home view
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

        // Add fade-in animation to sections
        sections.home.classList.add("fade-in");
        sections.projects.classList.add("fade-in");
        sections.contact.classList.add("fade-in");

        // Remove animation class after completion
        setTimeout(() => {
          sections.home.classList.remove("fade-in");
          sections.projects.classList.remove("fade-in");
          sections.contact.classList.remove("fade-in");
        }, 600);

        // Scroll to projects after transition completes
        setTimeout(() => {
          sections.projects.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 400);
      }, 300);
    }
  });
});

contactLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    // If we're in About section, switch back to home view first
    if (aboutShown && sections.home.style.display === "none") {
      e.preventDefault(); // Prevent default scroll

      // Fade out About section
      sections.about.style.opacity = "0";
      sections.about.style.transform = "translateY(-20px)";

      setTimeout(() => {
        // Switch to home view
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

        // Add fade-in animation to sections
        sections.home.classList.add("fade-in");
        sections.projects.classList.add("fade-in");
        sections.contact.classList.add("fade-in");

        // Remove animation class after completion
        setTimeout(() => {
          sections.home.classList.remove("fade-in");
          sections.projects.classList.remove("fade-in");
          sections.contact.classList.remove("fade-in");
        }, 600);

        // Scroll to contact after transition completes
        setTimeout(() => {
          sections.contact.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 400);
      }, 300);
    }
  });
});

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for scroll animations
document
  .querySelectorAll(".project-card, .skills, .contact-item")
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
    observer.observe(el);
  });

// Functions
function showElements(elements) {
  elements.forEach(({ el, display = "block" }) => {
    el.style.display = display;
    // Reset opacity and transform for smooth transitions
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  });
}

function hideElements(elements) {
  elements.forEach((el) => {
    el.style.display = "none";
    // Reset for next show
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  });
}
