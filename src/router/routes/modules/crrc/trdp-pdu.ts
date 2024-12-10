import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

export const mainDevice: AppRouteModule = {
  path: '/TRDP-PDU',
  name: 'TRDP-PDU',
  component: LAYOUT,
  redirect: '/TRDP-PDU/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ion:settings-outline',
    title: 'TRDP信息',
    orderNo: 3000,
    ignoreKeepAlive: true,
  },
  code: 8,
  children: [
    {
      path: 'index',
      name: 'TRDP-PDUPage',
      meta: {
        title: 'TRDP信息',
        orderNo: 1000,
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/TRDP-PDU/index.vue'),
      componentUrl: '/TRDP-PDU/index.vue',
    },
  ],
};

export default mainDevice;
