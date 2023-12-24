import { UploadProps } from "antd";
import { UploadFile } from "antd/lib/upload/interface";

export type value2List<T> = (val: T) => UploadProps["fileList"];
export type list2value<T> = (list: UploadFile[]) => T;
export interface IUploadBaseProps<T = any>
  extends Omit<UploadProps, "onChange"> {
  value?: T;
  onChange?: (e: T) => void;
  value2List?: value2List<T>;
  list2value: list2value<T>;
  url: string;
  mode?: "signle" | "multiple";
  params?: Record<string, any>;
}
