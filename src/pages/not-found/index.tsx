import { RootState } from "@/store";
import { Button, Result } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navitate = useNavigate();
  const { isLogin } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    if (!isLogin) {
      navitate("/login");
    }
  }, [isLogin, navitate]);

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => navitate(-1)}>
          返回上一页
        </Button>
      }
    />
  );
};

export default NotFound;
