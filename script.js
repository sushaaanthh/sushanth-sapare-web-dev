// Initialize Animations
AOS.init({ 
    duration: 800, 
    once: true,
    easing: 'ease-out-sine'
});

// Initialize Lucide Icons
lucide.createIcons();

// Scroll to Top Function
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Smooth Scroll for Nav Links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offset = 80; 
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Spy for Nav Active States
const sections = document.querySelectorAll('header, section');
const navLinks = document.querySelectorAll('.nav-links a:not(.btn-sm)');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        // Trigger highlight slightly before the section reaches the top of the viewport
        if (scrollPosition >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Scroll Progress Indicator
const scrollProgress = document.getElementById('scrollProgress');
let isScrolling = false;

window.addEventListener('scroll', () => {
    if (!isScrolling && scrollProgress) {
        window.requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercentage = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
            scrollProgress.style.transform = `scaleX(${scrollPercentage})`;
            isScrolling = false;
        });
        isScrolling = true;
    }
}, { passive: true });

// Dual-Element Custom Cursor System
const cursorInner = document.getElementById('cursorInner');
const cursorOuter = document.getElementById('cursorOuter');

let mouseX = -100;
let mouseY = -100;
let outerX = -100;
let outerY = -100;
let innerScale = 1;
let outerScale = 1;
let targetInnerScale = 1;
let targetOuterScale = 1;
let isCursorVisible = false;

// Listen for mouse movement
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (!isCursorVisible) {
        isCursorVisible = true;
        if (cursorInner) cursorInner.style.opacity = '1';
        if (cursorOuter) cursorOuter.style.opacity = '1';
        outerX = mouseX;
        outerY = mouseY;
    }
}, { passive: true });

// Handle pointer leaving and entering document viewport
document.addEventListener('mouseleave', () => {
    isCursorVisible = false;
    if (cursorInner) cursorInner.style.opacity = '0';
    if (cursorOuter) cursorOuter.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    isCursorVisible = true;
    if (cursorInner) cursorInner.style.opacity = '1';
    if (cursorOuter) cursorOuter.style.opacity = '1';
});

// Interactive State Callbacks via Event Delegation
const interactiveSelectors = 'a, button, .skill-category, .project-card, .resp-card, .btn-large, .nav-avatar, .footer-back-to-top, [onclick], input, textarea';

document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(interactiveSelectors);
    if (target) {
        if (cursorOuter) cursorOuter.classList.add('cursor-hover');
        if (cursorInner) cursorInner.classList.add('cursor-hover');
    }
});

document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(interactiveSelectors);
    if (target) {
        const related = e.relatedTarget && e.relatedTarget.closest ? e.relatedTarget.closest(interactiveSelectors) : null;
        if (related !== target) {
            if (cursorOuter) cursorOuter.classList.remove('cursor-hover');
            if (cursorInner) cursorInner.classList.remove('cursor-hover');
        }
    }
});

// Mousedown / Mouseup scaling
window.addEventListener('mousedown', () => {
    targetInnerScale = 0.85;
    targetOuterScale = 0.85;
}, { passive: true });

window.addEventListener('mouseup', () => {
    targetInnerScale = 1;
    targetOuterScale = 1;
}, { passive: true });

// requestAnimationFrame Engine for smooth tracking & lerping
function renderCursor() {
    if (cursorInner && cursorOuter) {
        // Lerp scales for smooth elastic easing on click
        innerScale += (targetInnerScale - innerScale) * 0.2;
        outerScale += (targetOuterScale - outerScale) * 0.2;

        // Inner cursor: instant tracking without lag
        cursorInner.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${innerScale})`;
        
        // Outer cursor: sequential linear interpolation (~0.18 factor for elastic smoothness)
        outerX += (mouseX - outerX) * 0.18;
        outerY += (mouseY - outerY) * 0.18;
        
        cursorOuter.style.transform = `translate3d(${outerX}px, ${outerY}px, 0) translate(-50%, -50%) scale(${outerScale})`;
    }
    requestAnimationFrame(renderCursor);
}
requestAnimationFrame(renderCursor);