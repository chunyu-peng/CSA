<template>
    <a-card class="audit">
      <a-spin :spinning="spinning">
        <div class="text-[#333] font-medium text-base mb-6" style="color: #C70019">审计员</div>
  
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
                <span>审计员</span>
              </td>
              <td class="p-2.5">
                <span class="centerContent" >{{ (user as any).name }}</span>
              </td>
              <td class="p-2.5">
                <span class="centerContent" >{{ showPassword }}</span>
              </td>
              <td class="p-2.5">
                <input type="checkbox" disabled="true"/>
              </td>
              <td class="p-2.5">
                <input type="checkbox" v-model="checkDown" disabled="true"/>
              </td>
              <td class="p-2.5">
                <input type="checkbox" disabled="true"/>
              </td>
            </tr>
          </table>
        </form>

        <a-divider />
        <div class="text-[#333] font-medium text-base mb-6" style="color: #C70019">下载</div>
        <div>
          <select v-model="fileSelectDown" style="color: darkgrey">
            <option value="" disabled>请选择文件</option>
            <option v-for="(file, index) in fileList" :value=index+1>{{(file as any).name}}</option>
          </select>
          &nbsp
          <button class="btn" @click="getFileList">刷新</button>
          &nbsp
          <button class="btn" @click="downloadFileCheck">下载</button>
          &nbsp
          <span v-if="fileSelectDown == ''" style="color: #C70019">{{ checkDownload }}</span>
        </div>
  
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
  
    let users = ref();

    const checkDownload = ref('');
    const checkDown = ref(true);
    const prevPwdCheck = ref('');
    const newPwdCheck = ref('');
    const rePwdCheck = ref('');
    const fileList = ref([]);
    const fileSelectDown = ref('');
    const showPassword = ref('');
    const prevPassword = ref('');
    const revisePassword = ref('');
    const reEnterPassword = ref('');
    const renderComponent = ref(true);
    const oldPwdType = ref('password');
    const revisePwdType = ref('password');
    const reEnterPwdType = ref('password');

    const handleIntervalFn = async () => {
      spinning.value = false;
    };
    const forceRender = async() => {
      renderComponent.value = false;
      await nextTick();
      renderComponent. value = true;
    };

    const userStore = useUserStore();
    const token = userStore.getToken1;
    const authHeader = token;
    const { t } = useI18n();
    const { notification } = useMessage();
    showUserInfo();
    getFileList();

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
  
    function fillTable() {
      showPassword.value = users[0].pwd;
    }

    async function getFileList() {
      const response = await axios({
        method: "POST",
        url: "cgi-bin/script/getFileInfo",
        headers: {
          "Authorization": authHeader
        }
      });
      // @ts-ignore
      fileList.value = response.data.fileNameList;
    }

    function downloadFileCheck() {
      checkDownload.value = '';
      if (fileSelectDown.value == '') {
        checkDownload.value = '请选择文件!';
        return;
      }
      checkDownload.value = '';
      Modal.confirm({
        title: '温馨提醒',
        icon: createVNode(ExclamationCircleOutlined),
        content: '确定要下载该文件吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          downloadFile();
        }
      });
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

    async function downloadFile() {
      const index = fileSelectDown.value as any - 1;
      const filename = (fileList.value[index] as any).name;
      const response = await axios({
        method: 'POST',
        url: "/cgi-bin/script/downloadFile",
        data: { file: filename },
        headers: {
          "Authorization": authHeader
        },
        responseType: 'arraybuffer'
      });
      const blob = new Blob([response.data]);
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
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
      padding-right: 1px;
    }
    select:focus {
      border: 1px solid #C70019;;
      outline: 1px solid #C70019;;
    }
    .audit {
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
  </style>
  