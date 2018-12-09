/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

export default [
  {
    name: 'popup',
    path: '/popup',
    meta: { parent: 'popup', nav: 'popup', title: 'FL 自动化' },
    components: {
      header: () => import('@/components/main.vue'),
      main: () => import('@/views/popup/index.vue'),
      footer: () => import('@/components/main.vue'),
    },
  },
];
