/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

export default [
  {
    name: 'csort',
    path: '/csort',
    meta: { parent: 'csort', nav: 'csort', title: '超级排序', requiresAuth: true },
    components: {
      header: () => import('@/components/header.vue'),
      main: () => import('@/views/csort/index.vue'),
      footer: () => import('@/components/footer.vue'),
    },
  },
];
