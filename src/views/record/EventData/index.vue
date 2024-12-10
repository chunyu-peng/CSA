<template>
  <a-card>
    <a-spin :spinning="spinning">
      <div class="text-[#333] font-medium text-base mb-6 flex mb-5 items-center">
        <div class="mr-10" style="color: #C70019">故障信息栏</div>
        <a-input-search placeholder="请输入十六进制故障码，例如0x1000" v-model:value="val" style="width: 300px" />
      </div>

      <a-table
        :columns="columns"
        :dataSource="!isEmpty(val) ? faultList.filter((v) => includes(v.faultCode.toString(), val)) : faultList"
        size="small"
        :pagination="false"
        :scroll="{ y: 290 }"
      />

      <a-row :gutter="20" class="mt-8">
        <a-col :span="12">
          <div class="text-[#333] font-medium text-base mb-6" style="color: #C70019">MVB事件信息</div>

          <table class="w-full border-solid border-1 border-[#DBDBDB]">
            <tr>
              <td class="p-2.5 w-40.5 bg-[#ECEEF1]">端口</td>
              <td class="p-2.5 bg-[#ECEEF1]">数据</td>
            </tr>
          </table>
          <div class="overflow-y-auto max-h-65">
            <table class="w-full border-solid border-1 border-[#DBDBDB]">
              <tbody>
                <tr v-for="item in mvbFaults" :key="item.port">
                  <td class="p-2.5 w-40.5 bg-[#ECEEF1]">{{ item.port }}</td>
                  <td class="p-2.5">{{ item.data }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </a-col>
        <a-col :span="12">
          <div class="text-[#333] font-medium text-base mb-6">TRDP事件信息</div>
          <table class="w-full border-solid border-1 border-[#DBDBDB]">
            <tr>
              <td class="p-2.5 w-40.5 bg-[#ECEEF1]">端口</td>
              <td class="p-2.5 bg-[#ECEEF1]">数据</td>
            </tr>
          </table>
          <div class="overflow-y-auto max-h-65">
            <table class="w-full border-solid border-1 border-[#DBDBDB]">
              <tbody>
                <tr v-for="item in trdpFaults" :key="item.port">
                  <td class="p-2.5 w-40.5 bg-[#ECEEF1]">{{ item.port }}</td>
                  <td class="p-2.5">{{ item.data }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </a-col>
      </a-row>
    </a-spin>
  </a-card>
</template>
<script lang="ts" setup>
  import { onMounted, ref, onUnmounted } from 'vue';
  import { fetchBackendData as fetch, Api } from '../api';
  import { DiagRcdInfo, DiagRecord, MvbDiagRcdInfo, TrdpDiagRcdInfo, PortData } from '../type';
  import pageRefreshCycle from '/@/store/modules/pageRefreshCycle';
  import { useRoute } from 'vue-router';
  import { isEmpty, includes } from 'lodash-es';

  const spinning = ref(true);
  const route = useRoute();
  const val = ref('');
  const columns = [
    { title: '故障码', dataIndex: 'faultCode', key: 'faultCode' },
    { title: '起始时间', dataIndex: 'startTime', key: 'startTime' },
    { title: '终止时间', dataIndex: 'stopTime', key: 'stopTime' },
  ];

  const faultList = ref<DiagRecord[]>([]),
    mvbFaults = ref<PortData[]>([]),
    trdpFaults = ref<PortData[]>([]);

  const handleIntervalFn = async () => {
    faultList.value = (await fetch<DiagRcdInfo>(Api.DiagRcdInfo)).diagRecordList;
    mvbFaults.value = (await fetch<MvbDiagRcdInfo>(Api.MvbDiagRcdInfo)).mvbDiagEventInfoList;
    trdpFaults.value = (await fetch<TrdpDiagRcdInfo>(Api.TrdpDiagRcdInfo)).trdpDiagEventInfoList;
    spinning.value = false;
  };

  let timer: any = null;
  onMounted(async () => {
    timer = setInterval(() => handleIntervalFn(), pageRefreshCycle.getCycle(route.meta.title) * 1000);

    pageRefreshCycle.off().on('updateCycle', (val) => {
      clearInterval(timer);
      timer = null;
      timer = setInterval(async () => handleIntervalFn(), val * 1000);
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
  :deep(.ant-divider) {
    border-top: 1px solid rgba(0, 0, 0, 0.15);
  }
</style>
