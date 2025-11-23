import './style.css'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

// Donation form
const donationForm = document.querySelector("#donate form");
donationForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    showModal("Thank you! Your donation has been received.");
    donationForm.reset();
});

// Footer contact form
const contactForm = document.querySelector("#getinvolved form");
contactForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    showModal("Thank you for reaching out! We will contact you soon.");
    contactForm.reset();
});

const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("show");
});