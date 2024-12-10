<template>
  <!-- <div class="pft"> -->
  <a-card class="ethernet">
    <a-spin :spinning="spinning">
      <template v-for="item in EthList?.ethList" :key="item.id">
        <div class="text-[#333] text-base font-medium leading-[22px]">面板网口{{ item.ethNameOnBrd }}</div>
        <a-row :gutter="24" class="text-[#333]">
          <a-col class="gutter-row" :span="8">
            <div class="gutter-box mt-5">网口名称：{{ item?.ethNameInSoft }}</div>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <div class="gutter-box mt-5">MAC地址：{{ item?.macAdd }}</div>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <div class="gutter-box mt-5">IP：{{ item?.ipAdd }}</div>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <div class="gutter-box mt-5">掩码：{{ item?.mask }}</div>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <div class="gutter-box mt-5">网关：{{ item?.gateway }}</div>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <div class="gutter-box mt-5">TX总数：{{ item?.txPackSum }}</div>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <div class="gutter-box mt-5">RX总数：{{ item?.rxPackSum }}</div>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <div class="gutter-box mt-5 flex items-center"
              >Link状态：<span
                class="w-4 h-4 rounded-2xl inline-block ml-4 setshadow"
                :class="[item?.linkStat < 1 ? 'bg-[#999]' : 'bg-[#42AD5D]']"
              ></span
            ></div>
          </a-col>
        </a-row>
        <a-divider style="border-color: rgba(0, 0, 0, 0.15); margin-top: 30px" />
      </template>
    </a-spin>
  </a-card>
  <!-- </div> -->
</template>
<script lang="ts" name="ethernet" setup>
  import { onMounted, ref, watch } from 'vue';
  import { getEthInfo } from '/@/api/deviceInformation';
  import { IEthInfo } from '/@/api/deviceInformation/interface';
  import { useIntervalFn, noop } from '@vueuse/core';
  import pageRefreshCycle from '/@/store/modules/pageRefreshCycle';
  import { useRoute } from 'vue-router';
  const route = useRoute();
  const spinning = ref(true);
  let cycle = ref(pageRefreshCycle.getCycle(route.meta.title));
  let pause = noop;

  const EthList = ref<IEthInfo>();

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

  const init = () => {
    getEthInfo().then((res) => {
      EthList.value = res;
      spinning.value = false;
    });
  };
</script>
<style lang="less" scoped>
  .setshadow {
    box-shadow: inset 0px 0px 6px 0px rgba(0, 0, 0, 0.25);
  }
  .ethernet {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
</style>
