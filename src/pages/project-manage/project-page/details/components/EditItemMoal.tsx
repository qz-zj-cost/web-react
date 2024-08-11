import { EditOutlined } from "@ant-design/icons";
import { ModalForm } from "@ant-design/pro-components";
import { Typography, message } from "antd";
import { ReactElement, useContext } from "react";
import { ProjectContext } from "../detailContext";

const EditItemModal = ({
  children,
  onSuccess,
  title,
  api,
}: {
  children: ReactElement;
  onSuccess: VoidFunction;
  title: string;
  api: (val: any) => Promise<any>;
}) => {
  const { projectInfo } = useContext(ProjectContext);
  return (
    <ModalForm
      title={`修改${title}`}
      trigger={
        <Typography.Link disabled={projectInfo?.confirmStatus === 1}>
          <EditOutlined />
        </Typography.Link>
      }
      width={400}
      modalProps={{ destroyOnClose: true }}
      onFinish={async (val) => {
        try {
          await api({ ...val });
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

export default EditItemModal;
