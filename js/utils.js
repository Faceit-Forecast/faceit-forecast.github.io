function setupCopyButton() {
    let notificationTimeout = null;
    const copyButton = document.getElementById('copyButton');

    if (copyButton) {
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText("forecast.extension@gmail.com").then(() => {
                const notification = document.getElementById('notification');
                notification.classList.add('show');

                if (notificationTimeout) clearTimeout(notificationTimeout);

                notificationTimeout = setTimeout(() => {
                    notification.classList.remove('show');
                    notificationTimeout = null;
                }, 2000);
            });
        });
    }
}

function switchLanguage(lang) {
    const contents = document.querySelectorAll('.language-content');
    contents.forEach(content => content.classList.add('hidden'));

    const selectedContent = document.getElementById(`content-${lang}`);
    if (selectedContent) {
        selectedContent.classList.remove('hidden');
    }

    localStorage.setItem('preferred-language', lang);
}

setupCopyButton();

window.addEventListener('load', function () {
    const savedLang = localStorage.getItem('preferred-language') || 'en';
    document.getElementById('languageSelect').value = savedLang;
    switchLanguage(savedLang);
});