import { Form, Input, Modal } from "antd";
import { useState } from "react";

const reg = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[.@$!%*#_~?&^]).{8,16}$/;
const Password = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const handleOk = () => {
    form.validateFields().then((val) => {
      const { password, confirmPassword } = val;
      if (password !== confirmPassword)
        return form.setFields([
          { name: "confirmPassword", errors: ["密码不一致"] },
        ]);
      // UserApi.updatePassword({ password }).then(() => {
      //   setVisible(false);
      //   message.success("密码修改成功");
      // });
    });
  };
  return (
    <>
      <div onClick={() => setVisible(true)}>修改密码</div>
      <Modal
        title="修改密码"
        width={500}
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={handleOk}
      >
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} form={form}>
          <Form.Item
            name="password"
            label="新密码"
            extra="密码必须满足8~16位，包含大小写字母、数字和下列字符.@$!%*#_~?&^，如123546aA!"
            rules={[
              {
                required: true,
                pattern: reg,
                message: "请输入正确格式的密码",
              },
            ]}
          >
            <Input.Password maxLength={16} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            rules={[
              {
                required: true,
                pattern: reg,
                message: "请输入正确格式的密码",
              },
            ]}
          >
            <Input.Password maxLength={16} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Password;
