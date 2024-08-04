import InstallmentApi from "@/apis/installmentApi";
import { ActionType, ProTable } from "@ant-design/pro-components";
import { useContext, useEffect, useRef, useState } from "react";
import { ProjectContext } from "../detailContext";
import useColumns from "./columns";
import CostPreviewModal from "./costPreviewModal";
import ExportBtn from "./exportBtn";
//机械使用费
const Table9 = ({ monthDate }: { monthDate?: string }) => {
  const actionRef = useRef<ActionType>();
  const { projectId } = useContext(ProjectContext);
  const [tabKey, settabKey] = useState("1");
  const pageRef = useRef<{ pageSize?: number; pageNum?: number }>();
  const { columns } = useColumns({
    projectId: projectId,
    priceType: 4,
    stageType: tabKey,
    monthDate: monthDate!,
    type: 3,
    actionRef: actionRef.current,
  });
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
        const res = await InstallmentApi.getOtherCostList({
          projectId: projectId,
          priceType: 4,
          stageType: tabKey,
          pageNum,
          pageSize,
          dateQuantitiesId: monthDate,
          type: 3,
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
            priceType={4}
            type={3}
            fileName="机械使用费"
            pageNum={pageRef.current?.pageNum}
            pageSize={pageRef.current?.pageSize}
            stageType={Number(tabKey)}
            dateQuantitiesId={monthDate}
          />,
          <CostPreviewModal
            priceType={4}
            dateQuantitiesId={monthDate!}
            type={3}
            title="机械使用费"
          />,
        ],
      }}
    />
  );
};

export default Table9;
