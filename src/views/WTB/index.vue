<template>
  <a-card>
    <a-spin :spinning="spinning">
      <div class="text-[#333] font-medium text-base mb-6" style="color: #C70019">拓扑统计</div>
      <a-descriptions>
        <a-descriptions-item label="拓扑节点数">{{ info?.wtbTopoNodeCnt }}</a-descriptions-item>
        <a-descriptions-item label="顶节点地址">{{ info?.wtbTopoTopNodeAdd }}</a-descriptions-item>
        <a-descriptions-item label="底节点地址">{{ info?.wtbTopoBottomNodeAdd }}</a-descriptions-item>
        <a-descriptions-item label="自身地址">{{ info?.wtbTopoSelfNodeAdd }}</a-descriptions-item>
        <a-descriptions-item label="编组强度"> {{ info?.groupStrength }} </a-descriptions-item>
      </a-descriptions>

      <a-divider />
      <div class="text-[#333] font-medium text-base mb-7.5" style="color: #C70019">拓扑图</div>
      <div>
        <div class="w-full h-[1px] bg-black bg-opacity-15"></div>
        <div class="flex h-43.5 overflow-auto">
          <div class="mx-7.5" v-for="item in topo?.wtbTopoImageNodeList" :key="item.wtbAdd">
            <div class="ml-11.5">
              <div class="h-7.5 w-[1px] bg-[#D9D9D9] ml-3.5"></div>
              <div class="h-4 w-7 bg-[#C4C5C7] rounded-sm" :class="item.wtbAdd === topo?.wtbLocalDevAdd && 'bg-[#59A14F]'"></div>
              <div class="py-2 text-black">{{ item.wtbAdd }}</div>
            </div>
            <div class="h-16 w-30 border-solid border-1 rounded-sm text-xs p-1.5"> {{ item.wtbNodeData }} </div>
          </div>
        </div>
      </div>

      <a-divider />
      <div class="text-[#333] font-medium text-base mb-6" style="color: #C70019">WTB计数表格</div>
      <table class="w-full border-solid border-1 border-[#DBDBDB]">
        <tr>
          <td class="p-2.5 bg-[#ECEEF1]"></td>
          <td class="p-2.5 bg-[#ECEEF1]">TX总数</td>
          <td class="p-2.5 bg-[#ECEEF1]">RX总数</td>
          <td class="p-2.5 bg-[#ECEEF1]">丢包总数</td>
        </tr>
        <tr>
          <td class="p-2.5 bg-[#ECEEF1]">A线方向1</td>
          <td class="p-2.5">{{ statics?.wtbLineADir1Statis[0] }}</td>
          <td class="p-2.5">{{ statics?.wtbLineADir1Statis[1] }}</td>
          <td class="p-2.5">{{ statics?.wtbLineADir1Statis[2] }}</td>
        </tr>
        <tr>
          <td class="p-2.5 bg-[#ECEEF1]">A线方向2</td>
          <td class="p-2.5">{{ statics?.wtbLineADir2Statis[0] }}</td>
          <td class="p-2.5">{{ statics?.wtbLineADir2Statis[1] }}</td>
          <td class="p-2.5">{{ statics?.wtbLineADir2Statis[2] }}</td>
        </tr>
        <tr>
          <td class="p-2.5 bg-[#ECEEF1]">B线方向1</td>
          <td class="p-2.5">{{ statics?.wtbLineBDir1Statis[0] }}</td>
          <td class="p-2.5">{{ statics?.wtbLineBDir1Statis[1] }}</td>
          <td class="p-2.5">{{ statics?.wtbLineBDir1Statis[2] }}</td>
        </tr>
        <tr>
          <td class="p-2.5 bg-[#ECEEF1]">B线方向2</td>
          <td class="p-2.5">{{ statics?.wtbLineBDir2Statis[0] }}</td>
          <td class="p-2.5">{{ statics?.wtbLineBDir2Statis[1] }}</td>
          <td class="p-2.5">{{ statics?.wtbLineBDir2Statis[2] }}</td>
        </tr>
      </table>

      <a-divider />
      <div class="text-[#333] font-medium text-base mb-6" style="color: #C70019">CRC错误统计</div>
      <a-descriptions>
        <a-descriptions-item label="方向1CR错误数">{{ statics?.wtbDir1CRCErrCnt }}</a-descriptions-item>
        <a-descriptions-item label="方向1CR错误数">{{ statics?.wtbDir2CRCErrCnt }}</a-descriptions-item>
      </a-descriptions>
    </a-spin>
  </a-card>
</template>
<script lang="ts" setup>
  import { onMounted, ref, onUnmounted } from 'vue';
  import { Api, fetchBackendData as fetch } from './api';
  import { Info, Statics, Topo } from './type';
  import pageRefreshCycle from '/@/store/modules/pageRefreshCycle';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const spinning = ref(true);
  const info = ref<Info | undefined>(),
    statics = ref<Statics | undefined>(),
    topo = ref<Topo | undefined>();

  const handleIntervalFn = async () => {
    info.value = await fetch(Api.WtbNodeInfo);
    statics.value = await fetch(Api.WtbStatisInfo);
    topo.value = await fetch<Topo>(Api.WtbTopoImgInfo);
    spinning.value = false;
  };

  let timer: any = null;
  onMounted(() => {
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
