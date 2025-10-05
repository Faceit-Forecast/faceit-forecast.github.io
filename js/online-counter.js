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

async function startOnlineUpdater() {
    function animateValue(element, start, end, duration = 600) {
        if (element.animationTimer) {
            cancelAnimationFrame(element.animationTimer);
        }
        const range = end - start;
        const startTime = Date.now();

        function updateCounter() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = start + (range * easeProgress);
            element.textContent = Math.round(current);
            if (progress < 1) {
                element.animationTimer = requestAnimationFrame(updateCounter);
            } else {
                element.textContent = end;
                delete element.animationTimer;
            }
        }

        updateCounter();
    }

    async function updateOnline() {
        let onlineElement = document.getElementById("online");
        if (onlineElement) {
            try {
                const res = await fetch(`https://forecast.dargen.dev/session/online`);
                if (!res.ok) throw new Error(`Error on fetching online: ${res.statusText}`);
                let online = await res.json();
                const currentValue = parseInt(onlineElement.textContent) || 0;
                const newValue = online.online;
                if (currentValue !== newValue) {
                    animateValue(onlineElement, currentValue, newValue);
                }
            } catch (error) {
                console.error('Failed to update online count:', error);
            }
        }
    }

    await updateOnline();
    setInterval(async () => {
        await updateOnline();
    }, 1000 * 30);
}

setupCopyButton();
startOnlineUpdater();