import { IBaseModel, IListBaseModel } from "@/models/baseModel";
import { IBuildProjectItem } from "@/models/buildModel";
import { BaseApi } from "@/utils/https/service";

export class BuildServer extends BaseApi {
  getBuildProject(params: { id: string }) {
    //获取构件书列表
    return this.axios
      .get<IBaseModel<IBuildProjectItem[]>>("/member/unit/project", { params })
      .then((v) => v.data);
  }
  getBuildList(params: {
    unitProjectUuid: string;
    pageSize?: number;
    pageNum?: number;
  }) {
    //获取构件书列表
    return this.axios
      .get<IListBaseModel>("/member/storey/list", { params })
      .then((v) => v.data);
  }
  import(data: any) {
    return this.axios.post("/member/file/import", data).then((v) => v.data);
  }
  importQuan(data: any) {
    return this.axios
      .post("/member/import/concrete/level", data)
      .then((v) => v.data);
  }
  getBuildChildList(params: { id: number }) {
    return this.axios
      .get<IListBaseModel>("/member/storey/info/list", { params })
      .then((v) => v.data);
  }
  getBureauList(params: {
    projectId: string;
    pageSize?: number;
    pageNum?: number;
    stageType?: string;
    priceType: number;
  }) {
    //获取构件局清单列表
    return this.axios
      .get<IListBaseModel>("/member/group/bill/list", { params })
      .then((v) => v.data);
  }
  getBureauChildList(params: {
    id: number;
    pageSize?: number;
    pageNum?: number;
  }) {
    return this.axios
      .get<IListBaseModel>("/member/group/bill/member/list", { params })
      .then((v) => v.data);
  }
  match(data: { id: string }) {
    return this.axios.post("/member/mate/init", data).then((v) => v.data);
  }
  getBuildstorey(params: { uuid: string }) {
    ///member/storey/name
    return this.axios
      .get<IBaseModel<{ name: string }[]>>("/member/storey/name", { params })
      .then((v) => v.data);
  }
}
const BuildApi = new BuildServer();
export default BuildApi;
