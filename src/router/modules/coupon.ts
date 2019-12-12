/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { RouteConfig } from 'vue-router';

export default [
  {
    name: 'coupon',
    path: '/coupon',
    meta: { tabbar: 'main/coupon', title: '自动换券' },
    components: {
      header: () => import('@/views/common/header'),
      main: () => import('@/views/coupon/index'),
      footer: () => import('@/views/common/footer'),
    },
  },
] as RouteConfig[];
