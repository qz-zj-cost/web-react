import { BaseApi } from "@/utils/https/service";

class UserService extends BaseApi {
  login(data: any) {
    return this.axios.post("/login", data).then((e) => e.data);
  }
  logout() {
    return this.axios.get("/logout");
  }
}
const UserApi = new UserService();
export default UserApi;
