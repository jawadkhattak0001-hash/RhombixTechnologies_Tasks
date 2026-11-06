// Mobile navigation
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

// Reveal sections as they enter the screen
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Small rotating role label
const roles = ['MERN Stack', 'Web Development', 'Always Learning'];
let roleIndex = 0;
const typeText = document.getElementById('typeText');
setInterval(() => {
  roleIndex = (roleIndex + 1) % roles.length;
  typeText.style.opacity = '0';
  setTimeout(() => {
    typeText.textContent = roles[roleIndex];
    typeText.style.opacity = '1';
  }, 220);
}, 2400);

// Contact form opens the visitor's email app (no backend required)
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const name = data.get('name');
  const email = data.get('email');
  const message = data.get('message');
  const recipient = 'YOUR_EMAIL@example.com'; // Replace with your real email
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});

if (window.lucide) lucide.createIcons();
