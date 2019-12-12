/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import cheerio from 'cheerio';
import http from './driver';
import { HttpResponseData } from './driver/http';

interface TsellItem {
  id: string;
  uid: string;
  name: string;
  finalPrice: number;
  discount: number;
  planNum: number;
  planType: string;
  url: string;
  discountUrl: string;
}

export const queryList = (url): Promise<HttpResponseData> => new Promise((resolve, reject) => {
  http.get(url).then((res) => {
    const list: TsellItem[] = [];
    const $ = cheerio.load(res.data);
    $('.goods-item').each((_, element) => {
      const $goods = $(element);
      list.push({
        id: ($goods.attr('id') || '').replace(/[^\d]/igu, '').trim(),
        uid: ($goods.attr('data_goodsid') || '').trim(),
        name: $goods.find('.goods-tit').text().trim(),
        finalPrice: parseFloat($goods.find('.goods-price').text().replace(/[^\d.]/igu, '').trim()),
        discount: parseFloat($goods.find('.goods-quan').text().replace(/[^\d.]/igu, '').trim()),
        planNum: parseFloat($goods.find('.goods-yj').find('p').text().trim()),
        planType: $goods.find('.goods-yj').find('span').text().trim(),
        url: '',
        discountUrl: '',
      });
    });
    const category = $('li.curl').text() || '';
    resolve({ errcode: 0, errmsg: 'OK', data: list, extra: { category } });
  }).catch(reject);
});

export const queryItem = (id): Promise<HttpResponseData> => new Promise((resolve, reject) => {
  http.get('http://www.dataoke.com/gettpl', { gid: id }).then((res) => {
    const $ = cheerio.load(res.data);
    const data = {
      uid: ($('a').last().attr('href') || '').replace(/(.*id=|\D.*)/igu, ''),
      img: $('img').attr('src'),
      url: $('a').last().attr('href'),
      discountUrl: $('a').first().attr('href'),
    };
    resolve({ errcode: 0, errmsg: 'OK', data });
  }).catch(reject);
});
