const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const demoBtn = document.getElementById('demoBtn');
const chatFab = document.getElementById('chatFab');
const toast = document.getElementById('toast');
const contactForm = document.getElementById('contactForm');
const revealItems = document.querySelectorAll('.reveal');
const statNumbers = document.querySelectorAll('[data-target]');
const tabButtons = document.querySelectorAll('.tab-btn');
const casePanels = document.querySelectorAll('.case-panel');
const testimonials = document.querySelectorAll('.testimonial');
const sliderDots = document.querySelectorAll('.slider-dot');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => toast.classList.remove('show'), 2800);
}

function closeMenu() {
  navMenu.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

menuToggle.addEventListener('click', () => {
  const active = navMenu.classList.toggle('active');
  document.body.classList.toggle('menu-open', active);
  menuToggle.setAttribute('aria-expanded', String(active));
});

navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

demoBtn.addEventListener('click', () => {
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  showToast('Seu diagnóstico inicial foi solicitado. Preencha o formulário para continuar.');
  closeMenu();
});

chatFab.addEventListener('click', () => {
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  showToast('Conversa iniciada. Conte seu desafio no formulário abaixo.');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal--visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealItems.forEach(item => revealObserver.observe(item));

let statsAnimated = false;
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statNumbers.forEach(stat => animateCounter(stat));
    }
  });
}, { threshold: 0.4 });

if (statNumbers.length) {
  statsObserver.observe(statNumbers[0].closest('.hero__stats'));
}

function animateCounter(element) {
  const target = Number(element.dataset.target);
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = current + (target === 38 || target === 97 ? '%' : '+');
  }, 30);
}

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    tabButtons.forEach(btn => btn.classList.remove('tab-btn--active'));
    casePanels.forEach(panel => panel.classList.remove('case-panel--active'));
    button.classList.add('tab-btn--active');
    document.getElementById(button.dataset.case).classList.add('case-panel--active');
  });
});

let currentSlide = 0;
function setSlide(index) {
  testimonials.forEach((item, i) => item.classList.toggle('testimonial--active', i === index));
  sliderDots.forEach((dot, i) => dot.classList.toggle('slider-dot--active', i === index));
  currentSlide = index;
}
sliderDots.forEach(dot => dot.addEventListener('click', () => setSlide(Number(dot.dataset.slide))));
setInterval(() => setSlide((currentSlide + 1) % testimonials.length), 4200);

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const company = document.getElementById('company').value.trim();
  const focus = document.getElementById('focus').value;
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !company || !focus || !validEmail) {
    showToast('Preencha nome, empresa, objetivo principal e um e-mail válido.');
    return;
  }
  contactForm.reset();
  showToast('Solicitação enviada com sucesso. Nossa equipe retornará em breve.');
});
