/**
 * This file is part of Fanli chrome extension.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

export default [
  {
    name: 'user',
    path: '/user',
    meta: { parent: 'user', nav: 'user' },
    redirect: { name: 'user_index' },
    components: {
      header: () => import('@/components/header.vue'),
      main: () => import('@/components/main.vue'),
      footer: () => import('@/components/footer.vue'),
    },
    children: [
      {
        name: 'user_index',
        path: 'me',
        meta: { parent: 'user', title: '用户中心', requiresAuth: true },
        component: () => import('@/views/user/index.vue'),
      },
      {
        name: 'user_login',
        path: 'login',
        meta: { parent: 'user', title: '登录', requiresGuest: true },
        component: () => import('@/views/user/login.vue'),
        children: [
          {
            name: 'user_login_index',
            path: 'login',
            meta: { parent: 'user', title: '登录', requiresGuest: true },
            component: () => import('@/views/user/login.vue'),
          },
          {
            name: 'user_login_dev',
            path: 'login_dev',
            meta: { parent: 'user', title: '登录', requiresGuest: true },
            component: () => import('@/views/user/login.vue'),
          },
        ],
      },
    ],
  },
];
