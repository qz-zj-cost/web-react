import InstallmentApi from "@/apis/installmentApi";
import {
  ModalForm,
  ProFormInstance,
  ProFormRadio,
} from "@ant-design/pro-components";
import { message } from "antd";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

export type IEditTypeModalRef = {
  show: (e: { id: number }) => void;
};
const EditTypeModal = forwardRef<IEditTypeModalRef, { onSuccess: () => void }>(
  ({ onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const formRef = useRef<ProFormInstance>(null);
    const idRef = useRef<number>();
    useImperativeHandle(
      ref,
      () => ({
        show: (e) => {
          setVisible(true);
          idRef.current = e.id;
        },
      }),
      [],
    );
    return (
      <ModalForm
        open={visible}
        formRef={formRef}
        title="选择管理类型-归属"
        onOpenChange={(e) => {
          if (!e) {
            setVisible(false);
            formRef.current?.resetFields();
          }
        }}
        width={500}
        initialValues={{ type: 1 }}
        onFinish={async (val) => {
          try {
            await InstallmentApi.addSupplyType({
              ...val,
              settlementPriceInfoDateId: idRef.current,
            });
            formRef.current?.resetFields();
            message.success("修改成功");
            onSuccess();
            return true;
          } catch (error) {
            return false;
          }
        }}
      >
        <ProFormRadio.Group
          label="类型归属"
          name="type"
          options={[
            { label: "设备管理", value: 1 },
            { label: "物资管理", value: 2 },
            { label: "劳务管理", value: 3 },
            { label: "财务管理", value: 4 },
          ]}
        ></ProFormRadio.Group>
      </ModalForm>
    );
  },
);

export default EditTypeModal;
