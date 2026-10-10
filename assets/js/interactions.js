const PRESS_SELECTOR = '.btn, .action, .footer-social a';
const POP_SELECTOR = 'button:not(.nav-label):not(.faq-question), .btn, .action';
const POP_DURATION = 350;
const NAVIGATION_DELAY = 300;

const leavesPage = (link, event) =>
    link.matches('a[href]') &&
    !link.getAttribute('href').startsWith('#') &&
    link.target !== '_blank' &&
    !(event.ctrlKey || event.metaKey || event.shiftKey);

export function initInteractions() {
    let active = null;

    const release = () => {
        active?.classList.remove('is-pressed');
        active = null;
    };

    document.addEventListener('click', (event) => {
        if (event.target.closest('a[href="#"]')) {
            event.preventDefault();
        }

        const pressed = event.target.closest(PRESS_SELECTOR);
        if (pressed !== active) release();

        if (pressed) {
            pressed.classList.add('is-pressed');
            active = pressed;

            if (leavesPage(pressed, event)) {
                event.preventDefault();
                setTimeout(() => { window.location.href = pressed.href; }, NAVIGATION_DELAY);
            }
        }

        const popped = event.target.closest(POP_SELECTOR);
        if (popped) {
            popped.classList.remove('is-popping');
            void popped.offsetWidth;
            popped.classList.add('is-popping');
            setTimeout(() => popped.classList.remove('is-popping'), POP_DURATION);
        }
    });
}
