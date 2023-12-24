interface IExterpriseTypeModel {
  childList: IExterpriseTypeModel[];
  code: string;
  id: number;
  name: string;
  parentId: number;
}

interface IExterpriseItemModel {
  code: string;
  name: string;
  unit: string;
  feature: string;
  content: string;
  calcRule: string;
  status: number;
}
