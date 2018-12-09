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
    meta: { parent: 'tsell', nav: 'tsell', title: '实时榜单' },
    components: {
      header: () => import('@/components/header.vue'),
      main: () => import('@/views/tsell/index.vue'),
      footer: () => import('@/components/footer.vue'),
    },
  },
];
