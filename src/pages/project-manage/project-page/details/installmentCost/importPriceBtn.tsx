import InstallmentApi from "@/apis/installmentApi";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";
import { useContext, useState } from "react";
import { ProjectContext } from "../detailContext";

const ImportPriceBtn = ({ date }: { date?: string }) => {
  const { projectId } = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);

  const customRequest = (fileList: any) => {
    const data = new FormData();
    data.append("file", fileList.file);
    data.append("id", projectId);
    data.append("monthDate", date!);
    setLoading(true);
    InstallmentApi.importPrice(data)
      .then((res) => {
        message.success("导入成功");
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
    <Upload
      multiple
      customRequest={customRequest}
      showUploadList={false}
      disabled={!date}
    >
      <Button
        type="primary"
        disabled={!date}
        loading={loading}
        icon={<UploadOutlined />}
      >
        载入实际价格包
      </Button>
    </Upload>
  );
};

export default ImportPriceBtn;
