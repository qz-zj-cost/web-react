import { IBaseModel, IListBaseModel } from "@/models/baseModel";
import { IProjectTypeModel } from "@/models/projectModel";
import { BaseApi, ListApi } from "@/utils/https/service";
import { Key } from "react";

class ProjectServer extends ListApi {
  url = "/project";
}
export class ContractImportServer extends BaseApi {
  getSummaryList(params: { projectId: string; unitProjectUuid?: string }) {
    return this.axios
      .get<IBaseModel>("/unit/project/summary/list", { params })
      .then((v) => v.data);
  }
  getFbList(params: {
    projectId: string;
    unitProjectUuid?: string;
    type: number;
    pageNum?: number;
    pageSize?: number;
    unitSectionUuid?: string;
  }) {
    return this.axios
      .get<IListBaseModel>("/unit/project/unit/section/list", { params })
      .then((v) => v.data);
  }
  getUnitProjectList(params: {
    projectId: string;
    unitProjectUuid?: string;
    byFinance: string; //人工费、直接材料费、专业分包工程费、机械使用费
    pageNum?: number;
    pageSize?: number;
    unitSectionUuid?: string;
  }) {
    return this.axios
      .get<IListBaseModel>("/unit/project/by/finance/list", { params })
      .then((v) => v.data);
  }
  getProjectTypeList(params: { id: Key; type?: number }) {
    return this.axios
      .get<IBaseModel<IProjectTypeModel[]>>("/unit/project/list", { params })
      .then((v) => v.data);
  }
  getServiceCost(params: { projectId: string }) {
    return this.axios
      .get<IListBaseModel>("/project/general/contracting/list", {
        params,
      })
      .then((e) => e.data);
  }
  import(data: any) {
    return this.axios.post("/unit/project/import", data).then((v) => v.data);
  }
}
export class OverheadServer extends BaseApi {
  getProjectPayList(params: {
    projectId: string;
    feeType: number;
    stageType: string;
  }) {
    //获取项目款列表
    return this.axios
      .get<IListBaseModel>("/project/payment/list", { params })
      .then((v) => v.data);
  }
}

const ProjectApi = new ProjectServer();
const ContractImportApi = new ContractImportServer();
const OverheadApi = new OverheadServer();

export { ContractImportApi, OverheadApi };

export default ProjectApi;
