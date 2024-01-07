import { ContractImportApi } from "@/apis/projectApi";
import { Button, message } from "antd";
import { useState } from "react";

const MatchBtn = (props: { uuid?: string; unitProjectUuid?: string }) => {
  const [loading, setloading] = useState(false);
  const handleClick = () => {
    if (!props.unitProjectUuid || !props.uuid) return;
    setloading(true);
    ContractImportApi.smartMatch(props)
      .then(() => {
        message.success("操作成功");
      })
      .finally(() => {
        setloading(false);
      });
  };
  return (
    <Button
      disabled={!props.unitProjectUuid || !props.uuid}
      loading={loading}
      onClick={handleClick}
      type="primary"
    >
      智能匹配局清单
    </Button>
  );
};

export default MatchBtn;
