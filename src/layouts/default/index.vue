<template>
  <div class="globalContainer" v-bind="lockEvents">
    <!-- <Layout :class="prefixCls"> -->
      <!-- <LayoutFeatures /> -->
    <div class="leftContainer">
      <img class="item-logo" src="../../../src/assets/images/logoHeader.png" />
      <div class="item-sidebar">
        <LayoutSideBar v-if="getShowSidebar || getIsMobile" />
      </div>
    </div>
    <div class="rightContainer">
      <LayoutHeader fixed v-if="getShowFullHeaderRef" />
      <LayoutContent class="item-content" />
    </div>
  </div>
  <div class="footerContainer">软件版本: 1.0.0 Build 株洲中车时代电气股份有限公司</div>
</template>
      <!-- <div class="bodyContainer"> -->
        <!-- <Layout :class="[layoutClass]"> -->

            <!-- <Layout :class="`${prefixCls}-main`"> -->
              <!-- <LayoutMultipleHeader /> -->

              <!-- <LayoutFooter /> -->
            <!-- </Layout> -->
        <!-- </Layout> -->
      <!-- </div> -->
    <!-- </Layout> -->


<script lang="ts">
  import { defineComponent, computed, unref, ref, onMounted, onUnmounted, onBeforeUnmount, createVNode } from 'vue';
  import { Layout } from 'ant-design-vue';
  // import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

  import LayoutHeader from './header/index.vue';
  import LayoutContent from './content/index.vue';
  import LayoutSideBar from './sider/index.vue';
  // import LayoutMultipleHeader from './header/MultipleHeader.vue';
  import { Modal } from 'ant-design-vue';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useLockPage } from '/@/hooks/web/useLockPage';
  import ExclamationCircleOutlined from '@ant-design/icons-vue/lib/icons/ExclamationCircleOutlined';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { useUserStore } from '/@/store/modules/user';
  import axios from 'axios';

  const userStore = useUserStore();
  const token = userStore.getToken1;
  const account = userStore.account;
  let data: string;
  const authHeader = token;
  const timer = ref();
  let count = ref<number>();
  const sessionTimeout = ref('');
  const sessionTimer = ref<number>();
  const timer2 = ref();
  let count2 = ref(0);
  let resetCount = 0;

  async function sessionCountCheck() {
    axios({
      method: "POST",
      url: "/cgi-bin/script/sessionCount",
      headers: {
        "Authorization": authHeader
      }
    })
    .then(response => {
      if (response.data.status == "OK") {
        resetCount = 0;
      }
    })
    .catch(error => {
      console.log(error);
      resetCount++;
      if (resetCount >= 3) {
      clearInterval(timer.value);
      timer.value = null;
      clearInterval(timer2.value);
      timer2.value = null;
      userStore.setAccount('');
      userStore.setRole(0);
      userStore.setToken1('');
      userStore.setBanner('');
      window.location.reload();
    }});
  }

  const recurSessionCountCheck = () => {
    timer2.value = setInterval(() => {
      if (count2.value > 0 && count2.value <= 1) {
        count2.value--;
      }
      else if (count2.value == 0) {
        count2.value = 1;
        sessionCountCheck();
      }
    }, 1000);
  };

  recurSessionCountCheck();

  async function sessionTimeoutRetrieve() {
    const result = await axios.get("/cgi-bin/script/userSetting");
    sessionTimeout.value = result.data.logValidMinTime;
    sessionTimer.value = (sessionTimeout.value as unknown as number) * 60;
  }

  function resetSessionTimer() {
    clearInterval(timer.value);
    timer.value = null;
    count.value = sessionTimer.value;
    startSessionTimer();
  }

  function startSessionTimer() {
    timer.value = setInterval(() => {
      let uploadFlag = userStore.getUploadFlag;
      if (uploadFlag) {
        resetSessionTimer();
      }
      // @ts-ignore
      if (count.value > 0 && count.value <= sessionTimer.value) {
        // @ts-ignore
        count.value--;
      }
      else if (count.value == 0) {
        // @ts-ignore
        count.value = sessionTimer.value + 1;
        Modal.confirm({
          title: '温馨提醒',
          icon: createVNode(ExclamationCircleOutlined),
          content: '长时间未操作, 要退出登录吗?',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            eraseData();
          },
          onCancel() {
            resetSessionTimer();
          }
        });
      }
    }, 1000);
  }

  function eraseData() {
    clearInterval(timer.value);
    timer.value = null;
    clearInterval(timer2.value);
    timer2.value = null;
    userStore.setAccount('');
    userStore.setRole(0);
    userStore.setToken1('');
    userStore.setBanner('');
    window.location.reload();
  }

  if (token == null || token == '') {
    window.location.reload();
  }

  export default defineComponent({
    name: 'DefaultLayout',
    components: {
      // LayoutFeatures: createAsyncComponent(() => import('/@/layouts/default/feature/index.vue')),
      // LayoutFooter: createAsyncComponent(() => import('/@/layouts/default/footer/index.vue')),
      LayoutHeader,
      LayoutContent,
      LayoutSideBar,
      // LayoutMultipleHeader,
      Layout,
    },
    setup() {
      const { prefixCls } = useDesign('default-layout');
      const { getIsMobile } = useAppInject();
      const { getShowFullHeaderRef } = useHeaderSetting();
      const { getShowSidebar, getIsMixSidebar, getShowMenu } = useMenuSetting();

      // Create a lock screen monitor
      const lockEvents = useLockPage();

      const layoutClass = computed(() => {
        let cls: string[] = ['ant-layout'];
        if (unref(getIsMixSidebar) || unref(getShowMenu)) {
          cls.push('ant-layout-has-sider');
        }
        return cls;
      });

      function handleBeforeUnload(event: any) {
        navigator.sendBeacon("/cgi-bin/script/sessionCheck", data);
        userStore.setAccount('');
        userStore.setRole(0);
        userStore.setToken1('');
        userStore.setBanner('');
        clearInterval(timer.value);
        timer.value = null;
        clearInterval(timer2.value);
        timer2.value = null;
      }

      function handleUnload(event: any) {
        navigator.sendBeacon("/cgi-bin/script/sessionCheck", data);
        userStore.setAccount('');
        userStore.setRole(0);
        userStore.setToken1('');
        userStore.setBanner('');
        clearInterval(timer.value);
        timer.value = null;
        clearInterval(timer2.value);
        timer2.value = null;
      }

      onMounted(() => {
        data = JSON.stringify({ user: account, status: "LOGOUT" });
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('unload', handleUnload);
        sessionTimeoutRetrieve();
        startSessionTimer();
        window.addEventListener('mousemove', resetSessionTimer);
      });

      onBeforeUnmount(() => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('unload', handleUnload);
        window.removeEventListener('mousemove', resetSessionTimer);
      })

      onUnmounted(() => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('unload', handleUnload);
        window.removeEventListener('mousemove', resetSessionTimer);
      });

      return {
        getShowFullHeaderRef,
        getShowSidebar,
        prefixCls,
        getIsMobile,
        getIsMixSidebar,
        layoutClass,
        lockEvents,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-default-layout';

  .@{prefix-cls} {
    display: flex;
    width: 100%;
    min-height: 100%;
    background-color: @content-bg;
    flex-direction: column;
    align-items: center;

    > .ant-layout {
      min-height: 100%;
    }

    &-main {
      width: 100%;
      margin-left: 1px;
    }
  }
  .globalContainer {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 93%;
    margin-left: 3.5%;
    // overflow-x: auto;
    // overflow-y: hidden;
  }
  .footerContainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: lightgray;
    width: 93%;
    height: 4%;
    margin-left: 3.5%;
  }
  .leftContainer {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }
  .rightContainer {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    // flex-shrink: 0;
  }
  .item-logo {
    display: flex;
    background-color: whitesmoke;
    border-bottom: 3px solid #C70019;
  }
  .item-sidebar {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    border-right: 3px solid lightgray;
    border-top: 7px solid lightgray;
    border-left: 3px solid lightgray;
    background-color: white;
  }
  .item-content {
    display: flex;
    flex-direction: row;
    border-top: 7px solid lightgray;
    border-right: 3px solid lightgray;
  }
</style>
