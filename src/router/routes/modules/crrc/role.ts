import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const role: AppRouteModule = {
  path: '/role',
  name: 'role',
  component: LAYOUT,
  redirect: '/role/log/index',
  meta: {
    orderNo: 1000,
    icon: 'ion:settings-outline',
    title:'权限管理信息',
  },
  code: [12, 13, 14, 15],
  children: [
    {
      path: 'log',
      name: 'log',
      meta: {
        title: '日志信息',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/role/log/index.vue'),
      componentUrl: '/role/log/index.vue',
      code: 12,
    },
    {
      path: 'admin',
      name: 'admin',
      meta: {
        title: '用户管理信息',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/role/admin/index.vue'),
      componentUrl: '/role/admin/index.vue',
      code: 13,
    },
    {
      path: 'audit',
      name: 'audit',
      meta: {
        title: '审计信息',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/role/audit/index.vue'),
      componentUrl: '/role/audit/index.vue',
      code: 14,
    },
    {
      path: 'operator',
      name: 'operator',
      meta: {
        title: '操作信息',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/role/operator/index.vue'),
      componentUrl: '/role/operator/index.vue',
      code: 15,
    },
  ],
};

export default role;
