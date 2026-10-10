import { t } from './i18n.js';

const STORAGE_KEY = 'cofysoft-seen-tips';
const SHOW_DELAY = 3500;
const VISIBLE_TIME = 8000;
const FADE_TIME = 600;

const TIPS = [
    { id: 'chat', icon: 'tip-chat', title: 'Chat Tip:', text: 'Stay connected with the Cofysoft community to keep up to date with our latest news and announcements!' },
    { id: 'gaming', icon: 'tip-game', title: 'Gaming Tip:', text: 'Discover our original games and keep an eye out for upcoming releases!' },
    { id: 'software', icon: 'tip-software', title: 'Software Tip:', text: 'Our software is designed to simplify business tasks and streamline everyday operations.' },
    { id: 'developer', icon: 'tip-code', title: 'Developer Tip:', text: 'Different projects call for different tools. Choosing the right technology is an important part of software development.' },
    { id: 'know', icon: 'tip-bulb', title: 'Did You Know?', text: 'Cofysoft develops software products designed to simplify business tasks and make everyday work easier.' },
    { id: 'news', icon: 'tip-news', title: 'Cofysoft News:', text: "There's always something new to explore. Visit us again to discover what we're working on!" },
    { id: 'member', icon: 'tip-member', title: 'Membership Tip:', text: 'Join the Cofysoft Membership to enjoy exclusive benefits and be the first to hear about our latest releases.' },
];

const readSeen = () => {
    try {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) ?? [];
    } catch {
        return [];
    }
};

function pickTip() {
    let seen = readSeen();
    let pool = TIPS.filter((tip) => !seen.includes(tip.id));

    if (!pool.length) {
        seen = [];
        pool = TIPS;
    }

    const tip = pool[Math.floor(Math.random() * pool.length)];
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...seen, tip.id]));
    return tip;
}

function buildTip(tip) {
    const element = document.createElement('aside');
    element.className = 'tip';
    element.setAttribute('role', 'status');
    element.innerHTML = `
        <svg class="icon tip-icon" aria-hidden="true"><use href="assets/img/icons.svg#${tip.icon}"></use></svg>
        <div>
            <strong class="tip-title"></strong>
            <p class="tip-text"></p>
        </div>`;
    element.querySelector('.tip-title').textContent = t(`tip.${tip.id}.title`, tip.title);
    element.querySelector('.tip-text').textContent = t(`tip.${tip.id}.text`, tip.text);
    return element;
}

export function initTips() {
    setTimeout(() => {
        const element = buildTip(pickTip());
        document.body.append(element);
        requestAnimationFrame(() => element.classList.add('is-visible'));

        const hide = () => {
            element.classList.remove('is-visible');
            setTimeout(() => element.remove(), FADE_TIME);
        };

        element.addEventListener('click', hide);
        setTimeout(hide, VISIBLE_TIME);
    }, SHOW_DELAY);
}
