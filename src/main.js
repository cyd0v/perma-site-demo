import './style.css'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// scroll fade-in effect
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.2 });
document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

// Navbar scroll control — navbar sits at top-7 (28px) below topbar
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  const hero = document.getElementById("hero");
  if (!navbar) return;
  const navLinks = navbar.querySelectorAll("a, span");

  if (window.scrollY > 80) {
    navbar.classList.remove("bg-transparent");
    navbar.classList.add("bg-white", "shadow-md");

    navLinks.forEach(link => {
      link.classList.remove("text-white");
      link.classList.add("text-gray-800");
    });

  } else {
    navbar.classList.add("bg-transparent");
    navbar.classList.remove("bg-white", "shadow-md");

    navLinks.forEach(link => {
      link.classList.remove("text-gray-800");
      link.classList.add("text-white");
    });
  }

  // Hero shadow
  if (hero) {
    if (window.scrollY > 85) {
      hero.classList.add("shadow-[0_15px_30px_rgba(0,0,0,0.25)]");
    } else {
      hero.classList.remove("shadow-[0_15px_30px_rgba(0,0,0,0.25)]");
    }
  }
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Function to toggle navbars based on viewport
function updateNavbarView() {
  const desktopNavbar = document.getElementById('navbar');
  const mobileNavbar = document.getElementById('mobile-navbar');

  if (window.matchMedia("(min-width: 768px)").matches) {
    // Desktop
    desktopNavbar.classList.remove('hidden');
    mobileNavbar.classList.add('hidden');
  } else {
    // Mobile
    desktopNavbar.classList.add('hidden');
    mobileNavbar.classList.remove('hidden');
  }
}

updateNavbarView();
window.addEventListener('resize', updateNavbarView);

const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("show");
  });
}

// Modal
const modal = document.getElementById("success-modal");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");

function showModal(message) {
  modal.querySelector("p").textContent = message;

  modal.classList.remove("hidden");
  modal.classList.add("flex");

  requestAnimationFrame(() => {
    modal.style.opacity = "1";
    modalContent.classList.remove("scale-90", "opacity-0");
    modalContent.classList.add("scale-100", "opacity-100");
  });
}

function hideModal() {
  modalContent.classList.remove("scale-100", "opacity-100");
  modalContent.classList.add("scale-90", "opacity-0");

  modal.style.opacity = "0";

  setTimeout(() => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }, 300);
}

if (modalClose) {
  modalClose.addEventListener("click", hideModal);
}

// Contact form
const contactForm = document.querySelector("#contact-form");
contactForm?.addEventListener("submit", function (e) {
  e.preventDefault();
  showModal("Thank you for reaching out! We will contact you soon.");
  contactForm.reset();
});
