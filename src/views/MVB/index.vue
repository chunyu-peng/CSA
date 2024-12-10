<template>
  <a-card>
    <a-spin :spinning="spinning">
      <div class="text-[#333] font-medium text-base mb-6" style="color: #C70019">MVB信息</div>
      <a-descriptions>
        <a-descriptions-item label="设备地址">{{ mvbInfo?.mvbDevAdd }}</a-descriptions-item>
        <a-descriptions-item label="设备状态字">{{ mvbInfo?.mvbDsw }}</a-descriptions-item>
        <a-descriptions-item label="总帧数">{{ mvbInfo?.mvbAllFrameCnt }}</a-descriptions-item>
        <a-descriptions-item label="总错帧数">{{ mvbInfo?.mvbErrFrameCnt }}</a-descriptions-item>
        <!-- <a-descriptions-item label="总线状态"> {{ mvbInfo?.busStat === 1 ? 'OK' : 'BAD' }} </a-descriptions-item> -->
        <!-- <a-descriptions-item label="信任线状态"> {{ mvbInfo?.trustLine === 1 ? 'A线' : 'B线' }} </a-descriptions-item> -->
        <a-descriptions-item label="A任线状态"> {{ mvbInfo?.AlineStat === 1 ? 'OK' : 'BAD' }} </a-descriptions-item>
        <a-descriptions-item label="B任线状态"> {{ mvbInfo?.BlineStat === 1 ? 'OK' : 'BAD' }} </a-descriptions-item>
        <!-- <a-descriptions-item label="EnterMasterCnt"> {{ mvbInfo?.enterMasCnt }} </a-descriptions-item> -->
      </a-descriptions>

      <a-divider style="border-color: rgba(0, 0, 0, 0.15); margin-top: 30px" />
      <div class="flex mb-6 items-center">
        <div class="text-[#333] font-medium text-base mr-20" style="color: #C70019">端口信息列表</div>
        <a-input-search placeholder="请输入十六进制端口，例如aH" v-model:value="port" style="width: 250px" />
      </div>
      <a-table
        :columns="portInfoCols"
        :scroll="{ y: 240 }"
        :dataSource="!isEmpty(port) ? portInfoList.filter((v) => includes(v.ID.toString(), port)) : portInfoList"
        size="small"
        :pagination="false"
      />

      <!-- <a-divider style="border-color: rgba(0, 0, 0, 0.15); margin-top: 30px" />
      <div class="flex mb-6 items-center">
        <div class="text-[#333] font-medium text-base mr-20">设备状态信息列表</div>
        <a-input-search placeholder="请输入地址" v-model:value="add" style="width: 240px" />
      </div>
      <a-table
        :columns="devCols"
        :scroll="{ y: 240 }"
        :dataSource="!isEmpty(add) ? devList.filter((v) => includes(v.devAdd.toString(), add)) : devList"
        size="small"
        :pagination="false"
      />

      <a-divider style="border-color: rgba(0, 0, 0, 0.15); margin-top: 30px" />
      <div class="flex mb-6 items-center">
        <div class="text-[#333] font-medium text-base mr-20">BA状态列表</div>
      </div>
      <a-table :columns="baCols" :scroll="{ y: 240 }" :dataSource="baList" size="small" :pagination="false" /> -->
    </a-spin>
  </a-card>
</template>
<script lang="ts" setup>
  import { ref, onMounted, Ref, onUnmounted } from 'vue';
  import { fetchBackendData as fetch, Api } from './api';
  import { isEmpty, includes } from 'lodash-es';
  import { MvbStatInfo, mvbPortInfo, MvbDevInfo, BA, MvbPortAndDevInfo } from './type';
  import pageRefreshCycle from '/@/store/modules/pageRefreshCycle';
  import { useRoute } from 'vue-router';

  const spinning = ref(true);
  const route = useRoute();
  const cycle = ref(pageRefreshCycle.getCycle(route.meta.title));
  const port = ref(''),
    add = ref('');

  const portInfoCols = [
    { title: '端口号', dataIndex: 'ID', key: 'ID' },
    { title: 'Fcode', dataIndex: 'Fcode', key: 'Fcode' },
    { title: '类型', dataIndex: 'type', key: 'type', customRender: ({ text }) => (text ? '源' : '宿') },
    { title: '周期', dataIndex: 'period', key: 'period' },
  ];
  const portInfoList = ref<mvbPortInfo[]>([]);

  const devCols = [
    { title: '设备地址', dataIndex: 'devAdd', key: 'devAdd' },
    { title: '设备状态字', dataIndex: 'devDsw', key: 'devDsw' },
  ];
  const devList = ref<MvbDevInfo[]>([]);

  const baCols = [
    { title: '设备地址', dataIndex: 'BAAdd', key: 'BAAdd' },
    { title: '设备状态字', dataIndex: 'BADsw', key: 'BADsw' },
  ];
  const baList = ref<BA[]>([]);

  const mvbInfo: Ref<MvbStatInfo | undefined> = ref();
  let timer: any = null;
  onMounted(async () => {
    timer = setInterval(async () => {
      const { mvbStat } = await fetch<{ mvbStat: MvbStatInfo }>(Api.MvbStatInfo);
      mvbInfo.value = mvbStat;
      spinning.value = false;
    }, cycle.value * 100);

    const { mvbBAList, mvbDevList, mvbPortInfoList } = await fetch<MvbPortAndDevInfo>(Api.MvbPortAndDevInfo);
    portInfoList.value = mvbPortInfoList;
    devList.value = mvbDevList;
    baList.value = mvbBAList;

    pageRefreshCycle.off().on('updateCycle', (val) => {
      clearInterval(timer);
      timer = null;
      timer = setInterval(async () => {
        const { mvbStat } = await fetch<{ mvbStat: MvbStatInfo }>(Api.MvbStatInfo);
        mvbInfo.value = mvbStat;
      }, val * 1000);
    });
  });

  onUnmounted(() => {
    clearInterval(timer);
    timer = null;
  });
</script>

<style lang="less" scoped>
  :deep(.ant-table-thead > tr > th) {
    background-color: #eceef1;
  }
</style>
