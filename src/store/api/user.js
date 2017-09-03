/*
* @Author: William Chan
* @Date:   2017-05-03 15:55:08
* @Last Modified by:   William Chan
* @Last Modified time: 2017-05-03 19:21:30
*/

import { http } from '@/store/api';

export const login = (account, password) => http.postForm('Public/checkLogin/', { account, password, ajax: 1 });
export const logout = () => http.get('Public/logout/');
export const getUser = () => http.get('Public/profile/');
