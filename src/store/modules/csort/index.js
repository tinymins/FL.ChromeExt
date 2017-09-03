/**
 * @Author: Zhai Yiming (root@derzh.com)
 * @Date:   2017-09-02 17:45:27
 * @Last Modified by:   Zhai Yiming
 * @Last Modified time: 2017-09-03 16:37:05
 */
/* eslint no-param-reassign: ["error", { "props": false }] */

import * as api from '@/store/api/csort';
import { openIndicator, closeIndicator } from '@/store/api';
import { CSORT } from '@/store/types';

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
          openIndicator();
        }
        const next = () => {
          if (list.length === 0) {
            if (hasRequest) {
              closeIndicator();
            }
            resolve();
            return;
          }
          const p = list.shift();
          if (hasRequest && state.goods.filter(c => c.id === p.id).length === 0) {
            api.queryList(p.id).then((res) => {
              commit(CSORT.QUERY_SUCCESS, { p, html: res.data });
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
    [CSORT.SUBMIT]({ commit, state }, orilist) {
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
          api.submit(p.uid, p.newSort).then((res) => {
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
    },
    [CSORT.QUERY_UPDATE](state, { p }) {
      const g = state.goods.find(c => c.id === p.id);
      state.goods = state.goods.filter(c => c.id !== p.id);
      if (g) {
        g.newSort = p.newSort;
        state.goods.push(g);
      }
    },
    [CSORT.QUERY_SUCCESS](state, { p, html }) {
      const re = /data-id='(\d+)' data-numiid='(\d+)'[^]+'J-list-name'><a href="([^"]+)"[^]+" alt="([^"]+)" data-original="([^"]+)"[^]+>已启用<[^]+ajaxSetAsort\(\1,'asort'[^]+value="(\d+)" id="csort\1"/gui;
      let r = re.exec(html);
      while (r) {
        state.goods.push({
          uid: r[1],
          id: r[2],
          url: r[3],
          name: r[4],
          image: r[5],
          sort: r[6],
          newSort: p.newSort,
          submitting: false,
        });
        r = re.exec(html);
      }
      state.htmls.push({ id: p.id, uid: p.uid, html });
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
