/**
 * @author Destin
 * @description 项目成本差费-材料费
 * @date 2023/12/25
 */

import { ContractImportApi } from "@/apis/projectApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { useContext, useRef, useState } from "react";
import { ProjectContext } from "..";
import ChildTable from "./childTable";

const MaterialFee = () => {
  const actionRef = useRef<ActionType>();
  const { projectId } = useContext(ProjectContext);
  // const { selectProject, selectProjectType, types } = useSelect({
  //   actionRef: actionRef.current,
  //   type: 2,
  // });
  const [tabKey, settabKey] = useState("1");
  const columns: ProColumns[] = [
    {
      title: "项目名称",
      dataIndex: "name",
    },
    {
      title: "局清单编码",
      dataIndex: "groupBillCode",
    },
    {
      title: "企业定额",
      dataIndex: "corpQuotaCode",
    },
    {
      title: "单位",
      dataIndex: "unit",
    },
    {
      title: "合同收入",
      children: [
        {
          title: "工程量",
          dataIndex: "num",
        },
        {
          title: "单价",
          dataIndex: "incomePrice",
        },
        {
          title: "合价",
          dataIndex: "incomeSumPrice",
        },
      ],
    },
    {
      title: "目标成本",
      children: [
        {
          title: "工程量",
          dataIndex: "groupBillEngineeringNum",
        },
        {
          title: "单价",
          dataIndex: "price",
        },
        {
          title: "合价",
          dataIndex: "sumPrice",
        },
      ],
    },
  ];

  return (
    <ProTable
      actionRef={actionRef}
      search={false}
      scroll={{ x: "max-content" }}
      rowKey={"groupBillCode"}
      bordered
      columns={columns}
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
      request={async ({ current: pageNum, pageSize }) => {
        // if (!types?.typeId1 || !types?.typeId2) return { data: [] };
        const res = await ContractImportApi.getUnitProjectList({
          projectId: projectId,
          priceType: 2,
          stageType: tabKey,
          pageNum,
          pageSize,
        });
        return {
          data: res.data || [],
          success: true,
        };
      }}
      expandable={{
        expandedRowRender: (record) => {
          return <ChildTable record={record} />;
        },
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

export default MaterialFee;
