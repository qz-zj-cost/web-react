/**
 * @author Destin
 * @description 目标成本归集
 * @date 2024/01/08
 */

import ProjectApi from "@/apis/projectApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, message, Modal } from "antd";
import { useContext, useRef } from "react";
import { ProjectContext } from "../detailContext";
import ExportModal from "./export";

const TargetCost = () => {
  const { projectId, getProjectInfo, projectInfo } = useContext(ProjectContext);
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
        actions: [
          <ExportModal />,
          projectInfo?.confirmStatus === 0 && (
            <Button
              type="primary"
              onClick={() => {
                Modal.confirm({
                  title: "修改项目状态",
                  content: "确认保存当前项目数据？",
                  onOk: () => {
                    return ProjectApi.updateProjectStatus({
                      projectId,
                      confirmStatus: 1,
                    }).then(() => {
                      message.success("修改成功");
                      getProjectInfo();
                    });
                  },
                });
              }}
            >
              确认项目配置
            </Button>
          ),
          projectInfo?.confirmStatus === 1 && (
            <Button
              type="primary"
              onClick={() => {
                Modal.confirm({
                  title: "修改项目状态",
                  content: "确认取消项目锁定状态？",
                  onOk: () => {
                    return ProjectApi.updateProjectStatus({
                      projectId,
                      confirmStatus: 0,
                    }).then(() => {
                      message.success("修改成功");
                      getProjectInfo();
                    });
                  },
                });
              }}
            >
              取消项目锁定
            </Button>
          ),
        ],
      }}
      columns={columns}
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
    />
  );
};

export default TargetCost;
