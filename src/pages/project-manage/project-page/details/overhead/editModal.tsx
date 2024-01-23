import ProjectApi from "@/apis/projectApi";
import { IServiceCostModal } from "@/models/projectModel";
import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormGroup,
  ProFormRadio,
  ProFormText,
} from "@ant-design/pro-components";
import { Form, Typography, message } from "antd";
import { useContext, useEffect, useState } from "react";
import { ProjectContext } from "..";
import BureauSelect from "../components/BureauSelect";

type IEditModalProps = {
  onSuccess?: VoidFunction;
  feeType: number;
  record: any;
};

const typeMap = new Map([
  [1, "现场经费"],
  [2, "规费及其他应缴费"],
  [3, "税金及附加"],
  [4, "资金占用费"],
]);
const EditModal = ({ onSuccess, feeType, record }: IEditModalProps) => {
  const { projectId } = useContext(ProjectContext);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (record && form && visible) {
      form?.setFieldsValue(record);
    }
  }, [form, record, visible]);

  return (
    <>
      <Typography.Link
        onClick={() => {
          setVisible(true);
        }}
      >
        编辑
      </Typography.Link>

      <ModalForm<IServiceCostModal>
        open={visible}
        onOpenChange={(e) => {
          if (!e) setVisible(e);
        }}
        title={`编辑${typeMap.get(feeType)}`}
        modalProps={{ destroyOnClose: true }}
        onFinish={async (val) => {
          try {
            await ProjectApi.updateOverHeadCost({
              ...val,
              feeType,
              projectId: Number(projectId),
              id: record.id,
            });
            message.success("操作成功");
            onSuccess?.();
            form.resetFields();

            return true;
          } catch (error) {
            return false;
          }
        }}
        form={form}
      >
        <ProFormRadio.Group
          name="stageType"
          label="阶段"
          width={"md"}
          rules={[{ required: true }]}
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
    </>
  );
};

export default EditModal;
