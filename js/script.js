// Select elements
const hamBurger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links a");
const navItems = document.querySelectorAll(".nav-links li");
const header = document.querySelector("header");
const scrollProgress = document.querySelector(".scroll-progress");
const viewCvBtn = document.querySelector("#viewCvBtn");
const cvModal = document.querySelector("#cvModal");
const downloadCvBtn = document.querySelector("#downloadCvBtn");
const closeCvButtons = document.querySelectorAll("[data-close-cv]");

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
let cvLastFocusedElement = null;

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

if (viewCvBtn && cvModal) {
  viewCvBtn.addEventListener("click", openCvModal);
}

closeCvButtons.forEach((button) => {
  button.addEventListener("click", closeCvModal);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && cvModal && !cvModal.hasAttribute("hidden")) {
    closeCvModal();
  }
});

if (downloadCvBtn) {
  downloadCvBtn.addEventListener("click", downloadCvAsPdf);
}

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

function openCvModal() {
  cvLastFocusedElement = document.activeElement;
  cvModal.removeAttribute("hidden");
  document.body.classList.add("cv-modal-open");

  const closeButton = cvModal.querySelector(".cv-modal__close");
  if (closeButton) {
    closeButton.focus();
  }
}

function closeCvModal() {
  cvModal.setAttribute("hidden", "");
  document.body.classList.remove("cv-modal-open");

  if (cvLastFocusedElement) {
    cvLastFocusedElement.focus();
  }
}

function downloadCvAsPdf() {
  const jsPdfConstructor = window.jspdf && window.jspdf.jsPDF;

  if (!jsPdfConstructor) {
    alert("PDF download is still loading. Please try again in a moment.");
    return;
  }

  const doc = new jsPdfConstructor({ unit: "pt", format: "a4" });
  const page = {
    width: doc.internal.pageSize.getWidth(),
    height: doc.internal.pageSize.getHeight(),
    margin: 42,
  };
  const maxWidth = page.width - page.margin * 2;
  let y = page.margin;

  const ensureSpace = (height = 24) => {
    if (y + height > page.height - page.margin) {
      doc.addPage();
      y = page.margin;
    }
  };

  const writeText = (text, options = {}) => {
    const {
      size = 10,
      style = "normal",
      color = [45, 45, 45],
      indent = 0,
      spacing = 13,
      before = 0,
      after = 0,
      width = maxWidth - indent,
    } = options;

    y += before;
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(...color);

    const lines = doc.splitTextToSize(text, width);
    ensureSpace(lines.length * spacing + after);
    doc.text(lines, page.margin + indent, y);
    y += lines.length * spacing + after;
  };

  const writeSection = (title) => {
    ensureSpace(32);
    y += 16;
    writeText(title.toUpperCase(), {
      size: 11,
      style: "bold",
      color: [0, 134, 74],
      after: 6,
    });
    doc.setDrawColor(0, 184, 103);
    doc.setLineWidth(0.8);
    doc.line(page.margin, y, page.width - page.margin, y);
    y += 14;
  };

  const writeBullets = (items) => {
    items.forEach((item) => {
      writeText(`- ${item}`, { indent: 10, width: maxWidth - 10 });
    });
  };

  const writeEntry = (title, subtitle, date, bullets = []) => {
    ensureSpace(42);
    writeText(title, { size: 10.5, style: "bold", color: [17, 17, 17] });
    if (subtitle) {
      writeText(subtitle, { before: -2 });
    }
    if (date) {
      writeText(date, {
        style: "bold",
        color: [0, 117, 65],
        before: -2,
        after: 2,
      });
    }
    writeBullets(bullets);
  };

  doc.setFillColor(17, 17, 17);
  doc.rect(0, 0, page.width, 108, "F");
  doc.setTextColor(0, 255, 136);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("KEROKIEL L. MADEJA", page.margin, 48);
  doc.setTextColor(235, 235, 235);
  doc.setFontSize(11);
  doc.text("Frontend Developer & System Analyst", page.margin, 68);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    "(+63)-998-370-6782 | kielmadeja38@gmail.com | Portfolio",
    page.margin,
    88,
  );
  y = 132;

  writeSection("Objective");
  writeText(
    "Recent B.S. Computer Engineering graduate with a background in IT systems and internal controls. Passionate about web development, focused on creating clean, user-friendly, and intuitive UI experiences.",
  );

  writeSection("Technical Skills");
  writeBullets([
    "Web Development: HTML, CSS, JavaScript, WordPress",
    "UI/UX: Figma, user-centered design principles",
    "Database Management: MySQL, data retrieval",
    "Tools & Version Control: GitHub, Crystal Reports",
    "Operating Systems: Windows, Linux",
    "System & Technical Support: troubleshooting, system monitoring, issue escalation",
  ]);

  writeSection("Personal Skills");
  writeText("Teamwork | Time Management | Strong Problem-Solving | Effective Communication");

  writeSection("Experience");
  writeEntry(
    "System Analyst",
    "H2 Software Consulting Inc. (Client: EastWest Bank)",
    "06/2026 to Present",
    [
      "Provided technical support and resolved system issues.",
      "Monitored and validated system data.",
      "Assisted in basic system analysis and documentation.",
      "Coordinated issue escalation with internal teams.",
    ],
  );
  writeEntry("Dev Intern", "One Document Corporation, Quezon City", "02/2024 to 03/2024", [
    "Assisted in database management using MySQL Workbench.",
    "Created reports from databases using Crystal Reports.",
    "Conducted basic system troubleshooting and data validation.",
  ]);

  writeSection("Education");
  writeEntry(
    "B.S., Computer Engineering",
    "Southern Luzon State University Main Campus",
    "September 2020 - August 2024",
  );

  writeSection("Certifications");
  writeEntry(
    "Principles of Web Development and Introduction to HTML",
    "DICT Learning Management System",
    "Completed: March 2024",
  );
  writeEntry(
    "Using HTML and CSS to Design a Website",
    "DICT Learning Management System",
    "Completed: April 2024",
  );
  writeEntry(
    "Google UX Design Professional Certificate",
    "Coursera, authorized by Google",
    "Completed: November 2024",
  );

  writeSection("Capstone Project");
  writeEntry("Frontend Developer", "Fresh Produce Merchandising System", "01/2023 - 05/2024", [
    "Developed user-friendly interfaces using HTML, CSS, and JavaScript.",
    "Ensured responsive design for optimal performance on various devices.",
    "Collaborated with team members using Git for version control and code reviews.",
  ]);

  writeSection("Seminars");
  writeEntry(
    "Next-Generation IT: Hyperconverged Infrastructure (HCI) and Network Solution",
    "",
    "May 6, 2024 | 8 hours",
  );
  writeEntry(
    "Weaving the Web! Integrating Frontend, Backend, and Frameworks",
    "",
    "May 8, 2024 | 8 hours",
  );

  writeSection("Character Reference");
  writeText("Engr. Leonard Allen R. Pavino", {
    style: "bold",
    color: [17, 17, 17],
  });
  writeText("SLSU Computer Engineering Professor");
  writeText("lpavino@slsu.edu.ph | 09473506600");

  doc.save("Kerokiel-Madeja-CV.pdf");
}
