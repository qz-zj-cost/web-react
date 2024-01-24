import InstallmentApi from "@/apis/installmentApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { useRef } from "react";

const ChildTable = ({ id, monthDate }: { id: string; monthDate?: string }) => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: "构件区域",
      dataIndex: "groupBillCode",
    },
    {
      title: "构建名称",
      dataIndex: "name",
    },
    {
      title: "单位",
      dataIndex: "unit",
    },
    {
      title: "计算项目",
      dataIndex: "computeProject",
    },
    {
      title: "构件工程量",
      dataIndex: "memberNum",
    },
    {
      title: "往期完成",
      dataIndex: "previousValue",
    },
    {
      title: "本期完成",
      dataIndex: "mortgageValue",
    },
    {
      title: "累计完成",
      dataIndex: "sumMortgage",
    },
    {
      title: "实际价格",
      dataIndex: "actualPrice",
    },
    {
      title: "实际成本",
      dataIndex: "actualIncome",
    },
    {
      title: "目标成本",
      dataIndex: "sumPrice",
    },
    {
      title: "合同收入",
      dataIndex: "incomeSumPrice",
    },
  ];
  return (
    <ProTable
      search={false}
      rowKey={"id"}
      scroll={{ x: "max-content" }}
      bordered
      size="small"
      cardBordered
      actionRef={actionRef}
      columns={[...columns]}
      request={async ({ current: pageNum, pageSize }) => {
        if (!monthDate) return { data: [] };
        const res = await InstallmentApi.getCostChildList({
          id,
          monthDate,
          pageNum,
          pageSize,
        });
        return {
          data: res.data || [],
          success: true,
          total: res.totalRow,
        };
      }}
    />
  );
};

export default ChildTable;
