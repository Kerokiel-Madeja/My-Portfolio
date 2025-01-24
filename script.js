document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  // Toggle mobile menu
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  // Close menu when clicking links
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });
});

const scrollElements = document.querySelectorAll("[data-scroll]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".scroll-appear").forEach((el) => {
          el.style.animationPlayState = "running";
          el.classList.add("appeared");
        });
      }
    });
  },
  {
    threshold: 0.2, // Trigger when 20% of element is visible
  }
);

// Observe all sections with data-scroll attribute
scrollElements.forEach((element) => {
  observer.observe(element);
});

// Initialize elements as hidden
document.querySelectorAll(".scroll-appear").forEach((el) => {
  el.style.opacity = "0";
  el.style.animationPlayState = "paused";
});

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});
