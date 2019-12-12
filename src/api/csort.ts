/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import http from './driver';
import { HttpResponseData } from './driver/http';

export const submit = (id, sort): Promise<HttpResponseData> => new Promise((resolve, reject) => {
  http.get(`Tuan/Tuanitem/ajaxSetAsort/id/${id}/asort/${sort}/sortkey/csort`, {}, {
    interceptors: {
      onResponse: (res) => {
        res.errcode = res.data.status === 1 ? 0 : 501;
        res.errmsg = res.data.info;
        res.data = res.data.data;
        if (res.errcode) {
          throw new Error('csort api error');
        }
        return Promise.resolve(res);
      },
    },
  }).then(resolve).catch(reject);
});
