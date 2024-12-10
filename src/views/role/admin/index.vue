<template>
  <a-card class="admin">
    <a-spin :spinning="spinning">
      <div style="display: flex; justify-content: flex-start; flex-flow: row; align-items: center;">
        <div class="text-[#333] font-medium text-base mb-6" style="display: flex; color: #C70019">用户管理员</div>
        <span style="display: flex; flex-grow: 1;"></span>
        <img class="destroy" style="display: flex;" src="../../../assets/images/destroy.png" alt="" @click="destroyDataCheck()" />
      </div>

      <a-divider />
      <div class="text-[#333] font-medium text-base mb-6" style="color: #C70019">用户账户</div>
      <form onsubmit="return false">
        <table class="w-full border-solid border-1 border-[#DBDBDB]">
          <tr>
            <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">ID</td>
            <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">账户类型</td>
            <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">账号</td>
            <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">密码</td>
            <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">激活</td>
            <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">上传</td>
            <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">下载</td>
            <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">配置</td>
            <td class="p-2.5 bg-[#ECEEF1]" style="color:white; background-color: grey;">操作</td>
          </tr>
          <tr v-for="(user, index) in users" v-if="renderComponent">
            <td class="p-2.5">{{ (user as any).id }}</td>
            <td class="p-2.5">
              <span v-if="roleSelect[index] == 1">用户管理员</span>
              <select v-else class="centerContent" v-model="roleSelect[index]">
                <option value="2">审计员</option>
                <option value="3">操作员</option>
              </select>
            </td>
            <td class="p-2.5">
              <input v-model="reviseAccount[index]" class="reviseInput" />
            </td>
            <td class="p-2.5">
              <input v-model="revisePassword[index]" class="reviseInput" />
            </td>
            <td class="p-2.5">
              <span class="centerCheck">
                <button @click="changeEnable(index)">
                  <img v-if="roleSelect[index] == 1" src="../../../assets/images/switchon-overlay.png" />
                  <img v-else-if="enableCheck[index]" src="../../../assets/images/switchon-overlay.png"  />
                  <img v-else src="../../../assets/images/switchoff-overlay.png" />
                </button>
              </span>
            </td>
            <td class="p-2.5">
              <input type="checkbox" v-model="checkup[index]" disabled="true"/>
            </td>
            <td class="p-2.5">
              <input type="checkbox" v-model="checkdown[index]" disabled="true"/>
            </td>
            <td class="p-2.5">
              <input type="checkbox" v-model="checkset[index]" disabled="true"/>
            </td>
            <td class="p-2.5">
              <span class="flexRow">
                <span class="flexMember">
                  <button class="btn" type="submit" @click="reviseUserCheck(index)">修改</button>
                </span>
                <span class="flexMember" v-if="roleSelect[index] != 1">
                  <button class="btn" type="submit" @click="deleteUserCheck(index)">删除</button>
                </span>
              </span>
            </td>
          </tr>
        </table>
      </form>

      <a-divider />
      <div class="text-[#333] font-medium text-base mb-6" style="color: #C70019">创建账户</div>
      <form onsubmit="return false">
        <span class="flexRow">
          <span class="flexMember">
            <span class="flexMemberuse">
              <span class="uselabel">账户类型</span>
              <select class="selectInput" v-model="createSelect" id="role" style="color: darkgrey">
                <option value="" disabled>请选择角色</option>
                <option value="2">审计员</option>
                <option value="3">操作员</option>
              </select>
            </span>
            <span style="color: #C70019">{{ checkSelect }}</span>
          </span>
          <span class="flexMember">
            <span class="flexMemberuse">
              <span class="uselabel">账号</span>
              <input class="createInput" type="text" v-model="createAccount" />
            </span>
            <span style="color: #C70019">{{ checkAccount }}</span>
          </span>
          <span class="flexMember">
            <span class="flexMemberuse">
              <button class="uselabel" @click="showCreatePwd">密码</button>
              <input class="createInput" :type="createPwdType" v-model="createPassword" />
            </span>
            <span style="color: #C70019">{{ checkPassword }}</span>
          </span>
          <span class="flexMember">
            <span class="flexMemberuse">
              <button class="uselabel" @click="showReEnterPwd">重新输入密码</button>
              <input class="createInput" :type="reEnterPwdType" v-model="reEnterPassword" />
            </span>
            <span style="color: #C70019">{{ checkRePassword }}</span>
          </span>
        </span>
        <br><br>
        <span class="flexRow">
          <span class="flexSpace"></span>
          <span class="flexMember">
            <button type="submit" class="check" @click="createUserCheck"></button>
            <span style="color: #C70019">创建</span>
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
  const checkup = ref([]);
  const checkdown = ref([]);
  const checkset = ref([]);
  const checkSelect = ref('');
  const checkAccount = ref('');
  const checkPassword = ref('');
  const checkRePassword = ref('');
  const createSelect = ref('');
  const roleSelect = ref([]);
  const createAccount= ref('');
  const createPassword = ref('');
  const reEnterPassword = ref('');
  const enableCheck = ref([]);
  const reviseAccount = ref([]);
  const revisePassword = ref([]);
  const renderComponent = ref(true);
  const createPwdType = ref('password');
  const reEnterPwdType = ref('password');
  const handleIntervalFn = async () => {
    spinning.value = false;
  };
  const forceRender = async() => {
    renderComponent.value = false;
    await nextTick();
    renderComponent.value = true;
  };

  const userStore = useUserStore();
  const token = userStore.getToken1;
  const authHeader = token;
  const account = userStore.account;
  const { t } = useI18n();
  const { notification } = useMessage();
  showUserInfo();

  function showCreatePwd() {
    if (createPwdType.value == 'password') {
      createPwdType.value = 'text';
    }
    else if (createPwdType.value == 'text') {
      createPwdType.value = 'password';
    }
  }

  function destroyDataCheck() {
    Modal.confirm({
      title: '温馨提醒',
      icon: createVNode(ExclamationCircleOutlined),
      content: '确定要销毁数据吗?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        destroyData();
      }
    });
  }

  async function destroyData() {
    let formData = {
      token: token
    };
    const result =  await axios({
      method: "POST",
      url: "/cgi-bin/script/destroyData",
      data: formData
    });
    const res = result.data.status;
    if (res == "OK") {
      notification.success({
        message: t('sys.api.operationSucceed'),
        description: `数据销毁成功!`,
        duration: 3,
      });
    }
    else {
      notification.error({
        message: t('sys.api.operationFailed'),
        description: '数据销毁失败!',
        duration: 3,
      });
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

  function changeEnable(index: any) {
    // @ts-ignore
    enableCheck.value[index] = !enableCheck.value[index];
  }

  function fillTable() {
    for (let i = 0; i < (users as any).length; i++) {
      // @ts-ignore
      roleSelect.value[i] = users[i].role;
      // @ts-ignore
      enableCheck.value[i] = users[i].isEnable == 0;
      // @ts-ignore
      reviseAccount.value[i] = users[i].name;
      // @ts-ignore
      revisePassword.value[i] = users[i].pwd;
      // @ts-ignore
      checkup.value[i] = users[i].role == 3;
      // @ts-ignore
      checkdown.value[i] = users[i].role == 2;
      // @ts-ignore
      checkset.value[i] = users[i].role == 3;
    }
  }

  function clearForm() {
    createSelect.value = '';
    createAccount.value = '';
    createPassword.value = '';
    reEnterPassword.value = '';
  }

  function clearCheck() {
    checkSelect.value = '';
    checkAccount.value = '';
    checkPassword.value = '';
    checkRePassword.value = '';
  }

  function clearAll() {
    clearForm();
    clearCheck();
  }

  function createUserCheck() {
    clearCheck();
    if (createSelect.value == '') {
      checkSelect.value = "请选择角色!";
      return;
    }
    if (createAccount.value == '') {
      checkAccount.value = "请输入账号!";
      return;
    }
    if (createPassword.value == '') {
      checkPassword.value = "请输入密码!";
      return;
    }
    if (reEnterPassword.value == '') {
      checkRePassword.value = "请重新输入密码!";
      return;
    }
    let validAccountFilter = /^[0-9A-Za-z]{1,32}$/;
    let reg = new RegExp(validAccountFilter);
    if (!reg.test(createAccount.value)) {
      checkAccount.value = "账号含有非法字符或超出长度!";
      return;
    }
    let validPwdFilter = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*-.?])[A-Za-z0-9!@#$%^&*-.?]{8,32}/;
    if (!validPwdFilter.test(createPassword.value) || createPassword.value.length < 8 || createPassword.value.length > 32) {
      checkPassword.value = "密码强度不足或超出长度!";
      return;
    }
    if (createPassword.value != reEnterPassword.value) {
      checkRePassword.value = "输入密码不一致!";
      return;
    }
    clearCheck();
    Modal.confirm({
      title: '温馨提醒',
      icon: createVNode(ExclamationCircleOutlined),
      content: '确定要创建该账户吗?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        createUser();
      }
    });
  }

  async function createUser() {
    const salt = genSaltSync(10);
    const encryptedPassword = hashSync(createPassword.value, salt);
    // console.log(encryptedPassword);
    let formData = {
      role: parseInt(createSelect.value),
      user: createAccount.value,
      pwd: encryptedPassword,
    };
    // console.log('formData.pwd: ', formData.pwd);
    let response = await axios({
      method: "POST",
      url: "/cgi-bin/script/addUsr",
      data: formData,
      headers: {
        "Authorization": authHeader
      }
    });
    if (response.data.status == "OK") {
      clearForm();
      clearCheck();
      response = await axios({
        method: "POST",
        url: "/cgi-bin/script/getUsrInfo",
        headers: {
          "Authorization": authHeader
        }
      });
      users = response.data.usrInfo;
      fillTable();
      forceRender();
      notification.success({
        message: t('sys.api.operationSucceed'),
        description: `账户创建成功!`,
        duration: 3,
      });
    }
    else {
      notification.error({
        message: t('sys.api.operationFailed'),
        description: '账户创建失败!',
        duration: 3,
      });
    }
  }

  function reviseUserCheck(index: any) {
    Modal.confirm({
      title: '温馨提醒',
      icon: createVNode(ExclamationCircleOutlined),
      content: '确定要修改该账户吗?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        reviseUser(index);
      }
    });
  }

  async function reviseUser(index: any) {
    let formData = {
      user: users[index].name,
      newName: reviseAccount.value[index],
      role: parseInt(roleSelect.value[index]),
      isEnable: parseInt(enableCheck.value[index] ? 0 : 1),
      permission: 1,
    };
    if (formData.user != formData.newName) {
      let validAccountFilter = /^[0-9A-Za-z]{1,32}$/;
      let reg = new RegExp(validAccountFilter);
      if (!reg.test(formData.newName)) {
        notification.error({
          message: t('sys.api.operationFailed'),
          description: '账号含有非法字符或超出长度!',
          duration: 3,
        });
        fillTable();
        forceRender();
        return;
      }
    }
    if (revisePassword.value[index] == users[index].pwd) {
      // @ts-ignore
      formData.pwd = users[index].pwd;
    }
    else {
      let validPwdFilter = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*-.?])[A-Za-z0-9!@#$%^&*-.?]{8,32}/;
      if (!validPwdFilter.test(revisePassword.value[index]) || (revisePassword.value[index] as any).length < 8 || (revisePassword.value[index] as any).length > 32) {
        notification.error({
          message: t('sys.api.operationFailed'),
          description: '密码强度不足!',
          duration: 3,
        });
        fillTable();
        forceRender();
        return;
      }
      const salt = genSaltSync(10);
      const encryptedPassword = hashSync(revisePassword.value[index], salt);
      // @ts-ignore
      formData.pwd = encryptedPassword;
    }
    let response = await axios({
      method: "POST",
      url: "/cgi-bin/script/updateUsr",
      data: formData,
      headers: {
        "Authorization": authHeader
      }
    });
    if (response.data.status == "OK") {
      response = await axios({
        method: "POST",
        url: "/cgi-bin/script/getUsrInfo",
        headers: {
          "Authorization": authHeader
        }
      });
      users = response.data.usrInfo;
      fillTable();
      forceRender();
      notification.success({
        message: t('sys.api.operationSucceed'),
        description: `账户修改成功!`,
        duration: 3,
      });
      if (formData.user != formData.newName) {
        userStore.setAccount('');
        userStore.setRole(0);
        userStore.setToken1('');
        userStore.setBanner('');
        navigator.sendBeacon("/cgi-bin/script/sessionCheck", JSON.stringify({ user: account, status: "LOGOUT" })); 
        
        notification.success({
          message: t('sys.api.operationSucceed'),
          description: `用户名已修改, 需重新登录!`,
          duration: 3,
        });
        window.location.reload();
        // router.replace(PageEnum.BASE_LOGIN);
      }
    }
    else {
      notification.error({
        message: t('sys.api.operationFailed'),
        description: '账户修改失败!',
        duration: 3,
      });
      fillTable();
      forceRender();
    }
  }

  function deleteUserCheck(index: any) {
    Modal.confirm({
      title: '温馨提醒',
      icon: createVNode(ExclamationCircleOutlined),
      content: '确定要删除该账户吗?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        deleteUser(index);
      }
    });
  }

  async function deleteUser(index: any) {
    let formData = { user: users[index].name };
    let response = await axios({
      method: "POST",
      url: "/cgi-bin/script/deleUsr",
      data: formData,
      headers: {
          "Authorization": authHeader
      }
    });
    if (response.data.status == "OK") {
      response = await axios({
        method: "POST",
        url: "/cgi-bin/script/getUsrInfo",
        headers: {
          "Authorization": authHeader
        }
      });
      users = response.data.usrInfo;
      fillTable();
      forceRender();
      notification.success({
        message: t('sys.api.operationSucceed'),
        description: `账户删除成功!`,
        duration: 3,
      });
    }
    else {
      notification.error({
        message: t('sys.api.operationFailed'),
        description: '账户删除失败!',
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
  .destroy {
    width: 50px;
    height: 50px;
  }
  .destroy:active {
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
