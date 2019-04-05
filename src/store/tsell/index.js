/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: "off" */

import * as api from '@/api/tsell';
import * as apiTuan from '@/api/tuan';
import { TSELL } from '@/store/types';
import { showLoading, hideLoading } from '@/store/utils';

export default {
  namespaced: true,
  state: {
    url: '',
    html: null,
    htmls: [],
    goods: [],
    lock: false,
  },
  getters: {},
  actions: {
    [TSELL.QUERY_LIST]({ commit, state }, { action, url }) {
      const cacheUsable = state.html && state.url === url;
      if ((!action || action === 'more') && !cacheUsable) {
        action = 'reload';
      } else if (action === 'refresh' && !cacheUsable) {
        action = '';
      }
      if (action) {
        commit(TSELL.QUERY_LIST, { status: 'start', action });
        return new Promise((resolve, reject) => {
          const loading = showLoading({ text: `正在从 ${url} 中获取数据` });
          api.queryList(url).then((res) => {
            commit(TSELL.QUERY_LIST, {
              status: 'success',
              action,
              url,
              list: res.data,
            });
            resolve(res);
          }).catch((err) => {
            commit(TSELL.QUERY_LIST, { status: 'failure', action });
            reject(err);
          }).finally(() => {
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
    [TSELL.GET_ZCFLOOR](_, { id }) {
      return apiTuan.getTuanNewzcFloor(id);
    },
    [TSELL.SET_ZCFLOOR](_, { form, json }) {
      return apiTuan.setTuanNewzcFloor({ form, json });
    },
  },
  mutations: {
    [TSELL.QUERY_LIST](state, { status, action, url, list }) {
      if (status === 'start') {
        if (action !== 'query') {
          state.url = '';
          state.html = '';
          state.goods = [];
          state.htmls = [];
          state.lock = true;
        }
      } else if (action !== 'query') {
        if (status === 'success') {
          state.url = url;
          state.goods = list;
        }
        state.lock = false;
      }
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
