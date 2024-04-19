import { ListApi } from "@/utils/https/service";

class AccountServer extends ListApi {
  url = "/user";
  updatePassword(data: any) {
    return this.axios.post("/user/bsUser/password/edit", data);
  }
}
const AccountApi = new AccountServer();
export default AccountApi;
