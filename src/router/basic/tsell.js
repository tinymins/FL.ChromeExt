/**
 * @Author: Zhai Yiming (root@derzh.com)
 * @Date:   2017-09-02 17:19:11
 * @Last Modified by:   Emine Zhai (root@derzh.com)
 * @Last Modified time: 2018-05-05 12:41:41
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
