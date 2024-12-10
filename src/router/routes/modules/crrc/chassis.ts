import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const chassis: AppRouteModule = {
  path: '/chassis',
  name: 'chassis',
  component: LAYOUT,
  redirect: '/chassis/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ion:settings-outline',
    title: '机箱管理信息',
    orderNo: 3000,
    ignoreKeepAlive: true,
  },
  code: 6,
  children: [
    {
      path: 'index',
      name: 'Chassis',
      meta: {
        title: '机箱管理信息',
        orderNo: 1000,
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/chassis/index.vue'),
      componentUrl: '/chassis/index.vue',
    },
  ],
};

export default chassis;
