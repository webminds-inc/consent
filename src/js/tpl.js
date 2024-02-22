const log = require('logToConsole');
const injectScript = require('injectScript');
const setDefaultConsentState = require('setDefaultConsentState');
const updateConsentState = require('updateConsentState');
const getCookieValues = require('getCookieValues');
const setCookie = require('setCookie');
const callInWindow = require('callInWindow');
const gtagSet = require('gtagSet');
const COOKIE_NAME = '__wmConsent';

const defaultData = {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'denied',
  'personalization_storage': 'denied',
  'security_storage': 'denied',
  'wait_for_update': 500
};

const onUserConsent = (consent) => {
  let cookieVal = '';
  const consentModeStates = {};
  for (let key in defaultData) {
    if (key !== 'wait_for_update') {
      const val = consent[key];
      consentModeStates[key] = val ? val : 'denied';
      cookieVal += consentModeStates[key] === 'granted' ? 1 : 0;
    }
  }
  setCookie(COOKIE_NAME, cookieVal);
  updateConsentState(consentModeStates);
};

log('data =', data);

// Write default settings
gtagSet('ads_data_redaction', true);
gtagSet('url_passthrough', true);
setDefaultConsentState(defaultData);

// Check for saved settings
const savedSettings = getCookieValues(COOKIE_NAME).toString();
if (savedSettings !== 'undefined' && savedSettings !== '') {
  const consentModeStates = {};
  let index = 0;
  for (let key in defaultData) {
    if (key !== 'wait_for_update') {
      const val = savedSettings.charAt(index);
      consentModeStates[key] = val ? 'granted' : 'denied';
    }
    index++;
  }
  onUserConsent(consentModeStates);
} else {
  // Load consent banner script
  /*
  const url = 'https://cdn.jsdelivr.net/gh/copthuy/webminds/consent.min.js?v=8';
  injectScript(url, function () {
      callInWindow(
          '__wmConsentInit',
          onUserConsent,
          data.brandName || 'WebMinds',
          data.policyURL,
          data.themeColor || '#3f51b5',
          data.textColor || '#575757'
      );
  }, data.gtmOnFailure, url);
  */
  callInWindow(
    '__wmConsentInit',
    onUserConsent,
    data.brandName || 'WebMinds',
    data.policyURL,
    data.themeColor || '#3f51b5',
    data.textColor || '#575757'
  );
}

data.gtmOnSuccess();