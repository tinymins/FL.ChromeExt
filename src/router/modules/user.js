/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
import { AUTH_STATE } from '@/config';
import { isDevelop } from '@/utils/environment';

export default [
  {
    name: 'user',
    path: '/user',
    meta: { tabbar: 'fl/user' },
    components: {
      static: () => import('@/views/common/static/index.vue'),
      header: () => import('@/views/common/header/index.vue'),
      main: () => import('@/views/common/main/index.vue'),
      footer: () => import('@/views/common/footer/index.vue'),
    },
    redirect: { name: 'user_index' },
    children: [
      {
        name: 'user_index',
        path: 'me',
        meta: { auth: AUTH_STATE.LOGGED_IN, title: '用户中心' },
        component: () => import('@/views/user/index.vue'),
      },
      {
        name: 'user_login',
        path: 'login',
        component: () => import('@/views/common/main/index.vue'),
        redirect: { name: 'user_login_index' },
        children: [
          {
            name: 'user_login_index',
            path: '',
            meta: { auth: AUTH_STATE.GUEST, title: '登录' },
            component: () => import('@/views/user/login.vue'),
          },
          isDevelop()
            ? {
              name: 'user_login_dev',
              path: 'dev',
              meta: { title: '登录' },
              component: () => import('@/views/user/login.vue'),
            }
            : null,
        ].filter(_ => _),
      },
    ],
  },
];
