/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: "off" */

import * as api from '@/api/csort';
import * as apiTuan from '@/api/tuan';
import { CSORT } from '@/store/types';
import { showLoading, hideLoading } from '@/store/utils';

export default {
  namespaced: true,
  state: {
    goods: [],
  },
  getters: {},
  actions: {
    [CSORT.QUERY]({ commit, state }, { reload, iids }) {
      const list = reload
        ? Object.assign([], iids)
        : iids.filter(iid => !state.goods.some(p => p.iid === iid));
      if (list.length > 0) {
        commit(CSORT.QUERY, { reload });
        return new Promise((resolve) => {
          const loading = showLoading();
          const next = () => {
            if (list.length === 0) {
              hideLoading({ id: loading });
              resolve();
              return;
            }
            const iid = list.shift();
            const subLoading = showLoading({ text: `加载商品 ${iid}` });
            apiTuan.getItemList({
              iid,
              state: 1,
              category: 0,
              subCategoryid: 0,
            }).then((res) => {
              Promise.all(res.data.map(item => new Promise((rs, rj) => {
                apiTuan.getTuanItem(item.id).then((resItem) => {
                  item.soldOut = resItem.data.sellout === '1' ? '是' : '否';
                  rs();
                }).catch(rj);
              }))).then(() => {
                commit(CSORT.QUERY_SUCCESS, { list: res.data });
              });
              next();
            }).catch(() => {
              next();
            }).finally(() => {
              hideLoading({ id: subLoading });
            });
          };
          next();
        });
      }
      return Promise.resolve();
    },
    [CSORT.SUBMIT]({ commit }, orilist) {
      const list = Object.assign([], orilist);
      if (list.length === 0) {
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        const loading = showLoading();
        const next = () => {
          if (list.length === 0) {
            hideLoading({ id: loading });
            resolve();
            return;
          }
          const p = list.shift();
          const subLoading = showLoading({ text: `修改商品 [${p.name}](${p.iid}) 超级排序为 ${p.newCsort}` });
          api.submit(p.id, p.newCsort).then(() => {
            commit(CSORT.SUBMIT_SUCCESS, p);
            next();
          }).catch(() => {
            commit(CSORT.SUBMIT_FAILURE, p);
            next();
          }).finally(() => {
            hideLoading({ id: subLoading });
          });
        };
        next();
      });
    },
  },
  mutations: {
    [CSORT.QUERY](state, { reload }) {
      if (reload) {
        state.goods = [];
      }
    },
    [CSORT.QUERY_SUCCESS](state, { list }) {
      list.forEach((item) => {
        const index = state.goods.findIndex(c => c.id === item.id);
        if (index >= 0) {
          state.goods.splice(index, 1);
        }
        state.goods.push(item);
      });
    },
    [CSORT.SUBMIT](state, p) {
      state.goods.filter(c => c.id === p.id).forEach((c) => { c.submitting = true; });
    },
    [CSORT.SUBMIT_SUCCESS](state, p) {
      state.goods.filter(c => c.id === p.id).forEach((c) => {
        c.submitting = false;
        c.csort = p.newCsort;
      });
    },
    [CSORT.SUBMIT_FAILURE](state, p) {
      state.goods.filter(c => c.id === p.id).forEach((c) => { c.submitting = false; });
    },
  },
};
