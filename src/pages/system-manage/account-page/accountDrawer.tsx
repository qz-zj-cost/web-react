import AccountApi from "@/apis/accountApi";
import { PlusOutlined } from "@ant-design/icons";
import {
  ModalForm,
  ProFormGroup,
  ProFormText,
} from "@ant-design/pro-components";
import { Button, Form } from "antd";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

type IAccountDarwerProps = {
  onCreate: VoidFunction;
};
export type IAccountDarwerRef = {
  onEdit: (v: any) => void;
};

const reg = /^[a-zA-Z][a-zA-Z0-9]{7,15}$/;
const AccountDarwer = forwardRef<IAccountDarwerRef, IAccountDarwerProps>(
  ({ onCreate }, ref) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const id = useRef<number>();
    useImperativeHandle(
      ref,
      () => ({
        onEdit: (e) => {
          form.setFieldsValue(e);
          id.current = e.id;
          setVisible(true);
        },
      }),
      [form],
    );
    return (
      <ModalForm
        title="新建账号"
        width={700}
        modalProps={{
          centered: true,
        }}
        form={form}
        open={visible}
        onOpenChange={(v) => {
          setVisible(v);
          if (!v) {
            id.current = void 0;
            form.resetFields();
          }
        }}
        trigger={
          <Button type="primary">
            <PlusOutlined />
            新建账号
          </Button>
        }
        onFinish={async (val) => {
          try {
            if (id.current) {
              await AccountApi.update({ ...val, id: id.current });
            } else {
              await AccountApi.add(val);
            }
            onCreate();
            return true;
          } catch (error) {
            return false;
          }
        }}
      >
        <ProFormGroup>
          <ProFormText
            width="sm"
            name="userNo"
            label="账号"
            placeholder="请输入账号"
            rules={[
              {
                required: true,
                pattern: reg,
                message: "账号必须满足8~16位，以字母开头，包含大小写字母、数字",
              },
            ]}
          />
          <ProFormText
            width="sm"
            name="name"
            label="姓名"
            tooltip="最长为 24 位"
            placeholder="请输入姓名"
            rules={[{ required: true }]}
          />

          {/* <ProFormText
            width="md"
            name="speciality"
            label="专业"
            placeholder="请输入专业"
            rules={[{ required: true }]}
          /> */}
        </ProFormGroup>
        {/* <ProFormRadio.Group
          width="lg"
          name="expert"
          label="是否专家"
          placeholder="请输入名称"
          rules={[{ required: true }]}
          options={[
            { label: "是", value: 1 },
            { label: "否", value: 0 },
          ]}
        />
        <ProFormRadio.Group
          width="lg"
          name="engineer"
          label="是否算量工程师"
          placeholder="请输入名称"
          rules={[{ required: true }]}
          options={[
            { label: "是", value: 1 },
            { label: "否", value: 0 },
          ]}
        /> */}
      </ModalForm>
    );
  },
);

export default AccountDarwer;
