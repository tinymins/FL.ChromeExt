/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import cheerio from 'cheerio';
import { http } from '@/store/api';

export const login = (account, password) => {
  const formData = new FormData();
  formData.set('account', account);
  formData.set('password', password);
  formData.set('ajax', 1);
  return new Promise((resolve, reject) => {
    http.post('Public/checkLogin/', formData).then((res) => {
      const data = {
        errcode: res.data.status ? 0 : 401,
        errmsg: res.data.info,
        data: res.data.data,
      };
      res.status = data.errcode || 200;
      res.data = data;
      if (data.errcode) {
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
  http.get('Public/profile/').then((res) => {
    const $ = cheerio.load(res.data);
    res.status = $('td:contains("没有登录")').length ? 401 : 200;
    res.data = { errcode: 0, errmsg: '' };
    if (res.status === 200) {
      res.data.data = {
        id: $('[name="id"]').attr('value'),
        name: $('[name="nickname"]').attr('value'),
        email: $('[name="email"]').attr('value'),
        remark: $('[name="remark"]').text(),
      };
    }
    resolve(res);
  }).catch(reject);
});
