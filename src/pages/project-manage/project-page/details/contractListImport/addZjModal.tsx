import { ContractImportApi } from "@/apis/projectApi";
import { PlusOutlined } from "@ant-design/icons";
import {
  ModalForm,
  ProFormDigit,
  ProFormGroup,
  ProFormItem,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { Button } from "antd";
import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { ProjectContext } from "..";
import FormItemMatchBureauList from "../components/FormItemMatchBureauList";

type IAddZjModalRef = {
  show: (e: any) => void;
};
type IAddZjModalProps = {
  onSuccess: () => void;
};
const AddZjModal = forwardRef<IAddZjModalRef, IAddZjModalProps>(
  ({ onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const { projectId } = useContext(ProjectContext);
    useImperativeHandle(
      ref,
      () => ({
        show: () => {
          setVisible(true);
        },
      }),
      [],
    );
    return (
      <ModalForm
        open={visible}
        onOpenChange={(e) => {
          if (!e) {
            setVisible(false);
          }
        }}
        title="新增总价措施费"
        trigger={
          <Button type="primary" icon={<PlusOutlined />}>
            新增总价措施费
          </Button>
        }
        onFinish={async (values) => {
          try {
            await ContractImportApi.addZj({ ...values, projectId });
            onSuccess();
            return true;
          } catch (error) {
            return false;
          }
        }}
        submitTimeout={2000}
      >
        <ProFormGroup>
          <ProFormText
            name="priceName"
            label="项目名称"
            width="md"
            rules={[
              {
                required: true,
              },
            ]}
          />
          <ProFormText
            fieldProps={{ type: "number" }}
            name="amount"
            label="金额"
            width="md"
            rules={[
              {
                required: true,
              },
            ]}
          />
          <ProFormSelect
            name="unitProjectUuid"
            label="单位工程"
            width="md"
            rules={[
              {
                required: true,
              },
            ]}
            request={async () => {
              const res = await ContractImportApi.getProjectTypeList({
                id: projectId,
                type: 1,
              });
              const opts = res.data.map((v) => ({
                label: v.unitProject,
                value: v.uuid,
              }));
              return opts;
            }}
          />
          <ProFormDigit name="sort" label="排序" width="md" />
          <ProFormItem name="groupBillUuidList" label="局清单">
            <FormItemMatchBureauList />
          </ProFormItem>
        </ProFormGroup>
      </ModalForm>
    );
  },
);

export default AddZjModal;
