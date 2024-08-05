import InstallmentApi from "@/apis/installmentApi";
import BureauColumns from "@/pages/quota-manage/bureau-list/columns";
import { ActionType, ProTable } from "@ant-design/pro-components";
import { Input, Modal, message } from "antd";
import {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ProjectContext } from "../detailContext";

export type IUpdatePriceModalRef = {
  show: (e: { parentId: number; id: string; num: number }) => void;
};
const UpdatePriceModal = forwardRef<
  IUpdatePriceModalRef,
  { onSuccess?: VoidFunction }
>(({ onSuccess }, ref) => {
  const [visible, setVisible] = useState(false);
  const data = useRef<{ parentId: number; id: string; num: number }>();
  const [selectKeys, setSelectKeys] = useState<string[]>();
  const [stockNum, setStockNum] = useState<number>();
  const actionRef = useRef<ActionType>();
  const { projectId } = useContext(ProjectContext);
  useImperativeHandle(
    ref,
    () => ({
      show: (e) => {
        setVisible(true);
        data.current = e;
        setStockNum(e.num);
        actionRef.current?.reload();
      },
    }),
    [],
  );
  const handleOk = () => {
    InstallmentApi.updatePrice({
      dateQuantitiesId: data.current!.parentId,
      groupBillUuid: selectKeys ? selectKeys[0] : void 0,
      settlementPriceInfoId: data.current!.id,
      stockNum,
    }).then(() => {
      message.success("修改成功");
      setSelectKeys(void 0);
      setStockNum(void 0);
      setVisible(false);
      onSuccess?.();
    });
  };
  return (
    <Modal
      open={visible}
      onCancel={() => {
        setVisible(false);
      }}
      width={1000}
      title="编辑分期"
      onOk={handleOk}
    >
      <div>
        <label style={{ marginBottom: 10, display: "block" }}>库存数量：</label>
        <Input
          value={stockNum}
          type="number"
          onChange={(e) => setStockNum(e.target.value as any)}
        />
      </div>
      <ProTable
        scroll={{ y: 500, x: "max-content" }}
        rowKey={"uuid"}
        size="small"
        cardProps={{
          bodyStyle: { padding: 0 },
        }}
        actionRef={actionRef}
        rowSelection={{
          selectedRowKeys: selectKeys,
          type: "radio",
          onChange: (keys) => {
            setSelectKeys(keys as string[]);
          },
        }}
        request={async ({ current: pageNum, pageSize, ...val }) => {
          const res = await InstallmentApi.getBillGroupList({
            pageNum,
            pageSize,
            projectId,
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
        tableAlertRender={false}
        columns={[...BureauColumns.slice(0, 9)]}
        toolbar={{
          title: "匹配局清单",
        }}
      />
    </Modal>
  );
});

export default UpdatePriceModal;
