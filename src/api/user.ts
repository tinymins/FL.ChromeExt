/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import cheerio from 'cheerio';
import { AUTH_STATE } from '@/config';
import http from './driver';
import { HttpResponseData } from './driver/http';

export const login = (account, password): Promise<HttpResponseData> => {
  const formData = new FormData();
  formData.set('account', account);
  formData.set('password', password);
  formData.set('ajax', '1');
  return new Promise((resolve, reject) => {
    http.post('Public/checkLogin/', formData, {
      interceptors: {
        onResponse: (res) => {
          res.errcode = res.data.status ? 0 : 401;
          res.errmsg = res.data.info;
          res.data = res.data.data;
          if (res.errcode) {
            throw new Error('login error');
          }
          return Promise.resolve(res);
        },
      },
    }).then(resolve).catch(reject);
  });
};
export const logout = (): Promise<HttpResponseData> => http.get('Public/logout/');
export const getUser = (strict, silent): Promise<HttpResponseData> => new Promise((resolve, reject) => {
  http.get('Public/profile/', {}, { silent }).then((res) => {
    const $ = cheerio.load(res.data);
    const auth = $('td:contains("没有登录")').length === 0;
    if (auth) {
      res.data = {
        id: $('[name="id"]').attr('value'),
        name: $('[name="nickname"]').attr('value'),
        email: $('[name="email"]').attr('value'),
        remark: $('[name="remark"]').text(),
      };
      res.errcode = AUTH_STATE.LOGGED_IN;
    } else {
      res.data = null;
      res.errcode = AUTH_STATE.GUEST;
    }
    resolve(res);
  }).catch(reject);
});
