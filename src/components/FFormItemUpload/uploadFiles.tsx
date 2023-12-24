import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import { UploadFile } from "antd/lib/upload/interface";
import { isArray } from "lodash";
import { useMemo } from "react";
import { IUploadBaseProps } from "./types";
import { useUpload } from "./useUpload";

const UploadFiles = <T extends any>({
  value,
  onChange,
  value2List,
  list2value,
  url,
  mode = "multiple",
  params,
  ...props
}: IUploadBaseProps<T>) => {
  const { customRequest, getFileList, setFileList } = useUpload(
    url,
    value2List,
    params,
  );

  const handleChange = (list: UploadFile[]) => {
    setFileList(list.length > 0 ? list : void 0);
    if (list2value) {
      const __value = list2value(list);
      onChange?.(__value);
    }
  };
  const getDisabled = useMemo(() => {
    if (mode === "signle") {
      if (isArray(value)) {
        return value.length > 0 ? true : false;
      } else {
        return value ? true : false;
      }
    } else {
      if (isArray(value) && props.maxCount && value.length >= props.maxCount)
        return true;
      return false;
    }
  }, [mode, props.maxCount, value]);
  return (
    <Upload
      customRequest={customRequest}
      fileList={props.showUploadList === false ? void 0 : getFileList(value)}
      onChange={({ fileList }) => {
        handleChange(fileList);
      }}
      {...props}
    >
      <Button disabled={getDisabled} type="primary" icon={<UploadOutlined />}>
        点击上传
      </Button>
    </Upload>
  );
};

export default UploadFiles;
