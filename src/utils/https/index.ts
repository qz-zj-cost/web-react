import store from "@/store";
import { signOut } from "@/store/user";
import { Modal, notification } from "antd";
import Axios from "axios";
import qs from "query-string";
import { IConfig, IHttpFunConfig, IResponseType } from "./types";

const axios = Axios.create({
  // baseURL: NODE_ENV === "development" ? void 0 : url,
  baseURL: import.meta.env.VITE_HTTP_URL,
});
axios.interceptors.request.use((config) => {
  const { isLogin, token } = store.getState().user;
  if (isLogin) {
    config.headers["token"] = token;
  }
  if (config.method === "get") {
    config.paramsSerializer = (params) => {
      return qs.stringify(params, { arrayFormat: "comma" });
    };
  }
  return config;
});
/**
 * @author Destin
 * @description Http请求封装
 * @date 2021/12/02
 */
export default class HttpApi {
  public static showLogoutModal = true;

  public static get = <T = any>(url: string, config?: IHttpFunConfig) => {
    return this.request<T>({ url, method: "GET", ...config });
  };
  public static post = <T = any>(url: string, config?: IHttpFunConfig) => {
    return this.request<T>({ url, method: "POST", ...config });
  };
  public static put = <T = any>(url: string, config?: IHttpFunConfig) => {
    return this.request<T>({ url, method: "PUT", ...config });
  };
  public static delete = <T = any>(url: string, config?: IHttpFunConfig) => {
    return this.request<T>({ url, method: "DELETE", ...config });
  };
  public static file = async <T = ArrayBuffer>({
    ...config
  }: IConfig): Promise<T> => {
    try {
      const { data } = await axios.request<T>({
        ...config,
        responseType: "arraybuffer",
        // headers:{...he}
      });
      return data;
    } catch (error) {
      return Promise.reject({
        code: -1,
        message: "请求失败",
        data: null as any,
      });
    }
  };
  public static request = async <
    T = any,
    R extends IResponseType = IResponseType<T>,
  >({
    authError = true,
    ...config
  }: IConfig): Promise<R extends IResponseType ? R : IResponseType<T>> => {
    try {
      const { data } = await axios.request<
        R extends IResponseType ? R : IResponseType<T>
      >({
        ...config,
      });
      const code = Number(data.code);
      if (code === 200) {
        return data;
      } else {
        throw data;
      }
    } catch (err: any) {
      if (Number(err.code) === 401 && this.showLogoutModal) {
        this.showLogoutModal = false;
        Modal.error({
          title: "提示",
          content: "登录超时，请重新登录",
          okText: "登录",
          onOk: () => {
            this.showLogoutModal = true;
            store.dispatch(signOut());
            // window.location.reload();
          },
        });
      } else {
        if (authError) {
          notification.error({
            message: "请求失败",
            description: err.message || "网络失败",
          });
        }
      }
      const message = err.message || "请求失败";
      return Promise.reject({
        code: -1,
        message,
        data: err,
      } as R extends IResponseType ? R : IResponseType<T>);
    }
  };
}

export const requestModuleFun = <T = any, R = any>(queryUrl: string) => {
  const url = queryUrl.replace(/^\/|\/$/g, "/");
  return {
    get: (params?: any) => HttpApi.get<T[]>(url, { params }),
    getList: (params?: any) => HttpApi.get<T[]>(`${url}/list`, { params }),
    getDetails: (id: React.Key) => HttpApi.get<T>(`${url}/${id}`),
    post: (data: R) => HttpApi.post(url, { data }),
    delete: (id: React.Key) => HttpApi.delete(`${url}/${id}`),
  };
};
