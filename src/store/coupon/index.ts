/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2018-12-09 15:49:47
 * @Last Modified by: Emil Zhai
 * @Last Modified time: 2019-12-12 17:35:52
 */

// import * as api from '@/store/api/coupon';
import * as apiTuan from '@/api/tuan';
import { COUPON } from '@/store/types';
import { showLoading, hideLoading } from '@/store/utils';

export interface StoreCouponState {
  list: [];
  categoryList: [];
}

export default {
  namespaced: true,
  state: {
    list: [],
    categoryList: null,
  },
  getters: {},
  actions: {
    [COUPON.GET_CATEGORY]({ state, commit }, { reload = false } = {}) {
      if (!state.categoryList) {
        reload = true;
      }
      if (reload) {
        return new Promise((resolve, reject) => {
          const loading = showLoading({ text: '正在读取分类' });
          apiTuan.getCategoryList().then((res) => {
            commit(COUPON.GET_CATEGORY, res.data);
            resolve();
          }).catch(reject).finally(() => {
            hideLoading({ id: loading });
          });
        });
      }
      return Promise.resolve();
    },
    [COUPON.GET_LIST]({ commit }, { category = '0' } = {}) {
      return new Promise((resolve, reject) => {
        const subLoading = showLoading({ text: '加载售罄商品' });
        apiTuan.getItemList({
          youngName: '0',
          soldOut: '1',
          state: '1',
          category,
          subCategoryid: '0',
        }).then((res) => {
          commit(COUPON.GET_LIST, res.data);
          resolve();
        }).catch(reject).finally(() => {
          hideLoading({ id: subLoading });
        });
      });
    },
  },
  mutations: {
    [COUPON.GET_CATEGORY](state, list) {
      state.categoryList = list;
    },
    [COUPON.GET_LIST](state, list) {
      state.list = list;
    },
  },
};
