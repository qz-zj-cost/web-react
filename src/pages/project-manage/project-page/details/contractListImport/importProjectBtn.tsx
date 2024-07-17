import { ContractImportApi } from "@/apis/projectApi";
import { UploadOutlined } from "@ant-design/icons";
import { ProFormSelect } from "@ant-design/pro-components";
import { Button, Form, Modal, Upload, message } from "antd";
import { useContext, useState } from "react";
import { ProjectContext } from "../detailContext";

type IImportProjectBtnProps = {
  onSuccess: VoidFunction;
};

const ImportProjectBtn = ({ onSuccess }: IImportProjectBtnProps) => {
  const { projectId } = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [channel, setChannel] = useState<number>();
  const customRequest = (fileList: any) => {
    if (!channel) return message.error("请选择渠道");
    const data = new FormData();
    data.append("file", fileList.file);
    data.append("id", projectId);
    data.append("channel", channel.toString());
    setLoading(true);
    ContractImportApi.projectImport(data)
      .then((res) => {
        message.success("导入成功");
        onSuccess();
        setVisible(false);
        fileList.onSuccess({ ...res.data });
      })
      .catch((err) => {
        fileList.onError(err, fileList);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <Button
        onClick={() => {
          setVisible(true);
        }}
        type="primary"
      >
        导入项目标底文件
      </Button>
      <Modal
        title="导入项目标底文件"
        open={visible}
        onCancel={() => {
          setVisible(false);
        }}
        destroyOnClose
        footer={false}
        centered
      >
        <ProFormSelect
          width={"md"}
          label="渠道"
          initialValue={1}
          options={[
            { label: "未来计价", value: 1 },
            { label: "品茗", value: 2 },
            { label: "杭州广联达", value: 3 },
          ]}
          onChange={(v: number) => {
            setChannel(v);
          }}
          placeholder={"请选择单位工程"}
        />
        <Form.Item label="项目标底文件">
          <Upload
            multiple
            customRequest={customRequest}
            showUploadList={false}
            disabled={!channel}
          >
            <Button
              type="primary"
              disabled={!channel}
              loading={loading}
              icon={<UploadOutlined />}
            >
              导入项目标底文件
            </Button>
          </Upload>
        </Form.Item>
      </Modal>
    </>
  );
};
export default ImportProjectBtn;
