export interface Info {
  wtbTopoNodeCnt: number;
  wtbTopoTopNodeAdd: number;
  wtbTopoSelfNodeAdd: number;
  wtbTopoBottomNodeAdd: number;
  groupStrength: string;
}

export interface Statics {
  wtbDir1CRCErrCnt: number;
  wtbDir2CRCErrCnt: number;
  wtbLineADir1Statis: number[];
  wtbLineADir2Statis: number[];
  wtbLineADir3Statis: number[];
  wtbLineBDir1Statis: number[];
  wtbLineBDir2Statis: number[];
  wtbLineBDir3Statis: number[];
}

export interface Topo {
  wtbLocalDevAdd?: number;
  wtbTopoImageNodeList: Node[];
}

export interface Node {
  wtbAdd: number;
  wtbNodeData: number[];
}
