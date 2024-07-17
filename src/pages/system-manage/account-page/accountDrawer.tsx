import AccountApi from "@/apis/accountApi";
import RoleApi from "@/apis/roleApi";
import { PlusOutlined } from "@ant-design/icons";
import {
  ModalForm,
  ProFormGroup,
  ProFormText,
  ProFormTreeSelect,
} from "@ant-design/pro-components";
import { Button, Form } from "antd";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

type IAccountDarwerProps = {
  onCreate: VoidFunction;
};
export type IAccountDarwerRef = {
  onEdit: (v: any) => void;
};

const reg = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[.@$!%*#_~?&^]).{8,16}$/;
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
        title={id.current ? "编辑账号" : "新建账号"}
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
            width="md"
            name="userNo"
            label="账号"
            placeholder="请输入账号"
            rules={[
              {
                required: true,
                // pattern: reg,
                // message: "账号必须满足8~16位，以字母开头，包含大小写字母、数字",
              },
            ]}
          />
          <ProFormText
            width="md"
            name="name"
            label="姓名"
            tooltip="最长为 24 位"
            placeholder="请输入姓名"
            rules={[{ required: true }]}
          />
          <ProFormTreeSelect
            label="角色"
            name="roleId"
            width={"md"}
            rules={[{ required: true }]}
            fieldProps={{
              treeDefaultExpandAll: true,
            }}
            request={async () => {
              const res = await RoleApi.getRoleAll();
              return res.data.map((v) => ({
                label: v.roleName,
                value: v.roleId,
              }));
            }}
          />
          {!id.current && (
            <ProFormText.Password
              name="password"
              label="密码"
              width={"md"}
              extra="密码必须满足8~16位，包含大小写字母、数字和下列字符.@$!%*#_~?&^，如123546aA!"
              rules={[
                {
                  required: true,
                  pattern: reg,
                  message: "请输入正确格式的密码",
                },
              ]}
            />
          )}
        </ProFormGroup>
      </ModalForm>
    );
  },
);

export default AccountDarwer;
