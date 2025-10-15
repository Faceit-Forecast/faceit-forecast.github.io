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

setupCopyButton();