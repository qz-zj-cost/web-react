import { IBaseModel, IListBaseModel } from "@/models/baseModel";
import { BaseApi } from "@/utils/https/service";

class NationalServer extends BaseApi {
  getList(params: any) {
    return this.axios
      .get<IListBaseModel<INationalItemModel[]>>("/gb/bill/list", { params })
      .then((e) => e.data);
  }

  getType() {
    return this.axios
      .get<IBaseModel<INationalTypeModel[]>>("/gb/bill/pull/down")
      .then((e) => e.data);
  }
}
const NationalApi = new NationalServer();
export default NationalApi;
