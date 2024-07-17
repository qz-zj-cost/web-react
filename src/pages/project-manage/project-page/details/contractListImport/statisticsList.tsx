import ProjectApi from "@/apis/projectApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { useContext, useRef } from "react";
import { ProjectContext } from "../detailContext";

const StatisticsList = () => {
  const actionRef = useRef<ActionType>();
  const { projectId } = useContext(ProjectContext);

  const columns: ProColumns[] = [
    {
      title: "序号",
      dataIndex: "sort",
      // render(_, _v, index) {
      //   return index + 1;
      // },
    },
    {
      title: "单位工程",
      dataIndex: "unitProjectName",
    },
    {
      title: "金额",
      dataIndex: "amount",
    },
  ];

  return (
    <>
      <ProTable
        actionRef={actionRef}
        search={false}
        scroll={{ x: "max-content" }}
        rowKey={"sort"}
        bordered
        columns={columns}
        cardProps={{
          bodyStyle: { padding: 0 },
        }}
        pagination={false}
        request={async () => {
          const res = await ProjectApi.getStatisticsList({
            projectId: projectId,
          });
          return {
            data: res.data || [],
            success: true,
          };
        }}
        toolbar={{
          settings: [],
        }}
      />
    </>
  );
};

export default StatisticsList;
