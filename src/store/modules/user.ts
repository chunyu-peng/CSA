import type { UserInfo, LoginInfo } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { PageEnum } from '/@/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY, LOGIN_INFO_KEY, DB_DICT_DATA_KEY, TENANT_ID, TOKEN_KEY1, ACCOUNT_KEY, CHARACTER_KEY, BANNER_KEY } from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { GetUserInfoModel, LoginParams, ThirdLoginParams } from '/@/api/sys/model/userModel';
import { getUserInfo, loginApi, thirdLogin } from '/@/api/sys/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { useGlobSetting } from '/@/hooks/setting';
import { JDragConfigEnum } from '/@/enums/jeecgEnum';
import { useSso } from '/@/hooks/web/useSso';
import { JSEncrypt } from 'jsencrypt';
import { PUBLIC_KEY } from '/@/utils/constants';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  token1?: string;
  roleList: RoleEnum[];
  dictItems?: [];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
  tenantid?: string | number;
  loginInfo?: Nullable<LoginInfo>;
  account?: string;
  role?: number;
  banner?: string;
  upFlag?: number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // 用户信息
    userInfo: null,
    // token
    token: undefined,
    token1: undefined,
    // 角色列表
    roleList: [],
    // 字典
    dictItems: [],
    // session过期时间
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
    //租户id
    tenantid: '',
    //登录返回信息
    loginInfo: null,
    //account
    account: undefined,
    //role
    role: 0,
    // login banner
    banner: undefined,
    upFlag: 0,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getLoginInfo(): LoginInfo {
      return this.loginInfo || getAuthCache<LoginInfo>(LOGIN_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getToken1(): string {
      return this.token1 || getAuthCache<string>(TOKEN_KEY1);
    },
    getAllDictItems(): [] {
      return this.dictItems || getAuthCache(DB_DICT_DATA_KEY);
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
    getTenant(): string | number {
      return this.tenantid || getAuthCache<string | number>(TENANT_ID);
    },
    getAccount(): string {
      return this.account || getAuthCache<string>(ACCOUNT_KEY);
    },
    getRole(): number {
      return this.role || getAuthCache<number>(CHARACTER_KEY);
    },
    getBanner(): string {
      return this.banner || getAuthCache<string>(BANNER_KEY);
    },
    getUploadFlag(): number {
      return this.upFlag as number;
    }
  },
  actions: {
    setUploadFlag(flag: number) {
      this.upFlag = flag;
    },
    setBanner(info: string | undefined) {
      this.banner = info ? info : ''; // for null or undefined value
      setAuthCache(BANNER_KEY, info);
    },
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setToken1(info: string | undefined) {
      this.token1 = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY1, info);
    },
    setAccount(info: string | undefined) {
      this.account = info ? info : ''; // for null or undefined value
      setAuthCache(ACCOUNT_KEY, info);
    },
    setRole(roleIdx: number) {
      this.role = roleIdx;
      setAuthCache(CHARACTER_KEY, roleIdx);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setLoginInfo(info: LoginInfo | null) {
      this.loginInfo = info;
      setAuthCache(LOGIN_INFO_KEY, info);
    },
    setAllDictItems(dictItems) {
      this.dictItems = dictItems;
      setAuthCache(DB_DICT_DATA_KEY, dictItems);
    },
    setTenant(id) {
      this.tenantid = id;
      setAuthCache(TENANT_ID, id);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.dictItems = [];
      this.token = '';
      this.token1 = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * 登录事件
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      }
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const encrypt = new JSEncrypt({});
        encrypt.setPublicKey(PUBLIC_KEY);
        const password = String(loginParams.password);
        loginParams.password = encrypt.encrypt(password) as string;
        const data = await loginApi(loginParams, mode);
        const { accessToken } = data;
        // save token
        this.setToken(accessToken);
        return this.afterLoginAction(goHome, data);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /**
     * 扫码登录事件
     */
    async qrCodeLogin(token): Promise<GetUserInfoModel | null> {
      try {
        // save token
        this.setToken(token);
        return this.afterLoginAction(true, {});
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /**
     * 登录完成处理
     * @param goHome
     */
    async afterLoginAction(goHome?: boolean, data?: any): Promise<any | null> {
      if (!this.getToken) return null;
      //获取用户信息
      const userInfo = await this.getUserInfoAction();
      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }
        await this.setLoginInfo({ ...data, isLogin: true });
        //update-begin-author:liusq date:2022-5-5 for:登录成功后缓存拖拽模块的接口前缀
        localStorage.setItem(JDragConfigEnum.DRAG_BASE_URL, useGlobSetting().domainUrl);
        //update-end-author:liusq date:2022-5-5 for: 登录成功后缓存拖拽模块的接口前缀
        goHome && (await router.replace((userInfo && userInfo.homePath) || PageEnum.BASE_HOME));
      }
      return data;
    },

    /**
     * 获取用户信息
     */
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) {
        return null;
      }
      const data = await getUserInfo();
      let userInfo: UserInfo = {};
      if (data) {
        userInfo = {
          username: data.uniqueCode as string,
        };
      }
      this.setUserInfo(userInfo);
      return userInfo;
    },
    /**
     * 退出登录
     */
    async logout(goLogin = false) {
      if (this.getToken1) {
        try {
          // await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }

      // //update-begin-author:taoyan date:2022-5-5 for: src/layouts/default/header/index.vue showLoginSelect方法 获取tenantId 退出登录后再次登录依然能获取到值，没有清空
      // let username:any = this.userInfo && this.userInfo.username;
      // if(username){
      //   removeAuthCache(username)
      // }
      // //update-end-author:taoyan date:2022-5-5 for: src/layouts/default/header/index.vue showLoginSelect方法 获取tenantId 退出登录后再次登录依然能获取到值，没有清空

      this.setToken1('');
      this.setAccount('');
      this.setRole(0);
      this.setBanner('');
      setAuthCache(TOKEN_KEY, null);
      setAuthCache(ACCOUNT_KEY, null);
      setAuthCache(CHARACTER_KEY, null);
      setAuthCache(BANNER_KEY, null);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      this.setLoginInfo(null);
      //update-begin-author:liusq date:2022-5-5 for:退出登录后清除拖拽模块的接口前缀
      localStorage.removeItem(JDragConfigEnum.DRAG_BASE_URL);
      //update-end-author:liusq date:2022-5-5 for: 退出登录后清除拖拽模块的接口前缀

      //如果开启单点登录,则跳转到单点统一登录中心
      const openSso = useGlobSetting().openSso;
      if (openSso == 'true') {
        await useSso().ssoLoginOut();
      }
      // await axios.post("/cgi-bin/script/sessionCheck", { user: this.account, status: "LOGOUT" });
      const data = JSON.stringify({ user: this.account, status: "LOGOUT" })
      navigator.sendBeacon("/cgi-bin/script/sessionCheck", data);
      // await new Promise(resolve => setTimeout(resolve, 1000));
      // goLogin && (await router.replace(PageEnum.BASE_LOGIN));
      // goLogin && router.replace(PageEnum.BASE_LOGIN);
      goLogin && (window.location.reload());
    },
    /**
     * 登录事件
     */
    async ThirdLogin(
      params: ThirdLoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      }
    ): Promise<any | null> {
      try {
        const { goHome = true, mode, ...ThirdLoginParams } = params;
        const data = await thirdLogin(ThirdLoginParams, mode);
        const { token } = data;
        // save token
        this.setToken(token);
        return this.afterLoginAction(goHome, data);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /**
     * 退出询问
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: t('sys.app.logoutTip'),
        content: t('sys.app.logoutMessage'),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
