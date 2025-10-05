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