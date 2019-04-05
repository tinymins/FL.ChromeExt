/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

export default [
  {
    name: 'tsell',
    path: '/tsell',
    meta: { tabbar: 'fl/tsell' },
    components: {
      static: () => import('@/views/common/static/index.vue'),
      header: () => import('@/views/common/header/index.vue'),
      main: () => import('@/views/common/main/index.vue'),
      footer: () => import('@/views/common/footer/index.vue'),
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
];
