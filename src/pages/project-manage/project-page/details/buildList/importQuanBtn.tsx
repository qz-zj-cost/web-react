import BuildApi from "@/apis/buildApi";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";
import { useContext, useState } from "react";
import { ProjectContext } from "..";
//导入构件计算书
type IImportQuanBtnProps = {
  onSuccess: VoidFunction;
};
const ImportQuanBtn = ({ onSuccess }: IImportQuanBtnProps) => {
  const { projectId } = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const customRequest = (fileList: any) => {
    const data = new FormData();
    data.append("file", fileList.file);
    data.append("id", projectId);

    setLoading(true);
    BuildApi.importQuan(data)
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
        导入砼等级
      </Button>
    </Upload>
  );
};

export default ImportQuanBtn;
