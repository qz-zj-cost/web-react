/**
 * @author Destin
 * @description 构件计算书
 * @date 2023/12/25
 */

import BimApi from "@/apis/bimApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { useContext, useRef } from "react";
import { ProjectContext } from "../..";

const BuildTable = ({ pathList }: { pathList?: string[] }) => {
  const { projectId } = useContext(ProjectContext);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: "构件类型",
      dataIndex: "memberType",
    },
    {
      title: "构件名称",
      dataIndex: "memberName",
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
      title: "开累合同收入",
      dataIndex: "sumIncomeSumPrice",
    },
    {
      title: "开累目标成本",
      dataIndex: "sumSumPrice",
    },
    {
      title: "开累实际成本",
      dataIndex: "sumActualIncome",
    },
    {
      title: "盈亏",
      dataIndex: "profitLossValue",
    },
    {
      title: "盈亏率",
      dataIndex: "profitLossRatio",
    },
  ];

  return (
    <ProTable
      scroll={{ x: "max-content" }}
      rowKey={"id"}
      bordered
      actionRef={actionRef}
      search={false}
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
      request={async ({ current: pageNum, pageSize }) => {
        if (!pathList) return { data: [] };
        const res = await BimApi.getBuildList({
          projectId,
          pathList,
          pageNum,
          pageSize,
        });
        return {
          data: res.data || [],
          success: true,
          total: res.totalRow,
        };
      }}
      columns={columns}
    />
  );
};

export default BuildTable;
