export interface IBaseModel<T = any> {
  code: string;
  message: string;
  exceptionMessage: string;
  data: T;
}
export interface IListBaseModel<T = any> extends IBaseModel<T> {
  pageNum: number;
  pageSize: number;
  totalRow: number;
  totalPage: number;
}
