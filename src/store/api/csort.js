/*
* @Author: William Chan
* @Date:   2017-05-03 15:55:08
* @Last Modified by:   William Chan
* @Last Modified time: 2017-05-03 19:21:30
*/

import { http } from '@/store/api';

export const queryList = (loadingText, id) => http.get(`Tuan/Tuanitem?ctime_from=&ctime_to=&readytime_from=&readytime_to=&starttime_from=&starttime_to=&endtime_from=&endtime_to=&name=&num_iid=${id}&create_user=&shopid=&is_nine=&sellout=&state=1&asort_from=&asort_to=&category=0&sub_categoryid=0&zhaoshang=`, { loadingText });
export const submit = (loadingText, id, sort) => http.get(`Tuan/Tuanitem/ajaxSetAsort/id/${id}/asort/${sort}/sortkey/csort`, { loadingText });
