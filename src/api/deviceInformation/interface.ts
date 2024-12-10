/** 版本信息获取 */
interface verList {
  id: any;
  verName: string /** 组件名称  */;
  verCode: number /** 组件版本号 */;
}
export interface IVersionInfo {
  verNum?: number /** 需要显示的版本号数量  */;
  verNameList: verList[];
}

/** 版本信息获取 */
export interface ISysTime {
  softPowerOnTime?: string /** 软件上电时间  */;
  softTime: string /** 软件系统时间 */;
}

/** 以太网信息获取 */
interface ethList {
  ethNameOnBrd: string; // 面板网口名称
  ethNameInSoft: string; // 软件网口名称
  macAdd: number; // mac地址
  ipAdd: number; // ip地址
  mask: number; // 掩码地址
  gateway: number; // 网关地址
  txPackSum: number; // 发包总数
  rxPackSum: number; // 收包总数
  linkStat: number; // Link状态:该值为零时，将指示灯熄灭，否则将指示灯电量
}
export interface IEthInfo {
  ethNum: number; // 需要显示的以太网口数量
  ethList: ethList[]; // 以太网口列表
}

/** CPLD诊断信息 */
interface cpldDiagList {
  errNameInChinese: string; // 异常名称
  cnt: string; // 异常次数
}

export interface ICpldDiagInfo {
  cpldDiagNum: number; // 需要显示的CPLD诊断项点数量
  cpldDiagList: cpldDiagList[]; // cpld诊断项点列表
}
/** 软件诊断信息获取 */
interface softDiagList {
  errNameInChinese: string; // 异常名称
  value: number; // 检查结果
}
export interface ISoftDiagInfo {
  softDiagNum: number; // 需要显示的软件诊断项点数量
  softDiagList: softDiagList[]; // 软件诊断项点列表
}
