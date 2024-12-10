<template>
  <div class="w-[432px] h-[600px] rounded-lg bg-white overflow-hidden">
    <div class="h-[120px] flex justify-center items-center bg-[#293448]">
      <img class="w-16 h-16" src="../../../assets/images/logo.png" alt="" />
    </div>
    <div class="flex justify-center items-center text-xl font-medium py-10">{{ banner }}</div>
    <div class="mx-14">
      <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef" v-show="getShow" @keypress.enter="handleLogin">
        <FormItem name="account" class="enter-x">
          <Input size="large" v-model:value="formData.account" :placeholder="t('sys.login.userName')" class="fix-auto-fill" />
        </FormItem>
        <FormItem name="password" class="enter-x">
          <InputPassword size="large" visibilityToggle v-model:value="formData.password" :placeholder="t('sys.login.password')" />
        </FormItem>

        <ARow class="enter-x">
          <ACol :span="12">
            <FormItem>
            </FormItem>
          </ACol>
        </ARow>

        <FormItem class="enter-x">
          <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
            {{ t('sys.login.loginButton') }}
          </Button>
        </FormItem>

        <div class="flex justify-evenly enter-x" :class="`${prefixCls}-sign-in-way`">{{ t('sys.login.suggestMessage') }}</div>
        <div class="flex justify-evenly enter-x" :class="`${prefixCls}-sign-in-way`">
          Copyright© {{ pageData.currentYear }} 株洲中车时代电气股份有限公司
        </div>
      </Form>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';

  import { Form, Input, Row, Col, Button } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { router } from '/@/router';
  import { PageEnum } from '/@/enums/pageEnum';
  import axios from 'axios';
  import { genSaltSync, hashSync } from 'bcrypt-ts';

  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { notification } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();
  let banner = sessionStorage.getItem("welcomeInfo");

  const { getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);

  // 登录表单
  const formData = reactive({ account: '', password: '' });

  // 界面数据
  const pageData = reactive({
    randCodeImage: '',
    currentYear: new Date().getFullYear(),
  });

  const { validForm } = useFormValid(formRef);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    const { account, password } = data;
    let response = await axios.post("/cgi-bin/script/checkUsrValid", { user: account });
    if (response.data.status == "ERROR") {
      notification.error({
        message: t('sys.api.errorTip'),
        description: '用户或密码错误',
        duration: 3,
      });
    }
    else if (response.data.status == "LOCK") {
      notification.error({
        message: t('sys.api.errorTip'),
        description: '账户已被锁定!',
        duration: 3,
      });
    }
    else if (response.data.status == "DISABLED") {
      notification.error({
        message: t('sys.api.errorTip'),
        description: '该账户已被禁用, 请联系管理员!',
        duration: 3,
      });
    }
    else {
      const encryptedPassword = response.data.pwd;
      let getSalt = encryptedPassword.substr(0, 29);
      let newEncryptedPassword = hashSync(password, getSalt);
      if (encryptedPassword == newEncryptedPassword) {
        response = await axios.post("/cgi-bin/script/sessionCheck", { user: account, status: "LOGIN" });
        if (response.data.status == "LOGED") {
            notification.error({
              message: t('sys.api.errorTip'),
              description: '该账户已登录, 请等待账户下线!',
              duration: 3,
          });
          return;
        }
        else if (response.data.status == "LIMIT") {
          notification.error({
            message: t('sys.api.errorTip'),
            description: '登录账户数量已达上限, 请等待其他账户下线!',
            duration: 3,
          });
          return;
        }
        else {
          notification.success({
            message: t('sys.login.loginSuccessTitle'),
            description: `${t('sys.login.loginSuccessDesc')}: ${account}`,
            duration: 3,
          });
          await new Promise(resolve => setTimeout(resolve, 1000));
          const salt = genSaltSync(10);
          const newEncryptedPassword = hashSync(password, salt);
          response = await axios.post("/cgi-bin/script/fetchUsrToken", { user: account, pwd: newEncryptedPassword, status: "OK" });
          userStore.setToken1(response.data.token);
          userStore.setAccount(account);
          userStore.setRole(response.data.role);
          userStore.setBanner(response.data.welcomeInfo);
          router.push(PageEnum.BASE_HOME);
        }
      }
      else {
        notification.error({
          message: t('sys.api.errorTip'),
          description: '用户或密码错误',
          duration: 3,
        });
        response = await axios.post("/cgi-bin/script/fetchUsrToken", { user: account, status: "ERROR" });
      }
    }
    // if (1) {
    //   notification.success({
    //       message: t('sys.login.loginSuccessTitle'),
    //       description: `${t('sys.login.loginSuccessDesc')}: ${account}`,
    //       duration: 3,
    //     });
    //     userStore.setBanner('欢迎登录, PU520')
    //     userStore.setAccount("admin");
    //     userStore.setRole(1);
    //     userStore.setToken1('adfadf234sdfyewt');
    //     router.replace(PageEnum.BASE_HOME);
    // }


    //update-begin-author:taoyan date:2022-5-3 for: issues/41 登录页面，当输入验证码错误时，验证码图片要刷新一下，而不是保持旧的验证码图片不变
    // handleChangeCheckCode();
    //update-end-author:taoyan date:2022-5-3 for: issues/41 登录页面，当输入验证码错误时，验证码图片要刷新一下，而不是保持旧的验证码图片不变
  }

  // 重置验证码
  // function handleChangeCheckCode() {
  //   formData.inputCode = '';
  //   pageData.randCodeImage = `/gate/api/captcha?t_${new Date().getTime()}`;
  // }

  //初始化验证码
  // onMounted(() => {
  //   handleChangeCheckCode();
  // });
</script>

<style lang="less" scoped>
  .login-logo-title {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>

