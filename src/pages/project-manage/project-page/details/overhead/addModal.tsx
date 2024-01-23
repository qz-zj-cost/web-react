import ProjectApi from "@/apis/projectApi";
import { IServiceCostModal } from "@/models/projectModel";
import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormGroup,
  ProFormInstance,
  ProFormRadio,
  ProFormText,
} from "@ant-design/pro-components";
import { Button, message } from "antd";
import { useContext, useRef } from "react";
import { ProjectContext } from "..";
import BureauSelect from "../components/BureauSelect";

type IAddModalProps = {
  onSuccess?: VoidFunction;
  feeType: number; //
};

const typeMap = new Map([
  [1, "现场经费"],
  [2, "规费及其他应缴费"],
  [3, "税金及附加"],
  [4, "资金占用费"],
]);
const AddModal = ({ onSuccess, feeType }: IAddModalProps) => {
  const { projectId } = useContext(ProjectContext);
  const formRef = useRef<ProFormInstance>(null);
  return (
    <ModalForm<IServiceCostModal>
      trigger={<Button type="primary">{`添加${typeMap.get(feeType)}`}</Button>}
      title={`新增${typeMap.get(feeType)}`}
      onFinish={async (val) => {
        try {
          await ProjectApi.addOverHeadCost({
            ...val,
            feeType,
            projectId: Number(projectId),
          });
          message.success("操作成功");
          onSuccess?.();
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
        rules={[{ required: true }]}
        width={"md"}
        options={[
          { value: 1, label: "地下室" },
          { value: 2, label: "主体" },
          { value: 3, label: "装饰装修" },
        ]}
      />
      <ProFormGroup>
        <ProFormText label="费用名称" width={"md"} name="feeName" />
        <ProFormText label="单位" width={"md"} name="unit" />
        <ProFormDigit
          label="合同收入单价"
          width={"md"}
          name="incomePrice"
          rules={[{ required: true }]}
        />
        <ProFormDigit
          label="合同收入工程量"
          width={"md"}
          name="incomeNum"
          rules={[{ required: true }]}
        />
        <ProFormDigit
          label="目标成本单价"
          width={"md"}
          name="notIncludedPrice"
        />
        <ProFormDigit label="目标成本工程量" width={"md"} name="num" />

        <ProForm.Item label="局清单" name="groupBillUuid">
          <BureauSelect />
        </ProForm.Item>
      </ProFormGroup>
    </ModalForm>
  );
};

export default AddModal;
