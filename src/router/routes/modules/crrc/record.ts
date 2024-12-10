import { LAYOUT } from '/@/router/constant';

export default {
  path: '/record',
  name: 'record',
  component: LAYOUT,
  redirect: '/record/EnableCollect/index',
  meta: {
    icon: 'ion:settings-outline',
    title: '记录功能信息',
    orderNo: 3000,
    ignoreKeepAlive: true,
  },
  code: [9, 10],
  children: [
    {
      path: '/record/EnableCollect/index',
      name: 'EnableCollectPage',
      meta: {
        title: '使能与采集信息',
        orderNo: 1000,
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/record/EnableCollect/index.vue'),
      componentUrl: '/record/EnableCollect/index.vue',
      code: 9,
    },
    {
      path: '/record/EventDataPage/index',
      name: 'EventDataPage',
      meta: {
        title: '事件与数据信息',
        orderNo: 1001,
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/record/EventData/index.vue'),
      componentUrl: '/record/EventData/index.vue',
      code: 10,
    },
  ],
};
