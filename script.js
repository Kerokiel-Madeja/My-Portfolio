// Wait until the page fully loads before running JavaScript
document.addEventListener("DOMContentLoaded", function () {
  //
  // Mobile Menu Toggle
  //
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      // Toggle mobile menu
      this.classList.toggle("active");
      navLinks.classList.toggle("active");
    });
  } else {
    console.error("Mobile menu elements not found!");
  }

  //
  // Smooth Scroll
  //
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault(); // Stop normal link behavior

      // Get the target section from the link's href
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      // Only scroll if the section exists
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Close mobile menu after clicking link
        if (navLinks.classList.contains("active")) {
          hamburger.classList.remove("active");
          navLinks.classList.remove("active");
        }
      } else {
        console.error("Section not found:", targetId);
        alert("Oops! The page section you're trying to reach doesn't exist.");
      }
    });
  });

  //
  // Close Menu When Clicking Outside
  //
  document.addEventListener("click", function (e) {
    if (
      navLinks.classList.contains("active") &&
      !e.target.closest(".nav-links") &&
      !e.target.closest(".hamburger")
    ) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    }
  });

  //
  // Close Menu on Window Resize
  //
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    }
  });
});
