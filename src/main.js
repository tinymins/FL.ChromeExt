// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// mint-ui see https://github.com/ElemeFE/mint-ui
/* eslint-disable no-new */

import Vue from 'vue';
import Element from 'element-ui';
import { sync } from 'vuex-router-sync';
import 'normalize.css';
import 'element-ui/lib/theme-default/index.css';
import '@/styles/main.scss';
import App from '@/App';
import router from '@/router';
import { store } from '@/store';
import '../static/js/flexible';

Vue.config.productionTip = false;
Vue.use(Element, { size: 'small' });

sync(store, router);
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});

// Fake all web requests' referer.
if (window.chrome && window.chrome.webRequest && window.chrome.webRequest.onBeforeSendHeaders) {
  window.chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
    const headers = {};
    if (details.type === 'xmlhttprequest') {
      const referer = details.requestHeaders.find(h => h.name === 'Referer');
      if (referer) {
        referer.value = details.url;
      } else {
        details.requestHeaders.push({ name: 'Referer', value: details.url });
      }
      headers.requestHeaders = details.requestHeaders;
    }
    return headers;
  }, { urls: ['http://*/*', 'https://*/*'] }, ['requestHeaders', 'blocking']);
}
