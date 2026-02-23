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
        let currentTranslate = 0;
        let prevTranslate = 0;

        // Speed configuration
        const baseSpeed = 0.5;
        let currentSpeed = baseSpeed;

        let halfWidth = track.scrollWidth / 2;

        const updateWidth = () => {
            halfWidth = track.scrollWidth / 2;
        };

        window.addEventListener('resize', updateWidth);
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(updateWidth);
        } else {
            setTimeout(updateWidth, 500);
            setTimeout(updateWidth, 1500);
        }

        function animate() {
            if (!isDragging) {
                currentTranslate -= currentSpeed;
            }

            // Seamless infinite looping boundary checks
            if (currentTranslate <= -halfWidth) {
                currentTranslate += halfWidth;
                if (isDragging) prevTranslate += halfWidth;
            } else if (currentTranslate > 0) {
                currentTranslate -= halfWidth;
                if (isDragging) prevTranslate -= halfWidth;
            }

            track.style.transform = `translateX(${currentTranslate}px)`;
            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);

        // Hover to pause
        wrapper.addEventListener('mouseenter', () => currentSpeed = 0);
        wrapper.addEventListener('mouseleave', () => {
            currentSpeed = baseSpeed;
            isDragging = false;
            wrapper.classList.remove('cursor-grabbing');
            wrapper.classList.add('cursor-grab');
        });

        const getX = (e) => (e.touches ? e.touches[0].pageX : e.pageX);

        const handleDragStart = (e) => {
            isDragging = true;
            startX = getX(e);
            prevTranslate = currentTranslate;
            wrapper.classList.add('cursor-grabbing');
            wrapper.classList.remove('cursor-grab');
            currentSpeed = 0; // Pause auto-scrolling during drag
        };

        const handleDragMove = (e) => {
            if (!isDragging) return;
            // Prevent text selection and unwanted scroll during desktop drag
            if (!e.touches) e.preventDefault();

            const x = getX(e);
            // Feel free to adjust drag sensitivity (1 is 1:1, 1.5 is faster)
            const walk = (x - startX) * 1.5;
            currentTranslate = prevTranslate + walk;
        };

        const handleDragEnd = () => {
            isDragging = false;
            wrapper.classList.remove('cursor-grabbing');
            wrapper.classList.add('cursor-grab');
            // Resume speed if not still hovered (mouseleave handles the baseSpeed restore normally, but just in case for touch)
            if (!wrapper.matches(':hover')) {
                currentSpeed = baseSpeed;
            }
        };

        // Desktop Events
        wrapper.addEventListener('mousedown', handleDragStart);
        wrapper.addEventListener('mousemove', handleDragMove);
        wrapper.addEventListener('mouseup', handleDragEnd);

        // Touch Events
        wrapper.addEventListener('touchstart', handleDragStart, { passive: true });
        wrapper.addEventListener('touchmove', handleDragMove, { passive: true });
        wrapper.addEventListener('touchend', handleDragEnd);
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
