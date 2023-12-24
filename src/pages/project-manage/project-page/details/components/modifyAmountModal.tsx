import ProjectApi from "@/apis/projectApi";
import { ModalForm, ProFormDigit } from "@ant-design/pro-components";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

export type IModifyAmountModalRef = {
  show: (id: number) => void;
};
const ModifyAmountModal = forwardRef<
  IModifyAmountModalRef,
  { onCreate: VoidFunction }
>(({ onCreate }, ref) => {
  const [visible, setVisible] = useState(false);
  const idRef = useRef<number>();
  useImperativeHandle(
    ref,
    () => ({
      show: (id) => {
        idRef.current = id;
        setVisible(true);
      },
    }),
    [],
  );
  return (
    <ModalForm<{ approvedQuantity: number }>
      open={visible}
      title="修改核定工程量"
      width={500}
      modalProps={{
        destroyOnClose: true,
      }}
      onOpenChange={(e) => setVisible(e)}
      onFinish={async (val) => {
        try {
          if (!idRef.current) return;
          await ProjectApi.match.modifyMoney({
            ...val,
            originalInventoryId: idRef.current,
          });
          onCreate();
          return true;
        } catch (error) {
          return false;
        }
      }}
    >
      <ProFormDigit
        width="lg"
        name="approvedQuantity"
        placeholder={"请输入核定工程量"}
      />
    </ModalForm>
  );
});

export default ModifyAmountModal;
