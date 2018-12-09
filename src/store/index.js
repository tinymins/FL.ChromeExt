/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import Vue from 'vue';
import Vuex from 'vuex';
import { isDevelop } from '@/utils/util';
// globle and common
// import * as getters   from './getters'
// import * as actions   from './actions'
// import * as mutations from '@/store/mutations';
import userModule from '@/store/modules/user';
import csortModule from '@/store/modules/csort';
import tsellModule from '@/store/modules/tsell';

Vue.use(Vuex);
export const store = new Vuex.Store({
  strict: isDevelop(),
  // state,
  // getters,
  // actions,
  // mutations,
});

store.registerModule('user', userModule);
store.registerModule('csort', csortModule);
store.registerModule('tsell', tsellModule);

export const clearAuthorization = () => {
  store.dispatch('user/USER_CLEAR');
};

export const getAuthorization = async () => {
  if (!store.state.user.user) {
    await store.dispatch('user/USER_GET');
  }
  return store.getters['user/user'];
};
