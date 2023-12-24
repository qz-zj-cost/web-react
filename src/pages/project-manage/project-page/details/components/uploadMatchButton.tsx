import HttpApi from "@/utils/https";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";
import { Key, useState } from "react";

type IUploadMatchButtonProps = {
  id?: Key;
  unitProjectId?: number | null;
  disabled?: boolean;
  onSuccess: VoidFunction;
};
const UploadMatchButton = ({
  id,
  unitProjectId,
  disabled,
  onSuccess,
}: IUploadMatchButtonProps) => {
  const [loading, setLoading] = useState(false);
  const customRequest = (fileList: any) => {
    const data = new FormData();
    data.append("file", fileList.file);
    data.append("id", id as any);
    data.append("unitProjectId", unitProjectId as any);
    setLoading(true);
    HttpApi.request({
      url: "/api/project/operandInventory/import",
      data,
      timeout: 3 * 60 * 1000,
      method: "POST",
      onUploadProgress: (progressEvent) => {
        const percent =
          Math.round((progressEvent.loaded / progressEvent.total!) * 10000) /
          100.0;
        fileList.onProgress({ percent });
      },
    })
      .then((res) => {
        message.success("导入成功");
        onSuccess();
        fileList.onSuccess({ ...res.data });
      })
      .catch((err) => {
        fileList.onError(err, fileList);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Upload customRequest={customRequest} showUploadList={false}>
      <Button
        type="primary"
        loading={loading}
        disabled={!unitProjectId || disabled}
        icon={<UploadOutlined />}
      >
        导入算量文件
      </Button>
    </Upload>
  );
};

export default UploadMatchButton;
