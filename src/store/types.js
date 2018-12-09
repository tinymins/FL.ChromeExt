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
