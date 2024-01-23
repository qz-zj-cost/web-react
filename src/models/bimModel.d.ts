export interface IModelListItem {
  projId: number;
  ppid: number;
  projName: string;
  projType: number;
  updateUserName: string;
  updateRealName: string;
  updateDate: number;
  projSize: number;
  extractStatus: number;
  priorityOption: null;
  motor3dType: null;
  motor3dId: string;
  projMemo: string;
  projClassify: number;
  projModel: string;
  nodeType: number;
  deptId: string;
  deptName: string;
  nodeId: string;
  nodeName: string;
  fileuuid: string;
  extractLocationTree: number;
  version: number;
}
export interface ITreeItem {
  name: string;
  children: ITreeItem[];
}

export interface IMatchTreeItem {
  name: string;
  uuid: string;
  unitProjectUuid: string;
  memberPosition: string;
  modelPathList: string[];
  children: IMatchTreeItem[];
}
