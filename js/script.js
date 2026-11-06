/**
 * Portfolio Interaction and Motion Engine
 * Strictly follows B7 Motion, B9 States, and B11 Tagline Reveal
 */

document.addEventListener("DOMContentLoaded", () => {
  initScrollProgress();
  initHeroSpotlight();
  initNavigation();
  initScrollReveals();
  initTaglineReveal();
  initProjectsToggle();
  initFaqAccordion();
  initCvModal();
  initInquiryForm();
});

/* ==========================================================================
   0. Top Scroll Progress Indicator & Hero Ambient Spotlight per B7
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.querySelector("#scrollProgressBar");
  if (!progressBar) return;

  let ticking = false;

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    },
    { passive: true }
  );

  updateProgress();
}

function initHeroSpotlight() {
  const heroSection = document.querySelector("#home");
  if (!heroSection) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  let ticking = false;

  heroSection.addEventListener(
    "mousemove",
    (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = heroSection.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          heroSection.style.setProperty("--spotlight-x", `${x}%`);
          heroSection.style.setProperty("--spotlight-y", `${y}%`);
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
}

/* ==========================================================================
   1. Navigation & Mobile Menu per B7
   ========================================================================== */
function initNavigation() {
  const menuToggle = document.querySelector("#menuToggle");
  const mobileMenu = document.querySelector("#mobileMenu");
  const navLinks = document.querySelectorAll(".nav-menu a, .mobile-nav-link");
  const sections = document.querySelectorAll("section[id]");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("is-open");
      menuToggle.classList.toggle("is-active", isOpen);
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close on mobile link click
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (mobileMenu.classList.contains("is-open")) {
          mobileMenu.classList.remove("is-open");
          menuToggle.classList.remove("is-active");
          menuToggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        }
      });
    });
  }

  // Active section indicator using IntersectionObserver
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute("id");
          document.querySelectorAll(".nav-menu a").forEach((a) => {
            const href = a.getAttribute("href");
            if (href === `#${currentId}`) {
              a.classList.add("active");
            } else {
              a.classList.remove("active");
            }
          });
        }
      });
    },
    {
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => navObserver.observe(section));
}

/* ==========================================================================
   2. Scroll Reveals per B7 using IntersectionObserver
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll(".reveal-item");
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target); // Reveal once per B7
        }
      });
    },
    {
      rootMargin: "0px 0px -40px 0px",
      threshold: 0.1,
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
}

/* ==========================================================================
   3. Tagline Reveal Section per B11
   ========================================================================== */
function initTaglineReveal() {
  const taglineEl = document.querySelector("#taglineText");
  if (!taglineEl) return;

  // Split words if not already wrapped
  const words = taglineEl.innerText.trim().split(/\s+/);
  taglineEl.innerHTML = words
    .map((word) => {
      const isSpecial = word.toLowerCase().includes("reliable") || word.toLowerCase().includes("business");
      const highlightClass = isSpecial ? "is-highlight" : "";
      return `<span class="tagline-word ${highlightClass}">${word}</span>`;
    })
    .join(" ");

  const wordNodes = taglineEl.querySelectorAll(".tagline-word");

  // Reduced motion check
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    wordNodes.forEach((node) => node.classList.add("is-active"));
    return;
  }

  // Throttled scroll listener using requestAnimationFrame per B11
  let isTicking = false;

  function checkWordVisibility() {
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight * 0.78;

    wordNodes.forEach((word) => {
      const rect = word.getBoundingClientRect();
      if (rect.top <= triggerPoint) {
        word.classList.add("is-active");
      }
    });

    isTicking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!isTicking) {
        window.requestAnimationFrame(checkWordVisibility);
        isTicking = true;
      }
    },
    { passive: true }
  );

  checkWordVisibility();
}

/* ==========================================================================
   3.5. View All Projects Drawer Toggle per B9 States
   ========================================================================== */
function initProjectsToggle() {
  const toggleBtn = document.querySelector("#toggleAllProjectsBtn");
  const drawer = document.querySelector("#allProjectsDrawer");
  const toggleText = document.querySelector("#toggleProjectsText");
  const caretIcon = document.querySelector("#toggleCaretIcon");

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener("click", () => {
    const isHidden = drawer.hasAttribute("hidden");

    if (isHidden) {
      drawer.removeAttribute("hidden");
      drawer.classList.add("is-open");
      toggleBtn.setAttribute("aria-expanded", "true");
      if (toggleText) toggleText.textContent = "Show fewer projects";
      if (caretIcon) caretIcon.style.transform = "rotate(180deg)";

      // Trigger scroll reveals for newly opened drawer items
      const newItems = drawer.querySelectorAll(".reveal-item:not(.revealed)");
      newItems.forEach((item) => item.classList.add("revealed"));
    } else {
      drawer.setAttribute("hidden", "");
      drawer.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
      if (toggleText) toggleText.textContent = "View all 8 projects";
      if (caretIcon) caretIcon.style.transform = "rotate(0deg)";

      // Smooth scroll back to top of projects section if needed
      const projectsSection = document.querySelector("#work");
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
}

/* ==========================================================================
   4. FAQ Accordion per B9 & A2
   ========================================================================== */
function initFaqAccordion() {
  const faqTriggers = document.querySelectorAll(".faq-trigger");

  faqTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".faq-item");
      const isOpen = item.classList.contains("is-open");

      // Close all other items
      document.querySelectorAll(".faq-item").forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("is-open");
          const otherTrigger = otherItem.querySelector(".faq-trigger");
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        }
      });

      // Toggle current
      item.classList.toggle("is-open", !isOpen);
      trigger.setAttribute("aria-expanded", !isOpen ? "true" : "false");
    });
  });
}

/* ==========================================================================
   5. CV Modal with Accessible Focus Trapping
   ========================================================================== */
function initCvModal() {
  const openButtons = document.querySelectorAll("[data-open-cv]");
  const modalBackdrop = document.querySelector("#cvModalBackdrop");
  const closeButtons = document.querySelectorAll("[data-close-cv]");
  const downloadBtn = document.querySelector("#downloadCvPdf");
  let lastActiveElement = null;

  if (!modalBackdrop) return;

  function openModal() {
    lastActiveElement = document.activeElement;
    modalBackdrop.classList.add("is-active");
    modalBackdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const focusable = modalBackdrop.querySelector("button, [href], input");
    if (focusable) focusable.focus();
  }

  function closeModal() {
    modalBackdrop.classList.remove("is-active");
    modalBackdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastActiveElement) lastActiveElement.focus();
  }

  openButtons.forEach((btn) => btn.addEventListener("click", openModal));
  closeButtons.forEach((btn) => btn.addEventListener("click", closeModal));

  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalBackdrop.classList.contains("is-active")) {
      closeModal();
    }
  });

  if (downloadBtn && window.jspdf) {
    downloadBtn.addEventListener("click", () => {
      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(22);
        doc.text("Kerokiel L. Madeja", 20, 20);

        doc.setFont("Helvetica", "normal");
        doc.setFontSize(10);
        doc.text("kielmadeja38@gmail.com | 09983706782 | https://kerokiel-madeja.github.io/My-Portfolio/", 20, 26);

        doc.setDrawColor(200, 200, 200);
        doc.line(20, 30, 190, 30);

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.text("PROFESSIONAL SUMMARY", 20, 38);

        doc.setFont("Helvetica", "normal");
        doc.setFontSize(9.5);
        const summaryText = "Computer Engineering graduate with hands on IT support experience in a banking environment. Experienced in troubleshooting hardware, software, network, and application issues using ticketing tools like Sapphire IMS. Skilled in computer repair, system setup, and first level technical support, committed to fast issue resolution and reliable customer service.";
        doc.text(doc.splitTextToSize(summaryText, 170), 20, 44);

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.text("EXPERIENCE", 20, 64);

        // Job 1
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Freelance Web Developer & IT Technician", 20, 72);
        doc.setFont("Helvetica", "normal");
        doc.text("Sep 2024 - Present", 155, 72);
        doc.setFontSize(9);
        doc.text("• Engineered responsive client web applications and digital platforms using React, JavaScript, and Tailwind CSS.", 22, 78);
        doc.text("• Provided on site IT support to local barangay offices and individual clients for computer and network issues.", 22, 84);
        doc.text("• Handled PC assembly, OS installation, and hardware upgrades, including parts replacement and data backup.", 22, 90);

        // Job 2
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Technical Support | H2 Software Consulting Inc., Makati City", 20, 100);
        doc.setFont("Helvetica", "normal");
        doc.text("Jun 2025 - Jun 2026", 155, 100);
        doc.setFontSize(9);
        doc.text("• Provided first level IT support to EastWest Bank employees across branches and head office.", 22, 106);
        doc.text("• Troubleshoot hardware, software, network, and core banking application issues.", 22, 112);
        doc.text("• Managed incidents and service requests tickets using Sapphire IMS.", 22, 118);
        doc.text("• Assisted in monitoring critical applications to maintain system stability and business continuity.", 22, 124);

        // Job 3
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Junior Developer Intern | One Document Corporation, Quezon City", 20, 134);
        doc.setFont("Helvetica", "normal");
        doc.text("Feb 2024 - Mar 2024", 155, 134);
        doc.setFontSize(9);
        doc.text("• Managed and validated database records using MySQL Workbench to ensure data accuracy.", 22, 140);
        doc.text("• Generated database reports using Crystal Reports to support business reporting.", 22, 146);
        doc.text("• Troubleshot database related issues to improve data reliability.", 22, 152);

        // Education
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.text("EDUCATION", 20, 164);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(10);
        doc.text("B.S., Computer Engineering", 20, 172);
        doc.setFont("Helvetica", "normal");
        doc.text("Sep 2020 - Aug 2024", 155, 172);
        doc.setFontSize(9);
        doc.text("Southern Luzon State University Main Campus", 20, 178);

        // Skills
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.text("SKILLS", 20, 190);
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(9);
        doc.text("• Programming & Web Development: HTML, CSS, JavaScript, PHP, Python, WordPress, React, Tailwind CSS", 20, 196);
        doc.text("• Database: MySQL, SQL, Database Querying", 20, 202);
        doc.text("• Technical Support: Troubleshooting, System Monitoring, Issue Escalation, Ticketing System, Sapphire IMS", 20, 208);
        doc.text("• Version Control & UI Design: GitHub, Figma | Reporting: Crystal Reports, Microsoft Office", 20, 214);

        // Certifications
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.text("CERTIFICATIONS", 20, 226);
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(9);
        doc.text("• Principles of Web Development and Introduction to HTML — DICT LMS (March 2024)", 20, 232);
        doc.text("• Using HTML and CSS to Design a website — DICT LMS (April 2024)", 20, 238);
        doc.text("• Google UX Design Professional Certificate — Coursera, authorized by Google (June 2025)", 20, 244);
        doc.text("• Google IT Support Professional Certificate — Coursera, authorized by Google (Sept 2026)", 20, 250);

        doc.save("Kerokiel_Madeja_Resume.pdf");
      } catch (err) {
        console.error("PDF generation fallback", err);
        window.open("mailto:kielmadeja38@gmail.com?subject=Resume%20Request");
      }
    });
  }
}

/* ==========================================================================
   6. Conversion Inquiry Form Validation per B8 & B9
   ========================================================================== */
function initInquiryForm() {
  const form = document.querySelector("#inquiryForm");
  const statusEl = document.querySelector("#formStatus");
  if (!form || !statusEl) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.querySelector("#clientName").value.trim();
    const email = form.querySelector("#clientEmail").value.trim();
    const service = form.querySelector("#projectType").value;
    const message = form.querySelector("#projectDetails").value.trim();
    const submitBtn = form.querySelector("#submitInquiryBtn");

    // Reset status
    statusEl.className = "form-status";
    statusEl.textContent = "";

    // Validation
    if (!name || !email || !message) {
      statusEl.className = "form-status is-error";
      statusEl.textContent = "Please complete all required fields before sending.";
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      statusEl.className = "form-status is-error";
      statusEl.textContent = "Please provide a valid email address.";
      return;
    }

    // Submit state per B9
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending inquiry...";

    // Construct mailto fallback and friendly confirmation
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send inquiry";
      statusEl.className = "form-status is-success";
      statusEl.textContent = "Thank you. Your inquiry is prepared. Opening your email client to send.";

      const subject = encodeURIComponent(`Project Inquiry: ${service} from ${name}`);
      const body = encodeURIComponent(
        `Hello Kerokiel,\n\nName: ${name}\nEmail: ${email}\nProject Type: ${service}\n\nProject Overview:\n${message}\n`
      );
      window.location.href = `mailto:kielmadeja38@gmail.com?subject=${subject}&body=${body}`;
    }, 600);
  });
}
