import { initI18n } from './i18n.js';
import { initNavigation } from './navigation.js';
import { initReveal } from './reveal.js';
import { initInteractions } from './interactions.js';
import { initFaq } from './faq.js';
import { initHeroFade } from './hero.js';
import { initTips } from './tips.js';

const ready = (callback) => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
};

ready(async () => {
    initNavigation();
    initReveal();
    initInteractions();
    initFaq();
    initHeroFade();

    document.getElementById('consent-preferences')?.addEventListener('click', (event) => {
        event.preventDefault();
        window.ConsentManager?.reopen();
    });

    await initI18n();
    initTips();
});
