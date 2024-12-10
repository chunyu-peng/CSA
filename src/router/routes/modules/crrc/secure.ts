import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const secure: AppRouteModule = {
  path: '/secure',
  name: 'secure',
  component: LAYOUT,
  redirect: '/secure/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ion:settings-outline',
    title:'安全通信信息',
    orderNo: 3000,
    ignoreKeepAlive: true,
  },
  code: 7,
  children: [
    {
      path: 'index',
      name: 'secure',
      meta: {
        title: '安全通信信息',
        orderNo: 1000,
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/secure/index.vue'),
      componentUrl: '/secure/index.vue',
    },
  ],
};

export default secure;
