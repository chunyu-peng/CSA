<template>
  <div class="pft">
    <a-spin :spinning="spinning">
      <a-card>
        <div class="flex mb-5 items-center">
          <div class="text-[#333] text-base font-medium leading-[22px] mr-20" style="color: #C70019">TRDP信息</div>
          <a-input-search placeholder="请输入端口" v-model:value="port" style="width: 250px" />
        </div>
        <a-table
          :columns="columns"
          :dataSource="!isEmpty(port) ? trdpList.filter((v) => includes(v.port.toString(), port)) : trdpList"
          size="small"
          :scroll="{ y: 290 }"
          :pagination="false"
        >
          <template #bodyCell="{ column }">
            <template v-if="column.key === 'status'">
              <span class="w-4 h-4 rounded-2xl bg-[#42AD5D] inline-block ml-4 setshadow"></span>
            </template>
          </template>
        </a-table>
      </a-card>
    </a-spin>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, onUnmounted } from 'vue';
  import { Api, fetchBackendData as fetch } from './api';
  import { Info, Trdp, UDP } from './type';
  import { isEmpty, includes } from 'lodash-es';
  import pageRefreshCycle from '/@/store/modules/pageRefreshCycle';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const spinning = ref(true);

  const columns = [
    { title: '端口号', dataIndex: 'port', key: 'port' },
    { title: '类型', dataIndex: 'type', key: 'type', customRender: ({ text }) => (text ? '源' : '宿') },
    { title: 'TX总数', dataIndex: 'txCnt', key: 'txCnt' },
    { title: 'RX总数', dataIndex: 'rxCnt', key: 'rxCnt' },
    { title: 'RX超时数', dataIndex: 'txTMO', key: 'txTMO' },
    { title: 'RX丢包数', dataIndex: 'rxTMO', key: 'rxTMO' },
  ];

  const trdpList = ref<Info[]>([]),
    udpList = ref<Info[]>([]),
    port = ref();

  const handleIntervalFn = async () => {
    trdpList.value = (await fetch<Trdp>(Api.TrdpInfo)).trdpInfoList;
    udpList.value = (await fetch<UDP>(Api.UdpInfo)).udpInfoList;
    spinning.value = false;
  };
  let timer: any = null;
  onMounted(async () => {
    timer = setInterval(() => handleIntervalFn(), pageRefreshCycle.getCycle(route.meta.title) * 100);
    pageRefreshCycle.off().on('updateCycle', (val) => {
      clearInterval(timer);
      timer = null;
      timer = setInterval(async () => handleIntervalFn(), val * 100);
    });
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
  .setshadow {
    box-shadow: inset 0px 0px 6px 0px rgba(0, 0, 0, 0.25);
  }
</style>
