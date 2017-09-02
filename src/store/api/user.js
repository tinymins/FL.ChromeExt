/*
* @Author: William Chan
* @Date:   2017-05-03 15:55:08
* @Last Modified by:   William Chan
* @Last Modified time: 2017-05-03 19:21:30
*/

import { http } from '@/store/api';
import { popupWindow } from '@/utils/util';

export const login = () => popupWindow('http://trace.51fanli.com/index.php');
export const getState = () => http.get('http://trace.51fanli.com/index.php/Public/profile/');
