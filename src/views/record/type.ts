export interface EnableInfo {
  mvbEventEnableFlag: number;
  mvbFaultEnableFlag: number;
  mvbTimeEnableFlag: number;
  mvbRcdSrcPort: string;
  mvbRcdSinkPort: string;
  trdpEventEnableFlag: number;
  trdpFaultEnableFlag: number;
  trdpTimeEnableFlag: number;
  trdpRcdSrcPort: string;
  trdpRcdSinkPort: string;
}

/**5.9.2　MVB记录采样信息 */
export interface MvbRcdSampleInfo {
  mvbFastPeriod: number;
  mvbFastSampleCnt: number;
  mvbMidPeriod: number;
  mvbMidSampleCnt: number;
  mvbSlowPeriod: number;
  mvbSlowSampleCnt: number;
}

/**TRDP记录采样信息 */
export interface TrdpRcdSampleInfo {
  trdpFastPeriod: number;
  trdpFastSampleCnt: number;
  trdpMidPeriod: number;
  trdpMidSampleCnt: number;
  trdpSlowPeriod: number;
  trdpSlowSampleCnt: number;
}

/**5.10.1　故障记录统计信息 */
export interface DiagRcdInfo {
  diagRecordList: DiagRecord[];
}

export interface DiagRecord {
  faultCode: string;
  startTime: string;
  stopTime: string;
}

/** 5.10.2　MVB故障记录信息 */
export interface MvbDiagRcdInfo {
  mvbDiagEventInfoList: PortData[];
}

/** 5.10.3　TRDP故障记录信息 */
export interface TrdpDiagRcdInfo {
  trdpDiagEventInfoList: PortData[];
}

export interface PortData {
  port: number;
  data: Array<number>;
}
