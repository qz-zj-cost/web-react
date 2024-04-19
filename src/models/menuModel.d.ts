export interface IMenuModel {
  id: number | string;
  icon?: string;
  name: string;
  path: string;
  component?: string;
  children?: IMenuModel[];
  menuShow?: boolean;
  type: number;
  authCode: string;
  eventId?: number;
}

export interface MenuListModal {
  authorityId: number;
  authorityName: string;
  buttonCode?: string;
  parentId: number;
  icon: string;
  url: string;
  authorityCode: string;
  status: number;
  sort: number;
  authorityType: number;
  showStatus: number;
  createTime: string;
  createBy: string;
  modifyTime: string;
  modifyBy: string;
  remark?: any;
  children: MenuListModal[];
  show?: any;
  redirect?: any;
  frontComponents?: any;
  menuType?: any;
}
