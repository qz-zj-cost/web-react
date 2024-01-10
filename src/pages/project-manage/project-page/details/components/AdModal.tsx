import ProjectApi from "@/apis/projectApi";
import { ModalForm, ProFormRadio } from "@ant-design/pro-components";
import { Typography } from "antd";

const AdModal = ({
  id,
  onSuccess,
}: {
  id: number;
  onSuccess: VoidFunction;
}) => {
  return (
    <ModalForm<{ priceType: number; stageType: number }>
      modalProps={{ destroyOnClose: true }}
      trigger={<Typography.Link>调整</Typography.Link>}
      title="调整分类和阶段"
      width={600}
      onFinish={async (val) => {
        try {
          await ProjectApi.updateStage({ ...val, id });
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
      />
      <ProFormRadio.Group
        name="stageType"
        label="阶段"
        options={[
          { value: 1, label: "地下室" },
          { value: 2, label: "主体" },
          { value: 3, label: "装修装饰" },
        ]}
      />
    </ModalForm>
  );
};
export default AdModal;
