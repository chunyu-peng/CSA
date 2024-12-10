import { MockMethod } from 'vite-plugin-mock';
// import { resultSuccess } from '../_util';
import Mock, { Random } from 'mockjs';

export default [
  {
    url: '/cgi-bin/web_setup/',
    method: 'get',
    response: ({ query }) => {
      console.log(`output->query`, query);

      const { pageInfo } = query;

      switch (pageInfo) {
        case 'mvbStatInfo':
          return Mock.mock({
            mvbDevAdd: Random.hex(),
            mvbDsw: Random.hex(),
            trustLine: Random.integer(0, 1),
            AlineStat: Random.integer(0, 1),
            BlineStat: Random.integer(0, 1),
            busStat: Random.integer(0, 1),
            mvbAllFrameCnt: Random.integer(0, 1000),
            mvbErrFrameCnt: Random.integer(0, 1000),
            enterMasCnt: Random.integer(0, 1000),
          });
        case 'mvbPortAndDevInfo':
          return Mock.mock({
            mvbPortCnt: Random.integer(1000, 4096),
            'mvbPortInfoList|100-600': [
              {
                'ID|+1': Random.increment(),
                'Fcode|1-4': 1,
                'type|0-1': 1,
                'period|1-1024': 1,
              },
            ],
            mvbDevCnt: Random.integer(0, 256),
            'mvbDevList|0-256': [
              {
                'devAdd|1-256': 1,
                'devDsw|1-222': 1,
              },
            ],
            mvbBACnt: Random.integer(),

            'mvbBAList|100-600': [
              {
                'BAAdd||1-256': 1,
                'BADsw|1-256': 1,
              },
            ],
          });
        case 'mvbRcdSampleInfo':
          return Mock.mock({
            mvbFastPeriod: Random.integer(0, 256),
            mvbFastSampleCnt: 'FastSample',
            mvbMidPeriod: 'mvbMidPeriod',
            mvbMidSampleCnt: 'mvbMidSampleCnt',
            mvbSlowPeriod: 'mvbSlowPeriod',
            mvbSlowSampleCnt: 'mvbSlowSampleCnt',
          });
        case 'trdpRcdSampleInfo':
          return Mock.mock({
            trdpFastPeriod: 'trdpFastPeriod',
            trdpFastSampleCnt: 'trdpFastSampleCnt',
            trdpMidPeriod: 'trdpMidPeriod',
            trdpMidSampleCnt: 'trdpMidSampleCnt',
            trdpSlowPeriod: 'trdpSlowPeriod',
            trdpSlowSampleCnt: 'trdpSlowSampleCnt',
          });
        case 'diagRcdInfo':
          return Mock.mock({
            diagRecordCnt: Random.integer(0, 256),
            'diagRecordList|0-10': [
              {
                'faultCode|1-10': 1,
                startTime: '2023/09/14 00:00:01',
                stopTime: '2023/12/16 20:00:01',
              },
            ],
          });

        case 'mvbDiagRcdInfo':
          return Mock.mock({
            mvbDiagEventCnt: Random.integer(0, 100),
            'mvbDiagEventInfoList|1-100': [
              {
                'port|1-999': 1,
                data: '[02][32][333]',
              },
            ],
          });
        case 'trdpDiagRcdInfo':
          return Mock.mock({
            trdpDiagEventCnt: Random.integer(0, 100),
            'trdpDiagEventInfoList|1-100': [
              {
                'port|1-999': 1,
                data: '[02][32][333]',
              },
            ],
          });
        case 'trdpInfo':
          return Mock.mock({
            trdpPortCnt: Random.integer(0, 100),
            'trdpInfoList|1-100': [
              {
                'port|1-999': 1,
                'type|0-1': 0,

                'txCnt|1-999': 1,
                'rxCnt|1-999': 1,
                'txTMO|1-999': 1,
                'rxTMO|1-999': 1,
              },
            ],
          });
        case 'udpInfo':
          return Mock.mock({
            udpPortCnt: Random.integer(0, 100),
            'udpInfoList|1-100': [
              {
                'port|1-999': 1,
                'type|0-1': 0,

                'txCnt|1-999': 1,
                'rxCnt|1-999': 1,
                'txTMO|1-999': 1,
                'rxTMO|1-999': 1,
              },
            ],
          });

        case 'rcdEnableInfo':
          return Mock.mock({
            mvbEventEnableFlag: 0,
            mvbFaultEnableFlag: 0,
            mvbTimeEnableFlag: 0,
            mvbRcdSrcPort: 'c8H',
            mvbRcdSinkPort: '64H',
            trdpEventEnableFlag: 1,
            trdpFaultEnableFlag: 1,
            trdpTimeEnableFlag: 1,
            trdpRcdSrcPort: '123H',
            trdpRcdSinkPort: '23H',
          });
        default:
          return {};
      }
    },
  },
] as MockMethod[];
