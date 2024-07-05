import InstallmentApi from "@/apis/installmentApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Drawer } from "antd";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

export type IEditDateDrawerRef = {
  show: (e: any) => void;
};
const EditDateDrawer = forwardRef<IEditDateDrawerRef>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const actionRef = useRef<ActionType>();
  const dataRef = useRef<any>();
  useImperativeHandle(
    ref,
    () => ({
      show: (e) => {
        dataRef.current = e;
        setVisible(true);
        actionRef.current?.reloadAndRest?.();
      },
    }),
    [],
  );
  const columns: ProColumns[] = [
    {
      title: "成本清单ID",
      dataIndex: "costId",
      search: false,
    },
    {
      title: "成本清单编码",
      dataIndex: "costCode",
    },
    {
      title: "清单名称",
      dataIndex: "materialName",
    },
    {
      title: "清单规格",
      dataIndex: "materialModel",
      search: false,
    },
    {
      title: "清单单位",
      dataIndex: "materialUnit",
      search: false,
    },
    {
      title: "不含税单价",
      dataIndex: "price",
      search: false,
    },
    {
      title: "时间",
      dataIndex: "timeFormat",
      search: false,
    },
    {
      title: "结算数量",
      dataIndex: "settlementWuantity",
      search: false,
    },
    {
      title: "匹配局清单",
      dataIndex: "groupBillCode",
      search: false,
    },
    {
      title: "库存数量",
      dataIndex: "stockNum",
      search: false,
    },
  ];
  return (
    <Drawer
      open={visible}
      onClose={() => setVisible(false)}
      title="编辑分期成本"
      width={1000}
    >
      <ProTable
        actionRef={actionRef}
        scroll={{ x: "max-content" }}
        rowKey={"id"}
        bordered
        columns={columns}
        cardProps={{
          bodyStyle: { padding: 0 },
        }}
        search={{
          labelWidth: 100,
        }}
        request={async ({ current: pageNum, pageSize, ...params }) => {
          const res = await InstallmentApi.getPricePage({
            ...params,
            pageNum,
            pageSize,
            dateQuantitiesId: dataRef.current.id,
          });
          return {
            data: res.data || [],
            success: true,
            total: res.totalRow,
          };
        }}
      />
    </Drawer>
  );
});

export default EditDateDrawer;
