export interface IProjectModel {
  id: number;
  projectName: string;
  calculationCode: string;
  constructionUnit: string;
  designUnit: string;
  developmentUnit: string;
  parentOrganization: string;
  budgetType: string;
  budgetStage: string;
  contractIncome: string;
  contractName: string;
  contractNumber: string;
  contractAmount: string;
  projectDuration: string;
  contractStartDate: string;
  contractEndDate: string;
  projectLocation: string;
  vatRate: string;
  targetCost: string;
  actualCost: number;
  projectManager: string;
  auditsStatus: string;
}

export interface ExpertList {
  id: number;
  projectId: number;
  userId: number;
  name: string;
  speciality: string;
}
//原始工程量 单位工程数据模型
export interface IEqModel {
  id: number;
  projectId: number;
  unitProject: string;
  engineerStatus: number;
  expertStatus: number;
  unitSectionDtos: UnitSectionDto[];
}

export interface UnitSectionDto {
  fallName: string;
  id: number;
  name: string;
  projectId: number;
  unitProject: string;
  unitProjectId: number;
}
export interface IMatchItemModel {
  approvedQuantity: number;
  calcCode: string;
  calcFeature: string;
  calcName: string;
  calcQuantity: number;
  calcUnit: string;
  expertStatus: number;
  matchStatus: number;
  operandInventoryId: number;
  orgCode: string;
  orgFeature: string;
  orgName: string;
  orgQuantity: number;
  orgUnit: string;
  originalInventoryId: number;
  projectId: number;
  sectionId: number;
  unitProjectId: number;
}

export interface IProjectTypeModel {
  id: number;
  projectId: number;
  status: number;
  unitProject: string;
  unitSectionDtoList: [
    {
      id: number;
      name: string;
      projectId: number;
      totalAmount: number;
      uuid: string;
    },
  ];
  uuid: string;
}
interface IAreaItem {
  area: string;
  corpQuotaCode: string;
  monthDate: string;
  price: number;
}
