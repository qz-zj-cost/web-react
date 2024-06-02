import { IBaseModel, IListBaseModel } from "@/models/baseModel";
import store from "@/store";
import { notification } from "antd";
import Axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import queryString from "query-string";

export abstract class BasicService {
  axios = Axios.create({ baseURL: "", timeout: 500000 });
  abstract _baseUrl: string;

  abstract requestFun(
    config: InternalAxiosRequestConfig<any>,
  ): InternalAxiosRequestConfig<any>;

  abstract responseFun(data: AxiosResponse<any, any>): AxiosResponse<any, any>;
  initAxios() {
    // this.axios.defaults.timeout = 5000;
    this.axios.defaults.baseURL = this._baseUrl;
    this.axios.interceptors.request.use((config) => {
      const newConfig = this.requestFun(config);
      return newConfig;
    });
    this.axios.interceptors.response.use(
      (data) => {
        const newData = this.responseFun(data);
        return newData;
      },
      (error) => {
        notification.error({
          message: "请求失败",
          description: error.message ?? "网络错误",
        });
      },
    );
  }
}

export class BaseApi extends BasicService {
  _baseUrl = import.meta.env.VITE_HTTP_URL;
  constructor() {
    super();
    this.initAxios();
  }
  getData<T = any>(request: Promise<AxiosResponse<T, any>>) {
    return request.then((e) => e.data);
  }
  requestFun(
    config: InternalAxiosRequestConfig<any>,
  ): InternalAxiosRequestConfig<any> {
    const { isLogin, token } = store.getState().user;
    if (isLogin) {
      config.headers["token"] = token;
    }
    if (config.method === "get") {
      config.paramsSerializer = (params) => {
        return queryString.stringify(params, { arrayFormat: "comma" });
      };
    }
    return config;
  }
  responseFun(data: AxiosResponse<any, any>): AxiosResponse<any, any> {
    if (data.status === 200) {
      if (data.data?.code === "200") {
        return data;
      } else if (data.data?.code) {
        notification.error({
          message: "请求失败",
          description: data.data?.message ?? "接口错误",
        });
        throw data;
      } else {
        return data;
      }
    } else {
      notification.error({
        message: "请求失败",
        description: "网络错误，请检查网络",
      });
      throw data;
    }
  }
}
export abstract class ListApi extends BaseApi {
  abstract url: string;

  getList<T = any, D = any>(params: D) {
    return this.getData<IListBaseModel<T>>(
      this.axios.get<IListBaseModel<T>>(`${this.url}/list`, { params }),
    );
  }
  getDetails<T = any, D = any>(params: D) {
    return this.getData<IBaseModel<T>>(
      this.axios.get<IBaseModel<T>>(`${this.url}/info`, { params }),
    );
  }
  add<T = any, D = any>(data: D) {
    return this.getData<IBaseModel<T>>(
      this.axios.post<IBaseModel<T>>(`${this.url}/add`, data),
    );
  }
  update<T = any, D = any>(data: D) {
    return this.getData<IBaseModel<T>>(
      this.axios.post<IBaseModel<T>>(`${this.url}/update`, data),
    );
  }
  delete<T = any, D = any>(params: D) {
    return this.getData<IBaseModel<T>>(
      this.axios.get<IBaseModel<T>>(`${this.url}/del`, { params }),
    );
  }
}
