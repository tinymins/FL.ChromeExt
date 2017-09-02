/*
* @Author: William Chan
* @Date:   2017-05-03 15:53:04
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-03 21:15:10
*/
/* eslint no-param-reassign: ["error", { "props": false }] */

import * as api from '@/store/api/user';
import { USER } from '@/store/types';


export default {
  namespaced: true,
  state: {
    user: null,
  },
  getters: {
    user: (state) => {
      if (state.user && Object.keys(state.user).length !== 0) {
        return state.user;
      }
      return false;
    },
  },
  actions: {
    [USER.GET]({ commit, state }, force) {
      if (force || !state.user) {
        return api.getState().then((res) => {
          const re = /nickname" value="([^"]+)"/gui;
          const r = re.exec(res.data);
          if (r) {
            commit(USER.GET, { name: r[1] });
          } else {
            commit(USER.LOGOUT);
          }
        }).catch(() => {
          commit(USER.LOGOUT);
        });
      }
      return Promise.resolve();
    },
  },
  mutations: {
    [USER.GET](state, data) {
      state.user = data;
    },
    [USER.LOGOUT](state) {
      state.user = {};
    },
  },
};
