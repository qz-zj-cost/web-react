import BuildApi from "@/apis/buildApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { useRef } from "react";

const ChildTable = ({ id }: { id: number }) => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: "构件区域",
      dataIndex: "groupBillCode",
    },
    {
      title: "构件名称",
      dataIndex: "name",
    },
    {
      title: "单位",
      dataIndex: "unit",
    },
    {
      title: "计算项目",
      dataIndex: "computeProject",
    },
    {
      title: "构件工程量",
      dataIndex: "memberNum",
    },
  ];
  return (
    <ProTable
      search={false}
      rowKey={"id"}
      scroll={{ x: "max-content" }}
      bordered
      size="small"
      actionRef={actionRef}
      columns={[...columns]}
      request={async ({ current: pageNum, pageSize }) => {
        const res = await BuildApi.getBureauChildList({
          id: id,
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
        settings: [],
      }}
    />
  );
};

export default ChildTable;
