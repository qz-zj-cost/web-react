import InstallmentApi from "@/apis/installmentApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Space, Typography } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { ProjectContext } from "../detailContext";
import EditVisaModal, { IEditVisaModalRef } from "./editVisaModal";
//签证变更费用
const Table15 = ({ monthDate }: { monthDate?: string }) => {
  const actionRef = useRef<ActionType>();
  const [tabKey, settabKey] = useState("1");
  const { projectId } = useContext(ProjectContext);
  const editRef = useRef<IEditVisaModalRef>(null);
  const columns: ProColumns[] = [
    {
      title: "签证变更名称",
      dataIndex: "visaChangeName",
    },
    {
      title: "变更签证单号",
      dataIndex: "visaChangeNo",
    },
    {
      title: "变更签证类型",
      dataIndex: "visaChangeType",
    },
    {
      title: "收入预计",
      dataIndex: "incomeSumPrice",
    },
    {
      title: "目标成本",
      dataIndex: "sumPrice",
    },
    {
      title: "实际成本",
      dataIndex: "actualSumPrice",
    },
    {
      title: "目标成本节超率",
      dataIndex: "overshootRate",
    },
    {
      title: "利润率",
      dataIndex: "profitMargin",
    },
    {
      title: "备注",
      dataIndex: "remark",
    },
    {
      title: "操作",
      width: "auto",
      fixed: "right",
      align: "center",
      render: (_, val) => {
        return (
          <Space>
            <Typography.Link
              onClick={() => {
                editRef.current?.show(val);
              }}
            >
              编辑
            </Typography.Link>
          </Space>
        );
      },
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
      rowKey={"id"}
      bordered
      columns={columns}
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
      request={async ({ current: pageNum, pageSize }) => {
        try {
          if (!monthDate) return { data: [] };
          const res = await InstallmentApi.getVisaList({
            projectId: projectId,
            stageType: tabKey,
            pageNum,
            pageSize,
            dateQuantitiesId: monthDate,
          });
          return {
            data: res.data || [],
            success: true,
          };
        } catch (error) {
          return { data: [], success: false };
        }
      }}
      toolbar={{
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
        actions: [
          <EditVisaModal
            ref={editRef}
            dateQuantitiesId={monthDate}
            onSuccess={() => actionRef.current?.reload()}
          />,
        ],
      }}
    />
  );
};

export default Table15;
