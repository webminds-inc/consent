window.__wmConsentInit = function (callback, __wmConsentBrand, __wmConsentPolicy, __wmThemeColor, __wmTextColor) {
    var PREFIX = '__wmConsent';
    var DENIED = 'denied';
    var GRANTED = 'granted';
    var DNS = 'do_not_sell';

    var head = document.getElementsByTagName('head')[0];
    if (!head || !window.__wmConsentCss || !window.__wmConsentHTML) {
        return;
    }

    window.__wmConsentCss = window.__wmConsentCss.
        replace('#3f51b5', __wmThemeColor).
        replace('#575757', __wmTextColor);

    var css = document.createElement('style');
    css.textContent = window.__wmConsentCss;
    head.appendChild(css);

    var website = window.location.protocol + '://' + window.location.host;
    window.__wmConsentHTML = window.__wmConsentHTML.
        replace(/{{brand}}/g, __wmConsentBrand).
        replace(/{{website}}/g, website);

    var container = document.createElement('div');
    container.className = PREFIX;
    container.innerHTML = window.__wmConsentHTML;
    document.body.appendChild(container);

    var form = container.querySelector('form');
    var checkboxes = container.querySelectorAll('input[type="checkbox"]:not([name="essential_cookies"]):not([name="' + DNS + '"])');
    var dns = container.querySelector('input[name="' + DNS + '"]');

    if (form && __wmConsentPolicy && /https?:\/\//.test(__wmConsentPolicy)) {
        form.action = __wmConsentPolicy;
        form.target = "_blank";
    }

    function __wmSetChangeButtons(changed) {
        var decline = container.querySelector('button.__wmButtonDecline');
        var allow = container.querySelector('button.__wmButtonAllow');
        if (decline) {
            decline.value = changed === true ? 'discard' : 'decline';
            decline.textContent = changed === true ? 'Discard changes' : 'Decline all';
        }
        if (allow) {
            allow.value = changed === true ? 'finish' : 'allow';
            allow.textContent = changed === true ? 'Save and finish' : 'Allow all';
        }
    }

    function __wmConsentUpdateCustom() {
        var data = {};
        [
            'ad_storage',
            'ad_user_data',
            'ad_personalization',
            'analytics_storage',
            'functionality_storage',
            'personalization_storage',
            'security_storage'
        ].forEach(function (key) {
            var hasGranted = false;
            checkboxes.forEach(function(input) {
                if(input.checked && input.value.indexOf(key) !== -1) {
                    hasGranted = true;
                }
            });
            data[key] = hasGranted === true ? GRANTED : DENIED;
        });
        //checkboxes.forEach(function(input) {
        //    console.log(input.name, input.value, input.checked);
        //});
        callback.call(this, data);
        container.parentNode.removeChild(container);
    }

    function __wmConsentUpdate(val) {
        checkboxes.forEach(function(input) {
            input.checked = val === GRANTED;
        });
        dns.checked = val === DENIED;
        __wmConsentUpdateCustom();
    }

    container.style.display = 'block';
    container.querySelectorAll('button').forEach(function (button) {
        button.addEventListener('click', function (evt) {
            var button = evt.currentTarget;
            switch (button.value.trim().toLowerCase()) {
                case 'back':
                    container.className = PREFIX;
                    break;
                case 'more':
                    button.parentNode.parentNode.classList.toggle('__wmShow');
                    break;
                case 'policy':
                    if (__wmConsentPolicy) {
                        form.submit();
                    } else {
                        container.className = PREFIX + ' __wmPolicy';
                    }
                    break;
                case 'preferences':
                    container.className = PREFIX + ' __wmPreferences';
                    break;
                case 'discard':
                    checkboxes.forEach(function (item) {
                        if (item.name !== 'essential_cookies') {
                            item.checked = false;
                            item.disabled = false;
                        }
                    });
                    __wmSetChangeButtons(false);
                    break;
                case 'finish':
                    __wmConsentUpdateCustom();
                    break;
                case 'decline':
                    __wmConsentUpdate(DENIED);
                    break;
                case 'allow':
                    __wmConsentUpdate(GRANTED);
                    break;
            };
        });
    });

    dns.addEventListener('change', function(evt) {
        var el = evt.currentTarget;
        checkboxes.forEach(function (input) {
            if (el.checked) {
                input.checked = false;
                input.disabled = true;
            } else {
                input.disabled = false;
            }
        });
        __wmSetChangeButtons(el.checked);
    });

    checkboxes.forEach(function (item) {
        item.addEventListener('change', function (evt) {
            var checked = false;
            checkboxes.forEach(function (input) {
                checked = checked || input.checked;
            });
            __wmSetChangeButtons(checked);
        });
    });
};