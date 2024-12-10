/** 机箱管理信息 */
export interface ICmngCfgInfo {
  chasisId: number; // 机箱号
  slotId: number; // 槽位号
  parseRet: number; // 解析状态
  isMaster: number; // 是否主系
  becomeMasCnt: number; // 成为主系次数
  appMasSwitchCnt: number; // 应用切主次数
}

/** IO板状态信息 */
interface brdInfoList {
  slotId: number; // 接口板槽位号
  name: number; // 接口板名称
  initStatByOne: number | string; // 1系初始化状态
  initStatByTwo: number | string; // 2系初始化状态
  aliveStatByOne: number | string; // 1系生命状态
  aliveStatByTwo: number | string; // 2系生命状态
}
export interface IIoBrdInfo {
  brdStatCnt: number; // 接口板状态显示个数
  brdInfoList: brdInfoList[]; // 接口板信息列表
}

/** CAN流量信息 */
interface canInfoList {
  PPS: number; // 背板can PPS
  txOkCnt: number; // 发送成功数
  txErrCnt: number; // 发送失败数
  rxOkCnt: number; // 接收成功数
  rxErrCnt: number; // 接收失败数
}
export interface ICanFlowInfo {
  canInfoList: canInfoList[]; // Can流量信息列表
}

/** 安全通信信息 */
interface safetyCommList {
  port: number; //端口号
  commType: number | string; //通信类型
  portType: number | string; //端口类型
  channelStat: number; //通道状态
}
export interface ISafetyComm {
  safetyCommSMI: number; // 安全通信SMI值
  safeCommNum: number; // 安全通信端口数量
  safetyCommList: safetyCommList[]; // 安全通信信息列表
}
