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
