/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import cheerio from 'cheerio';
import { AUTH_STATE } from '@/config';
import { http } from './driver';

export const login = (account, password) => {
  const formData = new FormData();
  formData.set('account', account);
  formData.set('password', password);
  formData.set('ajax', 1);
  return new Promise((resolve, reject) => {
    http.post('Public/checkLogin/', formData).then((data) => {
      const res = {
        errcode: data.status ? 0 : 401,
        errmsg: data.info,
        data: data.data,
      };
      if (res.errcode) {
        const err = new Error('login error');
        err.response = res;
        reject(err);
      } else {
        resolve(res);
      }
    }).catch(reject);
  });
};
export const logout = () => http.get('Public/logout/');
export const getUser = () => new Promise((resolve, reject) => {
  http.get('Public/profile/').then((html) => {
    const $ = cheerio.load(html);
    const res = {};
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
      res.errcode = AUTH_STATE.GUEST;
    }
    resolve(res);
  }).catch(reject);
});
