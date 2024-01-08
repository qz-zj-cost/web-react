import BureauApi from "@/apis/bureauApi";
import BureauColumns from "@/pages/quota-manage/bureau-list/columns";
import { EditOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { Modal, Space, Typography } from "antd";
import { useState } from "react";

interface IBureauSelectProps {
  value?: string;
  onChange?: (e?: string) => void;
}
const BureauSelect = ({ value, onChange }: IBureauSelectProps) => {
  const [visible, setVisible] = useState(false);
  const [selectKeys, setSelectKeys] = useState<string[]>();
  const [selectRows, setSelectRows] = useState<any[]>();
  return (
    <div>
      {value ? (
        <Space>
          <Typography>
            {selectRows?.find((e) => e.uuid === value)?.name ?? value}
          </Typography>
          <Typography.Link onClick={() => setVisible(true)}>
            <EditOutlined />
            选择局清单
          </Typography.Link>
        </Space>
      ) : (
        <Typography.Link onClick={() => setVisible(true)}>
          <EditOutlined />
          选择局清单
        </Typography.Link>
      )}
      <Modal
        width={900}
        open={visible}
        onCancel={() => {
          setVisible(false);
        }}
        onOk={() => {
          onChange?.(selectKeys?.[0]);
          setVisible(false);
        }}
        centered
      >
        <ProTable
          scroll={{ y: 500, x: "max-content" }}
          rowKey={"uuid"}
          size="small"
          cardProps={{
            bodyStyle: { padding: 0 },
          }}
          rowSelection={{
            selectedRowKeys: selectKeys,
            type: "radio",
            onChange: (keys, rows) => {
              setSelectKeys(keys as string[]);
              setSelectRows(rows);
            },
          }}
          request={async ({ current: pageNum, pageSize, ...val }) => {
            const res = await BureauApi.getList({
              pageNum,
              pageSize,
              ...val,
            });
            return {
              data: res.data || [],
              success: true,
              total: res.totalRow,
            };
          }}
          pagination={{
            pageSize: 10,
          }}
          search={{
            filterType: "light",
          }}
          bordered
          columns={[...BureauColumns.slice(0, 7)]}
        />
      </Modal>
    </div>
  );
};

export default BureauSelect;
