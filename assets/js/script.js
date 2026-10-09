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

    document.addEventListener('cookie-settings-open', () => {
        console.log('Cookie settings opened');
    });
});
