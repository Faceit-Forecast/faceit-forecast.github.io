const modal = document.getElementById('privacy-modal');
const privacyLink = document.getElementById('privacy-link');
const closeModal = document.getElementById('close-modal');

function openModal() {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    history.pushState({modal: 'privacy'}, '', '#privacy');
}

function closeModalFunc() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    if (window.location.hash === '#privacy') {
        history.pushState('', document.title, window.location.pathname);
    }
}

privacyLink.addEventListener('click', function (e) {
    e.preventDefault();
    openModal();
});

closeModal.addEventListener('click', closeModalFunc);

window.addEventListener('click', function (e) {
    if (e.target === modal) {
        closeModalFunc();
    }
});

window.addEventListener('load', function () {
    if (window.location.hash === '#privacy') {
        openModal();
    }
});

window.addEventListener('popstate', function (_) {
    if (window.location.hash === '#privacy') {
        openModal();
    } else {
        closeModalFunc();
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModalFunc();
    }
});