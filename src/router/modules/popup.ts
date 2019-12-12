/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { RouteConfig } from 'vue-router';

export default [
  {
    name: 'popup',
    path: '/popup',
    meta: { tabbar: 'main/popup', title: 'FL 自动化', progressBar: false },
    components: {
      main: () => import('@/views/popup/index'),
    },
  },
] as RouteConfig[];
