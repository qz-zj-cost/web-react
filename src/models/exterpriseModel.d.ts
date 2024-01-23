export interface IExterpriseTypeModel {
  childList: IExterpriseTypeModel[];
  code: string;
  id: number;
  name: string;
  parentId: number;
}

export interface IExterpriseItemModel {
  code: string;
  name: string;
  unit: string;
  feature: string;
  content: string;
  calcRule: string;
  status: number;
}

export interface IAraeItemModel {
  area: string;
  corpQuotaCode: string;
  monthDate: string;
  price: number;
}
