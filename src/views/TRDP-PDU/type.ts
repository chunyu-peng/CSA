export interface Trdp {
  trdpInfoList: Info[];
}

export interface Info {
  port: number;
  type: number;
  txCnt: number;
  rxCnt: number;
  txTMO: number;
  rxTMO: number;
}

export interface UDP {
  udpInfoList: Info[];
}
