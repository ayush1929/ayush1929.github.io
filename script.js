document.addEventListener("DOMContentLoaded", function () {
  // Smooth scroll to sections
  document.querySelectorAll("nav ul li a").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }

      // Close the mobile menu when a link is clicked
      document.getElementById("nav-menu").classList.remove("show");

      // Special case for contact link
      if (this.id === "contact-link") {
        document.getElementById("popup-container").style.display = "flex";
      }
    });
  });

  // Show popup
  const showPopupButton = document.getElementById("show-popup");
  const popupContainer = document.getElementById("popup-container");
  const closePopupButton = document.getElementById("close-popup");

  showPopupButton.addEventListener("click", function () {
    popupContainer.style.display = "flex";
  });

  closePopupButton.addEventListener("click", function () {
    popupContainer.style.display = "none";
  });

  // Close popup if clicking outside of the popup content
  window.addEventListener("click", function (event) {
    if (event.target === popupContainer) {
      popupContainer.style.display = "none";
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  // Toggle the "show" class to make the menu visible on click
  navToggle.addEventListener("click", function () {
    navMenu.classList.toggle("show");
  });

  // Close the menu when a link is clicked
  document.querySelectorAll("nav ul li a").forEach((link) => {
    link.addEventListener("click", function () {
      navMenu.classList.remove("show");
    });
  });
});
function showSection(sectionId) {
  document.querySelectorAll(".project-section").forEach((section) => {
    section.classList.remove("active");
  });
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.remove("active");
  });
  document.getElementById(sectionId).classList.add("active");
  event.target.classList.add("active");
}