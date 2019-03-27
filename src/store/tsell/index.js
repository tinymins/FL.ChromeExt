/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: ["error", { "props": false }] */

import * as api from '@/api/tsell';
import { TSELL } from '@/store/types';
import { showLoading, hideLoading } from '@/store/utils';

export default {
  namespaced: true,
  state: {
    url: '',
    html: null,
    htmls: [],
    goods: [],
  },
  getters: {},
  actions: {
    [TSELL.QUERY_LIST]({ commit, state }, params) {
      if (!state.html || state.url !== params.url) {
        params.reload = true;
      }
      if (params.reload) {
        commit(TSELL.QUERY_LIST);
        return new Promise((resolve, reject) => {
          const loading = showLoading({ text: `正在从 ${params.url} 中获取数据` });
          api.queryList(params.url).then((res) => {
            commit(TSELL.QUERY_LIST_SUCCESS, {
              url: params.url,
              list: res.data,
            });
            resolve();
          }).catch(reject).finally(() => {
            hideLoading({ id: loading });
          });
        });
      }
      return Promise.resolve();
    },
    [TSELL.QUERY_ITEMS]({ commit, state }, params) {
      const list = params.reload ? state.goods.slice(0) : state.goods.filter(p => p.url === '');
      if (list.length > 0) {
        return new Promise((resolve) => {
          const loading = showLoading();
          const next = () => {
            if (list.length === 0) {
              hideLoading({ id: loading });
              resolve();
              return;
            }
            const p = list.shift();
            const subLoading = showLoading({ text: `加载商品 ${p.name}` });
            api.queryItem(p.id).then((res) => {
              commit(TSELL.QUERY_ITEM_SUCCESS, { p, item: res.data });
              next();
            }).catch(next).finally(() => {
              hideLoading({ id: subLoading });
            });
          };
          next();
        });
      }
      return Promise.resolve();
    },
  },
  mutations: {
    [TSELL.QUERY_LIST](state) {
      state.url = '';
      state.html = '';
      state.goods = [];
      state.htmls = [];
    },
    [TSELL.QUERY_LIST_SUCCESS](state, { url, list }) {
      state.url = url;
      state.goods = list;
    },
    [TSELL.QUERY_ITEM_SUCCESS](state, { p, item }) {
      Object.assign(p, item);
    },
  },
};
