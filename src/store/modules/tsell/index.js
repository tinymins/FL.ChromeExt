/**
 * @Author: Zhai Yiming (root@derzh.com)
 * @Date:   2017-09-02 17:45:27
 * @Last Modified by:   Emil Zhai (root@derzh.com)
 * @Last Modified time: 2018-08-10 18:37:42
 */
/* eslint no-param-reassign: ["error", { "props": false }] */

import * as api from '@/store/api/tsell';
import { openIndicator, closeIndicator } from '@/store/api';
import { TSELL } from '@/store/types';
import cheerio from 'cheerio';

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
          api.queryList(`正在从 ${params.url} 中获取数据`, params.url).then((res) => {
            commit(TSELL.QUERY_LIST_SUCCESS, {
              url: params.url,
              html: res.data,
            });
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
      state.url = '';
      state.html = '';
      state.goods = [];
      state.htmls = [];
    },
    [TSELL.QUERY_LIST_SUCCESS](state, { url, html }) {
      const $ = cheerio.load(html);
      $('.goods-item').each((_, element) => {
        const $goods = $(element);
        state.goods.push({
          id: $goods.attr('id').replace(/[^\d]/ig, '').trim(),
          uid: $goods.attr('data_goodsid').trim(),
          name: $goods.find('.goods-tit').text().trim(),
          finalPrice: parseFloat($goods.find('.goods-price').text().replace(/[^\d.]/ig, '').trim()),
          discount: parseFloat($goods.find('.goods-quan').text().replace(/[^\d.]/ig, '').trim()),
          planNum: parseFloat($goods.find('.goods-yj').find('p').text().trim()),
          planType: $goods.find('.goods-yj').find('span').text().trim(),
          url: '',
          discountUrl: '',
        });
      });
      state.url = url;
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
