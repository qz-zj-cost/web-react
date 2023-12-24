import UserApi from "@/apis/userApi";
import { LockOutlined, RedoOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space, Tooltip, Typography } from "antd";
import { useRef, useState } from "react";

import menuConfigs from "@/router/menu-config";
import { setUserInfo } from "@/store/user";
import Captcha from "react-captcha-code";
import { canvasRefProps } from "react-captcha-code/build/types/captcha";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const PREFIX = "login";
const LoginPage = () => {
  const navitate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const captchaRef = useRef<canvasRefProps>(null);
  const codeRef = useRef<string>("");
  const [form] = Form.useForm();

  const onFinish = async ({ code, ...value }: any) => {
    try {
      if (code !== codeRef.current)
        return form.setFields([{ name: "code", errors: ["验证码错误"] }]);
      setLoading(true);
      const user = await UserApi.login({
        ...value,
        password: value.password.trim(),
      });
      dispatch(
        setUserInfo({
          info: user.data,
          menus: menuConfigs,
        }),
      );
      navitate("/", { replace: true });
    } catch (error: any) {
      setLoading(false);
    }
  };
  return (
    <div className={styles[PREFIX]}>
      {/* <div className={styles[`${PREFIX}-logo`]}>
        <img src={getImageUrl("logo.png")} />
      </div> */}
      <div className={styles[`${PREFIX}-content`]}>
        <h1>定制化算量管理平台</h1>
        <p>账户登录</p>
        <br />
        <Form size="large" layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="userNo"
            rules={[
              {
                required: true,
                message: "请输入账号",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder={"请输入账号"} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={"请输入密码"}
            />
          </Form.Item>
          <Form.Item
            name="code"
            rules={[{ required: true, message: "请输入验证码" }]}
          >
            <Input
              placeholder={"请输入验证码"}
              addonAfter={
                <Space>
                  <Captcha
                    height={37}
                    ref={captchaRef}
                    onChange={(code) => {
                      codeRef.current = code;
                    }}
                  />
                  <Tooltip title="看不清，换一个">
                    <Typography.Link
                      onClick={() => {
                        captchaRef.current?.refresh();
                      }}
                    >
                      <RedoOutlined />
                    </Typography.Link>
                  </Tooltip>
                </Space>
              }
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 40 }}>
            <Button loading={loading} block type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
          <Space
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* <Link to="/register">忘记密码</Link> */}
            {/* <Link to="/register">注册</Link> */}
          </Space>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
