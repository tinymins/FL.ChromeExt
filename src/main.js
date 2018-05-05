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
