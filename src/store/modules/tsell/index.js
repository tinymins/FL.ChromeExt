/**
 * @Author: Zhai Yiming (root@derzh.com)
 * @Date:   2017-09-02 17:45:27
 * @Last Modified by:   Emine Zhai (root@derzh.com)
 * @Last Modified time: 2018-05-05 17:43:14
 */
/* eslint no-param-reassign: ["error", { "props": false }] */

import * as api from '@/store/api/tsell';
import { openIndicator, closeIndicator } from '@/store/api';
import { TSELL } from '@/store/types';

export default {
  namespaced: true,
  state: {
    html: null,
    htmls: [],
    goods: [],
  },
  getters: {},
  actions: {
    [TSELL.QUERY_LIST]({ commit, state }, params) {
      if (!state.html) {
        params.reload = true;
      }
      if (params.reload) {
        commit(TSELL.QUERY_LIST);
        return new Promise((resolve, reject) => {
          api.queryList().then((res) => {
            commit(TSELL.QUERY_LIST_SUCCESS, { html: res.data });
            resolve();
          }).catch(reject);
        });
      }
      return Promise.resolve();
    },
    [TSELL.QUERY_ITEMS]({ commit, state }, params) {
      const list = params.reload ? state.goods.slice(0) : state.goods.filter(p => p.url === '');
      if (list.length > 0) {
        return new Promise((resolve) => {
          openIndicator('tsell lock');
          const next = () => {
            if (list.length === 0) {
              closeIndicator('tsell lock');
              resolve();
              return;
            }
            const p = list.shift();
            api.queryItem(
              `加载商品 ${p.name}`,
              p.id,
            ).then((res) => {
              commit(TSELL.QUERY_ITEM_SUCCESS, { p, html: res.data });
              next();
            }).catch(next);
          };
          next();
        });
      }
      return Promise.resolve();
    },
  },
  mutations: {
    [TSELL.QUERY_LIST](state) {
      state.goods = [];
      state.htmls = [];
    },
    [TSELL.QUERY_LIST_SUCCESS](state, { html }) {
      const re = /<div id="goods-items_([\d.]+)"[\s\S]*?<a href="\/item\?id=\1" target="_blank">\s*([\s\S]*?)\s*<\/a>[\s\S]*?<\/i>([\d.]+)<\/b><\/p><span>券后价<\/span>[\s\S]*?<\/i>([\d.]+)<\/b><\/p><span>优惠券<\/span>[\s\S]*?<p>([\d.]+)<b>%<\/b><\/p><span>\s*([^<]+?)\s*<\/span>/gi;
      let r = re.exec(html);
      while (r) {
        state.goods.push({
          id: r[1],
          uid: '',
          name: r[2],
          finalPrice: r[3],
          discount: r[4],
          planNum: r[5],
          planType: r[6],
          url: '',
          discountUrl: '',
        });
        r = re.exec(html);
      }
      state.html = html;
    },
    [TSELL.QUERY_ITEM_SUCCESS](state, { p, html }) {
      const re = /优惠券:[\s\S]*?href="([^"]+)"[\s\S]*?下单链接:[\s\S]*?href="([^"]+)"/gi;
      const r = re.exec(html);
      if (r) {
        p.discountUrl = r[1];
        p.url = r[2];
        p.uid = p.url.replace(/.*id=/, '').replace(/\D.*/, '');
      }
    },
  },
};
