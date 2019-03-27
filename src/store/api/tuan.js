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
import { http } from './driver';

export const getItemList = ({
  ctimeFrom = '', // 创建时间
  ctimeTo = '', // 创建时间
  readytimeFrom = '', // 预热时间
  readytimeTo = '', // 预热时间
  starttimeFrom = '', // 上架时间
  starttimeTo = '', // 上架时间
  endtimeFrom = '', // 下架时间
  endtimeTo = '', // 下架时间
  title = '', // 商品名称
  iid = '', // 商品ID
  createUser = '', // 编辑
  shopid = '', // 所属商家
  youngName = '', // 青春版副标题
  soldOut = '', // 售罄
  state = '', // 状态
  asortFrom = '', // 排序值
  asortTo = '', // 排序值
  category = '', // 分类
  subCategoryid = '', // 二级分类
  isYoung = '', // 是否青春版
  isHotCoupon = '', // 是否青春版
  page = 1, // 页码
}) => new Promise((resolve, reject) => {
  http.get('Tuan/Tuanitem', {
    ctime_from: ctimeFrom,
    ctime_to: ctimeTo,
    readytime_from: readytimeFrom,
    readytime_to: readytimeTo,
    starttime_from: starttimeFrom,
    starttime_to: starttimeTo,
    endtime_from: endtimeFrom,
    endtime_to: endtimeTo,
    title,
    num_iid: iid,
    create_user: createUser,
    shopid,
    young_name: youngName,
    sellout: soldOut,
    state,
    asort_from: asortFrom,
    asort_to: asortTo,
    category,
    sub_categoryid: subCategoryid,
    is_young: isYoung,
    is_hot_coupon: isHotCoupon,
    p: page,
  }).then((html) => {
    const list = [];
    const $ = cheerio.load(html);
    $('.J-main-row-active').each((i, el) => {
      const $item = $(el);
      const $tds = $item.find('td');
      list.push({
        iid: $item.attr('data-numiid'),
        id: $tds.eq(1).text(),
        createTime: $tds.eq(2).html().replace(/<.*/igu, '').trim(),
        readyTime: $tds.eq(2).html().replace(/.*>/igu, '').trim(),
        startTime: $tds.eq(3).html().replace(/<.*/igu, '').trim(),
        endTime: $tds.eq(3).html().replace(/.*>/igu, '').trim(),
        title: $tds.eq(4).text(),
        url: $tds.eq(4).children('a').attr('href'),
        youngName: $tds.eq(5).text(),
        thumb: $tds.eq(6).find('img').attr('src'),
        image: $tds.eq(6).find('img').attr('data-original'),
        priceA: $tds.eq(7).html().replace(/<.*/igu, '').trim(),
        priceB: $tds.eq(7).html().replace(/.*>/igu, '').trim(),
        price: $tds.eq(8).text(),
        category: $tds.eq(9).text(),
        shopName: $tds.eq(10).text(),
        soldOut: $tds.eq(11).text().trim(),
        createUser: $tds.eq(12).text(),
        state: $tds.eq(13).text(),
        csort: $tds.eq(14).find('input').attr('value'),
        bsort: $tds.eq(15).find('input').attr('value'),
      });
    });
    const res = { errcode: 0, errmsg: '', data: list };
    resolve(res);
  }).catch(reject);
});
