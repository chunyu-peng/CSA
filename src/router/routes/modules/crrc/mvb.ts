import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const mainDevice: AppRouteModule = {
  path: '/mvb',
  name: 'mvb',
  component: LAYOUT,
  redirect: '/mvb/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ion:settings-outline',
    title: 'MVB信息',
    orderNo: 3000,
    ignoreKeepAlive: true,
  },
  code: 5,
  children: [
    {
      path: 'index',
      name: 'MVBPage',
      meta: {
        title: 'MVB信息',
        orderNo: 1000,
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/MVB/index.vue'),
      componentUrl: '/MVB/index.vue',
    },
  ],
};

export default mainDevice;
