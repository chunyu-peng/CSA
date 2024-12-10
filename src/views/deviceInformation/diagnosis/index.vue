<template>
  <a-card class="diagnosis">
    <a-spin :spinning="spinning">
      <div class="text-[#333] text-base font-medium leading-[22px]" style="color: #C70019">CPLD诊断信息</div>
      <a-row :gutter="24" class="text-[#333]">
        <a-col class="gutter-row" :span="8" v-for="(item, index) in cpldDiagInfo?.cpldDiagList" :key="index">
          <div class="gutter-box mt-5">{{ item.errNameInChinese }}：{{ item.cnt }}</div>
        </a-col>
      </a-row>
      <a-divider style="border-color: rgba(0, 0, 0, 0.15); margin-top: 30px" />
      <div class="text-[#333] text-base font-medium leading-[22px]" style="color: #C70019">软件诊断信息</div>
      <a-row :gutter="24" class="text-[#333]">
        <a-col class="gutter-row" :span="8" v-for="(item, index) in softDiagInfo?.softDiagList" :key="index">
          <div class="gutter-box mt-5 flex items-center"
            >{{ item.errNameInChinese }}：<span
              class="w-4 h-4 rounded-2xl inline-block ml-4 setshadow"
              :class="[item?.value < 1 ? 'bg-[#C70019]' : 'bg-[#42AD5D]']"
            ></span
          ></div>
        </a-col>
      </a-row>
    </a-spin>
  </a-card>
</template>
<script lang="ts" name="diagnosis" setup>
  import { onMounted, ref, watch } from 'vue';
  import { getCpldDiagInfo, getSoftDiagInfo } from '/@/api/deviceInformation';
  import { ICpldDiagInfo, ISoftDiagInfo } from '/@/api/deviceInformation/interface';
  import { useIntervalFn, noop } from '@vueuse/core';
  import pageRefreshCycle from '/@/store/modules/pageRefreshCycle';
  import { useRoute } from 'vue-router';
  const route = useRoute();
  let cycle = ref(pageRefreshCycle.getCycle(route.meta.title));
  let pause = noop;
  const cpldDiagInfo = ref<ICpldDiagInfo>();
  const softDiagInfo = ref<ISoftDiagInfo>();
  const spinning = ref(true);
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
    // CPLD诊断信息
    await getCpldDiagInfo().then((res) => {
      cpldDiagInfo.value = res;
    });

    // 软件诊断信息获取
    await getSoftDiagInfo().then((res) => {
      softDiagInfo.value = res;
    });
    spinning.value = false;
  };
</script>
<style lang="less" scoped>
  .setshadow {
    box-shadow: inset 0px 0px 6px 0px rgba(0, 0, 0, 0.25);
  }
  .diagnosis {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
</style>
