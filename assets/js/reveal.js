export function initReveal() {
    const items = document.querySelectorAll('[data-reveal]');

    if (!('IntersectionObserver' in window)) {
        items.forEach((item) => item.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting, boundingClientRect }) => {
            if (isIntersecting) {
                target.classList.add('is-visible');
            } else if (boundingClientRect.top > 0) {
                target.classList.remove('is-visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });

    items.forEach((item) => observer.observe(item));
}
