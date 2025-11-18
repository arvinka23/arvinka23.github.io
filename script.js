const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-links a');
const contactForm = document.getElementById('contactForm');
const formLoading = document.getElementById('formLoading');
const yearSpan = document.getElementById('year');

const setTheme = (mode) => {
    body.classList.toggle('light-mode', mode === 'light');
    themeIcon.textContent = mode === 'light' ? '☀️' : '🌙';
    localStorage.setItem('theme', mode);
};

const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const nextTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
    setTheme(nextTheme);
});

navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
});

navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        target?.scrollIntoView({ behavior: 'smooth' });
        nav.classList.remove('open');
    });
});

if (contactForm && formLoading) {
    contactForm.addEventListener('submit', () => {
        formLoading.hidden = false;
    });
}

if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

