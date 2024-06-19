import ProjectApi from "@/apis/projectApi";
import { ModalForm, ProFormRadio } from "@ant-design/pro-components";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

export type IAdModalRef = {
  show: (ids: number[]) => void;
};
const AdModal = forwardRef<IAdModalRef, { onSuccess: VoidFunction }>(
  ({ onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const idsRef = useRef<number[]>([]);
    useImperativeHandle(
      ref,
      () => ({
        show: (ids) => {
          idsRef.current = ids;
          setVisible(true);
        },
      }),
      [],
    );
    return (
      <ModalForm<{ priceType: number; stageType: number }>
        modalProps={{ destroyOnClose: true }}
        open={visible}
        onOpenChange={(e) => {
          setVisible(e);
        }}
        title="调整分类和阶段"
        width={600}
        onFinish={async (val) => {
          try {
            await ProjectApi.updateStage({ ...val, ids: idsRef.current });
            onSuccess();
            return true;
          } catch (error) {
            return false;
          }
        }}
      >
        <ProFormRadio.Group
          name="priceType"
          label="分类"
          options={[
            { value: 1, label: "直接人工费" },
            { value: 2, label: "直接材料费" },
            { value: 3, label: "分包工程支出" },
            { value: 4, label: "机械使用费" },
            { value: 5, label: "周转材料费（采购类" },
            { value: 6, label: "周转材料费（租赁类）" },
            { value: 7, label: "安全文明施工费" },
            { value: 8, label: "其他措施费" },
          ]}
          rules={[{ required: true }]}
        />
        <ProFormRadio.Group
          name="stageType"
          label="阶段"
          rules={[{ required: true }]}
          options={[
            { value: 1, label: "地下室" },
            { value: 2, label: "主体" },
            { value: 3, label: "装修装饰" },
          ]}
        />
      </ModalForm>
    );
  },
);
export default AdModal;
