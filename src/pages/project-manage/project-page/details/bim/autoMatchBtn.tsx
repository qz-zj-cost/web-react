import BimApi from "@/apis/bimApi";
import { Button, message } from "antd";
import { useContext, useState } from "react";
import { ProjectContext } from "../detailContext";

const AutoMatchBtn = ({
  unitProjectUuid,
  onSuccess,
}: {
  unitProjectUuid: string;
  onSuccess: VoidFunction;
}) => {
  const { projectId } = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const handleAutoMatch = () => {
    setLoading(true);
    BimApi.automMatch({ projectId, unitProjectUuid })
      .then(() => {
        message.success("操作成功");
        onSuccess();
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Button loading={loading} type="primary" onClick={handleAutoMatch}>
      自动匹配
    </Button>
  );
};

export default AutoMatchBtn;
