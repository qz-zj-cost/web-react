import ExterpriseApi from "@/apis/exterpriseApi";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";
import { useState } from "react";

type IImportBtnProps = {
  onSuccess: VoidFunction;
};
const ImportBtn = ({ onSuccess }: IImportBtnProps) => {
  const [loading, setLoading] = useState(false);
  const customRequest = (fileList: any) => {
    const data = new FormData();
    data.append("file", fileList.file);

    setLoading(true);
    ExterpriseApi.importPrice(data)
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
    <Upload multiple customRequest={customRequest} showUploadList={false}>
      <Button type="primary" loading={loading} icon={<UploadOutlined />}>
        导入价格包
      </Button>
    </Upload>
  );
};

export default ImportBtn;
