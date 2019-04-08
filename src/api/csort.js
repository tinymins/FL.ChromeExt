/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint-disable id-match */
/* eslint-disable camelcase */

import { http } from './driver';

export const submit = (id, sort) => new Promise((resolve, reject) => {
  http.get(`Tuan/Tuanitem/ajaxSetAsort/id/${id}/asort/${sort}/sortkey/csort`).then((data) => {
    const res = {
      errcode: data.status === 1 ? 0 : 501,
      errmsg: data.info,
      data: data.data,
    };
    if (data.errcode) {
      const err = new Error('csort api error');
      err.response = res;
      reject(err);
    } else {
      resolve(res);
    }
  }).catch(reject);
});