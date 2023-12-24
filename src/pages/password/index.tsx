import UserApi from "@/apis/userApi";
import { ProFormText } from "@ant-design/pro-components";
import { Button, Form, Space, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const PREFIX = "password-page";
const reg = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[.@$!%*#_~?&^]).{8,16}$/;
const PasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navitate = useNavigate();
  const handleSubmit = ({ password, affirm }: any) => {
    if (password !== affirm)
      return form.setFields([{ name: "affirm", errors: ["密码不一致"] }]);
    setLoading(true);
    UserApi.updatePassword({ password })
      .then(() => {
        navitate("/", { replace: true });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className={styles[PREFIX]}>
      <div className={styles[`${PREFIX}-content`]}>
        <Typography.Title level={4}>设置密码</Typography.Title>
        <Form form={form} labelCol={{ span: 4 }} onFinish={handleSubmit}>
          <ProFormText.Password
            label="新密码"
            name="password"
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
            label="确认密码"
            name="affirm"
            rules={[
              {
                required: true,
                pattern: reg,
                message: "请输入正确格式的密码",
              },
            ]}
          />
          <Form.Item>
            <Space>
              {/* <Button
                onClick={() => {
                  navitate("/", { replace: true });
                }}
              >
                跳过
              </Button> */}
              <Button loading={loading} block type="primary" htmlType="submit">
                确认密码
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default PasswordPage;
