}

  // Smooth scroll for in-page links (accounts for header height)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      // close mobile nav if open
      if (primaryNav.classList.contains('open')) {
        primaryNav.classList.remove('open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
      const headerHeight = header ? header.offsetHeight : 72;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ----------------------------
   HERO SLIDESHOW (auto, 2s)
   - pause on hover/focus, supports touch swipe
   ---------------------------- */
(function(){
  const heroContainer = document.querySelector('.hero-slideshow');
  if (!heroContainer) return;
  const slides = Array.from(heroContainer.querySelectorAll('.hero-slide'));
  let idx = slides.findIndex(s => s.classList.contains('active'));
  if (idx < 0) idx = 0;

  function show(i){
    slides.forEach((s, j) => s.classList.toggle('active', j === i));
  }

  // autoplay every 2s
  let interval = setInterval(() => {
    idx = (idx + 1) % slides.length;
    show(idx);
  }, 2000);

  // pause on mouse enter / focus
  heroContainer.addEventListener('mouseenter', () => clearInterval(interval));
  heroContainer.addEventListener('mouseleave', () => {
    clearInterval(interval);
    interval = setInterval(() => { idx = (idx + 1) % slides.length; show(idx); }, 2000);
  });

  // touch swipe (left/right)
  let startX = 0;
  heroContainer.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length) startX = e.touches[0].clientX;
  }, {passive:true});
  heroContainer.addEventListener('touchend', (e) => {
    const endX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : startX;
    const diff = startX - endX;
    if (diff > 40) { idx = (idx + 1) % slides.length; show(idx); }
    else if (diff < -40) { idx = (idx - 1 + slides.length) % slides.length; show(idx); }
  }, {passive:true});

  // initial
  show(idx);
})();

/* ----------------------------
   PREVIOUS STUNTS CAROUSEL (10 slides)
   - autoplay slow (5s), supports swipe and mouse drag
   ---------------------------- */
(function(){
  const carousel = document.querySelector('.previous-carousel');
  if (!carousel) return;
  const slides = Array.from(carousel.querySelectorAll('.prev-slide'));
  let idx = slides.findIndex(s => s.classList.contains('active'));
  if (idx < 0) idx = 0;

  function show(i){
    slides.forEach((s,j)=> s.classList.toggle('active', j===i));
  }

  // autoplay
  let interval = setInterval(()=>{ idx = (idx+1)%slides.length; show(idx); }, 5000);

  // touch support
  let startX = 0;
  carousel.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length) {
      startX = e.touches[0].clientX;
      clearInterval(interval);
    }
  }, {passive:true});

  carousel.addEventListener('touchend', (e) => {
    const endX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : startX;
    const diff = startX - endX;
    if (diff > 50) idx = (idx + 1) % slides.length;
    else if (diff < -50) idx = (idx - 1 + slides.length) % slides.length;
    show(idx);
    clearInterval(interval);
    interval = setInterval(()=>{ idx = (idx+1)%slides.length; show(idx); }, 5000);
  }, {passive:true});

  // mouse drag (desktop)
  let mouseDown = false, mouseStart = 0;
  carousel.addEventListener('mousedown', (e) => {
    mouseDown = true; mouseStart = e.clientX; clearInterval(interval);
  });
  document.addEventListener('mouseup', (e) => {
    if (!mouseDown) return;
    mouseDown = false;
    const diff = mouseStart - e.clientX;
    if (diff > 50) idx = (idx + 1) % slides.length;
    else if (diff < -50) idx = (idx - 1 + slides.length) % slides.length;
    show(idx);
    clearInterval(interval);
    interval = setInterval(()=>{ idx = (idx+1)%slides.length; show(idx); }, 5000);
  });

  // initial render
  show(idx);
})();

/* ----------------------------
   CONTACT FORM (placeholder)
   ---------------------------- */
(function(){
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    alert('Thank you — message sent (placeholder). Replace with real backend integration).');
    form.reset();
  });
})();


/* --- Autofest: mobile logo toggle + click-outside + resize handling (appended) --- */
(function () {
  const primaryNav = document.getElementById('primary-nav');
  const mobileLogo = document.querySelector('.mobile-nav-logo');

  function openNav(){ if(primaryNav) primaryNav.classList.add('open'); }
  function closeNav(){ if(primaryNav) primaryNav.classList.remove('open'); }
  function toggleNav(){ if(primaryNav) primaryNav.classList.toggle('open'); }

  if (mobileLogo && primaryNav) {
    mobileLogo.addEventListener('click', function (e) {
      if (window.innerWidth <= 991) {
        e.preventDefault();
        toggleNav();
      }
    });
  }

  // close when clicking outside
  document.addEventListener('click', function (e) {
    if (!primaryNav || !primaryNav.classList.contains('open')) return;
    const clickInside = primaryNav.contains(e.target) || (mobileLogo && mobileLogo.contains(e.target));
    if (!clickInside) closeNav();
  });

  // close on resize to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 991) closeNav();
  });

  // smooth scroll for in-page anchors — respects header height
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      ev.preventDefault();
      if (primaryNav && primaryNav.classList.contains('open')) closeNav();
      const header = document.querySelector('.site-header');
      const headerHeight = header ? header.offsetHeight : 72;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
const logo = document.querySelector(".mobile-nav-logo");
const nav = document.querySelector(".primary-nav");

// Create overlay dynamically
const overlay = document.createElement("div");
overlay.className = "nav-overlay";
document.body.appendChild(overlay);

// Toggle menu
logo.addEventListener("click", () => {
  nav.classList.toggle("open");
  logo.classList.toggle("active");
  overlay.classList.toggle("active");
});

// Close when clicking overlay
overlay.addEventListener("click", () => {
  nav.classList.remove("open");
  logo.classList.remove("active");
  overlay.classList.remove("active");
});

// Reset on resize
window.addEventListener("resize", () => {
  if (window.innerWidth > 991) {
    nav.classList.remove("open");
    logo.classList.remove("active");
    overlay.classList.remove("active");
  }
});
// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({ top: target.offsetTop - 60, behavior: "smooth" });
    }
  });
});

// Auto collapse mobile navbar after click
const navLinks = document.querySelectorAll('.navbar-collapse .nav-link');
const navbarCollapse = document.querySelector('.navbar-collapse');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (navbarCollapse.classList.contains('show')) {
      new bootstrap.Collapse(navbarCollapse, { toggle: true });
    }
  });
});

// Back to top button
const backToTop = document.createElement('button');
backToTop.innerHTML = '↑';
backToTop.className = 'btn btn-danger position-fixed';
backToTop.style.bottom = '25px';
backToTop.style.right = '20px';
backToTop.style.display = 'none';
backToTop.style.borderRadius = '50%';
backToTop.style.width = '40px';
backToTop.style.height = '40px';
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
  backToTop.style.display = window.scrollY > 400 ? 'block' : 'none';
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
// Scroll reveal animation
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  reveals.forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const revealPoint = 100;
    if (elementTop < windowHeight - revealPoint) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
