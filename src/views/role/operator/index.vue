<template>
  <a-card class="operater">
    <a-spin :spinning="spinning">
      <div class="text-[#333] font-medium text-base mb-6" style="color: #C70019">操作员</div>

      <a-divider />
      <div class="text-[#333] font-medium text-base mb-6" style="color: #C70019">用户账户</div>
      <form onsubmit="return false">
        <table class="w-full border-solid border-1 border-[#DBDBDB]">
          <tr>
            <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">账户类型</td>
            <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">账号</td>
            <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">密码</td>
            <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">上传</td>
            <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">下载</td>
            <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">配置</td>
          </tr>
          <tr v-for="user in users" v-if="renderComponent">
            <td class="p-2.5">
              <span>操作员</span>
            </td>
            <td class="p-2.5">
              <span class="centerContent" >{{ (user as any).name }}</span>
            </td>
            <td class="p-2.5">
              <span class="centerContent" >{{ showPassword }}</span>
            </td>
            <td class="p-2.5">
              <input type="checkbox" v-model="checkSetUp" disabled="true"/>
            </td>
            <td class="p-2.5">
              <input type="checkbox" disabled="true"/>
            </td>
            <td class="p-2.5">
              <input type="checkbox" v-model="checkSetUp" disabled="true"/>
            </td>
          </tr>
        </table>
      </form>

      <a-divider />
      <div class="text-[#333] font-medium text-base mb-6" style="color: #C70019">串口使能</div>
      <button @click="changeSerialEnable">
        <img v-if="serialEnable" src="../../../assets/images/switchon-overlay.png" />
        <img v-else src="../../../assets/images/switchoff-overlay.png" />
      </button>

      <a-divider />
      <div class="text-[#333] font-medium text-base mb-6" style="color: #C70019">软件更新</div>
      <div>
        <input
          ref="fileInput1"
          style="display: none"
          type="file"
          @change="handleFileChange($event, 1)"
        />
        <input type="text" class="uploadInput" disabled="true" v-model="fileSelectionUpApp" />
        &nbsp
        <button class="btn" @click="chooseFile1">浏览</button>
        &nbsp
        <button class="btn" @click="uploadFileCheck(1)">上传应用</button>
        &nbsp
        <span style="color: #C70019">{{ checkUploadApp }}</span>
      </div>
      <br>
      <div>
        <input
          ref="fileInput2"
          style="display: none"
          type="file"
          @change="handleFileChange($event, 2)"
        />
        <input type="text" class="uploadInput" disabled="true" v-model="fileSelectionUpLow" />
        &nbsp
        <button class="btn" @click="chooseFile2">浏览</button>
        &nbsp
        <button class="btn" @click="uploadFileCheck(2)">上传底层</button>
        &nbsp
        <span style="color: #C70019">{{ checkUploadLow }}</span>
      </div>

      <div class="overlay" v-if="uploadProgress > 0">
        <span class="progressContainer">
          <el-progress class="progress" type="circle" :percentage="uploadProgress" v-if="uploadProgress <= 99" />
          <el-progress class="progress" type="circle" :percentage="uploadProgress" v-if="uploadProgress == 100" status="success" />
          <el-progress class="progress" type="circle" :percentage="uploadProgress" v-if="uploadProgress == 404" status="exception" />
        </span>
      </div>

      <!-- <a-divider />
      <div class="text-[#333] font-medium text-base mb-6" style="color: #C70019">安全白名单</div>
      <div>
        <input
          ref="fileInput"
          style="display: none"
          type="file"
          @change="handleFileChange($event, 3)"
        />
        <input type="text" class="uploadInput" disabled="true" v-model="fileSelectionUpSet" />
        &nbsp
        <button class="btn" @click="chooseFile">浏览</button>
        &nbsp
        <button class="btn" @click="uploadFileCheck(3)">上传配置</button>
        &nbsp
        <span style="color: #C70019">{{ checkUploadSet }}</span>
      </div> -->

      <a-divider />
      <div class="text-[#333] font-medium text-base mb-6" style="color: #C70019">登录设置</div>
      <span class="flexCol">
        <span class="colItem">
          <span class="uselabel">登录失败尝试</span>
          <input class="reviseInput" type="text" v-model="failTimes" />
          <span class="symlabel">次</span>
          <button class="btn" @click="loginFailCheck">确定</button>
        </span>
        <span class="colItem">&nbsp;</span>
        <span class="colItem">
          <span class="uselabel">用户锁定时间</span>
          <input class="reviseInput" type="text" v-model="lockTimes" />
          <span class="symlabel">分</span>
          <button class="btn" @click="loginLockCheck">确定</button>
        </span>
        <span class="colItem">&nbsp;</span>
        <span class="colItem">
          <span class="uselabel">会话持续时间</span>
          <input class="reviseInput" type="text" v-model="sessionTimeout" />
          <span class="symlabel">分</span>
          <button class="btn" @click="sessionTimeCheck">确定</button>
        </span>
        <span class="colItem">&nbsp;</span>
        <span class="colItem">
          <span class="uselabel">最大会话数量</span>
          <input class="reviseInput" type="text" v-model="sessionCount" />
          <span class="symlabel">个</span>
          <button class="btn" @click="sessionCountCheck">确定</button>
        </span>
        <span class="colItem">&nbsp;</span>
        <span class="colItem">
          <span class="uselabel">登录系统提示</span>
          <input class="reviseInput" type="text" v-model="loginBanner" />
          <span class="symlabel">🚄</span>
          <button class="btn" @click="loginBannerCheck">确定</button>
        </span>
        <span class="colItem">&nbsp;</span>
        <span class="colItem">
          <span class="uselabel">CPU最大负荷</span>
          <input class="reviseInput" type="text" v-model="cpuLoad" />
          <span class="symlabel">%</span>
          <button class="btn" @click="cpuCheck">确定</button>
        </span>
        <span class="colItem">&nbsp;</span>
        <span class="colItem">
          <span class="uselabel">内存最大容量</span>
          <input class="reviseInput" type="text" v-model="memLoad" />
          <span class="symlabel">B</span>
          <button class="btn" @click="memCheck">确定</button>
        </span>
      </span>

      <a-divider />
      <div class="text-[#333] font-medium text-base mb-6" style="color: #C70019">修改密码</div>
      <form onsubmit="return false">
        <span class="flexRow">
          <span class="flexMember">
            <span class="flexMemberuse">
              <button class="uselabel" @click="showOdPwd">旧密码</button>
              <input class="reviseInput" :type="oldPwdType" v-model="prevPassword" />
            </span>
            <span style="color: #C70019">{{ prevPwdCheck }}</span>
          </span>
          <span class="flexMember">
            <span class="flexMemberuse">
              <button class="uselabel" @click="showRevisePwd">新密码</button>
              <input class="reviseInput" :type="revisePwdType" v-model="revisePassword" />
            </span>
            <span style="color: #C70019">{{ newPwdCheck }}</span>
          </span>
          <span class="flexMember">
            <span class="flexMemberuse">
              <button class="uselabel" @click="showReEnterPwd">重新输入新密码</button>
              <input class="reviseInput" :type="reEnterPwdType" v-model="reEnterPassword" />
            </span>
            <span style="color: #C70019">{{ rePwdCheck }}</span>
          </span>
        </span>
        <br><br>
        <span class="flexRow">
          <span class="flexSpace"></span>
          <span class="flexMember">
            <button type="submit" class="check" @click="changePasswordCheck"></button>
            <span style="color: #C70019">修改</span>
          </span>
          <span class="flexMember">
            <button class="clear" @click="clearAll"></button>
            <span style="color: #C70019">清空</span>
          </span>
          <span class="flexSpace"></span>
        </span>
        <br><br>
        <span class="flexRow">
          <div style="color: #C70019">密码长度至少8个字符, 且字符中需包含大小写字母、数字和特殊字符</div>
        </span>
      </form>
    </a-spin>
  </a-card>
</template>
<script lang="ts" setup>
  import { onMounted, ref, nextTick, onUnmounted, createVNode } from 'vue';
  import pageRefreshCycle from '/@/store/modules/pageRefreshCycle';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import { genSaltSync, hashSync } from 'bcrypt-ts';
  import { Modal } from 'ant-design-vue';
  import ExclamationCircleOutlined from '@ant-design/icons-vue/lib/icons/ExclamationCircleOutlined';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';

  const route = useRoute();
  const spinning = ref(true);
  const uploadProgress = ref(0);
  let users = ref();
  const failTimes = ref('');
  const lockTimes = ref('');
  const sessionTimeout = ref('');
  const sessionCount = ref('');
  const cpuLoad = ref('');
  const memLoad = ref('');
  const prevPwdCheck = ref('');
  const newPwdCheck = ref('');
  const rePwdCheck = ref('');
  const showPassword = ref('');
  const prevPassword = ref('');
  const revisePassword = ref('');
  const reEnterPassword = ref('');
  const renderComponent = ref(true);
  const checkSetUp = ref(true);
  const checkUploadApp = ref('');
  const checkUploadLow = ref('');
  const checkUploadSet = ref('');
  const fileInput1 = ref(null);
  const fileInput2 = ref(null);
  const file = ref(null);
  const fileSelectionUpApp = ref('');
  const fileSelectionUpLow = ref('');
  const fileSelectionUpSet = ref('');
  const oldPwdType = ref('password');
  const revisePwdType = ref('password');
  const reEnterPwdType = ref('password');
  const serialEnable = ref(true);

  const handleIntervalFn = async () => {
    spinning.value = false;
  };
  const forceRender = async() => {
    renderComponent.value = false;
    await nextTick();
    renderComponent.value = true;
  };

  const userStore = useUserStore();
  const loginBanner = ref('');
  const token = userStore.getToken1;
  const authHeader = token;
  const { t } = useI18n();
  const { notification } = useMessage();
  showUserInfo();
  getUserSetting();

  async function getUserSetting() {
    const result = await axios.get("/cgi-bin/script/userSetting");
    failTimes.value = result.data.logErrLockedCnt;
    lockTimes.value = result.data.logErrLockedTime;
    loginBanner.value = result.data.welcomeInfo;
    sessionTimeout.value = result.data.logValidMinTime;
    sessionCount.value = result.data.maxSessionCnt;
    cpuLoad.value = result.data.maxCpuLoad;
    memLoad.value = result.data.maxMemLoad;
    serialEnable.value = result.data.isSerialOn;
  }

  async function changeSerialEnable() {
    let formData = {
      token: token
    };
    const result =  await axios({
      method: "POST",
      url: "/cgi-bin/script/serialEnable",
      data: formData
    });
    const res = result.data.status;
    if (res == "OK") {
      serialEnable.value = !serialEnable.value;
      notification.success({
        message: t('sys.api.operationSucceed'),
        description: `串口状态更改成功!`,
        duration: 3,
      });
    }
    else {
      notification.error({
        message: t('sys.api.operationFailed'),
        description: '串口状态更改失败!',
        duration: 3,
      });
    }
  }

  function showOdPwd() {
      if (oldPwdType.value == 'password') {
        oldPwdType.value = 'text';
      }
      else if (oldPwdType.value == 'text') {
        oldPwdType.value = 'password';
      }
    }

    function showRevisePwd() {
      if (revisePwdType.value == 'password') {
        revisePwdType.value = 'text';
      }
      else if (revisePwdType.value == 'text') {
        revisePwdType.value = 'password';
      }
    }

    function showReEnterPwd() {
      if (reEnterPwdType.value == 'password') {
        reEnterPwdType.value = 'text';
      }
      else if (reEnterPwdType.value == 'text') {
        reEnterPwdType.value = 'password';
      }
    }

  function loginFailCheck() {
    const truncatedFailTimes = Math.trunc(failTimes.value as any);
    const numberFailTimes = Number(failTimes.value);
    if (numberFailTimes < 1 || numberFailTimes != truncatedFailTimes) {
      notification.error({
        message: t('sys.api.operationFailed'),
        description: '修改失败, 输入必须是正整数!',
        duration: 3,
      });
      return;
    }
    Modal.confirm({
      title: '温馨提醒',
      icon: createVNode(ExclamationCircleOutlined),
      content: '确定修改登录失败尝试吗?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        loginFailSet();
      }
    });
  }

  async function loginFailSet() {
    const result =  await axios({
      method: "POST",
      url: "/cgi-bin/script/userSetting",
      headers: {
        "Authorization": authHeader
      },
      data: { "logErrLockedCnt": failTimes.value }
    });
    if (result.data.status == "OK") {
      notification.success({
        message: t('sys.api.operationSucceed'),
        description: `修改成功!`,
        duration: 3,
      });
    }
    else {
      notification.error({
        message: t('sys.api.operationFailed'),
        description: '修改失败!',
        duration: 3,
      });
    }
  }

  function loginLockCheck() {
    const truncatedLockTimes = Math.trunc(lockTimes.value as any);
    const numberLockTimes = Number(lockTimes.value);
    if (numberLockTimes < 1 || numberLockTimes != truncatedLockTimes) {
      notification.error({
        message: t('sys.api.operationFailed'),
        description: '修改失败, 输入必须是正整数!',
        duration: 3,
      });
      return;
    }
    Modal.confirm({
      title: '温馨提醒',
      icon: createVNode(ExclamationCircleOutlined),
      content: '确定修改用户锁定时间吗?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        loginLockSet();
      }
    });
  }

  async function loginLockSet() {
    const result =  await axios({
      method: "POST",
      url: "/cgi-bin/script/userSetting",
      headers: {
        "Authorization": authHeader
      },
      data: { "logErrLockedTime": lockTimes.value }
    });
    if (result.data.status == "OK") {
      notification.success({
        message: t('sys.api.operationSucceed'),
        description: `修改成功!`,
        duration: 3,
      });
    }
    else {
      notification.error({
        message: t('sys.api.operationFailed'),
        description: '修改失败!',
        duration: 3,
      });
    }
  }

  function sessionTimeCheck() {
    const truncatedSessionTimeout = Math.trunc(sessionTimeout.value as any);
    const numberSessionTimeout = Number(sessionTimeout.value);
    if (numberSessionTimeout < 1 || numberSessionTimeout > 60 || numberSessionTimeout != truncatedSessionTimeout) {
      notification.error({
        message: t('sys.api.operationFailed'),
        description: '修改失败, 输入必须是范围1到60的正整数!',
        duration: 3,
      });
      return;
    }
    Modal.confirm({
      title: '温馨提醒',
      icon: createVNode(ExclamationCircleOutlined),
      content: '确定修改会话持续时间吗?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        sessionTimeSet();
      }
    });
  }

  async function sessionTimeSet() {
    const result =  await axios({
      method: "POST",
      url: "/cgi-bin/script/userSetting",
      headers: {
        "Authorization": authHeader
      },
      data: { "logValidMinTime": sessionTimeout.value }
    });
    if (result.data.status == "OK") {
      notification.success({
        message: t('sys.api.operationSucceed'),
        description: `修改成功!`,
        duration: 3,
      });
    }
    else {
      notification.error({
        message: t('sys.api.operationFailed'),
        description: '修改失败!',
        duration: 3,
      });
    }
  }

  function sessionCountCheck() {
    const truncatedSessionCount = Math.trunc(sessionCount.value as any);
    const numberSessionCount = Number(sessionCount.value);
    if (numberSessionCount < 1 || numberSessionCount > 5 || numberSessionCount != truncatedSessionCount) {
      notification.error({
        message: t('sys.api.operationFailed'),
        description: '修改失败, 输入必须是范围1到5的正整数!',
        duration: 3,
      });
      return;
    }
    Modal.confirm({
      title: '温馨提醒',
      icon: createVNode(ExclamationCircleOutlined),
      content: '确定修改最大会话数量吗?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        sessionCountSet();
      }
    });
  }

  async function sessionCountSet() {
    const result =  await axios({
      method: "POST",
      url: "/cgi-bin/script/userSetting",
      headers: {
        "Authorization": authHeader
      },
      data: { "maxSessionCnt": sessionCount.value }
    });
    if (result.data.status == "OK") {
      notification.success({
        message: t('sys.api.operationSucceed'),
        description: `修改成功!`,
        duration: 3,
      });
    }
    else {
      notification.error({
        message: t('sys.api.operationFailed'),
        description: '修改失败!',
        duration: 3,
      });
    }
  }

  function loginBannerCheck() {
    if (loginBanner.value.length == 0 || loginBanner.value.length > 64) {
      notification.error({
        message: t('sys.api.operationFailed'),
        description: '修改失败, 输入不能为空, 且字数必须小于64!',
        duration: 3,
      });
      return;
    }
    Modal.confirm({
      title: '温馨提醒',
      icon: createVNode(ExclamationCircleOutlined),
      content: '确定修改登录系统提示吗?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        loginBannerSet();
      }
    });
  }

  async function loginBannerSet() {
    userStore.setBanner(loginBanner.value);
    const result =  await axios({
      method: "POST",
      url: "/cgi-bin/script/userSetting",
      headers: {
        "Authorization": authHeader
      },
      data: { "welcomeInfo": loginBanner.value }
    });
    if (result.data.status == "OK") {
      notification.success({
        message: t('sys.api.operationSucceed'),
        description: `修改成功!`,
        duration: 3,
      });
    }
    else {
      notification.error({
        message: t('sys.api.operationFailed'),
        description: '修改失败!',
        duration: 3,
      });
    }
  }

  function cpuCheck() {
    const truncatedCpuLoad = Math.trunc(cpuLoad.value as any);
    const numberCpuLoad = Number(cpuLoad.value);
    if (numberCpuLoad < 20 || numberCpuLoad > 100 || numberCpuLoad != truncatedCpuLoad) {
      notification.error({
        message: t('sys.api.operationFailed'),
        description: '修改失败, 输入必须是范围20到100的正整数!',
        duration: 3,
      });
      return;
    }
    Modal.confirm({
      title: '温馨提醒',
      icon: createVNode(ExclamationCircleOutlined),
      content: '确定修改CPU最大负荷吗?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        cpuSet();
      }
    });
  }

  async function cpuSet() {
    const result =  await axios({
      method: "POST",
      url: "/cgi-bin/script/userSetting",
      headers: {
        "Authorization": authHeader
      },
      data: { "maxCpuLoad": cpuLoad.value }
    });
    if (result.data.status == "OK") {
      notification.success({
        message: t('sys.api.operationSucceed'),
        description: `修改成功!`,
        duration: 3,
      });
    }
    else {
      notification.error({
        message: t('sys.api.operationFailed'),
        description: '修改失败!',
        duration: 3,
      });
    }
  }

  function memCheck() {
    const truncatedMemLoad = Math.trunc(memLoad.value as any);
    const numberMemLoad = Number(memLoad.value);
    if (numberMemLoad < 2000 || numberMemLoad > 10000000 || numberMemLoad != truncatedMemLoad) {
      notification.error({
        message: t('sys.api.operationFailed'),
        description: '修改失败, 输入必须是范围2K到10M的正整数!',
        duration: 3,
      });
      return;
    }
    Modal.confirm({
      title: '温馨提醒',
      icon: createVNode(ExclamationCircleOutlined),
      content: '确定修改内存最大容量吗?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        memSet();
      }
    });
  }

  async function memSet() {
    const result =  await axios({
      method: "POST",
      url: "/cgi-bin/script/userSetting",
      headers: {
        "Authorization": authHeader
      },
      data: { "maxMemLoad": memLoad.value }
    });
    if (result.data.status == "OK") {
      notification.success({
        message: t('sys.api.operationSucceed'),
        description: `修改成功!`,
        duration: 3,
      });
    }
    else {
      notification.error({
        message: t('sys.api.operationFailed'),
        description: '修改失败!',
        duration: 3,
      });
    }
  }

  async function showUserInfo() {
    const result =  await axios({
      method: "POST",
      url: "/cgi-bin/script/getUsrInfo",
      headers: {
        "Authorization": authHeader
      }
    });
    users = result.data.usrInfo;
    // console.log(result.data);
    fillTable();
  }

  function chooseFile1() {
    // @ts-ignore
    fileInput1.value.click();
  }

  function chooseFile2() {
    // @ts-ignore
    fileInput2.value.click();
  }

  function handleFileChange(event: any, number: any) {
    const files = event.target.files;
    if (files.length > 0) {
      file.value = files[0];
      if (number == 1) {
        fileSelectionUpApp.value = files[0].name;
        checkUploadApp.value = '';
      }
      else if (number == 2) {
        fileSelectionUpLow.value = files[0].name;
        checkUploadLow.value = '';
      }
      else {
        fileSelectionUpSet.value = files[0].name;
        checkUploadSet.value = '';
      }
    }
    else {
      file.value = null;
      if (number == 1) fileSelectionUpApp.value = '';
      else if (number == 2)fileSelectionUpLow.value = '';
      else fileSelectionUpSet.value = '';
    }
  }

  function uploadFileCheck(number: any) {
    if (number == 1 && fileSelectionUpApp.value == '') {
      checkUploadApp.value = "请选择文件!";
      return;
    }
    else if (number == 2 && fileSelectionUpLow.value == '') {
      checkUploadLow.value = "请选择文件!";
      return;
    }
    else if (number == 3 && fileSelectionUpSet.value == '') {
      checkUploadSet.value = "请选择文件!";
      return;
    }
    if (number == 1) checkUploadApp.value = '';
    if (number == 2) checkUploadLow.value = '';
    if (number == 3) checkUploadSet.value = '';
    if (number == 1 && fileSelectionUpApp.value != "APP.bin") {
      notification.error({
        message: t('sys.api.operationFailed'),
        description: `文件名应为APP.bin`,
        duration: 3,
      });
      return;
    }
    else if (number == 2 && fileSelectionUpLow.value != "PU520.bin") {
      notification.error({
        message: t('sys.api.operationFailed'),
        description: `文件名应为PU520.bin`,
        duration: 3,
      });
      return;
    }
    Modal.confirm({
      title: '温馨提醒',
      icon: createVNode(ExclamationCircleOutlined),
      content: '确定要上传该文件吗?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        uploadFile(number);
      }
    });
  }

  function uploadFile(number: any) {
    let urlInfo = '';
    let urlFile = '';
    if (number == 1) {
      urlInfo = "/cgi-bin/script/uploadAppInfo";
      urlFile = "/cgi-bin/script/uploadAppFile";
    }
    else if (number == 2) {
      urlInfo = "/cgi-bin/script/uploadFirmwareInfo";
      urlFile = "/cgi-bin/script/uploadFirmwareFile";
    }
    else {
      urlInfo = "/cgi-bin/script/uploadFile";
      urlFile = "/cgi-bin/script/uploadFile";
    }
    const reader = new FileReader();
    //let fileContent: ArrayBuffer;
    reader.onload = async (e) => {
      const fileContent = e.target?.result as any;
      let fileArray = new Uint8Array(fileContent);
      // @ts-ignore
      const fileSize = file.value.size;
      let packNum = 0;
      const bytes = 20480;
      let packList = [];
      let packSizeList = [];
      let tmp = Math.trunc(fileSize / bytes);
      if (tmp == 0) {
        packNum = 1;
      }
      else {
        packNum = tmp;
        if (fileSize % bytes > 0) {
          packNum++;
        }
      }
      let startOffset = 0;
      for (let index = 0; index < packNum; index++) {
        let endOffset = startOffset + bytes;
        if (endOffset > fileSize) {
          endOffset = startOffset + fileSize % bytes;
        }
        // @ts-ignore
        packList.push(fileArray.slice(startOffset, endOffset));
        // @ts-ignore
        packSizeList.push(endOffset - startOffset);
        startOffset += bytes;
      }
      let result: any;
      result = await axios({
        method: "POST",
        url: urlInfo,
        params: {
          // @ts-ignore
          fileName: file.value.name,
          // @ts-ignore
          fileSize: fileSize,
          packNum: packNum
        },
        headers: {
//          "Content-Type": "application/octet-stream; charset=utf-8",
          "Authorization": authHeader
        }
      });
      result = result.data.status;
      if (result == "START") {
        let packIndex = 0;
        let retry = 0;
        // progress.value = true;
        notification.success({
          message: t('sys.api.operationSucceed'),
          description: `开始上传, 请勿刷新或关闭页面!`,
          duration: 3,
        });
        userStore.setUploadFlag(1);
        //startOffset = 0;
        while (!(result == "FINISHED")) {
          //let endOffset = startOffset + bytes;
          //if (endOffset > fileSize) {
          //  endOffset = startOffset + fileSize % bytes;
          //}
          //let fileArray = new Uint8Array(fileContent)
          //console.log(fileArray);
          //let pack = fileArray.slice(startOffset, endOffset);
          //console.log(pack);
          //let packSend = [pack];
          //console.log(packSend);
          //startOffset += bytes;
          while (!(result == "RECV")) {
            if (retry < 5) {
              result = await axios({
                method: "POST",
                url: urlFile,
                params: {
                  packSize: packSizeList[packIndex],
                  packIndex: packIndex
                },
                data: packList[packIndex],
                headers: {
                  // "Content-Type": "application/octet-stream; charset=utf-8",
                  "Authorization": authHeader
                },
                timeout: 60 * 1000
              });
              await new Promise(resolve => setTimeout(resolve, 100));
              result = result.data.status;
              if (result == "NOAUTH") {
                if (number == 1) {
                  notification.error({
                    message: t('sys.api.operationFailed'),
                    description: `应用软件验签不通过!`,
                    duration: 3,
                  });
                }
                if (number == 2) {
                  notification.error({
                    message: t('sys.api.operationFailed'),
                    description: `底层软件验签不通过!`,
                    duration: 3,
                  });
                }
                uploadProgress.value = 404;
                await new Promise(resolve => setTimeout(resolve, 3000));
                uploadProgress.value = 0;
                userStore.setUploadFlag(0);
                return;
              }
              if (result == "FINISHED") {
                if (number == 1) {
                  notification.success({
                    message: t('sys.api.operationSucceed'),
                    description: `应用软件更新成功!`,
                    duration: 3,
                  });
                }
                if (number == 2) {
                  notification.success({
                    message: t('sys.api.operationSucceed'),
                    description: `底层软件更新成功!`,
                    duration: 3,
                  });
                }
                uploadProgress.value = 100;
                await new Promise(resolve => setTimeout(resolve, 3000));
                uploadProgress.value = 0;
                userStore.setUploadFlag(0);
                return;
              }
              retry++;
            }
            else {
              if (number == 1) {
                notification.error({
                  message: t('sys.api.operationFailed'),
                  description: '应用软件更新失败!',
                  duration: 3,
                });
              }
              if (number == 2) {
                notification.error({
                  message: t('sys.api.operationFailed'),
                  description: '底层软件更新失败!',
                  duration: 3,
                });
              }
              uploadProgress.value = 404;
              await new Promise(resolve => setTimeout(resolve, 3000));
              uploadProgress.value = 0;
              userStore.setUploadFlag(0);
              return;
            }
          }
          if (result == "RECV") {
            uploadProgress.value = Math.round(((packIndex + 1) / packNum) * 100);
            result = "START";
          }
          retry = 0;
          packIndex++;
        }
      }
      else {
        if (number == 1) {
          notification.error({
            message: t('sys.api.operationFailed'),
            description: '应用软件更新失败!',
            duration: 3,
          });
        }
        if (number == 2) {
          notification.error({
            message: t('sys.api.operationFailed'),
            description: '底层软件更新失败!',
            duration: 3,
          });
        }
        uploadProgress.value = 404;
        await new Promise(resolve => setTimeout(resolve, 3000));
        uploadProgress.value = 0;
        userStore.setUploadFlag(0);
      }
    };
    // @ts-ignore
    reader.readAsArrayBuffer(file.value);
  }

  function fillTable() {
    showPassword.value = users[0].pwd;
  }

  function clearForm() {
    prevPassword.value = '';
    revisePassword.value = '';
    reEnterPassword.value = '';
  }

  function clearCheck() {
    prevPwdCheck.value = '';
    newPwdCheck.value = '';
    rePwdCheck.value = '';
  }

  function clearAll() {
    clearForm();
    clearCheck();
  }

  function changePasswordCheck() {
    clearCheck();
    if (prevPassword.value == '') {
      prevPwdCheck.value = "请输入旧密码!";
      return;
    }
    if (revisePassword.value == '') {
      newPwdCheck.value = "请输入新密码!";
      return;
    }
    if (reEnterPassword.value == '') {
      rePwdCheck.value = "请重新输入新密码!";
      return;
    }
    let getSalt = users[0].pwd.substr(0, 29);
    let newEncryptedPassword = hashSync(prevPassword.value, getSalt);
    if (newEncryptedPassword != users[0].pwd) {
      prevPwdCheck.value = "旧密码错误!";
      return;
    }
    if (prevPassword.value == revisePassword.value) {
      newPwdCheck.value = "新旧密码相同!";
      return;
    }
    if (revisePassword.value != reEnterPassword.value) {
      rePwdCheck.value = "输入密码不一致!";
      return;
    }
    let validPwdFilter = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*-.?])[A-Za-z0-9!@#$%^&*-.?]{8,}/;
    if (!validPwdFilter.test(revisePassword.value)) {
      newPwdCheck.value = "密码强度不足!";
      return;
    }
    clearCheck();
      Modal.confirm({
        title: '温馨提醒',
        icon: createVNode(ExclamationCircleOutlined),
        content: '确定要修改密码吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          changePassword();
        }
      });
    }

  async function changePassword() {
    let formData = {};
    const salt = genSaltSync(10);
    const encryptedPassword = hashSync(revisePassword.value, salt);
    formData = {
      user: users[0].name,
      newName: users[0].name,
      pwd: encryptedPassword,
      role: users[0].role,
      permission: users[0].permission,
      isEnable: users[0].isEnable
    };
    let response = await axios({
      method: "POST",
      url: "/cgi-bin/script/updateUsr",
      data: formData,
      headers: {
        "Authorization": authHeader
      },
    });
    if (response.data.status == "OK") {
      clearForm();
      clearCheck();
      response = await axios({
        method: "POST",
        url: "/cgi-bin/script/getUsrInfo",
        headers: {
          "Authorization": authHeader
        },
      });
      users = response.data.usrInfo;
      fillTable();
      forceRender();
      notification.success({
        message: t('sys.api.operationSucceed'),
        description: `密码修改成功!`,
        duration: 3,
      });
    }
    else {
      notification.error({
        message: t('sys.api.operationFailed'),
        description: '密码修改失败!',
        duration: 3,
      });
    }
  }

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
  .flexMemberuse {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .centerContent {
    text-align: center !Important;
  }
  .btn {
    border: 2px solid #C70019;
    border-radius: 20px;
    color: #C70019;
    padding-top: 2px;
    padding-bottom: 2px;
    padding-left: 30px;
    padding-right: 30px;
  }
  .btn:focus {
    border: 2px solid #C70019;
  }
  .btn:active {
    background-color: whitesmoke;
    border: 2px solid #C70019;
    transform: translateY(2px);
  }
  .reviseInput {
    border: 1px solid #dbdbdb;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    padding-top: 2px;
    padding-bottom: 2px;
  }
  .reviseInput:focus {
    outline: none;
    border: 1px solid grey;
  }
  input[type="text"] {
    padding-left: 5px;
  }
  input[type="password"] {
    padding-left: 5px;
  }
  .uploadInput {
    border: 1px solid #C70019;
    border-radius: 3px;
    padding-top: 2px;
    padding-bottom: 2px;
  }
  .uploadInput:focus {
    outline: none;
    border: 1px solid #C70019;
  }
  select {
    border: 1px solid #C70019;
    border-radius: 3px;
    padding-top: 3px;
    padding-bottom: 3px;
    padding-left: 1px;
    padding-right: 62px;
  }
  select:focus {
    border: 1px solid #C70019;;
    outline: 1px solid #C70019;;
  }
  .operater {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  .symlabel {
    color: grey;
    padding-top: 3.1px;
    padding-bottom: 3.1px;
    padding-left: 10px;
    width: 50px;
    flex-shrink: 0;
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
.check:active {
  transform: translateY(2px);
}
.clear:active {
  transform: translateY(2px);
}
.flexCol {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.colItem {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.overlay {
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(219, 219, 219, 0.8);
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.progressContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}
.progress {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
