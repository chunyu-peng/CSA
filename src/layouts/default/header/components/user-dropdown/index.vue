<template>
  <Dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <UserOutlined />
      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name  `" class="truncate">
          {{ getUserInfo.username }}
        </span>
      </span>
    </span>

    <template #overlay>
      <Menu @click="handleMenuClick">
        <!-- <MenuItem key="password" :text="t('layout.header.dropdownItemSwitchPassword')" icon="ant-design:edit-outlined" />
        <MenuItem key="refresh" text="刷新周期" icon="ant-design:setting-outlined" /> -->
        <MenuItem key="logout" :text="t('layout.header.dropdownItemLoginOut')" icon="ion:power-outline" />
      </Menu>
    </template>
  </Dropdown>
  <!-- <LockAction @register="register" />
  <DepartSelect ref="loginSelectRef" />
  <UpdatePassword ref="updatePasswordRef" /> -->
</template>
<script lang="ts">
  // components
  import { UserOutlined } from '@ant-design/icons-vue';
  import { Dropdown, Menu } from 'ant-design-vue';

  import { defineComponent, computed } from 'vue';


  import { useUserStore } from '/@/store/modules/user';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useModal } from '/@/components/Modal';
  import { propTypes } from '/@/utils/propTypes';

  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

  // import { DB_DICT_DATA_KEY } from '/src/enums/cacheEnum';
  // import { removeAuthCache, setAuthCache } from '/src/utils/auth';

  type MenuEvent = 'logout' | 'doc' | 'lock' | 'cache' | 'depart';
  // const { createMessage } = useMessage();
  export default defineComponent({
    name: 'UserDropdown',
    components: {
      Dropdown,
      Menu,
      UserOutlined,
      MenuItem: createAsyncComponent(() => import('./DropMenuItem.vue')),
      // DepartSelect: createAsyncComponent(() => import('./DepartSelect.vue')),
      // UpdatePassword: createAsyncComponent(() => import('./UpdatePassword.vue')),
    },
    props: {
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup() {
      const { prefixCls } = useDesign('header-user-dropdown');
      const { t } = useI18n();
      const { getShowDoc, getUseLockPage } = useHeaderSetting();
      const userStore = useUserStore();
      // const go = useGo();

      const getUserInfo = computed(() => {
        // console.log('userStore.getUserInfo :: ', userStore.getUserInfo);
        const { username = '', avatar, desc } = userStore.getUserInfo || {};
        return { username, avatar: avatar, desc };
      });

      const [register, { openModal }] = useModal();
      /**
       * 多部门弹窗逻辑
       */
      // const loginSelectRef = ref();
      function handleLock() {
        openModal(true);
      }

      //  login out
      function handleLoginOut() {
        userStore.confirmLoginOut();
      }

      function handleMenuClick(e: { key: MenuEvent }) {
        switch (e.key) {
          case 'logout':
            handleLoginOut();
            break;
          case 'doc':
            openDoc();
            break;
          case 'lock':
            handleLock();
            break;
          // case 'cache':
          //   clearCache();
          //   break;
          // case 'depart':
          //   updateCurrentDepart();
          //   break;
          // case 'password':
          //   updatePassword();
          //   break;
          // case 'account':
          //   go(`/page-demo/account/setting`);
          //   break;
        }
      }

      return {
        prefixCls,
        t,
        getUserInfo,
        handleMenuClick,
        getShowDoc,
        register,
        getUseLockPage,
        // loginSelectRef,
        // updatePasswordRef,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    height: @header-height;
    padding: 0 0 0 10px;
    padding-right: 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;
    align-items: center;

    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }

    &__header {
      border-radius: 50%;
    }

    &__name {
      font-size: 14px;
    }

    &--dark {
      &:hover {
        background-color: @header-dark-bg-hover-color;
      }
    }

    &--light {
      &:hover {
        background-color: @header-light-bg-hover-color;
      }

      .@{prefix-cls}__name {
        color: @text-color-base;
      }

      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }

    &-dropdown-overlay {
      .ant-dropdown-menu-item {
        min-width: 160px;
      }
    }
  }
</style>
