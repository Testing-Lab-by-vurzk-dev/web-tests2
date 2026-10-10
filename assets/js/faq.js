export function initFaq() {
    document.querySelectorAll('.faq-question').forEach((question) => {
        const panel = document.getElementById(question.getAttribute('aria-controls'));

        question.addEventListener('click', () => {
            const open = !question.classList.contains('is-open');
            question.classList.toggle('is-open', open);
            question.setAttribute('aria-expanded', String(open));
            panel?.classList.toggle('is-open', open);
        });
    });
}
