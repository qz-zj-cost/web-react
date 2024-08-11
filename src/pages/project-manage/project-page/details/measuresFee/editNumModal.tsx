import { ContractImportApi } from "@/apis/projectApi";
import { EditOutlined } from "@ant-design/icons";
import { ModalForm, ProFormDigit } from "@ant-design/pro-components";
import { Typography, message } from "antd";
import { useContext } from "react";
import { ProjectContext } from "../detailContext";

const EditNumModal = ({
  id,
  onSuccess,
}: {
  id: number;
  onSuccess: VoidFunction;
}) => {
  const { projectInfo } = useContext(ProjectContext);
  return (
    <ModalForm<{ num: number }>
      title={`修改工程量`}
      trigger={
        <Typography.Link disabled={projectInfo?.confirmStatus === 1}>
          <EditOutlined />
        </Typography.Link>
      }
      width={400}
      modalProps={{ destroyOnClose: true }}
      onFinish={async (val) => {
        try {
          await ContractImportApi.modifyNum({ ...val, extendId: id });
          message.success("修改成功");
          onSuccess();
          return true;
        } catch (error) {
          return false;
        }
      }}
    >
      <ProFormDigit
        name={"num"}
        label={"工程量"}
        rules={[{ required: true }]}
      />
    </ModalForm>
  );
};

export default EditNumModal;
