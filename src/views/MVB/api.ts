import { defHttp } from '/@/utils/http/axios';

export enum Api {
  MvbPortAndDevInfo = 'mvbPortAndDevInfo',
  MvbStatInfo = 'mvbStatInfo',
}

const baseUrl = '/web_setup/';

export const fetchBackendData = <T = any>(pageInfo: Api) => defHttp.get<T>({ url: "/script/" +  pageInfo });
