/**
 * @author Destin
 * @description 未归类局清单
 * @date 2023/12/25
 */

import { ContractImportApi } from "@/apis/projectApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { useContext, useRef, useState } from "react";
import { ProjectContext } from "..";
import AdModal from "../components/AdModal";

const UnBureau = () => {
  const { projectId } = useContext(ProjectContext);
  const [tabKey, settabKey] = useState("1");
  const actionRef = useRef<ActionType>();
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
    {
      title: "操作",
      width: "auto",
      fixed: "right",
      align: "center",
      render: (_, val) => {
        return (
          <AdModal
            id={val.id}
            onSuccess={() => {
              actionRef.current?.reload();
            }}
          />
        );
      },
    },
  ];

  return (
    <ProTable
      search={false}
      scroll={{ x: "max-content" }}
      rowKey={"id"}
      bordered
      actionRef={actionRef}
      request={async ({ current: pageNum, pageSize }) => {
        const res = await ContractImportApi.getUnitProjectList({
          projectId: projectId,
          stageType: tabKey,
          priceType: 0,
          pageNum,
          pageSize,
        });
        return {
          data: res.data || [],
          success: true,
          total: res.totalRow,
        };
      }}
      toolbar={{
        multipleLine: true,
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
      columns={columns}
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
    />
  );
};

export default UnBureau;
