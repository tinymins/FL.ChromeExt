/*
* @Author: William Chan
* @Date:   2017-05-03 15:55:08
* @Last Modified by:   William Chan
* @Last Modified time: 2017-05-03 19:21:30
*/

import { http } from '@/store/api';

export const queryList = (loadingText, url) => http.get(url, { loadingText });
export const queryItem = (loadingText, id) => http.get('http://www.dataoke.com/gettpl', { loadingText, params: { gid: id, _: (new Date()).valueOf() } });
