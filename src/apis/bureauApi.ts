import { IBaseModel, IListBaseModel } from "@/models/baseModel";
import { IBureauItemModel, IBureauTreeModel } from "@/models/bureauModel";
import { BaseApi } from "@/utils/https/service";

class BureauServer extends BaseApi {
  getList(params: any) {
    return this.axios
      .get<IListBaseModel<IBureauItemModel[]>>("/group/bill/list", { params })
      .then((e) => e.data);
  }

  getType() {
    return this.axios
      .get<IBaseModel<IBureauTreeModel[]>>("/group/bill/tree")
      .then((e) => e.data);
  }
}
const BureauApi = new BureauServer();
export default BureauApi;
