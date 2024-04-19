import { IBaseModel, IListBaseModel } from "@/models/baseModel";
import { BaseApi } from "@/utils/https/service";

class RoleServer extends BaseApi {
  addRole(data: any) {
    return this.axios.post<IBaseModel>("/api/bsRole/add", data);
  }
  editRole(data: any) {
    return this.axios.put<IBaseModel>("/api/bsRole/edit", data);
  }
  getRoleAll() {
    return this.axios
      .get<IBaseModel<{ roleId: string; roleName: string }[]>>(
        "/api/bsRole/list",
      )
      .then((e) => e.data);
  }
  getRole(params: any) {
    return this.axios
      .get<IListBaseModel>("/api/bsRole/list/page", { params })
      .then((e) => e.data);
  }
  deleteRole(roleId: number) {
    return this.axios.get<IBaseModel>(`/api/bsRole/del`, {
      params: { roleId },
    });
  }
}
const RoleApi = new RoleServer();
export default RoleApi;
