
/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { isInDevMode } from '@/utils/environment';
// globle and common
// import * as getters   from './getters'
// import * as actions   from './actions'
// import * as mutations from './mutations';
import commonModule, { StoreCommonState } from './common';
import userModule, { StoreUserState } from './user';
import csortModule, { StoreCsortState } from './csort';
import tsellModule, { StoreTsellState } from './tsell';
import couponModule, { StoreCouponState } from './coupon';

Vue.use(Vuex);

export interface StoreRootState {
  common: StoreCommonState;
  user: StoreUserState;
  csort: StoreCsortState;
  tsell: StoreTsellState;
  coupon: StoreCouponState;
}

const store: Store<StoreRootState> = new Vuex.Store<StoreRootState>({
  strict: isInDevMode(),
  modules: {
    common: commonModule,
    user: userModule,
    csort: csortModule,
    tsell: tsellModule,
    coupon: couponModule,
  },
  // state,
  // getters,
  // actions,
  // mutations,
});
export default store;
