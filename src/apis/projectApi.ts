import { IBaseModel, IListBaseModel } from "@/models/baseModel";
import { IAreaItem, IProjectTypeModel } from "@/models/projectModel";
import { BaseApi, ListApi } from "@/utils/https/service";
import { Key } from "react";

class ProjectServer extends ListApi {
  url = "/project";
  getAllArea() {
    return this.axios
      .post<IBaseModel<IAreaItem[]>>("/corp/quota/area/all")
      .then((v) => v.data);
  }

  getAllAreaTime(params: { area: string }) {
    return this.axios
      .post<IBaseModel<IAreaItem[]>>("/corp/quota/month/all", { params })
      .then((v) => v.data);
  }

  price(data: {
    area: string;
    extendId: number;
    monthDate: string;
    projectId: number;
  }) {
    return this.axios
      .post("/unit/project/corp/price", data)
      .then((v) => v.data);
  }
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
  getChildList(params: { unitProjectUuid?: string; uuid?: string }) {
    return this.axios
      .get("/unit/project/unit/section/extend/list", { params })
      .then((v) => v.data);
  }
  getUnitProjectList(params: {
    projectId: string;
    // unitProjectUuid?: string;
    pageNum?: number;
    pageSize?: number;
    // unitSectionUuid?: string;
    stageType?: string;
    priceType?: number; // 0.未分类 1.直接人工费 2.直接材料费 3.分包工程支出 4.机械使用费 5.周转材料费（采购类）6.周转材料费（租赁类）7.安全文明施工费 8.其他措施费
  }) {
    return this.axios
      .get<IListBaseModel>("/unit/project/by/finance/list", { params })
      .then((v) => v.data);
  }

  getUnitChildList(params: { id: number }) {
    return this.axios
      .get("/unit/project/by/finance/extend", { params })
      .then((v) => v.data);
  }
  getProjectTypeList(params: { id: Key; type?: number }) {
    return this.axios
      .get<IBaseModel<IProjectTypeModel[]>>("/unit/project/list", { params })
      .then((v) => v.data);
  }
  getServiceCost(params: { projectId: string; stageType?: string }) {
    return this.axios
      .get<IListBaseModel>("/project/general/contracting/list", {
        params,
      })
      .then((e) => e.data);
  }
  import(data: any) {
    return this.axios.post("/unit/project/import", data).then((v) => v.data);
  }
  smartMatch(data: { unitProjectUuid?: string; uuid?: string }) {
    return this.axios
      .post("/unit/project/automatic/mate", data)
      .then((v) => v.data);
  }
  match(data: { groupBillUuid?: string; id?: string }) {
    return this.axios.post("/unit/project/mate", data).then((v) => v.data);
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
