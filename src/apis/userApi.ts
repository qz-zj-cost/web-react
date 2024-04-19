import { IBaseModel } from "@/models/baseModel";
import { MenuListModal } from "@/models/menuModel";
import { BaseApi } from "@/utils/https/service";

export interface IUserData {
  userNo: string;
  password: string;
}
export interface IUserInfo {
  engineer: string;
  expert: string;
  id: number;
  name: string;
  speciality: string;
  token: string;
  userNo: string;
}

class UserService extends BaseApi {
  login(data: IUserData) {
    return this.axios
      .post<IBaseModel<IUserInfo>>("/login", data)
      .then((e) => e.data);
  }
  getMenu(token: string) {
    return this.axios
      .get<IBaseModel<MenuListModal[]>>("/api/bsAuthority/menu/tree", {
        headers: { token },
      })
      .then((e) => e.data);
  }
  logout() {
    return this.axios.get("/logout");
  }
  dopLogin(data: { code: string }) {
    return this.axios.post("/dop/login", data).then((e) => e.data);
  }
}
const UserApi = new UserService();
export default UserApi;
