import { defHttp } from '/@/utils/http/axios';
import { IVersionInfo, ISysTime, IEthInfo, ICpldDiagInfo, ISoftDiagInfo } from './interface';
import { ICmngCfgInfo, IIoBrdInfo, ICanFlowInfo, ISafetyComm } from './chassis';

const baseUrl = '/web_setup/';

/**　版本信息获取 */
export const getVersionInfo = () => defHttp.get<IVersionInfo>({ url: "/script/versionInfo" });

/**　版本信息获取 */
export const getSysTime = () => defHttp.get<ISysTime>({ url: "/script/sysTime" });

/**　以太网信息获取 */
export const getEthInfo = () => defHttp.get<IEthInfo>({ url: "/script/ethInfo" });

/**　CPLD诊断信息获取 */
export const getCpldDiagInfo = () => defHttp.get<ICpldDiagInfo>({ url: "/script/cpldDiagInfo" });

/**　CPLD诊断信息获取 */
export const getSoftDiagInfo = () => defHttp.get<ISoftDiagInfo>({ url: "/script/softDiagInfo" });

/** 机箱管理信息 */
export const getCmngCfgInfo = () => defHttp.get<ICmngCfgInfo>({ url: "/script/cmngCfgInfo" });

/** IO板状态信息 */
export const getIoBrdInfo = () => defHttp.get<IIoBrdInfo>({ url: "/script/ioBrdInfo" });

/** CAN流量信息 */
export const getCanFlowInfo = () => defHttp.get<ICanFlowInfo>({ url: "/script/canFlowInfo" });

/** 安全通信信息 */
export const getSafetyComm = () => defHttp.get<ISafetyComm>({ url: "/script/safetyComm" });
