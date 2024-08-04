import InstallmentApi from "@/apis/installmentApi";
import { Button } from "antd";
import fileDownload from "js-file-download";
import { useContext, useState } from "react";
import { ProjectContext } from "../detailContext";

const ExportBtn = ({
  fileName,
  priceType,
  type,
  ...props
}: {
  dateQuantitiesId?: string;
  pageNum?: number;
  pageSize?: number;
  priceType: number;
  stageType: number;
  type?: number;
  fileName: string;
}) => {
  const { projectId } = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    try {
      if (type === void 0) {
        const res = await InstallmentApi.export({
          ...props,
          priceType,
          projectId,
        });
        fileDownload(res.data, `${fileName || new Date().getTime()}.xlsx`);
      } else {
        const res = await InstallmentApi.exportOther({
          ...props,
          type,
          priceType,
          projectId,
        });
        fileDownload(res.data, `${fileName || new Date().getTime()}.xlsx`);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <Button type="primary" loading={loading} onClick={handleClick}>
      导出Excel
    </Button>
  );
};

export default ExportBtn;
