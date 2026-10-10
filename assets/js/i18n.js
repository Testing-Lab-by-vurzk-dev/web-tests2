const STORAGE_KEY = 'cofysoft-language';
const DEFAULT_LANGUAGE = 'en-GB';
const DICTIONARIES = { es: 'assets/i18n/es.xml' };
const ATTRIBUTES = ['aria-label', 'content', 'alt'];
const CONSENT_FIELDS = [
    ['#cookie-banner h3', 'cookie.title'],
    ['#CookieSettings', 'cookie.settings'],
    ['#RejectAll', 'cookie.reject'],
    ['#AcceptCookies', 'cookie.accept'],
];

let dictionary = null;
let currentLanguage = DEFAULT_LANGUAGE;

export const t = (key, fallback) => dictionary?.get(key) ?? fallback;

const isSupported = (language) => language === DEFAULT_LANGUAGE || language in DICTIONARIES;

async function loadDictionary(language) {
    if (!(language in DICTIONARIES)) return null;

    const response = await fetch(DICTIONARIES[language]);
    if (!response.ok) throw new Error(`Translation file unavailable (${response.status})`);

    const xml = new DOMParser().parseFromString(await response.text(), 'application/xml');
    if (xml.querySelector('parsererror')) throw new Error('Translation file is not valid XML');

    return new Map([...xml.querySelectorAll('string')].map((node) => [node.getAttribute('key'), node.textContent]));
}

function translateElement(element) {
    if (element.hasAttribute('data-i18n')) {
        element.dataset.i18nDefault ??= element.textContent;
        element.textContent = t(element.dataset.i18n, element.dataset.i18nDefault);
    }

    ATTRIBUTES.forEach((attribute) => {
        const key = element.getAttribute(`data-i18n-${attribute}`);
        if (!key) return;

        const defaultAttribute = `data-i18n-default-${attribute}`;
        if (!element.hasAttribute(defaultAttribute)) {
            element.setAttribute(defaultAttribute, element.getAttribute(attribute));
        }
        element.setAttribute(attribute, t(key, element.getAttribute(defaultAttribute)));
    });
}

function translateConsent() {
    CONSENT_FIELDS.forEach(([selector, key]) => {
        const element = document.querySelector(selector);
        if (!element) return;
        element.dataset.i18nDefault ??= element.textContent;
        element.textContent = t(key, element.dataset.i18nDefault);
    });

    const body = document.querySelector('#cookie-banner .cookie-text p');
    if (!body) return;
    body.dataset.i18nDefault ??= body.innerHTML;

    if (!dictionary) {
        body.innerHTML = body.dataset.i18nDefault;
        return;
    }

    const paragraphs = ['cookie.body.1', 'cookie.body.2', 'cookie.body.3'].map((key) => dictionary.get(key));
    body.replaceChildren();
    paragraphs.forEach((text, index) => {
        if (index) body.append(document.createElement('br'), document.createElement('br'));
        body.append(document.createTextNode(text));
    });
}

function translatePage() {
    document.querySelectorAll('[data-i18n], [data-i18n-aria-label], [data-i18n-content], [data-i18n-alt]').forEach(translateElement);
    translateConsent();
    document.documentElement.lang = currentLanguage;
    document.dispatchEvent(new CustomEvent('cofysoft:language', { detail: currentLanguage }));
}

export async function setLanguage(language) {
    if (!isSupported(language)) return;

    try {
        dictionary = await loadDictionary(language);
        currentLanguage = language;
    } catch (error) {
        console.error(error);
        dictionary = null;
        currentLanguage = DEFAULT_LANGUAGE;
    }

    localStorage.setItem(STORAGE_KEY, currentLanguage);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', currentLanguage);
    window.history.replaceState(null, '', url);
    translatePage();
}

export async function initI18n() {
    const requested = new URLSearchParams(window.location.search).get('lang') ?? localStorage.getItem(STORAGE_KEY);
    await setLanguage(isSupported(requested) ? requested : DEFAULT_LANGUAGE);

    document.addEventListener('click', (event) => {
        const link = event.target.closest('[data-lang]');
        if (!link) return;
        event.preventDefault();
        setLanguage(link.dataset.lang);
    });

    new MutationObserver(translateConsent).observe(document.body, { childList: true });
}
