/**
 * @author Destin
 * @description 目标成本归集
 * @date 2024/01/08
 */

import ProjectApi from "@/apis/projectApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { useContext, useRef } from "react";
import { ProjectContext } from "../detailContext";
import ExportModal from "./export";

const TargetCost = () => {
  const { projectId } = useContext(ProjectContext);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: "序号",
      dataIndex: "sort",
    },
    {
      title: "汇总内容",
      dataIndex: "content",
    },
    {
      title: "合同收入（万元）",
      dataIndex: "contractIncome",
    },
    {
      title: "目标成本（万元)",
      dataIndex: "targetCost",
    },
    {
      title: "盈亏额（万元）",
      dataIndex: "profitLossAmount",
    },
    {
      title: "盈亏率",
      dataIndex: "profitLossRatio",
    },
  ];

  return (
    <ProTable
      search={false}
      scroll={{ x: "max-content" }}
      rowKey={"sort"}
      bordered
      actionRef={actionRef}
      request={async () => {
        const res = await ProjectApi.getTargetCostList({
          projectId,
        });
        return {
          data: res.data || [],
          success: true,
        };
      }}
      pagination={false}
      toolbar={{
        actions: [<ExportModal />],
      }}
      columns={columns}
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
    />
  );
};

export default TargetCost;
