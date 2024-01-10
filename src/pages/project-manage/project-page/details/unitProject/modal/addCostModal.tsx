import ProjectApi from "@/apis/projectApi";
import { IServiceCostModal } from "@/models/projectModel";
import {
  ModalForm,
  ProFormDigit,
  ProFormGroup,
  ProFormInstance,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { Button, message } from "antd";
import { useContext, useRef } from "react";
import { ProjectContext } from "../..";

type IAddCostModalProps = {
  onSuccess: VoidFunction;
};
const AddCostModal = ({ onSuccess }: IAddCostModalProps) => {
  const { projectId } = useContext(ProjectContext);
  const formRef = useRef<ProFormInstance>(null);
  return (
    <ModalForm<IServiceCostModal>
      trigger={<Button type="primary">添加服务费</Button>}
      title="新增总包服务费"
      onFinish={async (val) => {
        try {
          await ProjectApi.addServiceCost({
            ...val,
            projectId: Number(projectId),
          });
          onSuccess();
          message.success("操作成功");
          formRef.current?.resetFields();
          return true;
        } catch (error) {
          return false;
        }
      }}
      formRef={formRef}
    >
      <ProFormRadio.Group
        name="stageType"
        label="阶段"
        width={"md"}
        options={[
          { value: 1, label: "地下室" },
          { value: 2, label: "主体" },
          { value: 3, label: "装饰装修" },
        ]}
      />
      <ProFormGroup>
        <ProFormText label="分包名称" width={"md"} name="subpackageName" />
        <ProFormDigit label="分包金额" width={"md"} name="subpackageAmount" />
        {/* <ProFormDigit label="管理费收入" width={"md"} name="managementFee" /> */}
        <ProFormDigit
          label="管理费比例"
          width={"md"}
          name="managementFeeRatio"
          fieldProps={{ suffix: "%" }}
        />
        <ProFormTextArea label="备注" width={"md"} name="remark" />
      </ProFormGroup>
    </ModalForm>
  );
};

export default AddCostModal;
