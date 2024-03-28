import { Button, Result } from "antd";
import { FallbackProps } from "react-error-boundary";

const ErrorPage = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <Result
      status={"error"}
      title="出错啦"
      subTitle={error.message}
      extra={
        <Button type="primary" onClick={resetErrorBoundary}>
          点击重试
        </Button>
      }
    />
  );
};

export default ErrorPage;
