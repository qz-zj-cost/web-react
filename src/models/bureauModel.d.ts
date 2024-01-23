export interface IBureauItemModel {
  calcRule: string;
  classPath: string;
  code: string;
  content: string;
  corpQuotaMate: number;
  createDate: string;
  feature: string;
  id: number;
  name: string;
  nationalStandardMate: number;
  unit: string;
  uuid: string;
}

export interface IBureauTreeModel {
  childList: IBureauTreeModel[];
  level: number;
  name: string;
  type: number;
}
