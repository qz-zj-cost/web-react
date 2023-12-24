/**
 * @author Destin
 * @description 提交审核按钮
 * @date 2023/10/11
 */

import ProjectApi from "@/apis/projectApi";
import { Button, message } from "antd";
import { useState } from "react";

type IApplyBtnProps = {
  projectId?: number;
  type: number;
  unitProjectId?: number | null;
  disabled?: boolean;
  callback?: VoidFunction;
};
const ApplyBtn = ({
  projectId,
  type,
  unitProjectId,
  disabled,
  callback,
}: IApplyBtnProps) => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const handleSubmit = () => {
    if (!projectId || !unitProjectId) return message.warning("请选择单位工程");
    setLoading(true);
    ProjectApi.apply({ projectId, type, unitProjectId })
      .then(() => {
        messageApi.success("提交成功");
        callback?.();
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        disabled={disabled}
        onClick={handleSubmit}
        loading={loading}
      >
        {type === 2 ? "提交审核" : "审核完成"}
      </Button>
    </>
  );
};

export default ApplyBtn;
