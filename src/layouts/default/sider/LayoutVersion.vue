<template>
  <div
    v-if="getShowVersion"
    class="version"
    :style="{
      padding: getCollapsed ? '0px' : '0 32px',
    }"
  >
    <span class="version-name" v-show="!getCollapsed">版本号</span>
    <span>{{ versions }}</span>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { useGlobSetting } from '/@/hooks/setting';
  export default defineComponent({
    name: 'LayoutVersion',
    setup() {
      const { getCollapsed } = useMenuSetting();
      const { getShowVersion } = useRootSetting();
      const globSetting = useGlobSetting();

      return {
        versions: globSetting.version,
        getCollapsed,
        getShowVersion,
      };
    },
  });
</script>
<style lang="less">
  .version {
    position: absolute;
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    bottom: 0;
    right: 0;
    left: 0;
    color: rgba(255, 255, 255, 0.65);
    background: transparent;
    clear: both;
    font-size: 14px;
    .version-name {
      margin-right: 30%;
    }
  }
</style>
