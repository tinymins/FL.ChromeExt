/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import cheerio from 'cheerio';
import { http } from '@/store/api';

export const queryList = url => new Promise((resolve, reject) => {
  http.get(url).then((res) => {
    const list = [];
    const $ = cheerio.load(res.data);
    $('.goods-item').each((_, element) => {
      const $goods = $(element);
      list.push({
        id: $goods.attr('id').replace(/[^\d]/ig, '').trim(),
        uid: $goods.attr('data_goodsid').trim(),
        name: $goods.find('.goods-tit').text().trim(),
        finalPrice: parseFloat($goods.find('.goods-price').text().replace(/[^\d.]/ig, '').trim()),
        discount: parseFloat($goods.find('.goods-quan').text().replace(/[^\d.]/ig, '').trim()),
        planNum: parseFloat($goods.find('.goods-yj').find('p').text().trim()),
        planType: $goods.find('.goods-yj').find('span').text().trim(),
        url: '',
        discountUrl: '',
      });
    });
    res.data = { errcode: 0, errmsg: '', data: list };
    resolve(res);
  }).catch(reject);
});

export const queryItem = id => new Promise((resolve, reject) => {
  http.get('http://www.dataoke.com/gettpl', {}, { params: { gid: id, _: (new Date()).valueOf() } }).then((res) => {
    const $ = cheerio.load(res.data);
    const data = {
      uid: $('a').last().attr('href').replace(/(.*id=|\D.*)/ig, ''),
      img: $('img').attr('src'),
      url: $('a').last().attr('href'),
      discountUrl: $('a').first().attr('href'),
    };
    res.data = { errcode: 0, errmsg: '', data };
    resolve(res);
  }).catch(reject);
});
