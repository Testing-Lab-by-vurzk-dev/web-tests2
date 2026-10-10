document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.querySelector('.hamburger-menu');
    const nav = document.getElementById('main-nav');

    if (menuButton && nav) {
        const setMenu = (open) => {
            menuButton.setAttribute('aria-expanded', String(open));
            menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            nav.hidden = !open;
            document.body.classList.toggle('menu-open', open);
        };

        menuButton.addEventListener('click', () => setMenu(nav.hidden));

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !nav.hidden) {
                setMenu(false);
                menuButton.focus();
            }
        });
    }

    document.querySelectorAll('.nav-label').forEach((label) => {
        const panel = document.getElementById(label.getAttribute('aria-controls'));
        if (!panel) return;

        label.addEventListener('click', () => {
            const open = label.getAttribute('aria-expanded') !== 'true';
            label.setAttribute('aria-expanded', String(open));
            panel.classList.toggle('is-open', open);
        });
    });

    document.addEventListener('click', (event) => {
        const target = event.target.closest('button:not(.nav-label):not(.faq-question), .btn, .action');
        if (!target) return;

        const isPageLink =
            target.matches('a[href]') &&
            !target.getAttribute('href').startsWith('#') &&
            target.target !== '_blank' &&
            !event.ctrlKey && !event.metaKey && !event.shiftKey;

        if (isPageLink) {
            event.preventDefault();
            setTimeout(() => { window.location.href = target.href; }, 300);
        }

        target.classList.remove('is-popping');
        void target.offsetWidth;
        target.classList.add('is-popping');

        const done = (animationEvent) => {
            if (animationEvent.animationName !== 'pop') return;
            target.classList.remove('is-popping');
            target.removeEventListener('animationend', done);
        };
        target.addEventListener('animationend', done);
    });

    const revealItems = document.querySelectorAll('[data-reveal]');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle('is-visible', entry.isIntersecting);
            });
        }, { threshold: 0.15 });

        revealItems.forEach((item) => observer.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add('is-visible'));
    }

    const hero = document.querySelector('.hero');
    const heroInner = document.querySelector('.hero-inner');

    if (hero && heroInner) {
        let waiting = false;

        const updateHeroFade = () => {
            const progress = Math.min(window.scrollY / (hero.offsetHeight * 0.7), 1);
            heroInner.style.opacity = String(1 - progress);
            heroInner.style.transform = `translateY(${progress * -40}px)`;
            waiting = false;
        };

        window.addEventListener('scroll', () => {
            if (!waiting) {
                waiting = true;
                requestAnimationFrame(updateHeroFade);
            }
        }, { passive: true });
    }

    document.querySelectorAll('.faq-question').forEach((question) => {
        const panel = document.getElementById(question.getAttribute('aria-controls'));

        question.addEventListener('click', () => {
            const open = !question.classList.contains('is-open');
            question.classList.toggle('is-open', open);
            question.setAttribute('aria-expanded', String(open));
            if (panel) panel.classList.toggle('is-open', open);
        });
    });

    const consentLink = document.getElementById('consent-preferences');

    if (consentLink) {
        consentLink.addEventListener('click', (event) => {
            event.preventDefault();
            if (window.ConsentManager) window.ConsentManager.reopen();
        });
    }

    document.addEventListener('cookie-settings-open', () => {
        console.log('Cookie settings opened');
    });
});
