/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint function-paren-newline: "off" */

const exportVar = (enumerate, ...args) => {
  const data = {};
  const type = [].concat(...args);
  type.forEach((action) => {
    data[action] = `${enumerate}_${action}`;
  });
  return data;
};

export const COMMON = exportVar('COMMON',
  'SAVE_SCROLL',
  'SHOW_LOADING', 'HIDE_LOADING',
  'PUSH_TOAST', 'POP_TOAST',
  'PUSH_MESSAGE', 'POP_MESSAGE',
  'ROUTE_BEFORE_CHANGE', 'ROUTE_CHANGE', 'ROUTE_HISTORY_MODE',
  'SET_BODY_SCROLLABLE', 'REVERT_BODY_SCROLLABLE',
  'SET_BODY_AUTO_HEIGHT', 'REVERT_BODY_AUTO_HEIGHT',
  'SET_HEADER_TITLE', 'SET_VIEWPORT_SIZE',
  'SET_HEADER_HEIGHT', 'OFFSET_HEADER_HEIGHT',
  'SET_TABBAR_HEIGHT', 'OFFSET_FOOTER_HEIGHT',
  'SET_NAVBAR_VISIBLE', 'REVERT_NAVBAR_VISIBLE',
  'SET_TABBAR_VISIBLE', 'REVERT_TABBAR_VISIBLE',
  'GET_WECHAT_SDK_INFO',
);

export const USER = exportVar('USER',
  'GET', 'DEBUG', 'LOGIN', 'LOGOUT',
);

export const CSORT = exportVar('CSORT',
  'QUERY', 'QUERY_SUCCESS', 'QUERY_UPDATE',
  'SUBMIT', 'SUBMIT_SUCCESS', 'SUBMIT_FAILURE',
);

export const TSELL = exportVar('TSELL',
  'QUERY_LIST', 'QUERY_LIST_SUCCESS',
  'QUERY_ITEMS', 'QUERY_ITEM_SUCCESS',
);
