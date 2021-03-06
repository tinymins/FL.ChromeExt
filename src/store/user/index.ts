/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import * as api from '@/api/user';
import { UserFull } from '@/api/types/user';
import { HttpResponseData } from '@/api/driver/http';
import { USER } from '@/store/types';
import { showLoading, hideLoading } from '@/store/utils';
import { finalizeAction, ActionType, StoreActionEnv } from '@/store/actions';
import router from '@/router';
import { AUTH_STATE } from '@/config';
import { camelize } from '@/utils/transfer';
import { checkAuthorizeRedirect } from '@/utils/authorization';

export interface StoreUserState {
  user: UserFull;
  errmsg: string;
  prevUser: UserFull;
  status: number;
  referral: number; // 介绍人id
  // modules
}

export interface StoreUserGetters {
  user?: UserFull;
}

export default {
  namespaced: true,
  modules: {},
  state: {
    user: null,
    errmsg: null,
    prevUser: null,
    status: null,
    referral: 0,
  },
  getters: {
    user: (state) => {
      if (state.status === AUTH_STATE.LOGGED_IN && state.user && Object.keys(state.user).length !== 0) {
        return state.user;
      }
      return null;
    },
    status: state => state.status,
  },
  actions: {
    [USER.LOGIN]({ dispatch, rootState }, { account, password }) {
      return new Promise((resolve, reject) => {
        const loading = showLoading({ text: '努力登录中' });
        api.login(account, password).then(() => {
          dispatch(USER.GET, { reload: true }).then(() => {
            const redirect = rootState.route.query.redirect;
            if (redirect) {
              router.push({ path: redirect });
            } else {
              router.push({ name: 'index' });
            }
            resolve();
          });
        }).catch(reject).finally(() => {
          hideLoading({ id: loading });
        });
      });
    },
    [USER.LOGOUT]({ commit, rootState }) {
      return new Promise((resolve, reject) => {
        const loading = showLoading({ text: '努力退出登录' });
        api.logout().then(async () => {
          commit(USER.LOGOUT);
          const { route } = router.resolve(rootState.common.route.to.fullPath);
          const redirect = await checkAuthorizeRedirect(route);
          if (redirect) {
            router.push(redirect);
          }
          resolve();
        }).catch(reject).finally(() => {
          hideLoading({ id: loading });
        });
      });
    },
    [USER.GET](
      { commit, state }: StoreActionEnv<StoreUserState>,
      { action: rawAction = '', strict = true, silent = false }: {
        action?: ActionType;
        strict?: boolean;
        silent?: boolean;
      } = {},
    ): Promise<void> {
      const action = finalizeAction(rawAction, state.status !== null);
      if (action) {
        // window.__INITIAL_STATE__ = {"errcode":401,"errmsg":"未授权"}; // 测试数据
        if (typeof window.__INITIAL_STATE__ === 'object') {
          const res = camelize<HttpResponseData<UserFull>>(window.__INITIAL_STATE__);
          commit(USER.GET, {
            status: res.errcode,
            user: res.data || {},
            errmsg: res.errmsg,
          });
          delete window.__INITIAL_STATE__;
        } else {
          return new Promise((resolve, reject) => {
            const loading = silent ? null : showLoading({ text: '获取当前登录状态' });
            api.getUser(strict, silent).then((res) => {
              commit(USER.GET, {
                status: res.data ? res.errcode : AUTH_STATE.GUEST,
                user: res.data || {},
                errmsg: res.errmsg,
              });
              resolve();
            }).catch((err) => {
              if (err && err.response) {
                commit(USER.GET, {
                  status: err.response.errcode,
                  user: err.response.data || {},
                  errmsg: err.response.errmsg,
                });
                resolve();
              } else {
                reject(err);
              }
            }).finally(() => {
              if (loading) {
                hideLoading({ id: loading });
              }
            });
          });
        }
      }
      return Promise.resolve();
    },
  },
  mutations: {
    [USER.GET](state, { status, user, errmsg }: { status: number; user: UserFull; errmsg: string }) {
      if (state.prevUser && state.prevUser.id && state.prevUser.id !== user.id) {
        setTimeout(() => window.location.reload(), 1000);
      }
      state.user = user;
      state.errmsg = errmsg;
      state.status = status;
      state.prevUser = user;
    },
    [USER.LOGOUT](state) {
      state.user = {};
      state.status = AUTH_STATE.GUEST;
    },
  },
};
