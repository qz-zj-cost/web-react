import ProjectApi from "@/apis/projectApi";
import { IServiceCostModal } from "@/models/projectModel";
import { PlusOutlined } from "@ant-design/icons";
import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormGroup,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { Button, message } from "antd";
import {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ProjectContext } from "../../detailContext";

type IAddCostModalProps = {
  onSuccess: VoidFunction;
};
export type IAddCostModalRef = {
  onEdit: (e: any) => void;
};
const AddCostModal = forwardRef<IAddCostModalRef, IAddCostModalProps>(
  ({ onSuccess }, ref) => {
    const { projectId, projectInfo } = useContext(ProjectContext);
    const [form] = ProForm.useForm();
    const [visible, setVisible] = useState(false);
    const typeRef = useRef(0);
    const idRef = useRef<number>();

    useImperativeHandle(
      ref,
      () => ({
        onEdit: (e) => {
          setVisible(true);
          form.setFieldsValue(e);
          typeRef.current = 1;
          idRef.current = e.id;
        },
      }),
      [form],
    );
    return (
      <ModalForm<IServiceCostModal>
        trigger={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            disabled={projectInfo?.confirmStatus === 1}
          >
            添加服务费
          </Button>
        }
        title={typeRef.current === 0 ? "新增总包服务费" : "编辑总包服务费"}
        open={visible}
        onOpenChange={(e) => {
          if (!e) {
            typeRef.current = 0;
            form.resetFields();
          }
          setVisible(e);
        }}
        onFinish={async (val) => {
          try {
            if (typeRef.current === 0) {
              await ProjectApi.addServiceCost({
                ...val,
                projectId: Number(projectId),
              });
            } else {
              await ProjectApi.editServiceCost({
                ...val,
                projectId: Number(projectId),
                id: idRef.current,
              });
            }

            onSuccess();
            message.success(typeRef.current === 0 ? "新增成功" : "编辑成功");
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
          initialValue={1}
          rules={[{ required: true }]}
          options={[
            { value: 1, label: "地下室" },
            { value: 2, label: "主体" },
            { value: 3, label: "装饰装修" },
          ]}
        />
        <ProFormGroup>
          <ProFormText
            label="分包名称"
            width={"md"}
            name="subpackageName"
            rules={[{ required: true }]}
          />
          <ProFormText
            fieldProps={{ type: "number" }}
            label="分包金额"
            width={"md"}
            name="subpackageAmount"
          />
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
  },
);

export default AddCostModal;
