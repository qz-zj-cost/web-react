import { IBaseModel, IListBaseModel } from "@/models/baseModel";
import {
  IAreaItem,
  IProjectTypeModel,
  IServiceCostModal,
} from "@/models/projectModel";
import { BaseApi, ListApi } from "@/utils/https/service";
import { Key } from "react";

class ProjectServer extends ListApi {
  url = "/project";
  getAllArea() {
    return this.axios
      .get<IBaseModel<IAreaItem[]>>("/corp/quota/area/all")
      .then((v) => v.data);
  }

  getAllAreaTime(params: { area: string }) {
    return this.axios
      .get<IBaseModel<IAreaItem[]>>("/corp/quota/month/all", { params })
      .then((v) => v.data);
  }

  getStatisticsList(params: { projectId: string }) {
    return this.axios
      .get<IBaseModel<IAreaItem[]>>("/project/summary/amount", { params })
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

  addServiceCost(data: IServiceCostModal) {
    return this.axios
      .post("/project/general/contracting/add", data)
      .then((v) => v.data);
  }
  getServiceCost(params: { projectId: string; stageType?: string }) {
    return this.axios
      .get<IListBaseModel>("/project/general/contracting/list", {
        params,
      })
      .then((e) => e.data);
  }
  addOverHeadCost(data: any) {
    return this.axios.post("/project/payment/add", data).then((v) => v.data);
  }

  updateOverHeadCost(data: any) {
    return this.axios.post("/project/payment/update", data).then((v) => v.data);
  }
  deleteOverHeadCost(data: any) {
    return this.axios.post("/project/payment/del", data).then((v) => v.data);
  }

  getTargetCostList(params: { projectId: string }) {
    return this.axios
      .get("/unit/project/data/statistics/cost", { params })
      .then((v) => v.data);
  }
  exportFile(data: { priceType: string; projectId: string; type: string }) {
    return this.axios.post("/price/second/instance/file/export", data, {
      responseType: "arraybuffer",
    });
  }
  //调整分段和分类
  updateStage(data: { id: number; priceType: number; stageType: number }) {
    return this.axios
      .post("/unit/project/by/finance/update", data)
      .then((v) => v.data);
  }
  //更新企业定额
  updateQuota(data: { corpQuotaCode: string; uuidGroupBillCode: string[] }) {
    return this.axios
      .post("/unit/project/corp/quota/batch/update", data)
      .then((v) => v.data);
  }
  // 修改单价
  updateUnitPrice(data: {
    ids: number[];
    projectId: string;
    price: string;
    sourceType: number;
  }) {
    return this.axios
      .post("/unit/project/corp/price/extend/batch", data)
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

  getUnitChildList(params: { id: number; groupBillCode: string }) {
    return this.axios
      .get("/unit/project/by/finance/extend", { params })
      .then((v) => v.data);
  }
  getProjectTypeList(params: { id: Key; type?: number }) {
    return this.axios
      .get<IBaseModel<IProjectTypeModel[]>>("/unit/project/list", { params })
      .then((v) => v.data);
  }
  getProjectTypeDetails(params: { unitProjectUuid: string }) {
    return this.axios
      .get<IBaseModel<IProjectTypeModel>>("/unit/project/info", { params })
      .then((v) => v.data);
  }
  import(data: any) {
    return this.axios.post("/unit/project/import", data).then((v) => v.data);
  }
  projectImport(data: any) {
    return this.axios.post("/unit/project/v2/import", data).then((v) => v.data);
  }
  smartMatch(data: { projectId: string }) {
    return this.axios
      .post("/unit/project/automatic/mate", data)
      .then((v) => v.data);
  }
  match(data: { groupBillUuidList?: string[]; ids?: string }) {
    return this.axios.post("/unit/project/mate", data).then((v) => v.data);
  }
  getZjList(params: { unitProjectUuid: string; projectId: string }) {
    return this.axios
      .get<IListBaseModel>("/unit/project/price/measures/list", { params })
      .then((v) => v.data);
  }
  getGfList(params: { unitProjectUuid: string; projectId: string }) {
    return this.axios
      .get<IListBaseModel>("/unit/project/taxes/list", { params })
      .then((v) => v.data);
  }
  getOtherList(params: { unitProjectUuid: string; projectId: string }) {
    return this.axios
      .get<IListBaseModel>("/unit/project/other/fee/list", { params })
      .then((v) => v.data);
  }
  import2(data: any) {
    return this.axios
      .post("/unit/project/summary/import", data)
      .then((v) => v.data);
  }
  export(data: {
    projectId: string;
    type?: number;
    unitProjectUuid?: string;
    unitSectionUuid?: string;
    pageNum?: number;
    pageSize?: number;
  }) {
    return this.axios.post("/unit/project/unit/section/import/list", data, {
      responseType: "arraybuffer",
    });
  }
  modify(data: {
    duration?: number;
    frequency?: number;
    id: number;
    num?: number;
  }) {
    return this.axios
      .post("/unit/project/frequency/duration/update", data)
      .then((v) => v.data);
  }
  modifyNum(data: { extendId: number; num: number }) {
    return this.axios
      .post("/unit/project/corp/num/extend", data)
      .then((v) => v.data);
  }
  delChildBureau(data: {
    groupBillUuid: string;
    uuid: string;
    mateId: number;
  }) {
    return this.axios
      .post("/unit/project/section/extend/mate/del", data)
      .then((v) => v.data);
  }
  //总价匹配局清单
  matchZjBureau(data: { groupBillUuidList: string[]; ids: string[] }) {
    return this.axios
      .post("/unit/project/price/measures/mate", data)
      .then((v) => v.data);
  }
  //删除总价局清单
  delZjBureau(data: { groupBillUuid: string; id: string; mateId: number }) {
    return this.axios
      .post("/unit/project/price/measures/del", data)
      .then((v) => v.data);
  }
  //规费匹配局清单
  matchGfBureau(data: { groupBillUuidList: string[]; ids: string }) {
    return this.axios
      .post("/unit/project/taxes/mate", data)
      .then((v) => v.data);
  }
  //删除规费局清单
  delGfBureau(data: { groupBillUuid: string; id: string; mateId: number }) {
    return this.axios.post("/unit/project/taxes/del", data).then((v) => v.data);
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
