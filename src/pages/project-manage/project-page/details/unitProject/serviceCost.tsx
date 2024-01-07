/**
 * @author Destin
 * @description 项目成本差费-总包服务费
 * @date 2023/12/25
 */

import { ContractImportApi } from "@/apis/projectApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { useContext, useRef, useState } from "react";
import { ProjectContext } from "..";

const ServiceCost = () => {
  const actionRef = useRef<ActionType>();
  const { projectId } = useContext(ProjectContext);
  const [tabKey, settabKey] = useState("1");
  const columns: ProColumns[] = [
    {
      title: "序号",
      dataIndex: "sort",
    },
    {
      title: "分包名称",
      dataIndex: "subpackageName",
    },
    {
      title: "分包金额",
      dataIndex: "subpackageAmount",
    },
    {
      title: "管理费比例",
      dataIndex: "managementFeeRatio",
    },
    {
      title: "管理费收入",
      dataIndex: "managementFee",
    },
    {
      title: "备注",
      dataIndex: "remark",
    },
  ];

  return (
    <ProTable
      actionRef={actionRef}
      search={false}
      scroll={{ x: "max-content" }}
      rowKey={"id"}
      bordered
      columns={columns}
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
      request={async () => {
        const res = await ContractImportApi.getServiceCost({
          projectId: projectId,
          stageType: tabKey,
        });
        return {
          data: res.data || [],
          success: true,
        };
      }}
      toolbar={{
        settings: [],
        // actions: [selectProject, selectProjectType],
        menu: {
          type: "tab",
          activeKey: tabKey,
          items: [
            { label: "地下室阶段", key: "1" },
            { label: "主体", key: "2" },
            { label: "装饰修饰", key: "3" },
          ],
          onChange: (v) => {
            settabKey(v as string);
            actionRef.current?.reset?.();
          },
        },
      }}
    />
  );
};

export default ServiceCost;
