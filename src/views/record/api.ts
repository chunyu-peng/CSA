import { defHttp } from '/@/utils/http/axios';

export enum Api {
  RcdEnableInfo = 'rcdEnableInfo',
  /**　MVB记录采样信息 */
  MvbRcdSampleInfo = 'mvbRcdSampleInfo',
  TrdpRcdSampleInfo = 'trdpRcdSampleInfo',
  /** 故障记录统计信息 */
  DiagRcdInfo = 'diagRcdInfo',
  /**5.10.2　MVB故障记录信息 */
  MvbDiagRcdInfo = 'mvbDiagRcdInfo',
  /**5.10.3　TRDP故障记录信息 */
  TrdpDiagRcdInfo = 'trdpDiagRcdInfo',
}

const baseUrl = '/web_setup/';

export const fetchBackendData = <T = any>(pageInfo: Api) => defHttp.get<T>({ url: "/script/" +  pageInfo });
