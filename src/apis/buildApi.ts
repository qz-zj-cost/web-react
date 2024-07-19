import { IBaseModel, IListBaseModel } from "@/models/baseModel";
import { IBuildProjectItem, IMathchMemberConfig } from "@/models/buildModel";
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
  getBuildstorey(params: { uuid: string; type: number }) {
    ///member/storey/name
    return this.axios
      .get<IBaseModel<{ name: string }[]>>("/member/storey/name", { params })
      .then((v) => v.data);
  }
  getRebarList(params: {
    unitProjectUuid: string;
    pageSize?: number;
    pageNum?: number;
  }) {
    //获取钢筋表
    return this.axios
      .get<IListBaseModel>("/member/rebar/list", { params })
      .then((v) => v.data);
  }
  importRebar(data: any) {
    return this.axios
      .post("/member/rebar/file/import", data)
      .then((v) => v.data);
  }
  //获取楼层
  getLcList(params: { unitProjectUuid: string; type: number }) {
    return this.axios
      .get<IBaseModel<{ name: string }[]>>("/member/storey/name/list", {
        params,
      })
      .then((v) => v.data);
  }
  //根据楼层获取钢筋表
  getLcRebarList(params: {
    unitProjectUuid: string;
    storeyName: string;
    type: number;
  }) {
    return this.axios
      .get<IListBaseModel>("/member/and/rebar/list", { params })
      .then((v) => v.data);
  }
  getGjGroup(data: { uuidList: number[] }) {
    return this.axios
      .post<IBaseModel<{ computeProject: string; id: number }[]>>(
        "/member/compute/project/group",
        data,
      )
      .then((v) => v.data);
  }
  addGjAndRebar(data: any) {
    return this.axios.post("/member/rebar/add", data).then((v) => v.data);
  }
  editGjAndRebar(data: any) {
    return this.axios.post("/member/rebar/update", data).then((v) => v.data);
  }
  deleteBill(data: { ids: string[] }) {
    return this.axios
      .post("/member/group/bill/member/del", data)
      .then((v) => v.data);
  }
  getMemberType(params: { id: string; uuid: string; type: number }) {
    return this.axios
      .get<IBaseModel<{ memberType: string; id: number }[]>>(
        "/member/group/member/type",
        {
          params,
        },
      )
      .then((v) => v.data);
  }
  getMatchMemberConfig(params: { projectId: string; unitProjectUuid: string }) {
    return this.axios
      .get<IBaseModel<IMathchMemberConfig>>("/member/rebar/config/all", {
        params,
      })
      .then((v) => v.data);
  }
  matchMember(data: any) {
    return this.axios.post<IBaseModel<IMathchMemberConfig>>(
      "/member/hand/movement/mate",
      data,
    );
  }
  matchGj(data: any) {
    return this.axios.post<IBaseModel<IMathchMemberConfig>>(
      "/member/hand/movement/rebar/mate",
      data,
    );
  }
  getSectionList(params: { type: number; unitProjectUuid: string }) {
    return this.axios
      .get<IBaseModel<{ name: string }[]>>("/member/section/name/list", {
        params,
      })
      .then((v) => v.data);
  }
}
const BuildApi = new BuildServer();
export default BuildApi;
