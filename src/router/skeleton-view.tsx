import { Skeleton, Space } from "antd";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect } from "react";

const progress = NProgress.configure({ showSpinner: true });

const SkeletonView = () => {
  useEffect(() => {
    progress.start();
    return () => {
      progress.done();
    };
  }, []);
  return (
    <div style={{ padding: 15 }}>
      <div style={{ marginBottom: 15 }}>
        <Space>
          <Skeleton.Input />
          <Skeleton.Input />
          <Skeleton.Input />
          <Skeleton.Input />
          <Skeleton.Input />
        </Space>
      </div>
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Space>
    </div>
  );
};
export default SkeletonView;
