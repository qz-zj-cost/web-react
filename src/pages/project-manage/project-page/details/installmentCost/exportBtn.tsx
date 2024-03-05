import InstallmentApi from "@/apis/installmentApi";
import { Button } from "antd";
import fileDownload from "js-file-download";
import { useContext, useState } from "react";
import { ProjectContext } from "..";

const ExportBtn = ({
  fileName,
  ...props
}: {
  monthDate?: string;
  pageNum?: number;
  pageSize?: number;
  priceType: number;
  stageType: number;
  fileName: string;
}) => {
  const { projectId } = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    setLoading(true);
    InstallmentApi.export({ ...props, projectId })
      .then((res) => {
        fileDownload(res.data, `${fileName || new Date().getTime()}.xlsx`);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Button type="primary" loading={loading} onClick={handleClick}>
      导出Excel
    </Button>
  );
};

export default ExportBtn;
