import { defHttp } from '/@/utils/http/axios';

export enum Api {
  TrdpInfo = 'trdpInfo',
  UdpInfo = 'udpInfo',
}

const baseUrl = '/web_setup/';

export const fetchBackendData = <T = any>(pageInfo: Api) => defHttp.get<T>({ url: "/script/" + pageInfo });
