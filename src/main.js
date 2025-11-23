import './style.css'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const counters = document.querySelectorAll(".count");

counters.forEach(counter => {
  const target = +counter.getAttribute("data-target");
  const duration = 2;
  const obj = { val: 0 };

  gsap.to(obj, {
    val: target,
    duration,
    ease: "power1.out",
    onUpdate: () => {
      if (target >= 1000)
        counter.textContent = Math.floor(obj.val).toLocaleString();
      else
        counter.textContent = Math.floor(obj.val);
    },
    scrollTrigger: {
      trigger: counter,
      start: "top 80%",
      toggleActions: "play none none none",
      once: true,
    },
  });
});

// scroll fade-in effect
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.2 });
document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

//Navvy control
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  const hero = document.getElementById("hero");
  const navLinks = navbar.querySelectorAll("a, h1"); // select all nav items and the logo text

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
  if (window.scrollY > 85) {
    hero.classList.add("shadow-[0_15px_30px_rgba(0,0,0,0.25)]");
  } else {
    hero.classList.remove("shadow-[0_15px_30px_rgba(0,0,0,0.25)]");
  }
});

// Impact image
const impactImage = document.getElementById('impact-image');

// Map text → image
const impactMap = {
  "Fighting Hunger": "assets/hunger.jpg",
  "Improving Health": "assets/health.jpg",
  "Supporting Education": "assets/education.jpg",
  "In Times of Crisis": "assets/crisis.jpg",
};

const impactItems = document.querySelectorAll('.impact-item');
window.addEventListener('DOMContentLoaded', () => {
  const defaultText = "Fighting Hunger";
  const defaultSrc = impactMap[defaultText];
  impactImage.src = defaultSrc;
  impactImage.style.opacity = 1;
  impactItems.forEach(item => {
    if (item.textContent.trim() === defaultText) {
      item.classList.add('text-blue-700');
    }
  });
});

impactItems.forEach(item => {
  const text = item.textContent.trim();
  const newSrc = impactMap[text];

  item.addEventListener('mouseenter', () => {
    if (newSrc && !impactImage.src.includes(newSrc)) {
      impactImage.style.opacity = 0;
      setTimeout(() => {
        impactImage.src = newSrc;
        impactImage.style.opacity = 1;
      }, 250);
    }

    impactItems.forEach(i => i.classList.remove('text-blue-700'));
    item.classList.add('text-blue-700');
  });
});


// Background color change on stats section
const statsSection = document.getElementById("stats");
const body = document.body;

const bgObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        body.classList.add("bg-blue-950", "text-white", "transition-colors", "duration-1000");
        body.classList.remove("bg-white", "text-gray-800");
      } else {
        body.classList.add("bg-white", "text-gray-800");
        body.classList.remove("bg-blue-950", "text-white");
      }
    });
  },
  { threshold: 0.3 }
);

bgObserver.observe(statsSection);

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault(); // prevent default jump
    const targetId = this.getAttribute('href').substring(1); // remove #
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start' // aligns element to top of viewport
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

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("show");
});

//modal
const modal = document.getElementById("success-modal");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");

function showModal(message) {
  modal.querySelector("p").textContent = message;

  // Make overlay visible immediately
  modal.classList.remove("hidden");
  modal.classList.add("flex");  // overlay flex container

  // trigger animation in next tick
  requestAnimationFrame(() => {
    modal.style.opacity = "1"; // fade in overlay
    modalContent.classList.remove("scale-90", "opacity-0");
    modalContent.classList.add("scale-100", "opacity-100");
  });
}

function hideModal() {
  modalContent.classList.remove("scale-100", "opacity-100");
  modalContent.classList.add("scale-90", "opacity-0");

  modal.style.opacity = "0"; // fade out overlay

  setTimeout(() => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }, 300); // match transition duration
}


modalClose.addEventListener("click", hideModal);

// Footer contact form
const contactForm = document.querySelector("#getinvolved form");
contactForm?.addEventListener("submit", function (e) {
  e.preventDefault();
  showModal("Thank you for reaching out! We will contact you soon.");
  contactForm.reset();
});
