/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { http } from '@/store/api';

export const queryList = (loadingText, id) => http.get(`Tuan/Tuanitem?ctime_from=&ctime_to=&readytime_from=&readytime_to=&starttime_from=&starttime_to=&endtime_from=&endtime_to=&name=&num_iid=${id}&create_user=&shopid=&is_nine=&sellout=&state=1&asort_from=&asort_to=&category=0&sub_categoryid=0&zhaoshang=`, { loadingText });
export const submit = (loadingText, id, sort) => http.get(`Tuan/Tuanitem/ajaxSetAsort/id/${id}/asort/${sort}/sortkey/csort`, { loadingText });
