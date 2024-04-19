import AccountApi from "@/apis/accountApi";
import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { message } from "antd";

const reg = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[.@$!%*#_~?&^]).{8,16}$/;
const Password = () => {
  const [form] = ProForm.useForm();

  return (
    <ModalForm
      title="修改密码"
      width={500}
      form={form}
      trigger={<div>修改密码</div>}
      onFinish={async (val) => {
        try {
          const { oldPassword, newPassword, confirmPassword } = val;
          if (newPassword !== confirmPassword)
            return form.setFields([
              { name: "confirmPassword", errors: ["密码不一致"] },
            ]);
          await AccountApi.updatePassword({ oldPassword, newPassword });
          message.success("密码修改成功");
          return true;
        } catch (error) {
          return false;
        }
      }}
    >
      <ProFormText.Password
        name="oldPassword"
        label="旧密码"
        rules={[
          {
            required: true,
            pattern: reg,
            message: "请输入正确格式的密码",
          },
        ]}
      />
      <ProFormText.Password
        name="newPassword"
        label="新密码"
        extra="密码必须满足8~16位，包含大小写字母、数字和下列字符.@$!%*#_~?&^，如123546aA!"
        rules={[
          {
            required: true,
            pattern: reg,
            message: "请输入正确格式的密码",
          },
        ]}
      />
      <ProFormText.Password
        name="confirmPassword"
        label="确认密码"
        rules={[
          {
            required: true,
            pattern: reg,
            message: "请输入正确格式的密码",
          },
        ]}
      />
    </ModalForm>
  );
};

export default Password;
