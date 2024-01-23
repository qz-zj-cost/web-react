import BimApi from "@/apis/bimApi";
import { ProTable } from "@ant-design/pro-components";
import { Button, Drawer, Typography, message } from "antd";
import { useContext, useState } from "react";
import { BimContext } from ".";

const BindModel = ({
  uuid,
  onSuccess,
}: {
  uuid: string;
  onSuccess: VoidFunction;
}) => {
  const [visible, setVisible] = useState(false);
  const { getToken } = useContext(BimContext);
  const [selectKey, setSelectKey] = useState<string[]>();

  const [loading, setLoading] = useState(false);
  const handleOk = () => {
    if (selectKey && selectKey.length < 1) return;
    setLoading(true);
    BimApi.binModel({ uuid, motor3dId: selectKey![0] })
      .then(() => {
        message.success("绑定成功");
        onSuccess();
        setVisible(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <Typography.Link onClick={() => setVisible(true)}>
        绑定模型
      </Typography.Link>
      <Drawer
        title="绑定模型"
        destroyOnClose
        open={visible}
        onClose={() => setVisible(false)}
        width={900}
        footer={
          <Button type="primary" onClick={handleOk} loading={loading}>
            确定
          </Button>
        }
      >
        <ProTable
          search={false}
          scroll={{ x: "max-content" }}
          rowKey={"motor3dId"}
          request={async ({ current: pageNum, pageSize }) => {
            await getToken();
            const res = await BimApi.getModelList({
              pageSize,
              pageNum,
            });
            return {
              data: res.data || [],
              success: true,
              total: res.totalPage,
            };
          }}
          tableAlertRender={false}
          rowSelection={{
            type: "radio",
            selectedRowKeys: selectKey,
            onChange: (keys) => {
              setSelectKey(keys as string[]);
            },
          }}
          headerTitle="模型列表"
          bordered
          columns={[
            {
              title: "模型名称",
              dataIndex: "deptName",
            },
            {
              title: "项目",
              dataIndex: "projName",
            },
          ]}
        />
      </Drawer>
    </>
  );
};

export default BindModel;
