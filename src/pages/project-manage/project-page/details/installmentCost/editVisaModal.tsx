import InstallmentApi from "@/apis/installmentApi";
import {
  ModalForm,
  ProForm,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { Button } from "antd";
import {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ProjectContext } from "../detailContext";

export type IEditVisaModalRef = {
  show: (e: any) => void;
};
type IEditVisaModalProps = {
  onSuccess: () => void;
  dateQuantitiesId?: string;
};
const EditVisaModal = forwardRef<IEditVisaModalRef, IEditVisaModalProps>(
  ({ onSuccess, dateQuantitiesId }, ref) => {
    const [visible, setVisible] = useState(false);
    const dataRef = useRef<any>();
    const [type, setType] = useState(0);
    const { projectId } = useContext(ProjectContext);
    const [form] = ProForm.useForm();
    useImperativeHandle(
      ref,
      () => ({
        show: (e) => {
          dataRef.current = e;
          form.setFieldsValue(e);
          setVisible(true);
          setType(1);
        },
      }),
      [form],
    );
    return (
      <ModalForm
        open={visible}
        form={form}
        onOpenChange={(e) => {
          form.resetFields();
          setVisible(e);
        }}
        trigger={
          <Button
            type="primary"
            onClick={() => {
              setType(0);
            }}
          >
            新增签证变更
          </Button>
        }
        title={type === 0 ? "新增签证变更" : "编辑签证变更"}
        onFinish={async (val) => {
          try {
            if (type === 0) {
              await InstallmentApi.addVisa({
                ...val,
                projectId,
                dateQuantitiesId,
              });
            } else {
              await InstallmentApi.updateVisa({
                ...val,
                projectId,
                dateQuantitiesId,
                id: dataRef.current.id,
              });
            }
            onSuccess();
            return true;
          } catch (error) {
            return false;
          }
        }}
      >
        <ProFormGroup>
          <ProFormText
            width={"md"}
            name="visaChangeName"
            label="变更签证名称"
            rules={[{ required: true }]}
          />
          <ProFormText
            width={"md"}
            name="visaChangeNo"
            label="变更签证单号"
            rules={[{ required: true }]}
          />
          <ProFormSelect
            width={"md"}
            name="stageType"
            label="阶段"
            rules={[{ required: true }]}
            options={[
              { label: "地下室阶段", value: "1" },
              { label: "主体", value: "2" },
              { label: "装饰修饰", value: "3" },
            ]}
          />
          <ProFormSelect
            width={"md"}
            name="visaChangeType"
            label="变更签证类型"
            options={[
              "设计变更",
              "工程洽商",
              "现场签证",
              "费用补充",
              "奖金收入",
            ]}
          />
          <ProFormText
            fieldProps={{ type: "number" }}
            width={"md"}
            name="incomeSumPrice"
            label="收入预计"
          />
          <ProFormText
            fieldProps={{ type: "number" }}
            width={"md"}
            name="sumPrice"
            label="目标成本"
          />
          <ProFormText
            fieldProps={{ type: "number" }}
            width={"md"}
            name="actualSumPrice"
            label="实际成本"
          />
          <ProFormText width={"md"} name="remark" label="备注" />
        </ProFormGroup>
      </ModalForm>
    );
  },
);

export default EditVisaModal;
