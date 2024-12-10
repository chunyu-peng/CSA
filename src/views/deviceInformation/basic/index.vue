<template>
  <!-- <div class="pft"> -->
  <a-card class="basic">
    <a-spin :spinning="spinning">
      <div class="text-[#333] text-base font-medium leading-[22px]" style="color: #C70019">版本信息</div>
      <a-row :gutter="24" class="text-[#333]">
        <a-col class="gutter-row" :span="8" v-for="item in VersionInfo?.verNameList" :key="item?.id">
          <div class="gutter-box mt-5">{{ item.verName }}：{{ item.verCode }}</div>
        </a-col>
      </a-row>
      <a-divider style="border-color: rgba(0, 0, 0, 0.15); margin-top: 30px" />
      <div class="text-[#333] text-base font-medium leading-[22px]" style="color: #C70019">时间信息</div>
      <a-row :gutter="24" class="text-[#333]">
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box mt-5">软件系统时间：{{ dateShow || '-' }}</div>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <!-- 18h 36min 3s -->
          <div class="gutter-box mt-5">本次上电时间：{{ timeShow || '-' }}</div>
        </a-col>
      </a-row>
    </a-spin>
  </a-card>
  <!-- </div> -->
</template>
<script lang="ts" name="basic" setup>
  import { onMounted, ref } from 'vue';
  import dayjs from 'dayjs';
  import { getVersionInfo, getSysTime } from '/@/api/deviceInformation';
  import { IVersionInfo } from '/@/api/deviceInformation/interface';
  const VersionInfo = ref<IVersionInfo>();
  const timeShow = ref();
  const dateShow = ref();
  const spinning = ref(true);
  let timer: NodeJS.Timeout | undefined;
  onMounted(() => {
    // 版本信息
    getVersionInfo().then((res) => {
      VersionInfo.value = res;
      spinning.value = false;
    });
    // 时间信息
    getSysTime().then((res) => {
      let sysTime = res;
      let num = Number(sysTime.softPowerOnTime);
      let serverDate = new Date(sysTime.softTime);
      let timeString = dayjs(sysTime.softTime).valueOf();
      clearInterval(timer);
      timer = setInterval(() => {
        num = num + 1;
        timeShow.value = formateTime(num);
        let time = serverDate.setTime((timeString += 1000));
        dateShow.value = dayjs(new Date(time)).format('YYYY-MM-DD HH:mm:ss'); // dayjs(serverDate, 'YYYY-MM-DD hh:mm:ss');
      }, 100);
    });
  });

  const formateTime = (s: number) => {
    var t = '';
    if (s > -1) {
      var hour = Math.floor(s / 3600);
      var min = Math.floor(s / 60) % 60;
      var sec = s % 60;
      if (hour && hour < 10) {
        t = '0' + hour + 'h ';
      } else {
        t = hour + 'h ';
      }
      if (min < 10) {
        t += '0';
      }
      t += min + 'min ';
      if (sec < 10) {
        t += '0';
      }
      t += sec + 's';
    }
    return t;
  };
</script>

<style lang="less" scoped>
  .basic {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
</style>
