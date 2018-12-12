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
  sellout = '', // 售罄
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
    sellout,
    state,
    asort_from: asortFrom,
    asort_to: asortTo,
    category,
    sub_categoryid: subCategoryid,
    is_young: isYoung,
    is_hot_coupon: isHotCoupon,
    p: page,
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
