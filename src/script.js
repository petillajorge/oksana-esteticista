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

        // Threshold to determine if it's a swipe vs scroll
        let isDragValid = false;
        let startY;
        const getX = (e) => (e.touches ? e.touches[0].pageX : e.pageX);

        const handleDragStart = (e) => {
            isDragging = true;
            isDragValid = false;
            startX = getX(e);
            startY = e.touches ? e.touches[0].pageY : e.pageY;
            prevTranslate = currentTranslate;
            wrapper.classList.add('cursor-grabbing');
            wrapper.classList.remove('cursor-grab');
            currentSpeed = 0; // Pause auto-scrolling during drag
        };

        const handleDragMove = (e) => {
            if (!isDragging) return;

            const x = getX(e);
            const y = e.touches ? e.touches[0].pageY : e.pageY;

            const diffX = Math.abs(x - startX);
            const diffY = Math.abs(y - startY);

            // If we are scrolling vertically more than horizontally on mobile, let the browser handle it
            // and cancel our drag to prevent layout jumping
            if (!isDragValid) {
                if (diffY > diffX && diffY > 5) {
                    isDragging = false;
                    return;
                }
                if (diffX > 5) {
                    isDragValid = true;
                }
            }

            // Once it's a valid horizontal drag, prevent vertical scrolling
            if (isDragValid && e.cancelable) {
                e.preventDefault();
            }

            // Adjust drag sensitivity to snap nicely (1.5 feels fast, let's use 1.2 to be more controllable)
            const walk = (x - startX) * 1.2;
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

        // Touch Events (passive: false is necessary so we can call preventDefault on touchmove to stop page scroll)
        wrapper.addEventListener('touchstart', handleDragStart, { passive: true });
        wrapper.addEventListener('touchmove', handleDragMove, { passive: false });
        wrapper.addEventListener('touchend', handleDragEnd);
    }

    // Services Card Click-to-Collapse Logic (Mobile/Desktop Hybrid)
    function initServicesToggle() {
        // Because we are using hover, mobile touch inherently acts as hover, 
        // but let's allow re-clicking to forcefully collapse it or remove focus
        const cards = document.querySelectorAll('.group.relative.p-8');
        cards.forEach(card => {
            card.addEventListener('click', function (e) {
                // Remove hover state forcibly by removing focus and group-hover simulation
                if (this.classList.contains('simulate-hover')) {
                    this.classList.remove('simulate-hover');
                } else {
                    cards.forEach(c => c.classList.remove('simulate-hover'));
                    this.classList.add('simulate-hover');
                }
            });
            // When leaving the card naturally, clear simulation
            card.addEventListener('mouseleave', function () {
                this.classList.remove('simulate-hover');
            });
        });
    }

    // Initialize
    initMarquee();
    initServicesToggle();

    // Initialize Language
    setLanguage(initialLang);

    // Event Listener for switcher
    if (langSwitcher) {
        langSwitcher.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }
});
