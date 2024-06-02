import BureauApi from "@/apis/bureauApi";
import BureauColumns from "@/pages/quota-manage/bureau-list/columns";
import { ProTable } from "@ant-design/pro-components";
import { Button, Input, Modal } from "antd";
import { useEffect, useState } from "react";

export type IFormItemMatchBureauListProp = {
  value?: string[];
  onChange?: (value: string[]) => void;
};
const FormItemMatchBureauList = ({
  onChange,
  value,
}: IFormItemMatchBureauListProp) => {
  const [visible, setVisible] = useState(false);
  const [selectKeys, setSelectKeys] = useState<string[]>([]);

  function handleOk() {
    if (!selectKeys || selectKeys.length === 0) return;
    onChange?.(selectKeys);
    setVisible(false);
  }
  useEffect(() => {
    if (visible && value && value?.length > 0) {
      setSelectKeys(value);
    }
  }, [value, visible]);

  return (
    <div>
      <Input
        placeholder="请选择局清单"
        readOnly
        style={{ width: 328 }}
        value={selectKeys?.join(",")}
        addonAfter={
          <Button type="link" size="small" onClick={() => setVisible(true)}>
            选择
          </Button>
        }
      />
      <Modal
        open={visible}
        onCancel={() => {
          setVisible(false);
        }}
        width={1000}
        onOk={handleOk}
        title="匹配局清单"
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
          search={{
            filterType: "light",
          }}
          bordered
          columns={[...BureauColumns.slice(0, 9)]}
        />
      </Modal>
    </div>
  );
};

export default FormItemMatchBureauList;
