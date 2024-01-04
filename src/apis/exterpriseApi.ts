import { IBaseModel, IListBaseModel } from "@/models/baseModel";
import { BaseApi } from "@/utils/https/service";

class ExterpriseServer extends BaseApi {
  getList(params: any) {
    return this.axios
      .get<IListBaseModel>("/corp/quota/list", { params })
      .then((e) => e.data);
  }
  getBillList(params: any) {
    return this.axios
      .get<IListBaseModel<IBureauItemModel[]>>("/corp/quota/group/bill/list", {
        params,
      })
      .then((e) => e.data);
  }
  getType() {
    return this.axios
      .get<IBaseModel<IExterpriseTypeModel[]>>("/corp/quota/kind/name/list")
      .then((e) => e.data);
  }
  match(data: any) {
    //匹配
    return this.axios
      .post<IBaseModel>("/corp/quota/mate", data)
      .then((e) => e.data);
  }
  getPrice(params: { code: string; area: string }) {
    return this.axios.get("/corp/quota/price", { params }).then((e) => e.data);
  }
  getArea(params: { code: string }) {
    return this.axios
      .get<IBaseModel<IAraeItemModel[]>>("/corp/quota/area", {
        params,
      })
      .then((e) => e.data);
  }
  //导入价格
  importPrice(data: any) {
    return this.axios
      .post("/corp/quota/price/import", data)
      .then((v) => v.data);
  }
}
const ExterpriseApi = new ExterpriseServer();
export default ExterpriseApi;
