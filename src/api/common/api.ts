import { defHttp } from '/@/utils/http/axios';
import { message } from 'ant-design-vue';
import { useGlobSetting } from '/@/hooks/setting';
import { appShortTitle, appTitle, useAppTitle } from '/@/hooks/setting/useAppTitle';
const globSetting = useGlobSetting();
const baseUploadUrl = globSetting.uploadUrl;
enum Api {
  positionList = '/sys/position/list',
  userList = '/sys/user/list',
  roleList = '/sys/role/list',
  queryDepartTreeSync = '/sys/sysDepart/queryDepartTreeSync',
  queryTreeList = '/sys/sysDepart/queryTreeList',
  loadTreeData = '/sys/category/loadTreeData',
  loadDictItem = '/sys/category/loadDictItem/',
  getDictItems = '/sys/dict/getDictItems/',
  getTableList = '/sys/user/queryUserComponentData',
  getCategoryData = '/sys/category/loadAllData',
}

/**
 * 上传父路径
 */
export const uploadUrl = `${baseUploadUrl}/sys/common/upload`;

/**
 * 职务列表
 * @param params
 */
export const getPositionList = (params) => {
  return defHttp.get({ url: Api.positionList, params });
};

/**
 * 用户列表
 * @param params
 */
export const getUserList = (params) => {
  return defHttp.get({ url: Api.userList, params });
};

/**
 * 角色列表
 * @param params
 */
export const getRoleList = (params) => {
  return defHttp.get({ url: Api.roleList, params });
};

/**
 * 异步获取部门树列表
 */
export const queryDepartTreeSync = (params?) => {
  return defHttp.get({ url: Api.queryDepartTreeSync, params });
};
/**
 * 获取部门树列表
 */
export const queryTreeList = (params?) => {
  return defHttp.get({ url: Api.queryTreeList, params });
};

/**
 * 分类字典树控件 加载节点
 */
export const loadTreeData = (params?) => {
  return defHttp.get({ url: Api.loadTreeData, params });
};

/**
 * 根据字典code加载字典text
 */
export const loadDictItem = (params?) => {
  return defHttp.get({ url: Api.loadDictItem, params });
};

/**
 * 根据字典code加载字典text
 */
export const getDictItems = (dictCode) => {
  return defHttp.get({ url: Api.getDictItems + dictCode }, { joinTime: false });
};
/**
 * 部门用户modal选择列表加载list
 */
export const getTableList = (params) => {
  return defHttp.get({ url: Api.getTableList, params });
};
/**
 * 加载全部分类字典数据
 */
export const loadCategoryData = (params) => {
  return defHttp.get({ url: Api.getCategoryData, params });
};
/**
 * 文件上传
 */
export const uploadFile = (params, success) => {
  return defHttp.uploadFile({ url: uploadUrl }, params, { success });
};
/**
 * 下载文件
 * @param url 文件路径
 * @param fileName 文件名
 * @param parameter
 * @returns {*}
 */
export const downloadFile = (url, fileName?, parameter?) => {
  return getFileblob(url, parameter).then((data) => {
    if (!data || data.size === 0) {
      message.warning('文件下载失败');
      return;
    }
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      window.navigator.msSaveBlob(new Blob([data]), fileName);
    } else {
      let url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    }
  });
};

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
export const getFileblob = (url, parameter) => {
  return defHttp.get(
    {
      url: url,
      params: parameter,
      responseType: 'blob',
    },
    { isTransformResponse: false }
  );
};

/**
 * 【用于评论功能】自定义文件上传-方法
 */
export const uploadMyFile = (url, data) => {
  return defHttp.uploadMyFile(url, data);
};

const baseUrl = '/web_setup/';
/** #define 基本信息页                    (1)
#define 以太网信息页                  (2)
#define 诊断信息页                    (3)
// #define 控制信息页                    (4) 目前不做
#define MVB信息页                     (5)
#define 机箱管理信息页                (6)
#define  安全通信信息页               (7)
#define TRDP/PDU信息页                (8)
#define  记录使能与采集信息页         (9)
#define  事件与数据信息页             (10)
#define  WTB信息页                    (11)  */
/**　菜单获取 */
export const getPageShowInfo = () =>
  defHttp.get<{ pageShowList: number[] }>({ url: "/script/pageShowInfo" });
// 配置信息页
export const getConfigInfo = () =>
  defHttp.get<{ projectName: string }>({ url: "/script/configInfo" }).then((res) => {
    appTitle.value = res.projectName;
    appShortTitle.value = `欢迎登录${res.projectName}软件`;
  });
