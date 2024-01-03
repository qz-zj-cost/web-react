/**
 * @author Destin
 * @description 项目成本差费-人工费
 * @date 2023/12/25
 */

import { ContractImportApi } from "@/apis/projectApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Space, Typography } from "antd";
import { useContext, useRef } from "react";
import { ProjectContext } from "..";
import useSelect from "../components/useSelect";

const LaborCost = () => {
  const actionRef = useRef<ActionType>();
  const { projectId } = useContext(ProjectContext);
  const { selectProject, selectProjectType, types } = useSelect({
    actionRef: actionRef.current,
    type: 2,
  });

  const columns: ProColumns[] = [
    {
      title: "项目名称",
      dataIndex: "name",
    },
    {
      title: "项目特征",
      dataIndex: "feature",
      render(dom) {
        return (
          <Typography.Paragraph
            style={{ width: 300, margin: 0 }}
            ellipsis={{ rows: 2, expandable: true }}
          >
            {dom}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: "单位",
      dataIndex: "unit",
    },
    {
      title: "清单工程量",
      dataIndex: "num",
    },
    {
      title: "局清单编码",
      dataIndex: "",
    },
    {
      title: "局清单量",
      dataIndex: "",
    },
    {
      title: "合约包价格",
      dataIndex: "",
    },
    {
      title: "合价",
      dataIndex: "totalAmount",
    },
    {
      title: "操作",
      width: "auto",
      fixed: "right",
      align: "center",
      render: () => {
        return (
          <Space>
            <Typography.Link onClick={() => {}}>匹配企业定额</Typography.Link>

            <Typography.Link type="danger">手动分类</Typography.Link>
          </Space>
        );
      },
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
      request={async ({ current: pageNum, pageSize }) => {
        if (!types?.typeId1 || !types?.typeId2) return { data: [] };
        const res = await ContractImportApi.getUnitProjectList({
          unitProjectUuid: types.typeId1,
          unitSectionUuid: types.typeId2,
          projectId: projectId,
          byFinance: "人工费",
          pageNum,
          pageSize,
        });
        return {
          data: res.data || [],
          success: true,
        };
      }}
      toolbar={{
        settings: [],
        actions: [selectProject, selectProjectType],
      }}
    />
  );
};

export default LaborCost;
