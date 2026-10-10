export function initNavigation() {
    const menuButton = document.querySelector('.hamburger-menu');
    const nav = document.getElementById('main-nav');
    if (!menuButton || !nav) return;

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
