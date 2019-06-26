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
import { parseCheerioForm } from '@/utils/transfer';
import { parseSelect, parseSelectValue, parseRadioValue, parseInputTextValue, parseTextareaValue, parseInputHiddenValue } from '@/utils/cheerio';
import http from './driver';
import { HttpResponseData } from './driver/http';

export const getCategoryList = (): Promise<HttpResponseData<{ label: string; value: any }[]>> => new Promise((resolve, reject) => {
  http.get<string>('Tuan/Tuanitem/index/').then((res) => {
    const $ = cheerio.load(res.data);
    const data = parseSelect($, 'category');
    resolve({ errcode: 0, errmsg: '', data: data.options });
  }).catch(reject);
});

export interface TuanItem {
  iid: string;
  id: string;
  createTime: string;
  readyTime: string;
  startTime: string;
  endTime: string;
  title: string;
  url: string;
  youngName: string;
  thumb: string;
  image: string;
  priceA: string;
  priceB: string;
  price: string;
  category: string;
  shopName: string;
  soldOut: string;
  createUser: string;
  state: string;
  csort: string;
  bsort: string;
  disabled: boolean;
}

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
}): Promise<HttpResponseData<TuanItem[]>> => new Promise((resolve, reject) => {
  http.get<string>('Tuan/Tuanitem', {
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
  }).then((res) => {
    const list: TuanItem[] = [];
    const $ = cheerio.load(res.data);
    $('.J-main-row-active').each((i, el) => {
      const $item = $(el);
      const $tds = $item.find('td');
      list.push({
        iid: $item.attr('data-numiid'),
        id: $tds.eq(1).text(),
        createTime: $tds.eq(2).text().replace(/\n.*/igu, '').trim(),
        readyTime: $tds.eq(2).text().replace(/.*\n/igu, '').trim(),
        startTime: $tds.eq(3).text().replace(/\n.*/igu, '').trim(),
        endTime: $tds.eq(3).text().replace(/.*\n/igu, '').trim(),
        title: $tds.eq(4).text(),
        url: $tds.eq(4).children('a').attr('href'),
        youngName: $tds.eq(5).text(),
        thumb: $tds.eq(6).find('img').attr('src'),
        image: $tds.eq(6).find('img').attr('data-original'),
        priceA: $tds.eq(7).text().replace(/\n.*/igu, '').trim(),
        priceB: $tds.eq(7).text().replace(/.*\n/igu, '').trim(),
        price: $tds.eq(8).text(),
        category: $tds.eq(9).text(),
        shopName: $tds.eq(10).text(),
        soldOut: $tds.eq(11).text().trim(),
        createUser: $tds.eq(12).text(),
        state: $tds.eq(13).text(),
        csort: $tds.eq(14).find('input').attr('value'),
        bsort: $tds.eq(15).find('input').attr('value'),
        disabled: $tds.eq(16).find('a:contains("启用")').length > 0,
      });
    });
    resolve({ errcode: 0, errmsg: '', data: list });
  }).catch(reject);
});

export const getTuanItem = (id): Promise<HttpResponseData> => new Promise((resolve, reject) => {
  http.get<string>(`//Tuan/Tuanitem/edit/id/${id}`).then((res) => {
    const $ = cheerio.load(res.data);
    const data = {
      name: parseInputTextValue($, 'name'),
      subname: parseInputTextValue($, 'subname'),
      youngName: parseInputTextValue($, 'young_name'),
      recommendTitle: parseInputTextValue($, 'recommend_title'),
      zhaoshang: parseSelectValue($, 'zhaoshang'),
      categoryid: parseSelectValue($, 'categoryid'),
      subCategoryid: parseSelectValue($, 'sub_categoryid'),
      subCategoryid_sub: parseSelectValue($, 'sub_categoryid_sub'),
      numIid: parseSelectValue($, 'num_iid'),
      itemUrl: parseSelectValue($, 'item_url'),
      wapUrl: parseSelectValue($, 'wap_url'),
      shopid: parseRadioValue($, 'shopid'),
      price: parseInputTextValue($, 'price'),
      tgPrice: parseInputTextValue($, 'tg_price'),
      appPrice: parseInputTextValue($, 'app_price'),
      cutPrice: parseRadioValue($, 'cut_price'),
      channel: parseRadioValue($, 'channel'),
      isNine: parseRadioValue($, 'is_nine'),
      isYoung: parseRadioValue($, 'is_young'),
      isHotCoupon: parseRadioValue($, 'is_hot_coupon'),
      isDouyin: parseRadioValue($, 'is_douyin'),
      sellcount: parseInputTextValue($, 'sellcount'),
      preSellcount: parseInputTextValue($, 'pre_sellcount'),
      img3: parseInputTextValue($, 'img3_input'),
      img2: parseInputTextValue($, 'img2_input'),
      endtime: parseInputTextValue($, 'endtime'),
      asort: parseInputTextValue($, 'asort'),
      csort: parseInputTextValue($, 'csort'),
      bsort: parseInputTextValue($, 'bsort'),
      rank: parseInputTextValue($, 'rank'),
      sourceSite: parseInputTextValue($, 'source_site'),
      appIcon: parseInputHiddenValue($, 'app_icon'),
      itemtag: parseInputTextValue($, 'itemtag'),
      miaosha: parseRadioValue($, 'miaosha'),
      couponcount: parseInputTextValue($, 'couponcount'),
      recommend: parseRadioValue($, 'recommend'),
      sellout: parseRadioValue($, 'sellout'),
      checkcount: parseSelectValue($, 'checkcount'),
      comment: parseTextareaValue($, 'comment'),
      promotionId: parseSelectValue($, 'promotion_id'),
      shareActivity: parseRadioValue($, 'share_activity'),
      isOnlyWap: parseRadioValue($, 'is_only_wap'),
      ispost: parseRadioValue($, 'ispost'),
      taobaoProductName: parseInputTextValue($, 'taobao_product_name'),
      tags: parseInputTextValue($, 'tags'),
      sex: parseSelectValue($, 'sex'),
      recommendInfo: parseInputTextValue($, 'recommend_info'),
      keyword: parseInputTextValue($, 'keyword'),
      couponsAmount: parseInputTextValue($, 'coupons_amount'),
      couponsUrl: parseInputTextValue($, 'coupons_url'),
      couponsManjian1: parseInputTextValue($, 'coupons_manjian_1'),
      couponsManjian2: parseInputTextValue($, 'coupons_manjian_2'),
      isMplan: parseRadioValue($, 'is_mplan'),
      commission: parseInputTextValue($, 'commission'),
      id: parseInputHiddenValue($, 'id'),
      state: parseInputHiddenValue($, 'state'),
    };
    resolve({ errcode: 0, errmsg: '', data });
  }).catch(reject);
});

export const getTuanNewzcFloor = (id): Promise<HttpResponseData> => new Promise((resolve, reject) => {
  http.get<string>(`/Tuan/TuanNewzcFloor/edit/id/${id}`).then((res) => {
    const $ = cheerio.load(res.data);
    const form = parseCheerioForm($, 'form');
    const json = parseCheerioForm($, 'form', 'data-name');
    resolve({ errcode: 0, errmsg: '', data: { form, json } });
  }).catch(reject);
});

export const setTuanNewzcFloor = ({ form, json }): Promise<void> => new Promise((resolve, reject) => {
  const data: Record<string, any> = Object.assign({ ajaxType: 1 }, form, { floor_item_json: JSON.stringify([json]) });
  http.get('/Tuan/TuanNewzcFloor/update/', data).then(() => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (k === 'ajaxType' || v === void 0 || v === null) {
        return;
      }
      formData.set(k, v);
    });
    http.post('/Tuan/TuanNewzcFloor/update/', formData).then(() => resolve());
  }).catch(reject);
});
