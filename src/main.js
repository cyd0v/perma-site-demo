// ═══════════════════════════════════════════
// PERMA — main.js
// ═══════════════════════════════════════════

let pdfjsLibPromise = null;
let pdfWorkerInstance = null;

async function loadPdfJs() {
  if (!pdfjsLibPromise) {
    pdfjsLibPromise = import('pdfjs-dist/build/pdf.mjs').then((mod) => {
      if (!pdfWorkerInstance) {
        pdfWorkerInstance = new Worker(
          new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url),
          { type: 'module' }
        );
      }
      mod.GlobalWorkerOptions.workerPort = pdfWorkerInstance;
      return mod;
    });
  }
  return pdfjsLibPromise;
}

// Prevent browser from restoring scroll position on refresh
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

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

function expandPanel(content) {
  content.dataset.collapsing = 'false';
  content.classList.remove('hidden');
  content.classList.add('show');
  content.style.maxHeight = '0px';

  requestAnimationFrame(() => {
    content.style.maxHeight = content.scrollHeight + 'px';
  });
}

function collapsePanel(content) {
  if (content.classList.contains('hidden') || !content.classList.contains('show')) return;

  content.dataset.collapsing = 'true';
  content.style.maxHeight = content.scrollHeight + 'px';
  content.classList.remove('show');

  requestAnimationFrame(() => {
    content.style.maxHeight = '0px';
  });

  const onTransitionEnd = (event) => {
    if (event.target !== content) return;
    if (event.propertyName !== 'max-height') return;
    if (content.dataset.collapsing !== 'true') return;

    content.classList.add('hidden');
    content.dataset.collapsing = 'false';
  };

  content.addEventListener('transitionend', onTransitionEnd, { once: true });
}

function toggleAccordion(btn) {
  const item = btn.closest('.accordion-item');
  if (!item) return;

  const content = item.querySelector('.accordion-content');
  const icon = btn.querySelector('.accordion-icon');
  if (!content || !icon) return;
  
  // Close all other accordions
  document.querySelectorAll('.accordion-item').forEach((accordionItem) => {
    if (accordionItem !== item) {
      const otherContent = accordionItem.querySelector('.accordion-content');
      const otherIcon = accordionItem.querySelector('.accordion-icon');
      if (!otherContent || !otherIcon) return;

      if (otherContent.classList.contains('show')) {
        collapsePanel(otherContent);
        otherIcon.classList.remove('open');
        const otherBtn = accordionItem.querySelector('.accordion-header');
        otherBtn?.classList.remove('accordion-open');
      }
    }
  });
  
  // Toggle current accordion
  const isOpen = content.classList.contains('show');
  if (isOpen) {
    collapsePanel(content);
    icon.classList.remove('open');
    btn.classList.remove('accordion-open');
    return;
  }

  expandPanel(content);
  icon.classList.add('open');
  btn.classList.add('accordion-open');
}

function toggleNestedAccordion(btn) {
  const item = btn.closest('.nested-accordion-item');
  if (!item) return;

  const content = item.querySelector('.nested-content');
  const icon = btn.querySelector('.nested-icon') || btn.querySelector('span:last-child');
  if (!content || !icon) return;

  const isOpen = content.classList.contains('show');
  if (isOpen) {
    collapsePanel(content);
    icon.classList.remove('open');
    return;
  }

  expandPanel(content);
  icon.classList.add('open');
}

function getCurrentSlideIndex(carousel) {
  const slides = carousel.querySelectorAll('.carousel-img');
  return Array.from(slides).findIndex((slide) => slide.classList.contains('active'));
}

function goToSlide(dotEl, index) {
  const carousel = dotEl.closest('.carousel-container');
  const slides = carousel.querySelectorAll('.carousel-img');
  const dots = carousel.querySelectorAll('.carousel-dot');
  
  // Hide all slides
  slides.forEach((slide) => {
    slide.classList.remove('active');
  });
  
  // Remove active from all dots
  dots.forEach((dot) => {
    dot.classList.remove('active');
  });
  
  // Show selected slide and dot
  if (slides[index]) {
    slides[index].classList.add('active');
    dots[index].classList.add('active');
  }
}

function nextSlide(btnEl) {
  const carousel = btnEl.closest('.carousel-container');
  const slides = carousel.querySelectorAll('.carousel-img');
  let current = getCurrentSlideIndex(carousel);
  let next = (current + 1) % slides.length;
  
  const dots = carousel.querySelectorAll('.carousel-dot');
  goToSlide(dots[next], next);
}

function prevSlide(btnEl) {
  const carousel = btnEl.closest('.carousel-container');
  const slides = carousel.querySelectorAll('.carousel-img');
  let current = getCurrentSlideIndex(carousel);
  let prev = (current - 1 + slides.length) % slides.length;
  
  const dots = carousel.querySelectorAll('.carousel-dot');
  goToSlide(dots[prev], prev);
}

const newsletterViewers = {};

function updateNewsletterControls(viewerId) {
  const viewer = newsletterViewers[viewerId];
  if (!viewer) return;

  const prevBtn = document.getElementById(`${viewerId}-prev`);
  const nextBtn = document.getElementById(`${viewerId}-next`);
  const pageLabel = document.getElementById(`${viewerId}-page-label`);

  if (prevBtn) prevBtn.disabled = viewer.page <= 1;
  if (nextBtn) nextBtn.disabled = viewer.page >= viewer.totalPages;
  if (pageLabel) pageLabel.textContent = `Page ${viewer.page} / ${viewer.totalPages}`;
}

async function renderNewsletterPage(viewerId) {
  const viewer = newsletterViewers[viewerId];
  if (!viewer?.pdfDoc) return;

  const status = document.getElementById(`${viewerId}-status`);
  if (status) status.textContent = `Rendering page ${viewer.page}...`;

  const page = await viewer.pdfDoc.getPage(viewer.page);
  const cssWidth = Math.max(680, Math.floor(viewer.viewport.clientWidth - 24));
  const baseViewport = page.getViewport({ scale: 1 });
  if (!viewer.lockedScale) {
    const fitScale = cssWidth / baseViewport.width;
    viewer.lockedScale = Math.max(0.1, Math.min(2, fitScale));
  }

  const renderScale = viewer.lockedScale;
  const viewport = page.getViewport({ scale: renderScale });

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  viewer.canvas.width = Math.floor(viewport.width * dpr);
  viewer.canvas.height = Math.floor(viewport.height * dpr);
  viewer.canvas.style.width = `${Math.floor(viewport.width)}px`;
  viewer.canvas.style.maxWidth = '100%';
  viewer.canvas.style.height = 'auto';

  viewer.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  viewer.ctx.clearRect(0, 0, viewport.width, viewport.height);

  if (viewer.renderTask) {
    try {
      viewer.renderTask.cancel();
    } catch {
      // Ignore cancel errors when no task is active.
    }
  }

  viewer.renderTask = page.render({
    canvasContext: viewer.ctx,
    viewport,
  });

  try {
    await viewer.renderTask.promise;
    if (status) status.textContent = 'Use Previous/Next to navigate pages.';
  } catch {
    if (status) status.textContent = 'Unable to render this page. Try again.';
  }

  updateNewsletterControls(viewerId);
}

async function initNewsletterViewer(viewerId) {
  const root = document.getElementById(viewerId);
  const canvas = document.getElementById(`${viewerId}-canvas`);
  if (!root || !canvas) return;

  const src = root.dataset.pdfSrc;
  if (!src) return;

  const status = document.getElementById(`${viewerId}-status`);
  if (status) status.textContent = 'Loading PDF...';

  try {
    const pdfjsLib = await loadPdfJs();
    const loadingTask = pdfjsLib.getDocument(src);
    const pdfDoc = await loadingTask.promise;

    newsletterViewers[viewerId] = {
      pdfDoc,
      page: 1,
      totalPages: pdfDoc.numPages,
      lockedScale: null,
      viewport: document.getElementById(`${viewerId}-viewport`),
      canvas,
      ctx: canvas.getContext('2d', { alpha: false }),
      renderTask: null,
    };

    await renderNewsletterPage(viewerId);
  } catch {
    if (status) status.textContent = 'Unable to load PDF in-page. Use Open PDF instead.';
  }
}

function initNewsletterViewers() {
  initNewsletterViewer('newsletter-2026');
  initNewsletterViewer('newsletter-2025');
}

function changePdfPage(viewerId, delta) {
  const viewer = newsletterViewers[viewerId];
  if (!viewer) return;

  const next = Math.min(viewer.totalPages, Math.max(1, viewer.page + delta));
  if (next === viewer.page) return;

  viewer.page = next;
  renderNewsletterPage(viewerId);
}

function rerenderNewsletterViewers() {
  Object.keys(newsletterViewers).forEach((viewerId) => {
    renderNewsletterPage(viewerId);
  });
}

window.toggleAccordion = toggleAccordion;
window.toggleNestedAccordion = toggleNestedAccordion;
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.goToSlide = goToSlide;
window.changePdfPage = changePdfPage;

window.addEventListener('resize', () => {
  rerenderNewsletterViewers();
});

// ── Init on load ───────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initFadeUps();
  initNewsletterViewers();
});
