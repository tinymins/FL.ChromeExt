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
    meta: { parent: 'index', nav: 'index' },
    redirect: { name: 'index' },
    components: {
      header: () => import('@/views/common/header/index.vue'),
      main: () => import('@/views/common/main/index.vue'),
      footer: () => import('@/views/common/footer/index.vue'),
    },
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
    path: '*',
    name: '404',
    components: {
      header: () => import('@/views/common/header/index.vue'),
      main: () => import('@/views/index/404.vue'),
      footer: () => import('@/views/common/footer/index.vue'),
    },
  },
];
