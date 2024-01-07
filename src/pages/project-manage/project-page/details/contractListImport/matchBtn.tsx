import { ContractImportApi } from "@/apis/projectApi";
import { Button, message } from "antd";
import { useContext, useState } from "react";
import { ProjectContext } from "..";

const MatchBtn = () => {
  const [loading, setloading] = useState(false);
  const { projectId } = useContext(ProjectContext);
  const handleClick = () => {
    setloading(true);
    ContractImportApi.smartMatch({ projectId })
      .then(() => {
        message.success("操作成功");
      })
      .finally(() => {
        setloading(false);
      });
  };
  return (
    <Button loading={loading} onClick={handleClick} type="primary">
      智能匹配局清单
    </Button>
  );
};

export default MatchBtn;
