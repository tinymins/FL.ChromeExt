/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint-disable id-match */
/* eslint-disable camelcase */

import cheerio from 'cheerio';
import { http } from '@/store/api';

export const queryList = iid => new Promise((resolve, reject) => {
  http.get('Tuan/Tuanitem', {
    ctime_from: '',
    ctime_to: '',
    readytime_from: '',
    readytime_to: '',
    starttime_from: '',
    starttime_to: '',
    endtime_from: '',
    endtime_to: '',
    name: '',
    num_iid: iid,
    create_user: '',
    shopid: '',
    is_nine: '',
    sellout: '',
    state: 1,
    asort_from: '',
    asort_to: '',
    category: 0,
    sub_categoryid: 0,
    zhaoshang: '',
  }).then((res) => {
    const list = [];
    const $ = cheerio.load(res.data);
    $('.J-main-row-active').each((i, el) => {
      const $item = $(el);
      const $tds = $item.find('td');
      list.push({
        iid: $item.attr('data-numiid'),
        id: $tds.eq(1).text(),
        createTime: $tds.eq(2).html().replace(/<.*/ig, '').trim(),
        prepareTime: $tds.eq(2).html().replace(/.*>/ig, '').trim(),
        launchTime: $tds.eq(3).html().replace(/<.*/ig, '').trim(),
        discontinueTime: $tds.eq(3).html().replace(/.*>/ig, '').trim(),
        name: $tds.eq(4).text(),
        url: $tds.eq(4).children('a').attr('href'),
        subName: $tds.eq(5).text(),
        thumb: $tds.eq(6).find('img').attr('src'),
        image: $tds.eq(6).find('img').attr('data-original'),
        priceA: $tds.eq(7).html().replace(/<.*/ig, '').trim(),
        priceB: $tds.eq(7).html().replace(/.*>/ig, '').trim(),
        price: $tds.eq(8).text(),
        category: $tds.eq(9).text(),
        via: $tds.eq(10).text(),
        soldOut: $tds.eq(11).text().trim(),
        editor: $tds.eq(12).text(),
        state: $tds.eq(13).text(),
        superSort: $tds.eq(14).find('input').attr('value'),
        newerSort: $tds.eq(15).find('input').attr('value'),
      });
    });
    res.data = { errcode: 0, errmsg: '', data: list };
    resolve(res);
  }).catch(reject);
});

export const submit = (id, sort) => new Promise((resolve, reject) => {
  http.get(`Tuan/Tuanitem/ajaxSetAsort/id/${id}/asort/${sort}/sortkey/csort`).then((res) => {
    const data = {
      errcode: res.data.status === 1 ? 0 : 501,
      errmsg: res.data.info,
      data: res.data.data,
    };
    if (data.errcode) {
      const err = new Error('login error');
      err.response = res;
      reject(err);
    } else {
      resolve(res);
    }
  }).catch(reject);
});
