const startAnalysisButton = document.getElementById('startAnalysis');
const closeModalButton = document.getElementById('closeModal');
const supportModal = document.getElementById('supportModal');
const featureCards = document.querySelectorAll('.feature-card');
const navLinks = document.querySelectorAll('.top-nav a');

const redirectToPage = (url) => {
    window.location.href = url;
};

const scrollToSection = (selector) => {
    const section = document.querySelector(selector);
    if (!section) return;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const toggleModal = (show) => {
    if (!supportModal) return;
    if (show) {
        supportModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        supportModal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

const initFeatureCards = () => {
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.12}s`;
        card.classList.add('visible');
        card.addEventListener('click', () => {
            const target = card.dataset.target;
            if (target) {
                if (target === '/dashboard') {
                    redirectToPage('/dashboard');
                } else if (target === '/analytics') {
                    redirectToPage('/analytics');
                } else if (target === '/predictor') {
                    redirectToPage('/predictor');
                } else if (target === '/support') {
                    redirectToPage('/support');
                } else {
                    scrollToSection(target);
                }
            }
        });
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const target = card.dataset.target;
                if (target) {
                    if (target === '/dashboard') {
                        redirectToPage('/dashboard');
                    } else if (target === '/analytics') {
                        redirectToPage('/analytics');
                    } else if (target === '/predictor') {
                        redirectToPage('/predictor');
                    } else if (target === '/support') {
                        redirectToPage('/support');
                    } else {
                        scrollToSection(target);
                    }
                }
            }
        });
    });
};

const initNavLinks = () => {
    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                scrollToSection(href);
            } else {
                redirectToPage(href);
            }
        });
    });
};

if (startAnalysisButton) {
    startAnalysisButton.addEventListener('click', () => redirectToPage('/predictor'));
}

if (closeModalButton) {
    closeModalButton.addEventListener('click', () => toggleModal(false));
}

if (supportModal) {
    supportModal.addEventListener('click', (event) => {
        if (event.target === supportModal) {
            toggleModal(false);
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        toggleModal(false);
    }
});

initFeatureCards();
initNavLinks();