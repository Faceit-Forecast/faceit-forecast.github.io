let translations = {};
let currentLang = 'en';
let availableLanguages = [];

const LANG_DIR = 'lang';
const DEFAULT_LANG = 'en';

function detectBrowserLanguage() {
    const browserLang = (navigator.language || 'en').split('-')[0];
    return browserLang;
}

function getInitialLanguage() {
    const saved = localStorage.getItem('site-language');
    if (saved && availableLanguages.includes(saved)) {
        return saved;
    }

    const detected = detectBrowserLanguage();
    return availableLanguages.includes(detected) ? detected : DEFAULT_LANG;
}

async function discoverLanguages() {
    try {
        const response = await fetch(`${LANG_DIR}/languages.json`);
        const languages = await response.json();

        availableLanguages = languages.length ? languages : [DEFAULT_LANG];
        return availableLanguages;
    } catch (error) {
        console.error("Failed to load languages:", error);
        availableLanguages = [DEFAULT_LANG];
        return availableLanguages;
    }
}

async function loadLanguageFile(lang) {
    try {
        const response = await fetch(`${LANG_DIR}/${lang}.json`);
        if (!response.ok) throw new Error(`Language file not found: ${lang}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to load language ${lang}:`, error);
        if (lang !== DEFAULT_LANG) {
            return await loadLanguageFile(DEFAULT_LANG);
        }
        return null;
    }
}

async function loadTranslations(lang) {
    if (translations[lang]) {
        return true;
    }

    const data = await loadLanguageFile(lang);
    if (data) {
        translations[lang] = data;
        return true;
    }
    return false;
}

function getTranslation(key, lang) {
    const keys = key.split('.');
    let value = translations[lang];

    for (const k of keys) {
        if (value && typeof value === 'object') {
            value = value[k];
        } else {
            console.warn(`Translation not found for key: ${key}`);
            return key;
        }
    }

    return value !== undefined ? value : key;
}

async function applyTranslations(lang) {
    const loaded = await loadTranslations(lang);
    if (!loaded) {
        console.error('Failed to load translations for:', lang);
        return;
    }

    currentLang = lang;

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = getTranslation(key, lang);
    });

    document.querySelectorAll('[data-i18n-html]').forEach(element => {
        const key = element.getAttribute('data-i18n-html');
        element.innerHTML = getTranslation(key, lang);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = getTranslation(key, lang);
    });

    localStorage.setItem('site-language', lang);
    document.documentElement.lang = lang;

    const mainSelect = document.getElementById('mainLanguageSelect');
    if (mainSelect && mainSelect.value !== lang) {
        mainSelect.value = lang;
    }
}

function getLanguageLabel(code) {
    const labels = {
        'en': 'English',
        'ru': 'Русский',
        'de': 'Deutsch',
        'fr': 'Français',
        'uk': 'Українська',
        'pl': 'Polski'
    };
    return labels[code] || code.toUpperCase();
}

function addLanguageSelector() {
    const headerRight = document.querySelector('.header-right');
    if (!headerRight || document.getElementById('mainLanguageSelect')) return;

    const selector = document.createElement('div');
    selector.className = 'language-selector';

    const selectElement = document.createElement('select');
    selectElement.id = 'mainLanguageSelect';

    availableLanguages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = getLanguageLabel(lang);
        selectElement.appendChild(option);
    });

    selector.appendChild(selectElement);
    headerRight.appendChild(selector);

    selectElement.value = currentLang;
    selectElement.addEventListener('change', (e) => {
        applyTranslations(e.target.value);
    });
}

async function initLocalization() {
    await discoverLanguages();

    const initialLang = getInitialLanguage();
    await applyTranslations(initialLang);

    addLanguageSelector();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLocalization);
} else {
    initLocalization();
}