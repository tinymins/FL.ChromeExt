/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { RouteConfig } from 'vue-router';

export default [
  {
    name: 'tsell',
    path: '/tsell',
    meta: { tabbar: 'main/tsell' },
    components: {
      static: () => import('@/views/common/static'),
      header: () => import('@/views/common/header'),
      main: () => import('@/views/common/main'),
      footer: () => import('@/views/common/footer'),
    },
    redirect: { name: 'tsell_realtime' },
    children: [
      {
        name: 'tsell_realtime',
        path: 'realtime',
        meta: { title: '实时榜单' },
        component: () => import('@/views/tsell/realtime.vue'),
      },
      {
        name: 'tsell_category',
        path: 'category',
        meta: { title: '分类榜单' },
        component: () => import('@/views/tsell/category.vue'),
      },
    ],
  },
] as RouteConfig[];
