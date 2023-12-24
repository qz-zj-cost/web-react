import ProjectApi from "@/apis/projectApi";
import { DownloadOutlined } from "@ant-design/icons";
import { App, Button } from "antd";
import fileDownload from "js-file-download";

const DownloadButton = ({ id, name }: { id: number | null; name?: string }) => {
  const { message } = App.useApp();
  const downloadExcel = () => {
    if (!id) return message.warning("请选择单位工程");
    ProjectApi.exportExcel(id).then((res) => {
      fileDownload(res, `${name?.split("(")[0] ?? "工程清单"}.xlsx`);
    });
  };
  return (
    <Button type="primary" icon={<DownloadOutlined />} onClick={downloadExcel}>
      导出工程清单
    </Button>
  );
};

export default DownloadButton;
