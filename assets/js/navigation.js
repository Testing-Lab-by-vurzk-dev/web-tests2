import { t } from './i18n.js';

export function initNavigation() {
    const menuButton = document.querySelector('.hamburger-menu');
    const nav = document.getElementById('main-nav');
    if (!menuButton || !nav) return;

    const syncLabel = () => {
        const open = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-label', open ? t('menu.close', 'Close menu') : t('menu.open', 'Open menu'));
    };

    const setMenu = (open) => {
        menuButton.setAttribute('aria-expanded', String(open));
        nav.hidden = !open;
        document.body.classList.toggle('menu-open', open);
        syncLabel();
    };

    menuButton.addEventListener('click', () => setMenu(nav.hidden));
    document.addEventListener('cofysoft:language', syncLabel);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !nav.hidden) {
            setMenu(false);
            menuButton.focus();
        }
    });

    nav.querySelectorAll('.nav-label').forEach((label) => {
        const panel = document.getElementById(label.getAttribute('aria-controls'));
        if (!panel) return;

        label.addEventListener('click', () => {
            const open = label.getAttribute('aria-expanded') !== 'true';
            label.setAttribute('aria-expanded', String(open));
            panel.classList.toggle('is-open', open);
        });
    });
}
