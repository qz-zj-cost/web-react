import BuildApi from "@/apis/buildApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Space, Tag } from "antd";
import { Key, useRef } from "react";

const BuildChildTable = ({
  id,
  value,
  onChange,
}: {
  id: number;
  value?: Key;
  onChange?: (value: Key, label: string) => void;
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
    {
      title: "匹配的局清单",
      dataIndex: "dtoList",
      width: 200,
      render: (_, entity) => {
        return (
          <Space direction="vertical">
            {entity["dtoList"]?.map((item: any) => (
              <div
                key={item.groupBillCode}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Tag color="processing">
                  名称：{item?.groupBillName ?? "-"}
                  <br />
                  编码：{item?.groupBillCode ?? "-"}
                </Tag>
              </div>
            )) ?? "-"}
          </Space>
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
                  onChange?.(_[0], selectedRows[0].computeProject);
                }
              },
            }
          : false
      }
    />
  );
};

export default BuildChildTable;
