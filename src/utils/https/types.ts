import { AxiosRequestConfig } from "axios";

export type IResponseType<T = any> = {
  code: number;
  message: string;
  data: T;
  pageNum?: number;
  pageSize?: number;
  totalPage?: number;
  totalRow?: number;
};

export interface IConfig extends AxiosRequestConfig {
  authError?: boolean;
}

export interface IHttpModel {}

export interface IHttpFunConfig extends Omit<IConfig, "method"> {}
