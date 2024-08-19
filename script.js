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

  // Scroll to certifications
  const certificationsButton = document.getElementById("view-certifications-button");
  if (certificationsButton) {
    certificationsButton.addEventListener("click", function () {
      document
        .getElementById("certifications")
        .scrollIntoView({ behavior: "smooth" });
    });
  }

  // Burger menu toggle
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const closeNavButton = document.createElement("span");
  closeNavButton.innerHTML = "&times;";
  closeNavButton.className = "close-nav";
  navMenu.prepend(closeNavButton);

  navToggle.addEventListener("click", function () {
    navMenu.classList.toggle("show");
  });

  // Close burger menu on outside click or close button click
  closeNavButton.addEventListener("click", function () {
    navMenu.classList.remove("show");
  });

  window.addEventListener("click", function (event) {
    if (!navMenu.contains(event.target) && event.target !== navToggle) {
      navMenu.classList.remove("show");
    }
  });
});
