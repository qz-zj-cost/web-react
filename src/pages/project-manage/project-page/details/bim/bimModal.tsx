import { Modal, Typography } from "antd";
import { useState } from "react";
import IframeView from "./iframeView";

const BimModal = ({ motor3dId, uuid }: { motor3dId: string; uuid: string }) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Typography.Link
        disabled={!motor3dId}
        onClick={() => {
          setVisible(true);
        }}
      >
        打开模型
      </Typography.Link>
      <Modal
        style={{
          maxWidth: "100vw",
          height: "100vh",
          padding: 0,
          position: "absolute",
          top: 0,
          left: 0,
        }}
        styles={{
          content: { padding: 0 },
          body: {
            height: "100vh",
          },
        }}
        footer={false}
        centered
        width="100vw"
        destroyOnClose
        open={visible}
        onCancel={() => setVisible(false)}
      >
        <IframeView motor3dId={motor3dId} uuid={uuid} />
      </Modal>
    </>
  );
};

export default BimModal;
