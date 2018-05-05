/*
* @Author: William Chan
* @Date:   2017-05-03 15:31:29
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-04 11:45:04
*/
/* eslint no-console: ["warn", { allow: ["warn", "error"] }] */

import qs from 'qs';
import axios from 'axios';
import { isDevelop } from '@/utils/util';
import { Loading } from 'element-ui';

export const API_HOST = 'http://trace.51fanli.com/index.php/';

let stack = [];
const indicator = {
  open: (id, text) => {
    stack.push({ id, text });
    if (this.$instance) {
      this.$instance.text = stack.map(c => c.text).filter(_ => _).join(' | ');
      return;
    }
    this.$instance = Loading.service({ fullscreen: true, text });
  },
  close: (id) => {
    if (id) {
      stack = stack.filter(c => c.id !== id);
    } else {
      stack.pop();
    }
    if (!this.$instance || stack.length !== 0) {
      return;
    }
    this.$instance.close();
    this.$instance = null;
  },
};
const messageBox = {
  open: () => { console.warn('MessageBox has not been loaded yet!'); },
};
const getLoadingText = config => `正在拼命连接 ${config.url.replace(/.*:\/\//, '').replace(/\/.*/, '')}${config.loadingText ? ` | ${config.loadingText}` : ''}`;

import('element-ui/lib/message-box').then(({ default: alert }) => {
  messageBox.open = (title, content) => { alert(content, title); };
});
import('element-ui/lib/theme-default/message-box.css');

window.onerror = (msg) => {
// window.onerror = (msg, url, lineNo, columnNo, error) => {
  messageBox.open('JavaScript catch', msg);
  return false;
};

export const onRequest = (req) => {
  if (req.interceptors !== false) {
    req.interceptors = true;
  }
  indicator.open(req, getLoadingText(req));
  return req;
};

export const onRequestError = error => Promise.reject(error);

export const onResponse = (res) => {
  indicator.close(res.config);
  return Promise.resolve(res);
};

export const onResponseError = (error) => {
  indicator.close(error.config);
  if (!error.response) {
    messageBox.open(error.message, error.stack);
  } else if (error.response.status === 401) {
    // clearAuthorization();
  } else if (error.response.status >= 500) {
    messageBox.open(`服务器错误 ${error.response.status}`, error.stack);
  } else if (error.response.status >= 400) {
    messageBox.open(`请求失败 ${error.response.status}`, error.response.data.errmsg || 'not errmsg');
  } else {
    messageBox.open(`异常 ${error.response.status}`, '未知Response错误');
  }
  return Promise.reject(error);
};

export const openIndicator = (...params) => { indicator.open(...params); };
export const closeIndicator = (...params) => { indicator.close(...params); };

export const http = axios.create({
  baseURL: API_HOST,
  withCredentials: true,
  timeout: !isDevelop() && 10000,
});

http.postForm = (url, data, ...params) => http.post(url, qs.stringify(data), ...params);
http.interceptors.request.use(onRequest, onRequestError);
http.interceptors.response.use(onResponse, onResponseError);
