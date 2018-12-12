/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: "off" */

import * as api from '@/store/api/csort';
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
            api.queryList(iid).then((res) => {
              commit(CSORT.QUERY_SUCCESS, { list: res.data.data });
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
          const subLoading = showLoading({ text: `修改商品 [${p.name}](${p.iid}) 超级排序为 ${p.newSuperSort}` });
          api.submit(p.id, p.newSuperSort).then(() => {
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
        c.superSort = p.newSuperSort;
      });
    },
    [CSORT.SUBMIT_FAILURE](state, p) {
      state.goods.filter(c => c.id === p.id).forEach((c) => { c.submitting = false; });
    },
  },
};
