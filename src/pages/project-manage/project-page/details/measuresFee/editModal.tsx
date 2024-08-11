import { ContractImportApi } from "@/apis/projectApi";
import { EditOutlined } from "@ant-design/icons";
import { ModalForm } from "@ant-design/pro-components";
import { Typography, message } from "antd";
import { ReactElement, useContext } from "react";
import { ProjectContext } from "../detailContext";

const EditModal = ({
  children,
  id,
  onSuccess,
}: {
  children: ReactElement;
  id: number;
  onSuccess: VoidFunction;
}) => {
  const { projectInfo } = useContext(ProjectContext);
  return (
    <ModalForm
      title={`修改`}
      trigger={
        <Typography.Link disabled={projectInfo?.confirmStatus === 1}>
          <EditOutlined />
        </Typography.Link>
      }
      width={400}
      modalProps={{ destroyOnClose: true }}
      onFinish={async (val) => {
        try {
          await ContractImportApi.modify({ ...val, id });
          message.success("修改成功");
          onSuccess();
          return true;
        } catch (error) {
          return false;
        }
      }}
    >
      {children}
    </ModalForm>
  );
};

export default EditModal;
