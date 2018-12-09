/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { http } from '@/store/api';

export const queryList = (loadingText, url) => http.get(url, { loadingText });
export const queryItem = (loadingText, id) => http.get('http://www.dataoke.com/gettpl', { loadingText, params: { gid: id, _: (new Date()).valueOf() } });
