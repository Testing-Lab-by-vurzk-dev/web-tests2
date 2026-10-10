export function initHeroFade() {
    const hero = document.querySelector('.hero');
    const inner = document.querySelector('.hero-inner');
    if (!hero || !inner) return;

    let queued = false;

    const update = () => {
        const progress = Math.min(Math.max(window.scrollY / (hero.offsetHeight * 0.7), 0), 1);
        inner.style.opacity = String(1 - progress);
        inner.style.transform = `translateY(${-40 * progress}px)`;
        queued = false;
    };

    window.addEventListener('scroll', () => {
        if (!queued) {
            queued = true;
            requestAnimationFrame(update);
        }
    }, { passive: true });

    update();
}
