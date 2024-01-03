/**
 * @author Destin
 * @description 项目成本差费-材料费
 * @date 2023/12/25
 */

import { ContractImportApi } from "@/apis/projectApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Typography } from "antd";
import { useContext, useRef } from "react";
import { ProjectContext } from "..";
import useSelect from "../components/useSelect";

const MaterialFee = () => {
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
      title: "局清单",
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
          projectId: projectId,
          unitProjectUuid: types.typeId1,
          unitSectionUuid: types.typeId2,
          byFinance: "直接材料费",
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

export default MaterialFee;
