/*
* @Author: William Chan
* @Date:   2017-05-03 15:31:00
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-04 12:05:57
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
