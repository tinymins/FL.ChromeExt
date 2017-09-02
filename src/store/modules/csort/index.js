/**
 * @Author: Zhai Yiming (root@derzh.com)
 * @Date:   2017-09-02 17:45:27
 * @Last Modified by:   Zhai Yiming
 * @Last Modified time: 2017-09-02 22:20:45
 */
/* eslint no-param-reassign: ["error", { "props": false }] */

import * as api from '@/store/api/csort';
import { CSORT } from '@/store/types';


export default {
  namespaced: true,
  state: {
    htmls: [],
    goods: [],
  },
  getters: {},
  actions: {
    [CSORT.QUERY]({ commit }, { ids, sorts }) {
      commit(CSORT.QUERY_CLEAR);
      const promise = [];
      const realSorts = [];
      const re = /(\d+)\s+(\d+)/;
      sorts.forEach((s) => {
        const r = re.exec(s);
        if (r) {
          for (let index = 0; index < r[2]; index += 1) {
            realSorts.push(r[1].toString());
          }
        } else {
          realSorts.push(s);
        }
      });
      ids.forEach((id, index) => {
        promise.push(new Promise((resolve, reject) => {
          api.queryList(id).then((res) => {
            commit(CSORT.QUERY_SUCCESS, {
              html: res.data,
              newSort: realSorts[index],
            });
            resolve();
          }).catch(reject);
        }));
      });
      return Promise.all(promise);
    },
    [CSORT.SUBMIT]({ commit, state }, list) {
      const promises = [];
      list.forEach((p) => {
        if (state.goods.filter(c => c.uid === p.uid && !c.submitting).length !== 0) {
          promises.push(new Promise((resolve, reject) => {
            api.submit(p.uid, p.sort).then((res) => {
              if (res.data.status === 1) {
                commit(CSORT.SUBMIT_SUCCESS, p);
                resolve();
              } else {
                commit(CSORT.SUBMIT_FAILURE, p);
                reject();
              }
            }).catch(() => {
              commit(CSORT.SUBMIT_FAILURE, p);
              reject();
            });
          }));
          commit(CSORT.SUBMIT, p);
        }
      });
      return Promise.all(promises);
    },
  },
  mutations: {
    [CSORT.QUERY_CLEAR](state) {
      state.htmls = [];
      state.goods = [];
    },
    [CSORT.QUERY_SUCCESS](state, { html, newSort }) {
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
          newSort,
          submitting: false,
        });
        r = re.exec(html);
      }
      state.htmls.push(html);
    },
    [CSORT.SUBMIT](state, p) {
      state.goods.filter(c => c.uid === p.uid).forEach((c) => { c.submitting = true; });
    },
    [CSORT.SUBMIT_SUCCESS](state, p) {
      state.goods.filter(c => c.uid === p.uid).forEach((c) => {
        c.submitting = false;
        c.sort = p.sort;
      });
    },
    [CSORT.SUBMIT_FAILURE](state, p) {
      state.goods.filter(c => c.uid === p.uid).forEach((c) => { c.submitting = false; });
    },
  },
};
