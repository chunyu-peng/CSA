<template>
  <!-- <div class="pft change-page"> -->
  <a-card class="control">
    <a-spin :spinning="spinning">
      <div class="text-[#333] text-base font-medium leading-[22px]">软件管理</div>
      <a-row :gutter="24" class="text-[#333]">
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box mt-5 h-8 flex items-center">软件系统时间：2023/8/25 10:24:56</div>
        </a-col>
        <a-col class="gutter-row" :span="16">
          <div class="gutter-box mt-5 h-8 flex items-center">
            设置系统时间：
            <a-date-picker show-time placeholder="设置时间" @change="onChange" @ok="onOk" class="w-[240px]">
              <template #suffixIcon>
                <ClockCircleOutlined />
              </template>
            </a-date-picker>
            <a-button class="w-[88px] ml-6 !rounded" @click="upFile">更 新</a-button>
          </div>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <div class="gutter-box mt-4">
            <a-button type="primary" class="!bg-[#3F7DF3] !rounded !border-color-[#3F7DF3]">一键重启</a-button>
          </div>
        </a-col>
      </a-row>
      <a-divider style="border-color: rgba(0, 0, 0, 0.15); margin-top: 30px" />
      <div class="text-[#333] text-base font-medium leading-[22px]">文件管理</div>
      <div class="font-medium mt-6 mb-5">文件上传</div>
      <div class="pl-6">
        <a-row :gutter="24" class="text-[#333]">
          <a-col :span="24" class="!flex items-center mb-5">
            <div class="w-[100px]">上传文件：</div>
            <a-upload v-model:file-list="fileList" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" :maxCount="1" class="flex items-center">
              <a-button class="mr-5 !rounded">
                <upload-outlined />
                选择文件
              </a-button>
            </a-upload>
          </a-col>
          <a-col :span="24" class="!flex items-center mb-5">
            <div class="w-[100px]">更新文件方式：</div>
            <a-select
              ref="select"
              v-model:value="value1"
              style="width: 240px"
              :options="options1"
              @focus="focus"
              @change="handleChange"
              class="!rounded !text-[#333]"
            />
          </a-col>
          <a-col :span="24" class="!flex items-center">
            <div class="w-[100px]">更新文件方式：</div>
            <a-button class="w-[88px] !rounded" @click="upFile">更 新</a-button>
          </a-col>
        </a-row>
      </div>
      <div class="font-medium mt-6 mb-5">文件下载</div>
      <div class="px-6">
        <a-button class="!rounded">获取文件列表</a-button>
        <div class="border border-color-[rgba(0,0,0,0.15)] !rounded-sm px-5 pt-4 pb-2 my-5">
          <a-radio-group v-model:value="radioValue" class="w-full !flex flex-wrap text-[#333]">
            <div class="w-[20%] mb-4" v-for="(item, index) in 15" :key="index"
              ><a-radio :value="index + 1">文件名称-{{ item }}.xlsx</a-radio></div
            >
          </a-radio-group>
        </div>
        <div class="flex items-center">
          <a-button class="mr-5 !rounded">
            <upload-outlined />
            下载文件
          </a-button>
          <div class="flex items-center">
            <PaperClipOutlined style="color: #c4c4c4" />
            <div class="pl-1 pr-3 cursor-pointer text-[#1891FF]">文件名称-{{ radioValue }}.xlsx</div>
            <DeleteOutlined style="color: #c4c4c4" class="cursor-pointer" />
          </div>
        </div>
      </div>
  </a-spin>
  </a-card>
  <!-- </div> -->
</template>
<script lang="ts" name="control" setup>
  import { ref, onMounted } from 'vue';
  import { Dayjs } from 'dayjs';
  import { ClockCircleOutlined, UploadOutlined, DeleteOutlined, PaperClipOutlined } from '@ant-design/icons-vue';
  import { UploadProps, SelectProps, message } from 'ant-design-vue';
  const spinning = ref(true);
  const fileList = ref<UploadProps['fileList']>([
    {
      uid: '1',
      name: 'xxx.png',
      status: 'done',
      response: 'Server Error 500', // custom error message to show
      url: 'http://www.baidu.com/xxx.png',
    },
    // {
    //   uid: '3',
    //   name: 'zzz.png',
    //   status: 'error',
    //   response: 'Server Error 500', // custom error message to show
    //   url: 'http://www.baidu.com/zzz.png',
    // },
  ]);
  const value1 = ref('jack');
  const options1 = ref<SelectProps['options']>([
    {
      value: 'jack',
      label: '更新到文件系统',
    },
    {
      value: 'lucy',
      label: '更新到file系统',
    },
    {
      value: 'disabled',
      label: '更新到服务器系统',
      disabled: true,
    },
    {
      value: 'yiminghe',
      label: '更新到其他系统',
    },
  ]);

  const radioValue = ref<number>(1);

  const onChange = (value: Dayjs, dateString: string) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  };

  const onOk = (value: Dayjs) => {
    console.log('onOk: ', value);
  };

  const focus = () => {
    console.log('focus');
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const upFile = () => {
    message.success({
      // class: 'custom-class',
      content: '更新成功！',
    });
  };
  onMounted(() => {});
</script>
<style lang="less" scoped>
  .change-page {
    :deep(.ant-upload-list-text-container) {
      .ant-upload-list-item {
        margin-top: 0;
        .ant-upload-list-item-name {
          // color: #333;
        }
        .anticon-paper-clip {
          position: relative;
          top: 2px;
        }
      }
    }
    :deep(.ant-select-selection-item) {
      color: #333 !important;
    }
  }
  .control {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
</style>
<style>
  /* .custom-class {
    .ant-message-notice-content {
      min-width: 600px;
      border-radius: 8px;
      background: #e7f1ff;
      border: 1px solid rgba(22, 119, 255, 0.2);
    }
    .ant-message-notice-content {
      padding-top: 5px;
      padding-bottom: 5px;
    }
    .anticon svg {
      fill: #1891ff;
    }
    .ant-message-success {
      color: rgba(0, 0, 0, 0.88);
      text-align: left;
    }
  } */
</style>
