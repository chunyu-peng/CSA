export const UAA_API = '/uaa/api/';
export const HMSVC_API = '/HMSVC/api/';
import { useGlobSetting } from '/@/hooks/setting';
const globSetting = useGlobSetting();
const MODE = import.meta.env.MODE;
const IP = MODE == 'development' ? globSetting.proxyip : location.host;

const BASE_SOCKET_URL = `${IP}/gate/netty/websocket`;

// 本地调试
// BASE_SOCKET_URL = "10.12.48.59:8089/websocket"

export const ONLINE_DATA_WS_URL = `ws://${BASE_SOCKET_URL}/online-data`;

export const ONLINE_FAULT_WS_URL = `ws://${BASE_SOCKET_URL}/online-fault`;

// 超限告警 ws url
export const ONLINE_TRANSFINITE_WARN_WS_URL = `ws://${BASE_SOCKET_URL}/online-transfinite-warn`;

// 变压器 ws url
export const ONLINE_TRANSFORMER_WS_URL = `ws://${BASE_SOCKET_URL}/online-transformer`;

// 全部数据
export const ONLINE_COMPLETE_WS_URL = `ws://${BASE_SOCKET_URL}/online-data-complete`;

// 天气地址 文档地址https://lbs.amap.com/api/webservice/guide/api/weatherinfo
export const WEATHER_URL = 'https://restapi.amap.com/v3/weather/weatherInfo?key=c9ad4e36340a744c4a6309affaee49e0';
