import InstallmentApi from "@/apis/installmentApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { useEffect, useRef } from "react";
//汇总表
const Table14 = ({ monthDate }: { monthDate?: string }) => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: "名称",
      dataIndex: "feeName",
    },
    {
      title: "合同收入",
      dataIndex: "incomeSumPrice",
    },
    {
      title: "目标成本",
      dataIndex: "sumPrice",
    },
    {
      title: "实际成本",
      dataIndex: "actualIncome",
    },
    {
      title: "目标成本节超",
      dataIndex: "overshoot",
    },
    {
      title: "盈亏",
      dataIndex: "profit",
    },
    {
      title: "目标成本节超率",
      dataIndex: "overshootRate",
    },
    {
      title: "盈利率",
      dataIndex: "profitMargin",
    },
  ];
  useEffect(() => {
    if (monthDate) {
      actionRef.current?.reload();
    }
  }, [monthDate]);
  return (
    <ProTable
      actionRef={actionRef}
      search={false}
      scroll={{ x: "max-content" }}
      rowKey={"sort"}
      bordered
      columns={columns}
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
      pagination={false}
      request={async () => {
        try {
          if (!monthDate) return { data: [] };
          const res = await InstallmentApi.getSummaryList({
            id: monthDate,
          });
          return {
            data: res.data || [],
            success: true,
          };
        } catch (error) {
          return { data: [], success: false };
        }
      }}
    />
  );
};

export default Table14;
