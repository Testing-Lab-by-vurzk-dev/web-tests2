import { initNavigation } from './navigation.js';
import { initReveal } from './reveal.js';
import { initInteractions } from './interactions.js';
import { initFaq } from './faq.js';
import { initHeroFade } from './hero.js';

const ready = (callback) => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
};

ready(() => {
    initNavigation();
    initReveal();
    initInteractions();
    initFaq();
    initHeroFade();

    document.getElementById('consent-preferences')?.addEventListener('click', (event) => {
        event.preventDefault();
        window.ConsentManager?.reopen();
    });
});
