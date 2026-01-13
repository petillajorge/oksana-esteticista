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

    // Initialize
    setLanguage(initialLang);

    // Event Listener for switcher
    if (langSwitcher) {
        langSwitcher.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }
});
