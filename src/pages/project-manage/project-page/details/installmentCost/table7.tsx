import InstallmentApi from "@/apis/installmentApi";
import { ActionType, ProTable } from "@ant-design/pro-components";
import { useContext, useEffect, useRef, useState } from "react";
import { ProjectContext } from "../detailContext";
import useColumns from "./columns";
import CostPreviewModal from "./costPreviewModal";
import ExportBtn from "./exportBtn";
//税金及附加
const Table7 = ({ monthDate }: { monthDate?: string }) => {
  const actionRef = useRef<ActionType>();
  const { projectId } = useContext(ProjectContext);
  const [tabKey, settabKey] = useState("1");
  const pageRef = useRef<{ pageSize?: number; pageNum?: number }>();
  const { columns } = useColumns({
    projectId: projectId,
    priceType: 3,
    stageType: tabKey,
    monthDate: monthDate!,
    type: 2,
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
          priceType: 3,
          stageType: tabKey,
          pageNum,
          pageSize,
          dateQuantitiesId: monthDate,
          type: 2,
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
            priceType={3}
            type={2}
            fileName="税金及附加"
            pageNum={pageRef.current?.pageNum}
            pageSize={pageRef.current?.pageSize}
            stageType={Number(tabKey)}
            dateQuantitiesId={monthDate}
          />,
          <CostPreviewModal
            priceType={3}
            dateQuantitiesId={monthDate!}
            type={2}
            title="税金及附加"
          />,
        ],
      }}
    />
  );
};

export default Table7;
