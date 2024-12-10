import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const mainDevice: AppRouteModule = {
  path: '/wtb',
  name: 'wtb',
  component: LAYOUT,
  redirect: '/wtb/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ion:settings-outline',
    title: 'WTB信息',
    orderNo: 3000,
    ignoreKeepAlive: true,
  },
  code: 11,
  children: [
    {
      path: 'index',
      name: 'WTBPage',
      meta: {
        title: 'WTB信息',
        orderNo: 1000,
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/WTB/index.vue'),
      componentUrl: '/WTB/index.vue',
    },
  ],
};

export default mainDevice;
