import { ListApi } from "@/utils/https/service";

class AccountServer extends ListApi {
  url = "/user";
}
const AccountApi = new AccountServer();
export default AccountApi;
