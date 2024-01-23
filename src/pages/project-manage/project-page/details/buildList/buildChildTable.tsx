import BuildApi from "@/apis/buildApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { useRef } from "react";

const BuildChildTable = ({ id }: { id: number }) => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: "序号",
      dataIndex: "sort",
    },
    {
      title: "计算项目",
      dataIndex: "computeProject",
    },

    {
      title: "单位",
      dataIndex: "unit",
    },
    {
      title: "计算值",
      dataIndex: "computeValue",
    },
  ];
  return (
    <>
      <ProTable
        search={false}
        scroll={{ x: "max-content" }}
        rowKey={"sort"}
        bordered
        size="small"
        actionRef={actionRef}
        columns={[...columns]}
        request={async () => {
          if (!id) return { data: [], success: true };
          const res = await BuildApi.getBuildChildList({
            id,
          });
          return {
            data: res.data || [],
            success: true,
          };
        }}
        toolbar={{
          settings: [],
        }}
        pagination={false}
      />
    </>
  );
};

export default BuildChildTable;
