import BuildApi from "@/apis/buildApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Key, useRef } from "react";

const BuildChildTable = ({
  id,
  value,
  onChange,
}: {
  id: number;
  value?: Key;
  onChange?: (value: Key) => void;
}) => {
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
    <ProTable
      search={false}
      scroll={{ x: "max-content" }}
      rowKey={"id"}
      bordered
      cardProps={{
        bodyStyle: {
          padding: 0,
        },
      }}
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
      tableAlertRender={false}
      rowSelection={
        onChange
          ? {
              type: "radio",
              selectedRowKeys: value ? [value] : void 0,
              onChange: (_, selectedRows) => {
                if (selectedRows.length > 0) {
                  onChange?.(_[0]);
                }
              },
            }
          : false
      }
    />
  );
};

export default BuildChildTable;
