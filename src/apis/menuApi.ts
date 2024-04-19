import { IBaseModel, IListBaseModel } from "@/models/baseModel";
import { MenuListModal } from "@/models/menuModel";
import { BaseApi } from "@/utils/https/service";

class MenuServer extends BaseApi {
  //获取全部menu
  getAllMenus() {
    return this.axios
      .get<IBaseModel<MenuListModal[]>>("/api/bsAuthority/menu/tree/all")
      .then((e) => e.data);
  }
  addMenu(data: any) {
    return this.axios.post<IBaseModel>("/api/bsAuthority/insert", data);
  }
  editMenu(data: any) {
    return this.axios.put<IBaseModel>("/api/bsAuthority/edit", data);
  }
  getMenu(params: any) {
    return this.axios
      .get<IListBaseModel>("api/bsAuthority/menu/list", { params })
      .then((e) => e.data);
  }
  deleteMenu(authorityId: number) {
    return this.axios.get<IBaseModel>(`/api/bsAuthority/del`, {
      params: { authorityId },
    });
  }
}
const MenuApi = new MenuServer();
export default MenuApi;
