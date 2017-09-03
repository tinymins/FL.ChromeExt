/**
 * @Author: Zhai Yiming (root@derzh.com)
 * @Date:   2017-09-02 17:19:11
 * @Last Modified by:   Zhai Yiming
 * @Last Modified time: 2017-09-03 09:50:01
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

