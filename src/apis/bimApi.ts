import { IBaseModel, IListBaseModel } from "@/models/baseModel";
import { IMatchTreeItem, IModelListItem, ITreeItem } from "@/models/bimModel";
import { BaseApi } from "@/utils/https/service";

export class BimServer extends BaseApi {
  login() {
    return this.axios.get<IBaseModel>("/luban/login").then((e) => e.data);
  }
  getModelList(params: any) {
    return this.axios
      .get<IListBaseModel<IModelListItem[]>>("/luban/model/list", { params })
      .then((e) => e.data);
  }
  binModel(data: { motor3dId: string; uuid: string }) {
    return this.axios
      .post("/member/unit/project/model/mate", data)
      .then((e) => e.data);
  }
  getMatchTree(params: { uuid: string }) {
    return this.axios
      .get<IBaseModel<IMatchTreeItem>>("/member/tree/list", { params })
      .then((e) => e.data);
  }
  getBimMatchTree(params: { motor3dId: string }) {
    return this.axios
      .get<IBaseModel<ITreeItem>>("/luban/member/tree", { params })
      .then((e) => e.data);
  }
  match(data: any) {
    return this.axios.post("/member/tree/mate", data).then((e) => e.data);
  }
  automMatch(data: { projectId: string; unitProjectUuid: string }) {
    return this.axios
      .post("/member/tree/automatic/mate", data)
      .then((e) => e.data);
  }
  getSummaryList(data: { projectId: string; pathList: string[] }) {
    return this.axios
      .post<IBaseModel>("/member/tree/statistics/all", data)
      .then((e) => e.data);
  }
  getBuildList(data: { projectId: string; pathList: string[] }) {
    return this.axios
      .post<IBaseModel>("/member/tree/statistics", data)
      .then((e) => e.data);
  }
}

const BimApi = new BimServer();
export default BimApi;
