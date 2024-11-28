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
// Disable right-click for images
document.addEventListener("contextmenu", function (e) {
  if (e.target.tagName === "IMG") {
      e.preventDefault();
      alert("Right-click is disabled to protect the images.");
  }
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
document.addEventListener("DOMContentLoaded", function () {
  // Smooth Scroll
  document.querySelectorAll("nav ul li a").forEach(anchor => {
      anchor.addEventListener("click", function (e) {
          e.preventDefault();
          const targetId = this.getAttribute("href").substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) targetElement.scrollIntoView({ behavior: "smooth" });
      });
  });

  // Slideshow Logic
  const photos = [
      "photography/aurora_1.jpg",
      "photography/aurora_2.jpg",
      "photography/aurora_3.jpg",
      "photography/aurora_4.jpg",
      "photography/aurora_5.jpg",
      "photography/aurora_6.jpg",
      "photography/aurora_7.jpg",
      "photography/aurora_8.jpg"
  ];
  let currentPhoto = 0;

  function openSlideshow(index) {
      currentPhoto = index;
      document.getElementById('slideshow-image').src = photos[currentPhoto];
      document.getElementById('slideshow-container').style.display = 'flex';
  }

  function closeSlideshow() {
      document.getElementById('slideshow-container').style.display = 'none';
  }

  function changePhoto(direction) {
      currentPhoto = (currentPhoto + direction + photos.length) % photos.length;
      document.getElementById('slideshow-image').src = photos[currentPhoto];
  }

  window.openSlideshow = openSlideshow;
  window.closeSlideshow = closeSlideshow;
  window.changePhoto = changePhoto;

  // Disable right-click for images
  document.addEventListener('contextmenu', function (e) {
      if (e.target.tagName === "IMG") {
          e.preventDefault();
          alert("Right-click is disabled to protect the images.");
      }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling for navigation links
  document.querySelectorAll("nav ul li a").forEach(anchor => {
      anchor.addEventListener("click", function (e) {
          e.preventDefault();
          const targetId = this.getAttribute("href").substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) targetElement.scrollIntoView({ behavior: "smooth" });
      });
  });

  // Contact Pop-up
  const showPopupButton = document.getElementById("contact-link");
  const popupContainer = document.getElementById("popup-container");
  const closePopupButton = document.getElementById("close-popup");

  showPopupButton.addEventListener("click", function () {
      popupContainer.style.display = "flex";
  });

  closePopupButton.addEventListener("click", function () {
      popupContainer.style.display = "none";
  });

  // Close pop-up when clicking outside
  window.addEventListener("click", function (event) {
      if (event.target === popupContainer) {
          popupContainer.style.display = "none";
      }
  });

  // Slideshow logic
  const photos = [
      "photography/aurora_1.jpg",
      "photography/aurora_2.jpg",
      "photography/aurora_3.jpg",
      "photography/aurora_4.jpg",
      "photography/aurora_5.jpg",
      "photography/aurora_6.jpg",
      "photography/aurora_7.jpg",
      "photography/aurora_8.jpg",
  ];
  let currentPhoto = 0;

  window.openSlideshow = function (index) {
      currentPhoto = index;
      document.getElementById("slideshow-image").src = photos[currentPhoto];
      document.getElementById("slideshow-container").style.display = "flex";
  };

  window.closeSlideshow = function () {
      document.getElementById("slideshow-container").style.display = "none";
  };

  window.changePhoto = function (direction) {
      currentPhoto = (currentPhoto + direction + photos.length) % photos.length;
      document.getElementById("slideshow-image").src = photos[currentPhoto];
  };

  // Disable right-click on images
  document.addEventListener("contextmenu", function (e) {
      if (e.target.tagName === "IMG") {
          e.preventDefault();
          alert("Right-click is disabled to protect the images.");
      }
  });
});