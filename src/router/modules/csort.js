/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { AUTH_STATE } from '@/config';

export default [
  {
    name: 'csort',
    path: '/csort',
    meta: { tabbar: 'fl/csort', title: '超级排序', auth: AUTH_STATE.LOGGED_IN },
    components: {
      static: () => import('@/views/common/static/index.vue'),
      header: () => import('@/views/common/header/index.vue'),
      main: () => import('@/views/csort/index.vue'),
      footer: () => import('@/views/common/footer/index.vue'),
    },
  },
];
