/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: ["error", { "props": false }] */

import * as api from '@/store/api/csort';
import { openIndicator, closeIndicator } from '@/store/api';
import { CSORT } from '@/store/types';
import { decodeTable, regexGet, getPureText } from '@/utils/util';

export default {
  namespaced: true,
  state: {
    htmls: [],
    goods: [],
  },
  getters: {},
  actions: {
    [CSORT.QUERY]({ commit, state }, { ids, newSorts, local = false }) {
      commit(CSORT.QUERY, ids);
      const list = ids.map((id, index) => ({
        id,
        newSort: newSorts[index],
      }));
      const hasRequest = local ? 0 : list.filter(
        p => state.goods.filter(c => c.id === p.id).length === 0,
      ).length > 0;
      return new Promise((resolve) => {
        if (hasRequest) {
          openIndicator('csort lock');
        }
        const next = () => {
          if (list.length === 0) {
            if (hasRequest) {
              closeIndicator('csort lock');
            }
            resolve();
            return;
          }
          const p = list.shift();
          if (hasRequest && state.goods.filter(c => c.id === p.id).length === 0) {
            api.queryList(
              `加载商品 ${p.id}`,
              p.id,
            ).then((res) => {
              commit(CSORT.QUERY_SUCCESS, { rec: p, html: res.data });
              next();
            }).catch(() => {
              next();
            });
          } else {
            commit(CSORT.QUERY_UPDATE, { p });
            next();
          }
        };
        next();
      });
    },
    [CSORT.SUBMIT]({ commit }, orilist) {
      const list = orilist.filter(p => p.newSort !== undefined && p.newSort !== p.sort);
      if (list.length === 0) {
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        openIndicator();
        const next = () => {
          if (list.length === 0) {
            closeIndicator();
            resolve();
            return;
          }
          const p = list.shift();
          api.submit(
            `修改商品 [${p.name}](${p.id}) 超级排序为 ${p.newSort}`,
            p.uid, p.newSort,
          ).then((res) => {
            if (res.data.status === 1) {
              commit(CSORT.SUBMIT_SUCCESS, p);
              next();
            } else {
              commit(CSORT.SUBMIT_FAILURE, p);
              next();
            }
          }).catch(() => {
            commit(CSORT.SUBMIT_FAILURE, p);
            next();
          });
        };
        next();
      });
    },
  },
  mutations: {
    [CSORT.QUERY](state, ids) {
      state.goods = state.goods.filter(c => ids.includes(c.id));
      state.htmls = state.htmls.filter(c => ids.includes(c.id) && c.matched);
    },
    [CSORT.QUERY_UPDATE](state, { p }) {
      const g = state.goods.find(c => c.id === p.id);
      state.goods = state.goods.filter(c => c.id !== p.id);
      if (g) {
        g.newSort = p.newSort;
        state.goods.push(g);
      }
    },
    [CSORT.QUERY_SUCCESS](state, { rec, html }) {
      let matched = false;
      const processRow = (row) => {
        const good = {
          uid: getPureText(row.columns[1]),
          id: regexGet(row.columns[0], /data-numiid='(\d+)'/),
          url: regexGet(row.columns[4], /href="([^"]+)"/),
          name: getPureText(row.columns[4]),
          image: regexGet(row.columns[6], /href="([^"]+)"/),
          price: getPureText(row.columns[8]),
          soldOut: getPureText(row.columns[11]),
          sort: regexGet(row.columns[14], /value="(\d+)" id="csort/),
          newSort: rec.newSort,
          submitting: false,
        };
        matched = true;
        state.goods.push(good);
      };
      const tbs = decodeTable(html).filter(p => p.maxColumn === 17);
      tbs.forEach(p => p.rows.forEach(processRow));
      state.htmls.push({ id: rec.id, html, matched });
    },
    [CSORT.SUBMIT](state, p) {
      state.goods.filter(c => c.uid === p.uid).forEach((c) => { c.submitting = true; });
    },
    [CSORT.SUBMIT_SUCCESS](state, p) {
      state.goods.filter(c => c.uid === p.uid).forEach((c) => {
        c.submitting = false;
        c.sort = p.newSort;
      });
    },
    [CSORT.SUBMIT_FAILURE](state, p) {
      state.goods.filter(c => c.uid === p.uid).forEach((c) => { c.submitting = false; });
    },
  },
};
