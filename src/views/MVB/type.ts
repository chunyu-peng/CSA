export interface MvbPortAndDevInfo {
  /** MVB端口数 */
  mvbPortCnt: number;
  /** mvbPortInfoList */
  mvbPortInfoList: mvbPortInfo[];
  /**MVB设备数 */
  mvbDevCnt: number;
  /** MVB设备信息列表  */
  mvbDevList: MvbDevInfo[];
  /**MVB BA设备数 */
  mvbBACnt: number;
  /** MVB BA设备信息列表 */
  mvbBAList: BA[];
}

export interface mvbPortInfo {
  ID: string;
  /** 取值范围为0,1,2,3,4 */
  Fcode: number;
  /** 为0时显示为“宿”，否则显示为“源” */
  type: number;
  /** 可能取值范围为1,2,4,8,16,32,64,128,256,512,1024 */
  period: number;
}

export interface MvbDevInfo {
  /** 设备地址 */
  devAdd: string;
  /** 设备状态字 */
  devDsw: string;
}

export interface BA {
  BAAdd: string;
  BADsw: string;
}

export interface MvbStatInfo {
  /**MVB设备地址 */
  mvbDevAdd: string;
  /**MVB设备状态字 */
  mvbDsw: string;
  /** 信任线状态: 1时表示信任A线 ,显示为“A线”，否则显示为“B线” */
  trustLine: number;
  /** A线状态: 1时表示A线OK，显示为“OK”，否则显示为“BAD” */
  AlineStat: number;
  /** B线状态: 1时表示B线OK，显示为“OK”，否则显示为“BAD” */
  BlineStat: number;
  /** 总线状态: 1时表示总线OK，显示为“OK”，否则显示为“BAD” */
  busStat: number;
  /** 总帧数 */
  mvbAllFrameCnt: number;
  /** 总错帧数 */
  mvbErrFrameCnt: number;
  /** 升主次数 */
  enterMasCnt: number;
}
