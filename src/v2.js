import translations from './locales.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Language switcher
    const langSwitcher = document.getElementById('lang-switcher-v2');

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
    }

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

    setLanguage(initialLang);

    if (langSwitcher) {
        langSwitcher.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }

    // 2. Filterable Treatments Modal / Interactive Selection
    const filterButtons = document.querySelectorAll('.treatment-filter-btn');
    const treatmentCards = document.querySelectorAll('.treatment-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.classList.remove('bg-amber-900', 'text-white');
                b.classList.add('bg-stone-100', 'text-stone-700');
            });
            btn.classList.remove('bg-stone-100', 'text-stone-700');
            btn.classList.add('bg-amber-900', 'text-white');

            const filter = btn.getAttribute('data-filter');

            treatmentCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    card.classList.add('animate-fadeIn');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 3. Treatment Detail Modal Logic
    const modal = document.getElementById('treatment-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const closeModalBtn = document.getElementById('close-modal');

    document.querySelectorAll('.open-treatment-modal').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const title = button.getAttribute('data-title');
            const desc = button.getAttribute('data-desc');

            if (modalTitle && modalDesc) {
                modalTitle.textContent = title;
                modalDesc.textContent = desc;
            }

            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
        });
    });

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        });
    }

    // 4. Quick Consultation Form Simulator
    const consultForm = document.getElementById('quick-consult-form');
    const consultSuccess = document.getElementById('consult-success');

    if (consultForm) {
        consultForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (consultSuccess) {
                consultSuccess.classList.remove('hidden');
                consultForm.reset();
                setTimeout(() => {
                    consultSuccess.classList.add('hidden');
                }, 5000);
            }
        });
    }

    // 5. Infinite Smooth Testimonial Carousel
    const marqueeTrack = document.getElementById('marquee-track-v2');
    if (marqueeTrack) {
        let translate = 0;
        let animationFrame;
        const speed = 0.6;

        function scrollMarquee() {
            translate -= speed;
            if (Math.abs(translate) >= marqueeTrack.scrollWidth / 2) {
                translate = 0;
            }
            marqueeTrack.style.transform = `translateX(${translate}px)`;
            animationFrame = requestAnimationFrame(scrollMarquee);
        }

        animationFrame = requestAnimationFrame(scrollMarquee);

        marqueeTrack.addEventListener('mouseenter', () => cancelAnimationFrame(animationFrame));
        marqueeTrack.addEventListener('mouseleave', () => {
            animationFrame = requestAnimationFrame(scrollMarquee);
        });
    }
});
