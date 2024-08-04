import InstallmentApi from "@/apis/installmentApi";
import { EditOutlined } from "@ant-design/icons";
import { ModalForm } from "@ant-design/pro-components";
import { Typography, message } from "antd";
import { ReactElement } from "react";

const EditModal = ({
  children,
  id,
  onSuccess,
  title,
  type,
  disabled = false,
}: {
  children: ReactElement;
  id: number;
  onSuccess: VoidFunction;
  title: string;
  type: number;
  disabled?: boolean;
}) => {
  return (
    <ModalForm
      title={`修改${title}`}
      trigger={
        <Typography.Link disabled={disabled}>
          <EditOutlined />
        </Typography.Link>
      }
      width={400}
      modalProps={{ destroyOnClose: true }}
      onFinish={async (val) => {
        try {
          await InstallmentApi.updateOther({ ...val, id, type } as any);
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
