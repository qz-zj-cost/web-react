import { IListBaseModel } from "@/models/baseModel";
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
  getCostList(params: {
    pageNum?: number;
    pageSize?: number;
    projectId: string;
    monthDate: string;
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
  addInstallment(data: any) {
    return this.axios
      .post("/member/mortgage/quantities/add", data)
      .then((e) => e.data);
  }
  importPrice(data: any) {
    return this.axios.post("/member/price/import", data).then((e) => e.data);
  }
}

const InstallmentApi = new InstallmentServer();
export default InstallmentApi;
