/**
 * @Author: Emil Zhai (root@derzh.com)
 * @Date:   2018-12-09 15:48:26
 * @Last Modified by: Emil Zhai
 * @Last Modified time: 2018-12-12 20:37:02
 */

export default [
  {
    name: 'coupon',
    path: '/coupon',
    meta: { parent: 'coupon', nav: 'coupon', title: '自动换券' },
    components: {
      header: () => import('@/views/common/header/index.vue'),
      main: () => import('@/views/coupon/index.vue'),
      footer: () => import('@/views/common/footer/index.vue'),
    },
  },
];
