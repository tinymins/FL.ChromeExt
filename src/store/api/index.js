/*
* @Author: William Chan
* @Date:   2017-05-03 15:31:29
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-04 11:45:04
*/
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import qs from 'qs';
import axios from 'axios';
import { isDevelop } from '@/utils/util';

export const API_HOST = 'http://trace.51fanli.com/index.php/';

let indicatorCount = 0;
let Indicator = () => { console.warn('Indicator has not been loaded yet!'); };
let MessageBox = () => { console.warn('MessageBox has not been loaded yet!'); };

import('element-ui/lib/loading').then(({ default: Loading }) => {
  Indicator = {
    open: () => {
      indicatorCount += 1;
      if (this.indicator) {
        return;
      }
      this.indicator = Loading.service({ fullscreen: true });
    },
    close: () => {
      indicatorCount -= 1;
      if (!this.indicator || indicatorCount) {
        return;
      }
      this.indicator.close();
      this.indicator = null;
    },
  };
});
import('element-ui/lib/theme-default/loading.css');

import('element-ui/lib/message-box').then(({ default: alert }) => {
  MessageBox = (title, content) => { alert(content, title); };
});
import('element-ui/lib/theme-default/message-box.css');

window.onerror = (msg) => {
// window.onerror = (msg, url, lineNo, columnNo, error) => {
  MessageBox('JavaScript catch', msg);
  return false;
};

export const onRequest = (req) => {
  if (req.interceptors !== false) {
    req.interceptors = true;
  }
  Indicator.open();
  return req;
};

export const onRequestError = error => Promise.reject(error);

export const onResponse = (res) => {
  Indicator.close();
  return Promise.resolve(res);
};

export const onResponseError = (error) => {
  Indicator.close();
  if (!error.response) {
    MessageBox(error.message, error.stack);
  } else if (error.response.status === 401) {
      // clearAuthorization();
  } else if (error.response.status >= 500) {
    MessageBox(`服务器错误 ${error.response.status}`, error.stack);
  } else if (error.response.status >= 400) {
    MessageBox(`请求失败 ${error.response.status}`, error.response.data.errmsg || 'not errmsg');
  } else {
    MessageBox(`异常 ${error.response.status}`, '未知Response错误');
  }
  return Promise.reject(error);
};

export const openIndicator = () => { Indicator.open(); };
export const closeIndicator = () => { Indicator.close(); };

export const http = axios.create({
  baseURL: API_HOST,
  withCredentials: true,
  timeout: !isDevelop() && 10000,
});

http.postForm = (url, data) => http.post(url, qs.stringify(data));
http.interceptors.request.use(onRequest, onRequestError);
http.interceptors.response.use(onResponse, onResponseError);
