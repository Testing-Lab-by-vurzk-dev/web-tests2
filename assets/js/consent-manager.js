(() => {
    'use strict';

    const COOKIE_NAME = 'user_cookie_consent';
    const MAX_AGE = 60 * 60 * 24 * 365;

    const getCookie = (name) =>
        document.cookie
            .split('; ')
            .find((row) => row.startsWith(name + '='))
            ?.split('=')[1];

    const setCookie = (name, value) => {
        const secure = location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `${name}=${value}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
    };

    const BANNER_HTML = `
        <div id="cookie-banner" class="cookie-overlay">
            <div class="cookie-text">
                <h3>COOKIE NOTICE</h3>
                <p>
                    We use cookies, pixels, and similar tracking technologies (“Cookies”) to optimise your game experience, personalise advertisements, and improve your experience across our websites, applications, and other web-based services (“Sites”).<br><br>
                    Some of these Cookies may transmit personal information and video viewing information to third parties. Certain Cookies are optional; however, limiting or declining non-optional Cookies may affect your visit and overall experience.<br><br>
                    You can change your preferences at any time via the Cookie Settings link available on our Sites. For further information about the Cookies we use and how they work, please visit our Cookie Policy.
                </p>
            </div>
            <div class="cookie-buttons">
                <button id="CookieSettings" class="btn-cookie btn-preferences">Cookie Settings</button>
                <button id="RejectAll" class="btn-cookie btn-decline">Reject All</button>
                <button id="AcceptCookies" class="btn-cookie btn-accept">Accept Cookies</button>
            </div>
        </div>`;

    const closeBanner = () => document.getElementById('cookie-banner')?.remove();

    const choose = (value) => {
        setCookie(COOKIE_NAME, value);
        closeBanner();
    };

    const showBanner = () => {
        if (document.getElementById('cookie-banner')) return;

        document.body.insertAdjacentHTML('beforeend', BANNER_HTML);

        document.getElementById('AcceptCookies').addEventListener('click', () => choose('accepted'));
        document.getElementById('RejectAll').addEventListener('click', () => choose('rejected'));
        document.getElementById('CookieSettings').addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('cookie-settings-open'));
        });
    };

    const init = () => {
        if (!getCookie(COOKIE_NAME)) showBanner();
    };

    window.ConsentManager = { reopen: showBanner };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
