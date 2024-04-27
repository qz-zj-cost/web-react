import InstallmentApi from "@/apis/installmentApi";
import { Button } from "antd";
import fileDownload from "js-file-download";
import { useContext, useState } from "react";
import { ProjectContext } from "..";

const ExportActualCost = ({ monthDate }: { monthDate?: string }) => {
  const { projectId } = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    if (!monthDate) return;
    setLoading(true);
    try {
      const res = await InstallmentApi.exportActualCost({
        monthDate,
        projectId,
      });
      fileDownload(res.data, `局清单实际成本.xlsx`);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <Button
      type="primary"
      disabled={!monthDate}
      loading={loading}
      onClick={handleClick}
    >
      导出局清单实际成本
    </Button>
  );
};

export default ExportActualCost;
