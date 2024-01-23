import BuildApi from "@/apis/buildApi";
import { ActionType, ProTable } from "@ant-design/pro-components";
import { useContext, useRef, useState } from "react";
import { ProjectContext } from "..";
import ChildTable from "./childTable";
import { columns } from "./columns";

const Table2 = () => {
  const actionRef = useRef<ActionType>();
  const { projectId } = useContext(ProjectContext);
  const [tabKey, settabKey] = useState("1");
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
        const res = await BuildApi.getBureauList({
          projectId: projectId,
          priceType: 2,
          stageType: tabKey,
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
      expandable={{
        expandedRowRender: (record) => {
          return <ChildTable id={record.id} />;
        },
      }}
    />
  );
};

export default Table2;
