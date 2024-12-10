<template>
  <div class="pft">
    <a-card>
      <a-spin :spinning="spinning">
        <div class="text-[#333] text-base font-medium leading-[22px]" style="color: #C70019">安全通信信息</div>
        <a-row :gutter="24" class="text-[#333]">
          <a-col class="gutter-row" :span="8">
            <div class="gutter-box mt-5">设备SMI号：{{ safetyComm?.safetyCommSMI }}</div>
          </a-col>
        </a-row>
        <a-divider style="border-color: rgba(0, 0, 0, 0.15); margin-top: 30px" />
        <div class="flex items-center mb-5">
          <div class="text-[#333] text-base font-medium leading-[22px] mr-5" style="color: #C70019">安全通信通道状态表</div>
          <a-input-search placeholder="请输入端口号" v-model:value="port" style="width: 250px" />
        </div>
        <!-- :dataSource="!isEmpty(port) ? safetyComm?.safetyCommList.filter((v) => includes(v.port.toString(), port)) : safetyComm?.safetyCommList" -->
        <!-- :dataSource="safetyComm?.safetyCommList" -->
        <a-table
          :columns="columns"
          :dataSource="!isEmpty(port) ? safetyComm?.safetyCommList.filter((v) => includes(v.port.toString(), port)) : safetyComm?.safetyCommList"
          size="small"
          :scroll="{ y: 240 }"
          :pagination="false"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'channelStat'">
              <span class="w-4 h-4 rounded-2xl inline-block ml-4 setshadow" :class="[record.channelStat < 1 ? 'bg-[#999]' : 'bg-[#42AD5D]']"></span>
            </template>
          </template>
        </a-table>
      </a-spin>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue';
  import { isEmpty, includes } from 'lodash-es';
  import { getSafetyComm } from '/@/api/deviceInformation';
  import { ISafetyComm } from '/@/api/deviceInformation/chassis';
  import { useIntervalFn, noop } from '@vueuse/core';
  import pageRefreshCycle from '/@/store/modules/pageRefreshCycle';
  import { useRoute } from 'vue-router';
  const route = useRoute();
  let cycle = ref(pageRefreshCycle.getCycle(route.meta.title));
  let pause = noop;
  const columns = [
    { title: '端口号', dataIndex: 'port', key: 'port' },
    { title: '通信类型', dataIndex: 'commType', key: 'commType' },
    { title: '类型', dataIndex: 'portType', key: 'portType' },
    { title: '通信状态', dataIndex: 'channelStat', key: 'channelStat' },
  ];
  const spinning = ref(true);
  const port = ref('');
  const safetyComm = ref<ISafetyComm>();
  onMounted(() => {
    watch(
      () => cycle.value,
      (time) => {
        pause();
        pause = useIntervalFn(init, time * 1000).pause;
      },
      { immediate: true }
    );
    pageRefreshCycle.off().on('updateCycle', (val) => {
      cycle.value = val;
    });
  });
  const init = () => {
    // 机箱管理信息
    getSafetyComm().then((res) => {
      safetyComm.value = res;
      safetyComm.value?.safetyCommList.map((item) => {
        item.commType = fiCommType(item.commType);
        item.portType = Number(item?.portType) < 1 ? '宿' : '源';
      });
      spinning.value = false;
    });
  };
  const fiCommType = (status) => {
    let result = '-';
    switch (status) {
      case 1:
        result = 'MVBS';
        break;
      case 2:
        result = 'TRDPS';
        break;
      case 3:
        result = 'CANS';
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
