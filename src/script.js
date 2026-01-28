import translations from './locales.js';

document.addEventListener('DOMContentLoaded', () => {
    const langSwitcher = document.getElementById('lang-switcher');

    function setLanguage(lang) {
        const t = translations[lang] || translations['es'];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                el.textContent = t[key];
            }
        });
        document.documentElement.lang = lang;
        localStorage.setItem('preferredLang', lang);
        if (langSwitcher) langSwitcher.value = lang;
        console.log(`Language set to: ${lang}`);
    }

    // Detection Logic
    const savedLang = localStorage.getItem('preferredLang');
    const userLang = navigator.language || navigator.userLanguage;
    let initialLang = 'es';

    if (savedLang) {
        initialLang = savedLang;
    } else if (userLang.startsWith('ru')) {
        initialLang = 'ru';
    } else if (userLang.startsWith('uk')) {
        initialLang = 'ua';
    } else if (userLang.startsWith('en')) {
        initialLang = 'en';
    }

    // Marquee Logic
    function initMarquee() {
        const wrapper = document.getElementById('marquee-wrapper');
        const track = document.getElementById('marquee-track');
        if (!wrapper || !track) return;

        let isDragging = false;
        let startX;
        let scrollLeft;
        let currentTranslate = 0;
        let animationId;

        // Speed configuration (lower is slower)
        const baseSpeed = 0.5;

        // Loop logic
        function animate() {
            if (!isDragging) {
                currentTranslate -= baseSpeed;

                // Infinite Loop Logic
                // We assume the content is duplicated. When we have scrolled half (width of one set), we reset.
                // However, simpler is to check if we've reached the end.
                // Better approach: reset when the first set is fully out.
                // Assuming content is duplicated 1:1.

                const trackWidth = track.scrollWidth;
                const halfWidth = trackWidth / 2;

                // Reset when we've moved past half the width
                if (Math.abs(currentTranslate) >= halfWidth) {
                    currentTranslate = 0;
                }

                track.style.transform = `translateX(${currentTranslate}px)`;
            }
            animationId = requestAnimationFrame(animate);
        }

        // Start animation
        animationId = requestAnimationFrame(animate);

        // Pause on hover
        wrapper.addEventListener('mouseenter', () => {
            // Optional: Pause purely on hover, or only when dragging?
            // User asked for "fixing the pause on hover", so we pause the updating of transform
            // But we keep the animation loop running
            cancelAnimationFrame(animationId);
        });

        wrapper.addEventListener('mouseleave', () => {
            if (!isDragging) {
                animationId = requestAnimationFrame(animate);
            }
            isDragging = false;
            wrapper.classList.remove('cursor-grabbing');
            wrapper.classList.add('cursor-grab');
        });

        // Drag Functionality
        wrapper.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - wrapper.offsetLeft;
            // Get current transform value
            const style = window.getComputedStyle(track);
            const matrix = new DOMMatrix(style.transform);
            currentTranslate = matrix.m41;

            // Allow dragging (disable CSS transition if added)
            wrapper.classList.add('cursor-grabbing');
            wrapper.classList.remove('cursor-grab');
            cancelAnimationFrame(animationId); // Ensure auto-move stops
        });

        wrapper.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - wrapper.offsetLeft;
            const walk = (x - startX) * 1.5; // Scroll-fast
            let nextTranslate = currentTranslate + walk;

            // Boundary checks for infinite feel during Drag?
            // Re-implement infinite wrapping for drag
            const trackWidth = track.scrollWidth;
            const halfWidth = trackWidth / 2;

            // If dragged too far left
            if (nextTranslate <= -halfWidth) {
                nextTranslate += halfWidth;
                currentTranslate += halfWidth; // adjust base
                startX = x; // adjust reference
            }
            // If dragged too far right (positive)
            if (nextTranslate > 0) {
                nextTranslate -= halfWidth;
                currentTranslate -= halfWidth;
                startX = x;
            }

            track.style.transform = `translateX(${nextTranslate}px)`;

            // Update currentTranslate for the next auto-scroll resumption
            // Note: we don't update currentTranslate global here fully to keep "walk" relative to startX
            // But when mouseup happens, we need the new base.
        });

        wrapper.addEventListener('mouseup', (e) => {
            isDragging = false;
            wrapper.classList.remove('cursor-grabbing');
            wrapper.classList.add('cursor-grab');

            // Update the global currentTranslate to where we dropped it
            const style = window.getComputedStyle(track);
            const matrix = new DOMMatrix(style.transform);
            currentTranslate = matrix.m41;

            // Resume
            animationId = requestAnimationFrame(animate);
        });

        // Touch support
        wrapper.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX - wrapper.offsetLeft;
            const style = window.getComputedStyle(track);
            const matrix = new DOMMatrix(style.transform);
            currentTranslate = matrix.m41;
            cancelAnimationFrame(animationId);
        });

        wrapper.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX - wrapper.offsetLeft;
            const walk = (x - startX) * 1.5;
            let nextTranslate = currentTranslate + walk;

            const trackWidth = track.scrollWidth;
            const halfWidth = trackWidth / 2;

            if (nextTranslate <= -halfWidth) {
                nextTranslate += halfWidth;
                currentTranslate += halfWidth;
                startX = x;
            }
            if (nextTranslate > 0) {
                nextTranslate -= halfWidth;
                currentTranslate -= halfWidth;
                startX = x;
            }

            track.style.transform = `translateX(${nextTranslate}px)`;
        });

        wrapper.addEventListener('touchend', () => {
            isDragging = false;
            const style = window.getComputedStyle(track);
            const matrix = new DOMMatrix(style.transform);
            currentTranslate = matrix.m41;
            animationId = requestAnimationFrame(animate);
        });
    }

    // Initialize
    initMarquee();

    // Initialize Language
    setLanguage(initialLang);

    // Event Listener for switcher
    if (langSwitcher) {
        langSwitcher.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }
});
