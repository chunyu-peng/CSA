import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
// import { useI18n } from '/@/hooks/web/useI18n';
const controlStrategy: AppRouteModule = {
  path: '/device-information',
  name: 'device-information',
  component: LAYOUT,
  redirect: '/device-information/basic',
  meta: {
    orderNo: 2000,
    icon: 'ion:settings-outline',
    title:'设备信息',
  },
  code: [1, 2, 3],
  children: [
    {
      path: 'basic',
      name: 'basic',
      meta: {
        title: '基本信息',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/deviceInformation/basic/index.vue'),
      componentUrl: '/deviceInformation/basic/index.vue',
      code: 1,
    },
    // 2023.9.27 本次更新不做此功能（接口未提供-zl
    // {
    //   path: 'control',
    //   name: 'control',
    //   meta: {
    //     title: useI18n().t('routes.crrc.deviceInformation.control'),
    //     ignoreKeepAlive: true,
    //   },
    //   component: () => import('/@/views/deviceInformation/control/index.vue'),
    //   componentUrl: '/deviceInformation/control/index.vue',
    // },
    {
      path: 'diagnosis',
      name: 'diagnosis',
      meta: {
        title: '诊断信息',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/deviceInformation/diagnosis/index.vue'),
      componentUrl: '/deviceInformation/diagnosis/index.vue',
      code: 3,
    },
    {
      path: 'ethernet',
      name: 'ethernet',
      meta: {
        title: '以太网信息',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/deviceInformation/ethernet/index.vue'),
      componentUrl: '/deviceInformation/ethernet/index.vue',
      code: 2,
    },
  ],
};

export default controlStrategy;
