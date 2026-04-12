// ═══════════════════════════════════════════
// PERMA — main.js
// ═══════════════════════════════════════════

// ── Page switching ─────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach((page) => page.classList.remove('active'));

  const targetPage = document.getElementById('page-' + name);
  if (targetPage) {
    targetPage.classList.add('active');
  }

  // Update active nav link
  document.querySelectorAll('.nav-link, .mob-link').forEach((link) => {
    const onclick = link.getAttribute('onclick') || '';
    link.classList.toggle('active', onclick.includes(`'${name}'`));
  });

  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (hamburger?.classList.contains('open') && menu) {
    hamburger.classList.remove('open');
    menu.classList.add('hidden');
    menu.classList.remove('flex');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(initFadeUps, 100);
}

// ── Mobile menu ────────────────────────────
function toggleMenu() {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!hamburger || !menu) return;

  hamburger.classList.toggle('open');
  menu.classList.toggle('hidden');
  menu.classList.toggle('flex');
}

window.showPage = showPage;
window.toggleMenu = toggleMenu;

// ── Navbar scroll shadow ───────────────────
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Scroll-triggered fade-up ───────────────
function currentPage() {
  const active = document.querySelector('.page.active');
  return active ? active.id.replace('page-', '') : 'home';
}

function initFadeUps() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(`#page-${currentPage()} .fade-up`).forEach((el) => {
    if (!el.classList.contains('in')) obs.observe(el);
  });
}

// ── Donate: frequency toggle ───────────────
function setFreq(el) {
  document.querySelectorAll('.freq-btn').forEach((b) => b.classList.remove('active'));
  el.classList.add('active');
}

// ── Donate: amount buttons ─────────────────
function setAmt(el, isCustom = false) {
  document.querySelectorAll('.amt-btn').forEach((b) => b.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('custom-field')?.classList.toggle('hidden', !isCustom);
}

function showContactSection() {
  showPage('getinvolved');
  setTimeout(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 120);
}

window.setFreq = setFreq;
window.setAmt = setAmt;
window.showContactSection = showContactSection;

// ── Init on load ───────────────────────────
document.addEventListener('DOMContentLoaded', initFadeUps);
