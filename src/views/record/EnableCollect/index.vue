<template>
  <a-card class="EnableCollect">
    <a-spin :spinning="spinning">
      <div class="text-[#333] font-medium text-base mb-6" style="color: #C70019">使能信息栏</div>
      <a-table :columns="columns" :dataSource="dataSource" size="small" :pagination="false" />

      <a-row :gutter="20" class="mt-8">
        <a-col :span="12">
          <div class="text-[#333] font-medium text-base mb-6" style="color: #C70019">MVB采样信息</div>
          <table class="w-full border-solid border-1 border-[#DBDBDB]">
            <tr>
              <td class="p-2.5 bg-[#ECEEF1]"></td>
              <td class="p-2.5 bg-[#ECEEF1]">采样周期</td>
              <td class="p-2.5 bg-[#ECEEF1]">采样数量</td>
            </tr>
            <tr>
              <td class="p-2.5 bg-[#ECEEF1]">FAST</td>
              <td class="p-2.5">{{ mvbCollectInfo?.mvbFastPeriod }}</td>
              <td class="p-2.5">{{ mvbCollectInfo?.mvbFastSampleCnt }}</td>
            </tr>
            <tr>
              <td class="p-2.5 bg-[#ECEEF1]">MID</td>
              <td class="p-2.5">{{ mvbCollectInfo?.mvbMidPeriod }}</td>
              <td class="p-2.5">{{ mvbCollectInfo?.mvbMidSampleCnt }}</td>
            </tr>
            <tr>
              <td class="p-2.5 bg-[#ECEEF1]">SLOW</td>
              <td class="p-2.5">{{ mvbCollectInfo?.mvbSlowPeriod }}</td>
              <td class="p-2.5">{{ mvbCollectInfo?.mvbSlowSampleCnt }}</td>
            </tr>
          </table>
        </a-col>
        <a-col :span="12">
          <div class="text-[#333] font-medium text-base mb-6">TRDP采样信息</div>
          <table class="w-full border-solid border-1 border-[#DBDBDB]">
            <tr>
              <td class="p-2.5 bg-[#ECEEF1]"></td>
              <td class="p-2.5 bg-[#ECEEF1]">采样周期</td>
              <td class="p-2.5 bg-[#ECEEF1]">采样数量</td>
            </tr>
            <tr>
              <td class="p-2.5 bg-[#ECEEF1]">FAST</td>
              <td class="p-2.5">{{ trdpCollectInfo?.trdpFastPeriod }}</td>
              <td class="p-2.5">{{ trdpCollectInfo?.trdpFastSampleCnt }}</td>
            </tr>
            <tr>
              <td class="p-2.5 bg-[#ECEEF1]">MID</td>
              <td class="p-2.5">{{ trdpCollectInfo?.trdpMidPeriod }}</td>
              <td class="p-2.5">{{ trdpCollectInfo?.trdpMidSampleCnt }}</td>
            </tr>
            <tr>
              <td class="p-2.5 bg-[#ECEEF1]">SLOW</td>
              <td class="p-2.5">{{ trdpCollectInfo?.trdpSlowPeriod }}</td>
              <td class="p-2.5">{{ trdpCollectInfo?.trdpSlowSampleCnt }}</td>
            </tr>
          </table>
        </a-col>
      </a-row>
    </a-spin>
  </a-card>
</template>
<script lang="ts" setup>
  import { onMounted, ref, onUnmounted } from 'vue';
  import { fetchBackendData as fetch, Api } from '../api';
  import { EnableInfo, MvbRcdSampleInfo, TrdpRcdSampleInfo } from '../type';
  import pageRefreshCycle from '/@/store/modules/pageRefreshCycle';
  import { useRoute } from 'vue-router';

  const spinning = ref(true);
  const route = useRoute();

  const columns = [
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '事件使能', dataIndex: 'event', key: 'event', customRender: ({ text }) => (text == 1 ? 'Enable' : 'Disable') },
    { title: '故障使能', dataIndex: 'fault', key: 'fault', customRender: ({ text }) => (text == 1 ? 'Enable' : 'Disable') },
    { title: '时间使能', dataIndex: 'time', key: 'time', customRender: ({ text }) => (text == 1 ? 'Enable' : 'Disable') },
    { title: '源端口', dataIndex: 'src', key: 'src' },
    { title: '宿端口', dataIndex: 'rcd', key: 'rcd' },
  ];

  const dataSource = ref<any>([]);

  const mvbCollectInfo = ref<MvbRcdSampleInfo | undefined>(),
    trdpCollectInfo = ref<TrdpRcdSampleInfo | undefined>();

  const handleIntervalFn = async () => {
    const res = await fetch<EnableInfo>(Api.RcdEnableInfo);
    dataSource.value = [
      {
        type: 'MVB',
        event: res.mvbEventEnableFlag,
        fault: res.mvbFaultEnableFlag,
        time: res.mvbTimeEnableFlag,
        src: res.mvbRcdSrcPort,
        rcd: res.mvbRcdSinkPort,
      },
      {
        type: 'TRDP',
        event: res.trdpEventEnableFlag,
        fault: res.trdpFaultEnableFlag,
        time: res.trdpTimeEnableFlag,
        src: res.trdpRcdSrcPort,
        rcd: res.trdpRcdSinkPort,
      },
    ];
  };

  let timer: any = null;
  onMounted(async () => {
    timer = setInterval(() => {
      handleIntervalFn();
      spinning.value = false;
    }, pageRefreshCycle.getCycle(route.meta.title) * 1000);

    pageRefreshCycle.off().on('updateCycle', (val) => {
      clearInterval(timer);
      timer = null;
      timer = setInterval(async () => {
        handleIntervalFn();
      }, val * 1000);
    });

    mvbCollectInfo.value = await fetch<MvbRcdSampleInfo>(Api.MvbRcdSampleInfo);
    trdpCollectInfo.value = await fetch<TrdpRcdSampleInfo>(Api.TrdpRcdSampleInfo);
  });
  onUnmounted(() => {
    clearInterval(timer);
    timer = null;
  });
</script>

<style lang="less" scoped>
  table {
    td {
      border: 1px solid #dbdbdb;
      text-align: center;
    }
  }
  :deep(.ant-divider) {
    border-top: 1px solid rgba(0, 0, 0, 0.15);
  }
  .EnableCollect {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
</style>
