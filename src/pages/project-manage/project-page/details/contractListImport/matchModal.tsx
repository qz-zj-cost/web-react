import BureauApi from "@/apis/bureauApi";
import { ContractImportApi } from "@/apis/projectApi";
import BureauColumns from "@/pages/quota-manage/bureau-list/columns";
import { ProTable } from "@ant-design/pro-components";
import { Modal, message } from "antd";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

export type IMatchModalRef = {
  show: (e: any) => void;
};
const MatchModal = forwardRef<IMatchModalRef, { onSuccess?: VoidFunction }>(
  ({ onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const record = useRef<any>();
    const [selectKeys, setSelectKeys] = useState<string[]>();

    useImperativeHandle(
      ref,
      () => ({
        show: (e) => {
          setVisible(true);
          record.current = e;
        },
      }),
      [],
    );
    return (
      <Modal
        open={visible}
        onCancel={() => {
          setVisible(false);
        }}
        width={900}
        onOk={() => {
          if (!selectKeys || selectKeys.length === 0) return;
          ContractImportApi.match({
            groupBillUuidList: selectKeys,
            id: record.current.id,
          }).then(() => {
            message.success("操作成功");
            setVisible(false);
            onSuccess?.();
          });
        }}
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
            type: "checkbox",
            onChange: (keys) => {
              setSelectKeys(keys as string[]);
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
    );
  },
);

export default MatchModal;
