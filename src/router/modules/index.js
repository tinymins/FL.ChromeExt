/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

export default [
  {
    path: '/',
    meta: { tabbar: 'fl/index' },
    components: {
      static: () => import('@/views/common/static/index.vue'),
      header: () => import('@/views/common/header/index.vue'),
      main: () => import('@/views/common/main/index.vue'),
      footer: () => import('@/views/common/footer/index.vue'),
    },
    redirect: { name: 'index' },
    children: [
      {
        name: 'index',
        path: '',
        meta: { title: '首页' },
        component: () => import('@/views/index/index.vue'),
      },
    ],
  },
  {
    name: '404',
    path: '*',
    components: {
      static: () => import('@/views/common/static/index.vue'),
      header: () => import('@/views/common/header/index.vue'),
      main: () => import('@/views/404'),
      footer: () => import('@/views/common/footer/index.vue'),
    },
  },
];
