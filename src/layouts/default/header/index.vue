<template>
  <div class="headerContainer">
      <span class="item-space1"></span>
      <span class="item-map">
        <b class="item-overlay">{{ banner }}</b>
        <img src="../../../assets/images/map.png" /> 
      </span>
      <span class="item-space2"></span>
      <a-button type="link" style="color: black" @click="showRefreshComfirm">刷新周期</a-button>
      <a-modal v-model:visible="cycleVisible" :title="cycleTitle + '刷新周期'" @ok="updateCycle">
        <div class="flex justify-center">
          <a-input-number v-model:value="cycle" style="width: 200px" :min="pageRefreshCycle.min" :max="pageRefreshCycle.max">
            <template #addonAfter>秒</template>
          </a-input-number>
        </div>
      </a-modal>
      <span class="item-space3"></span>
      <span class="flexCol">
        <span class="item-user">
          <span class="flexCol">
            <span style="display: flex; color: #C70019">{{ user }}</span>
            <span style="display: flex; color: #C70019">{{ showRole }}</span>
          </span>
          <UserDropDown />
        </span>
        <b style="display: flex;">{{ currentTime }}</b>
      </span>
      <span class="item-space3"></span>
  </div>
</template>
  <!-- <Header :class="getHeaderClass"> -->
    <!-- left start -->
    <!-- <div :class="`${prefixCls}-left`"> -->
      <!-- logo -->
      <!-- <AppLogo v-if="getShowHeaderLogo || getIsMobile" :theme="getHeaderTheme" /> -->
      <!-- <div>当前时间为 {{ currentTime }}</div> -->
      <!-- <img src="../../../../src/assets/images/map.png" /> -->

      <!-- <LayoutTrigger
        v-if="(getShowContent && getShowHeaderTrigger && !getSplit && !getIsMixSidebar) || getIsMobile"
        :theme="getHeaderTheme"
        :sider="false"
      /> -->
      <!-- <LayoutBreadcrumb v-if="getShowContent && getShowBread" :theme="getHeaderTheme" /> -->
      <!-- 欢迎语 -->
      <!-- <span v-if="getShowContent && getShowBreadTitle" :class="[prefixCls, `${prefixCls}--${getHeaderTheme}`, 'headerIntroductionClass']">
        欢迎进入 {{ title }}
      </span> -->
    <!-- </div> -->
    <!-- left end -->

    <!-- menu start -->
    <!-- <div :class="`${prefixCls}-menu`" v-if="getShowTopMenu && !getIsMobile"> -->
      <!-- <LayoutMenu :isHorizontal="true" :theme="getHeaderTheme" :splitType="getSplitType" :menuMode="getMenuMode" /> -->
    <!-- </div> -->
    <!-- menu-end -->

    <!-- action  -->
    <!-- <div>
      <a-button type="link" style="color: #fff" @click="showRefreshComfirm">刷新周期</a-button> -->

      <!-- <AppSearch :class="`${prefixCls}-action__item `" v-if="getShowSearch" /> -->

      <!-- <ErrorAction v-if="getUseErrorHandle" :class="`${prefixCls}-action__item error-action`" /> -->

      <!-- <Notify v-if="getShowNotice" :class="`${prefixCls}-action__item notify-item`" /> -->

      <!-- <FullScreen v-if="getShowFullScreen" :class="`${prefixCls}-action__item fullscreen-item`" /> -->

      <!-- <LockScreen v-if="getUseLockPage" /> -->

      <!-- <AppLocalePicker v-if="getShowLocalePicker" :reload="true" :showText="false" :class="`${prefixCls}-action__item`" /> -->

      <!-- <UserDropDown :theme="getHeaderTheme" /> -->

      <!-- <SettingDrawer v-if="getShowSetting" :class="`${prefixCls}-action__item`" /> -->
    <!-- </div> -->
  <!-- </Header> -->
  <!-- <LoginSelect ref="loginSelectRef" @success="loginSelectOk"></LoginSelect> -->
  <!-- <a-modal v-model:visible="cycleVisible" :title="cycleTitle + '刷新周期'" @ok="updateCycle">
    <div class="flex justify-center">
      <a-input-number v-model:value="cycle" style="width: 200px" :min="pageRefreshCycle.min" :max="pageRefreshCycle.max">
        <template #addonAfter>秒</template>
      </a-input-number>
    </div>
  </a-modal> -->

<script lang="ts">
  import { defineComponent, unref, computed, ref, onMounted } from 'vue';

  import { propTypes } from '/@/utils/propTypes';

  import { Layout } from 'ant-design-vue';
  import { AppLogo } from '/@/components/Application';
  import LayoutMenu from '../menu/index.vue';

  // import { AppSearch } from '/@/components/Application';

  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';

  import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum';
  import { SettingButtonPositionEnum } from '/@/enums/appEnum';
  // import { AppLocalePicker } from '/@/components/Application';

  // , FullScreen, Notify, ErrorAction, LockScreen
  import { UserDropDown } from './components';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { useDesign } from '/@/hooks/web/useDesign';

  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useLocale } from '/@/locales/useLocale';
  import { useRoute } from 'vue-router';

  // import LoginSelect from '/@/views/sys/login/LoginSelect.vue';

  import { appTitle } from '/@/hooks/setting/useAppTitle';
  import { useIntervalFn } from '@vueuse/shared';
  import dayjs from 'dayjs';
  import pageRefreshCycle from '/@/store/modules/pageRefreshCycle';
  import { useUserStore } from '/@/store/modules/user';

  const userStore = useUserStore();
  const banner = ref('');
  const user = ref('');
  const role = ref(0);
  const showRole = ref('');
  banner.value = userStore.getBanner;
  user.value = userStore.getAccount;
  role.value = userStore.getRole;

  if (role.value == 1) {
    showRole.value = "管理员";
  }
  else if (role.value == 2) {
    showRole.value = "审计员";
  }
  else if (role.value == 3) {
    showRole.value = "操作员";
  }

  export default defineComponent({
    name: 'LayoutHeader',
    components: {
      Header: Layout.Header,
      AppLogo,
      LayoutMenu,
      UserDropDown,
      SettingDrawer: createAsyncComponent(() => import('/@/layouts/default/setting/index.vue'), {
        loading: true,
      }),
    },
    props: {
      fixed: propTypes.bool,
    },
    emits: ['updateCycle'],
    setup(props) {
      const { prefixCls } = useDesign('layout-header');

      const { getShowTopMenu, getShowHeaderTrigger, getSplit, getIsMixMode, getMenuWidth, getIsMixSidebar } = useMenuSetting();
      const { getUseErrorHandle, getShowSettingButton, getSettingButtonPosition } = useRootSetting();
      const title = appTitle;
      const {
        getHeaderTheme,
        getShowFullScreen,
        getShowNotice,
        getShowContent,
        getShowBread,
        getShowHeaderLogo,
        getShowHeader,
        getShowSearch,
        getUseLockPage,
        getShowBreadTitle,
      } = useHeaderSetting();

      const { getShowLocalePicker } = useLocale();

      const { getIsMobile } = useAppInject();

      const getHeaderClass = computed(() => {
        const theme = unref(getHeaderTheme);
        return [
          prefixCls,
          {
            [`${prefixCls}--fixed`]: props.fixed,
            [`${prefixCls}--mobile`]: unref(getIsMobile),
            [`${prefixCls}--${theme}`]: theme,
          },
        ];
      });

      const getShowSetting = computed(() => {
        if (!unref(getShowSettingButton)) {
          return false;
        }
        const settingButtonPosition = unref(getSettingButtonPosition);

        if (settingButtonPosition === SettingButtonPositionEnum.AUTO) {
          return unref(getShowHeader);
        }
        return settingButtonPosition === SettingButtonPositionEnum.HEADER;
      });

      const getLogoWidth = computed(() => {
        if (!unref(getIsMixMode) || unref(getIsMobile)) {
          return {};
        }
        const width = unref(getMenuWidth) < 180 ? 180 : unref(getMenuWidth);
        return { width: `${width}px` };
      });

      const getSplitType = computed(() => {
        return unref(getSplit) ? MenuSplitTyeEnum.TOP : MenuSplitTyeEnum.NONE;
      });

      const getMenuMode = computed(() => {
        return unref(getSplit) ? MenuModeEnum.HORIZONTAL : null;
      });
      const route = useRoute();
      const cycle = ref(pageRefreshCycle.getCycle(route.meta.title));
      const cycleVisible = ref(false);
      const cycleTitle = ref('');
      const showRefreshComfirm = () => {
        cycleVisible.value = true;
        cycleTitle.value = route.meta.title;
        cycle.value = pageRefreshCycle.getCycle(route.meta.title);
      };

      const updateCycle = () => {
        pageRefreshCycle.setCycle(route.meta.title, cycle.value);
        cycleVisible.value = false;
        pageRefreshCycle.emit('updateCycle', cycle.value);
      };

      /**
       * 首页多租户部门弹窗逻辑
       */
      const loginSelectRef = ref();

      function loginSelectOk() {
        console.log('成功。。。。。');
      }
      function currentFormatTime() {
        return dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss');
      }
      const currentTime = ref(currentFormatTime());

      useIntervalFn(() => {
        currentTime.value = currentFormatTime();
      }, 1000);

      onMounted(() => {
        // showLoginSelect();
      });

      return {
        prefixCls,
        getHeaderClass,
        getShowHeaderLogo,
        getHeaderTheme,
        getShowHeaderTrigger,
        getIsMobile,
        getShowBreadTitle,
        getShowBread,
        getShowContent,
        getSplitType,
        getSplit,
        getMenuMode,
        getShowTopMenu,
        getShowLocalePicker,
        getShowFullScreen,
        getShowNotice,
        getUseErrorHandle,
        getLogoWidth,
        getIsMixSidebar,
        getShowSettingButton,
        getShowSetting,
        getShowSearch,
        getUseLockPage,
        loginSelectOk,
        loginSelectRef,
        title,
        currentTime,
        showRefreshComfirm,
        cycleVisible,
        updateCycle,
        cycleTitle,
        cycle,
        pageRefreshCycle,
        user,
        showRole,
        banner,
      };
    },
  });
</script>
<style lang="less">
  @import './index.less';
  //update-begin---author:scott ---date:2022-09-30  for：默认隐藏顶部菜单面包屑-----------
  //顶部欢迎语展示样式
  @prefix-cls: ~'@{namespace}-layout-header';

  .@{prefix-cls} {
    display: flex;
    padding: 0 8px;
    align-items: center;

    .headerIntroductionClass {
      margin-right: 4px;
      margin-bottom: 2px;
      border-bottom: 0px;
      border-left: 0px;
    }

    &--light {
      .headerIntroductionClass {
        color: @breadcrumb-item-normal-color;
      }
    }

    &--dark {
      .headerIntroductionClass {
        color: rgba(255, 255, 255, 0.6);
      }
      .anticon {
        color: rgba(255, 255, 255, 0.8);
      }
    }
    //update-end---author:scott ---date::2022-09-30  for：默认隐藏顶部菜单面包屑--------------
  }
  .headerContainer {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      border-right: 3px solid lightgray;
      border-bottom: 3px solid #C70019;
      background-color: whitesmoke;
  }
  .item-map {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
  }
  .item-space1 {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 3;
  }
  .item-space2 {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 20;
  }
  .item-space3 {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }
  .item-user {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .item-overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    font-size: 20px;
  }
  .flexCol {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
