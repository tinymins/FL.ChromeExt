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
    meta: { tabbar: 'fl/tsell', title: '实时榜单' },
    components: {
      static: () => import('@/views/common/static/index.vue'),
      header: () => import('@/views/common/header/index.vue'),
      main: () => import('@/views/tsell/index.vue'),
      footer: () => import('@/views/common/footer/index.vue'),
    },
  },
];
