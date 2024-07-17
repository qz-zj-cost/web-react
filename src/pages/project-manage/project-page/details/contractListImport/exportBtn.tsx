import { ContractImportApi } from "@/apis/projectApi";
import { Button } from "antd";
import fileDownload from "js-file-download";
import { useContext, useState } from "react";
import { ProjectContext } from "../detailContext";

const ExportBtn = ({
  fileName,
  ...props
}: {
  type: number; //1.分部分项清单表 2.措施项目清单
  pageNum?: number;
  pageSize?: number;
  unitProjectUuid?: string;
  unitSectionUuid?: string;
  fileName: string;
}) => {
  const { projectId } = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    setLoading(true);
    ContractImportApi.export({ ...props, projectId })
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
