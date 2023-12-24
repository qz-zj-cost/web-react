/**
 * @author Destin
 * @description 提交项目按钮
 * @date 2023/10/11
 */

import ProjectApi from "@/apis/projectApi";
import { Button, message } from "antd";
import { useState } from "react";

type ISubBtnProps = {
  id?: number;
  callback?: VoidFunction;
};
const SubBtn = ({ id, callback }: ISubBtnProps) => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const handleSubmit = () => {
    if (!id) return;
    setLoading(true);
    ProjectApi.updateStatus({ id })
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
      <Button type="primary" onClick={handleSubmit} loading={loading}>
        提交项目
      </Button>
    </>
  );
};

export default SubBtn;
