/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

export const SLOW_API_TIME = 300;
export const MAX_API_RETRY_COUNT = 3;
export const CAMELIZE_API_RESPONSE = false;
export const AUTH_STATE = {
  LOGGED_IN: 0,
  GUEST: 401,
  UNREGISTERED: 448,
};
export const AUTH_STATE_LIST = Object.values(AUTH_STATE);
export const AUTH_REDIRECT = {
  [AUTH_STATE.LOGGED_IN]: 'index',
  [AUTH_STATE.GUEST]: 'user_login',
  [AUTH_STATE.UNREGISTERED]: 'user_register',
};
export const BASE_HOST = 'http://trace.51fanli.com/';
export const ICON_URL = '';
export const BASE_API_URL = 'http://trace.51fanli.com/index.php/';
export const WECHAT_AUTH_URL = `${BASE_API_URL}/authorize?mode={{reason}}&service={{service}}&redirect_uri={{redirect}}`;
export const MULTI_REQUEST_URL = null;
