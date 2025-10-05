function switchLanguage(lang) {
    const contents = document.querySelectorAll('.language-content');
    contents.forEach(content => content.classList.add('hidden'));

    const selectedContent = document.getElementById(`content-${lang}`);
    if (selectedContent) {
        selectedContent.classList.remove('hidden');
    }

    localStorage.setItem('preferred-language', lang);
}

async function loadSVG(element) {
    const url = element.getAttribute('data-src');
    if (!url) return;

    try {
        const response = await fetch(url);
        element.outerHTML = await response.text();
    } catch (error) {
        console.error('Failed to load SVG:', url, error);
    }
}

document.querySelectorAll('svg[data-src]').forEach(loadSVG);

window.addEventListener('load', function () {
    const savedLang = localStorage.getItem('preferred-language') || 'en';
    document.getElementById('languageSelect').value = savedLang;
    switchLanguage(savedLang);
});