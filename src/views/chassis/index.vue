<template>
  <div class="pft">
    <a-card>
      <a-spin :spinning="spinning">
        <div class="text-[#333] text-base font-medium leading-[22px]" style="color: #C70019">机箱管理信息</div>
        <a-row :gutter="24" class="text-[#333]">
          <a-col class="gutter-row" :span="8">
            <div class="gutter-box mt-5">机箱号：{{ cmngCfInfo?.chasisId }}</div>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <div class="gutter-box mt-5">槽位号：{{ cmngCfInfo?.slotId }}</div>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <div class="gutter-box mt-5 flex items-center"
              >解析状态：<span
                class="w-4 h-4 rounded-2xl inline-block ml-4 setshadow"
                :class="[cmngCfInfo?.parseRet < 1 ? 'bg-[#C70019]' : 'bg-[#42AD5D]']"
              ></span
            ></div>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <div class="gutter-box mt-5 flex items-center"
              >是否为主系：<span
                class="w-4 h-4 rounded-2xl inline-block ml-4 setshadow"
                :class="[cmngCfInfo?.isMaster < 1 ? 'bg-[#C70019]' : 'bg-[#42AD5D]']"
              ></span
            ></div>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <div class="gutter-box mt-5">成为主系次数：{{ cmngCfInfo?.becomeMasCnt }}</div>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <div class="gutter-box mt-5">应用切主次数：{{ cmngCfInfo?.appMasSwitchCnt }}</div>
          </a-col>
        </a-row>
        <a-divider style="border-color: rgba(0, 0, 0, 0.15); margin-top: 30px" />
        <div class="text-[#333] text-base font-medium leading-[22px] mb-5" style="color: #C70019">IO板信息</div>
        <a-table :columns="columns" :dataSource="ioBrdInfo?.brdInfoList" size="small" :scroll="{ y: 240 }" :pagination="false" />
        <a-divider style="border-color: rgba(0, 0, 0, 0.15); margin-top: 30px" />
        <div class="text-[#333] text-base font-medium leading-[22px] mb-5" style="color: #C70019">CAN背板流量统计</div>
        <table class="w-full border-solid border-1 border-[#DBDBDB]">
          <tr>
            <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">#</td>
            <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">PPS</td>
            <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">TXOK</td>
            <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">RXOK</td>
            <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">TXERR</td>
            <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">RXERR</td>
          </tr>
          <tr v-for="(item, index) in canFlowInfo?.canInfoList" :key="index">
            <td class="p-2.5 bg-[#ECEEF1]">CAN {{ index + 1 }}</td>
            <td class="p-2.5">{{ item.PPS }}</td>
            <td class="p-2.5">{{ item.txOkCnt }}</td>
            <td class="p-2.5">{{ item.rxOkCnt }}</td>
            <td class="p-2.5">{{ item.txErrCnt }}</td>
            <td class="p-2.5">{{ item.rxErrCnt }}</td>
          </tr>
        </table>
      </a-spin>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';
  import { getCmngCfgInfo, getIoBrdInfo, getCanFlowInfo } from '/@/api/deviceInformation';
  import { ICmngCfgInfo, IIoBrdInfo, ICanFlowInfo } from '/@/api/deviceInformation/chassis';
  import { useIntervalFn, noop } from '@vueuse/core';
  import pageRefreshCycle from '/@/store/modules/pageRefreshCycle';
  import { useRoute } from 'vue-router';
  const route = useRoute();
  const spinning = ref(true);
  let cycle = ref(pageRefreshCycle.getCycle(route.meta.title));
  let pause = noop;
  const columns = [
    { title: '槽位', dataIndex: 'slotId', key: 'slotId' },
    { title: '板卡名称', dataIndex: 'name', key: 'name' },
    { title: '1系Init状态', dataIndex: 'initStatByOne', key: 'initStatByOne' },
    { title: '2系Init状态', dataIndex: 'initStatByTwo', key: 'initStatByTwo' },
    { title: '1系alive状态', dataIndex: 'aliveStatByOne', key: 'aliveStatByOne' },
    { title: '2系alive状态', dataIndex: 'aliveStatByTwo', key: 'aliveStatByTwo' },
  ];
  const cmngCfInfo = ref<ICmngCfgInfo>();
  const ioBrdInfo = ref<IIoBrdInfo>();
  const canFlowInfo = ref<ICanFlowInfo>();
  onMounted(() => {
    watch(
      () => cycle.value,
      (time) => {
        pause();
        pause = useIntervalFn(init, time * 100).pause;
      },
      { immediate: true }
    );
    pageRefreshCycle.off().on('updateCycle', (val) => {
      cycle.value = val;
    });
  });
  const init = async () => {
    // 机箱管理信息
    await getCmngCfgInfo().then((res) => {
      cmngCfInfo.value = res;
    });
    // IO板状态信息
    await getIoBrdInfo().then((res) => {
      ioBrdInfo.value = res;
      ioBrdInfo.value.brdInfoList.map((item) => {
        item.initStatByOne = analysis(item.initStatByOne);
        item.initStatByTwo = analysis(item.initStatByTwo);
        item.aliveStatByOne = analysis(item.aliveStatByOne);
        item.aliveStatByTwo = analysis(item.aliveStatByTwo);
      });
    });

    // CAN流量信息
    await getCanFlowInfo().then((res) => {
      canFlowInfo.value = res;
    });

    spinning.value = false;
  };
  const analysis = (status) => {
    let result = '-';
    switch (status) {
      case 0:
        result = 'BAD';
        break;
      case 1:
        result = 'OK';
        break;
      default:
        result = '-';
    }
    return result;
  };
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
