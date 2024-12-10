<template>
    <a-card class="log">
      <a-spin :spinning="spinning">
        <div class="text-[#333] font-medium text-base mb-6" style="color: #C70019">日志</div>
  
        <a-divider />
        <div class="text-[#333] font-medium text-base mb-6" style="color: #C70019">消息</div>
        <table class="w-full border-solid border-1 border-[#DBDBDB]">
            <tr>
                <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">操作时间</td>
                <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">操作码</td>
                <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">操作细节</td>
            </tr>
            <tr v-for="log in logInfo" v-if="renderComponent">
                <td class="p-2.5">
                    <span>{{ (log as any)?.faultTime }}</span>
                </td>
                <td class="p-2.5">
                    <span>{{ (log as any)?.faultCode }}</span>
                </td>
                <td class="p-2.5">
                    <span>{{ (log as any)?.faultDetail }}</span>
                </td>
            </tr>
        </table>
      </a-spin>
    </a-card>
  </template>
  <script lang="ts" setup>
    import { onMounted, ref, nextTick, onUnmounted } from 'vue';
    import pageRefreshCycle from '/@/store/modules/pageRefreshCycle';
    import { useRoute } from 'vue-router';
    import axios from 'axios';
    import { useUserStore } from '/@/store/modules/user';
  
    const route = useRoute();
    const spinning = ref(true);
    const renderComponent = ref(true);
    let logInfo = ref();
    const timer2 = ref();
    let count2 = ref(0);

    const userStore = useUserStore();
    const token = userStore.getToken1;
    const authHeader = token;
    showUserInfo();
    // showLogInfo();

    const handleIntervalFn = async () => {
      // spinning.value = false;
    };
    const forceRender = async() => {
      renderComponent.value = false;
      await nextTick();
      renderComponent.value = true;
    };
  
    async function showLogInfo() {
      const result =  await axios({
        method: "POST",
        url: "/cgi-bin/script/getMsgList",
        headers: {
          "Authorization": authHeader
        }
      });
      logInfo = result.data.msgList;
      // console.log(result.data.msgList);
      forceRender();
      if (result.data.msgList.length != 0) spinning.value = false;
    }

    async function showUserInfo() {
    const result =  await axios({
      method: "POST",
      url: "/cgi-bin/script/getUsrInfo",
      headers: {
        "Authorization": authHeader
      }
    });
    // @ts-ignore
    if (result.data.isFirstLogIn) {
      alert('首次登录, 请修改密码!');
    }
  }

  const recurShowLogInfo = () => {
    timer2.value = setInterval(() => {
      if (count2.value > 0 && count2.value <= 1) {
        count2.value--;
      }
      else if (count2.value == 0) {
        count2.value = 1;
        showLogInfo();
      }
    }, 1000);
  };

  recurShowLogInfo();
    
    let timer: any = null;
    onMounted(() => {
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
      clearInterval(timer2.value);
      timer2.value = null;
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
    .flexRow {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: flex-start;
    }
    .flexMember {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex-grow: 1;
    }
    .log {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .flexMemberuse {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .centerContent {
      border: 1px solid #dbdbdb;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
      padding-top: 3px;
      padding-bottom: 3px;
      padding-left: 1px;
      padding-right: 1px;
    }
    .centerContent:focus {
      border: 1px solid grey;
      outline: 1px solid grey;
    }
    .btn {
      border-radius: 3px;
      background-color: #6CD803;
      color: white;
      padding-top: 2px;
      padding-bottom: 2px;
      padding-left: 10px;
      padding-right: 10px;
    }
    .check {
      background-image: url(../../../assets/images/check.png);
      background-repeat: no-repeat;
      background-position: 50% 50%;
      width: 50px;
      height: 50px;
    }
    .clear {
      background-image: url(../../../assets/images/refresh.png);
      background-repeat: no-repeat;
      background-position: 50% 50%;
      width: 50px;
      height: 50px;
    }
    .btn:active {
      transform: translateY(2px);
    }
    .check:active {
      transform: translateY(2px);
    }
    .clear:active {
      transform: translateY(2px);
    }
    .createInput {
      border: 1px solid #dbdbdb;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
      padding-top: 2px;
      padding-bottom: 2px;
    }
    .createInput:focus {
      outline: none;
      border: 1px solid grey;
    }
    .reviseInput {
      text-align: center !Important;
      border: 1px solid #dbdbdb;
      border-radius: 3px;
      padding-top: 2px;
      padding-bottom: 2px;
    }
    .reviseInput:focus {
      text-align: center !Important;
      outline: none;
      border: 1px solid grey;
    }
    input[type="text"] {
      padding-left: 5px;
    }
    input[type="password"] {
      padding-left: 5px;
    }
    .selectInput {
      border: 1px solid #dbdbdb;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
      padding-top: 3px;
      padding-bottom: 3px;
      padding-left: 1px;
      padding-right: 62px;
    }
    .selectInput:focus {
      border: 1px solid grey;
      outline: 1px solid grey;
    }
    .admin {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    .uselabel {
      color: white;
      background-color: grey;
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
      padding-top: 3.1px;
      padding-bottom: 3.1px;
      padding-left: 50px;
      padding-right: 10px;
      flex-shrink: 0;
    }
    .flexSpace {
      display: flex;
      flex-grow: 10;
    }
    .centerCheck {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
  