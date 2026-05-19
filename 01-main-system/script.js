// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//             YEYO 💎
//     ULTRA MUNICIPAL AI SYSTEM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const navbar = document.getElementById('navbar');
const themeToggle = document.getElementById('themeToggle');
const fadeSections = document.querySelectorAll('.fade-section');

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileSidebar = document.getElementById('mobileSidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const closeSidebar = document.getElementById('closeSidebar');

// NAVBAR SCROLL EFFECT

window.addEventListener('scroll', () => {

    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(7,17,31,0.78)';
        navbar.style.backdropFilter = 'blur(30px)';
        navbar.style.border = '1px solid rgba(255,255,255,0.16)';
    } else {
        navbar.style.background = 'rgba(255,255,255,0.08)';
    }

});

// LIGHT MODE

let isLight = false;

themeToggle.addEventListener('click', () => {

    isLight = !isLight;

    document.body.classList.toggle('light-mode');

    themeToggle.innerHTML = isLight ? '☀' : '◐';

});

// FADE ANIMATION

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }

    });

}, {
    threshold: 0.15
});

fadeSections.forEach(section => {
    observer.observe(section);
});

// MOBILE SIDEBAR

mobileMenuBtn.addEventListener('click', () => {

    mobileSidebar.classList.add('active');
    sidebarOverlay.classList.add('active');

});

closeSidebar.addEventListener('click', closeMenu);
sidebarOverlay.addEventListener('click', closeMenu);

function closeMenu() {

    mobileSidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');

}

// PARALLAX HERO EFFECT

window.addEventListener('mousemove', (e) => {

    const x = (window.innerWidth / 2 - e.pageX) / 90;
    const y = (window.innerHeight / 2 - e.pageY) / 90;

    document.querySelectorAll('.float-card').forEach(card => {

        card.style.transform = `translate(${x}px, ${y}px)`;

    });

});

// SMOOTH BUTTON FEEDBACK

const buttons = document.querySelectorAll('.primary-btn, .secondary-btn, .glass-btn');

buttons.forEach(button => {

    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-4px) scale(1.02)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0px) scale(1)';
    });

});

// SYSTEM BOOT LOG

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        LGU PORTAL
 MUNICIPAL LEGAL SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STATUS: ONLINE
AI SYSTEM: ACTIVE
CHAPTER INDEX: READY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//             END FILE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━