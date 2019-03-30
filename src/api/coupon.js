/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2018-12-09 15:49:51
 * @Last Modified by: Emil Zhai
 * @Last Modified time: 2018-12-12 23:54:00
 */
/* eslint-disable id-match */
/* eslint-disable camelcase */
import cheerio from 'cheerio';
import { http } from '@/store/api';

// http://trace.51fanli.com/index.php/Tuan/Tuanitem?ctime_from=&ctime_to=&readytime_from=&readytime_to=&starttime_from=&starttime_to=&endtime_from=&endtime_to=&title=&num_iid=&create_user=&shopid=&young_name=0&sellout=1&state=1&asort_from=&asort_to=&category=0&sub_categoryid=0&is_young=&is_hot_coupon=
// http://api.tkjidi.com/getGoodInfo?appkey=1d9d953fc93e536963e07481b3f56446&id=583254799837
