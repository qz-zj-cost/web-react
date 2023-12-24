import ProjectApi from "@/apis/projectApi";
import {
  ModalForm,
  ProFormRadio,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

export type IReviewModalRef = {
  show: (id: number | number[], type?: number) => void;
};
const ReviewModal = forwardRef<IReviewModalRef, { onCreate: VoidFunction }>(
  ({ onCreate }, ref) => {
    const [visible, setVisible] = useState(false);
    const idRef = useRef<number | number[]>();
    const typeRef = useRef(0); //是否批量审核 0单独 1批量
    useImperativeHandle(
      ref,
      () => ({
        show: (id, type = 0) => {
          idRef.current = id;
          typeRef.current = type;
          setVisible(true);
        },
      }),
      [],
    );
    return (
      <ModalForm<{ expertStatus: number; opinion: string }>
        open={visible}
        title="审核"
        width={500}
        modalProps={{
          destroyOnClose: true,
        }}
        onOpenChange={(e) => setVisible(e)}
        onFinish={async (val) => {
          try {
            if (!idRef.current) return;
            if (typeRef.current === 0) {
              await ProjectApi.match.review({
                ...val,
                originalInventoryId: idRef.current as number,
              });
            } else {
              await ProjectApi.match.allReview({
                ...val,
                originalInventoryIdList: idRef.current as number[],
              });
            }

            onCreate();
            return true;
          } catch (error) {
            return false;
          }
        }}
      >
        <ProFormRadio.Group
          label="审核状态"
          width="md"
          name="expertStatus"
          options={[
            { label: "不通过", value: 1 },
            { label: "通过", value: 2 },
          ]}
          required={true}
          rules={[{ required: true }]}
          initialValue={2}
        />
        <ProFormTextArea
          width="lg"
          label="审核意见"
          name="opinion"
          placeholder={"请输入审核意见"}
        />
      </ModalForm>
    );
  },
);

export default ReviewModal;
