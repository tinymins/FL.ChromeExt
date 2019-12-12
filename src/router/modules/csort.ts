/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { RouteConfig } from 'vue-router';
import { AUTH_STATE } from '@/config';

export default [
  {
    name: 'csort',
    path: '/csort',
    meta: { tabbar: 'main/csort', title: '超级排序', auth: AUTH_STATE.LOGGED_IN },
    components: {
      static: () => import('@/views/common/static'),
      header: () => import('@/views/common/header'),
      main: () => import('@/views/csort/index.vue'),
      footer: () => import('@/views/common/footer'),
    },
  },
] as RouteConfig[];
