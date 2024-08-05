import { IBaseModel, IListBaseModel } from "@/models/baseModel";
import { BaseApi } from "@/utils/https/service";

export class InstallmentServer extends BaseApi {
  getDateList(params: {
    pageNum?: number;
    pageSize?: number;
    projectId: string;
  }) {
    return this.axios
      .get<IListBaseModel>("/member/mortgage/quantities/page", { params })
      .then((e) => e.data);
  }
  getMemberSum(params: {
    projectId: string;
    dateQuantitiesId: string;
    priceType: number;
    stageType: string;
    type: number;
  }) {
    return this.axios
      .get<
        IBaseModel<{
          actualIncome: number;
          incomeSumPrice: number;
          mortgageIncomeSumPrice: number;
          mortgageSumPrice: number;
          overshootRate: number;
          profitMargin: number;
          sumActualIncome: number;
          sumPrice: number;
        }>
      >("/member/mortgage/quantities/member/sum", { params })
      .then((e) => e.data);
  }
  getCostPreviewMemberSum(params: {
    projectId: string;
    dateQuantitiesId: string;
    priceType: number;
    stageType: string;
    type: number;
  }) {
    return this.axios
      .get<
        IBaseModel<{
          actualIncome: number;
          incomeSumPrice: number;
          mortgageIncomeSumPrice: number;
          mortgageSumPrice: number;
          overshootRate: number;
          profitMargin: number;
          sumActualIncome: number;
          sumPrice: number;
        }>
      >("/member/previous/mortgage/quantities/sum", { params })
      .then((e) => e.data);
  }
  getCostList(params: {
    pageNum?: number;
    pageSize?: number;
    projectId: string;
    dateQuantitiesId: string;
    priceType: number;
    stageType: string;
  }) {
    return this.axios
      .get<IListBaseModel>("/member/mortgage/quantities/list", { params })
      .then((e) => e.data);
  }
  getCostChildList(params: {
    pageNum?: number;
    pageSize?: number;
    id: string;
    monthDate: string;
  }) {
    return this.axios
      .get<IListBaseModel>("/member/mortgage/quantities/member/list", {
        params,
      })
      .then((e) => e.data);
  }
  getOtherCostList(params: {
    pageNum?: number;
    pageSize?: number;
    projectId: string;
    dateQuantitiesId: string;
    priceType: number;
    stageType: string;
    type: number;
  }) {
    return this.axios
      .get<IListBaseModel>("/member/other/mortgage/quantities", { params })
      .then((e) => e.data);
  }
  updateOther(data: { id: number; mortgageRatio: number; type: number }) {
    return this.axios
      .post("/member/other/mortgage/quantities/update", data)
      .then((e) => e.data);
  }
  addInstallment(data: any) {
    return this.axios
      .post("/member/mortgage/quantities/add", data)
      .then((e) => e.data);
  }
  importPrice(data: any) {
    return this.axios.post("/member/price/import", data).then((e) => e.data);
  }
  export(data: {
    projectId: string;
    dateQuantitiesId?: string;
    pageNum?: number;
    pageSize?: number;
    priceType: number;
    stageType: number;
  }) {
    return this.axios.post("/price/file/export", data, {
      responseType: "arraybuffer",
    });
  }
  exportOther(data: {
    projectId: string;
    dateQuantitiesId?: string;
    pageNum?: number;
    pageSize?: number;
    priceType: number;
    type: number;
    stageType: number;
  }) {
    return this.axios.post("/member/other/mortgage/quantities/export", data, {
      responseType: "arraybuffer",
    });
  }
  //导出实际成本
  exportActualCost(data: { projectId: string; monthDate: string }) {
    return this.axios.post(
      "/member/mortgage/quantities/group/bill/export",
      data,
      {
        responseType: "arraybuffer",
      },
    );
  }
  deleteInstallMent(data: { id: number }) {
    return this.axios.post("/member/mortgage/quantities/del", data);
  }
  syncStaging(data: { id: number; projectId: string }) {
    return this.axios.post("/member/mortgage/quantities/sync", data);
  }
  approval(data: { id: number }) {
    return this.axios.post("/member/mortgage/quantities/status", data);
  }
  getPricePage(params: any) {
    return this.axios
      .get("/member/settlement/price/page", { params })
      .then((e) => e.data);
  }
  getBillGroupList(params: any) {
    return this.axios
      .get("/unit/project/group/bill/list", { params })
      .then((e) => e.data);
  }
  updatePrice(data: {
    dateQuantitiesId: number;
    groupBillUuid?: string;
    settlementPriceInfoId: string;
    stockNum?: number;
  }) {
    return this.axios.post("/member/settlement/price/update", data);
  }
  updatePriceAndNum(data: {
    id: number;
    type: number;
    actualNum?: number;
    actualPrice?: number;
  }) {
    return this.axios.post("/member/mortgage/quantities/update", data);
  }
  getSummaryList(params: { id: string }) {
    return this.axios
      .get("/member/mortgage/quantities/summary", { params })
      .then((e) => e.data);
  }
  getVisaList(params: any) {
    return this.axios.get("/visa/change/list", { params }).then((v) => v.data);
  }
  addVisa(data: any) {
    return this.axios.post("/visa/change/save", data).then((v) => v.data);
  }
  updateVisa(data: any) {
    return this.axios.post("/visa/change/edit", data).then((v) => v.data);
  }
  getFqConfigList(params: { id: string }) {
    return this.axios
      .get("/member/mortgage/quantities/config/list", { params })
      .then((v) => v.data);
  }
  getCostPreviewList(params: {
    projectId: string;
    dateQuantitiesId?: string;
    pageNum?: number;
    pageSize?: number;
    priceType: number;
    type: number;
    stageType: string;
  }) {
    return this.axios
      .get<IListBaseModel>("/member/previous/mortgage/quantities", { params })
      .then((e) => e.data);
  }
  exportCostPreview(data: {
    projectId: string;
    dateQuantitiesId?: string;
    pageNum?: number;
    pageSize?: number;
    priceType: number;
    type: number;
    stageType: number;
  }) {
    return this.axios.post(
      "/member/previous/mortgage/quantities/export",
      data,
      {
        responseType: "arraybuffer",
      },
    );
  }
}

const InstallmentApi = new InstallmentServer();
export default InstallmentApi;
