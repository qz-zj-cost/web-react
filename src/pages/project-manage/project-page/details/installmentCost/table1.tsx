import InstallmentApi from "@/apis/installmentApi";
import { ActionType, ProTable } from "@ant-design/pro-components";
import { useContext, useEffect, useRef, useState } from "react";

import { ProjectContext } from "../detailContext";
import ChildTable from "./childTable";
import useColumns from "./columns";
import ExportBtn from "./exportBtn";

const Table1 = ({ monthDate }: { monthDate?: string }) => {
  const actionRef = useRef<ActionType>();
  const { projectId } = useContext(ProjectContext);
  const [tabKey, settabKey] = useState("1");
  const { columns } = useColumns({
    projectId: projectId,
    priceType: 1,
    stageType: tabKey,
    monthDate: monthDate!,
  });

  const pageRef = useRef<{ pageSize?: number; pageNum?: number }>();
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
        if (!monthDate) return { data: [] };
        const res = await InstallmentApi.getCostList({
          projectId: projectId,
          priceType: 1,
          stageType: tabKey,
          pageNum,
          pageSize,
          dateQuantitiesId: monthDate,
        });
        pageRef.current = { pageSize, pageNum };
        return {
          data: res.data || [],
          success: true,
          total: res.totalRow,
        };
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
          <ExportBtn
            priceType={1}
            fileName="人工费"
            pageNum={pageRef.current?.pageNum}
            pageSize={pageRef.current?.pageSize}
            stageType={Number(tabKey)}
            monthDate={monthDate}
          />,
        ],
      }}
      expandable={{
        expandedRowRender: (record) => {
          return <ChildTable id={record.id} monthDate={monthDate} />;
        },
      }}
    />
  );
};

export default Table1;
