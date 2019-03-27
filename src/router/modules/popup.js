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
    meta: { tabbar: 'popup/index', title: 'FL 自动化', progressBar: false },
    components: {
      main: () => import('@/views/popup/index.vue'),
    },
  },
];
