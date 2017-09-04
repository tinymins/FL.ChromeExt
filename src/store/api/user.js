/*
* @Author: William Chan
* @Date:   2017-05-03 15:55:08
* @Last Modified by:   William Chan
* @Last Modified time: 2017-05-03 19:21:30
*/

import { http } from '@/store/api';

export const login = ([account, password], loadingText) => http.postForm('Public/checkLogin/', { account, password, ajax: 1 }, { loadingText });
export const logout = loadingText => http.get('Public/logout/', { loadingText });
export const getUser = loadingText => http.get('Public/profile/', { loadingText });
