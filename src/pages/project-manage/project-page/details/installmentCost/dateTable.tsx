import InstallmentApi from "@/apis/installmentApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { useContext, useRef } from "react";
import { ProjectContext } from "..";
import AddDateModal from "./addDateModal";

const DateTable = ({
  onChange,
  date,
}: {
  onChange: (date: string) => void;
  date?: string;
}) => {
  const actionRef = useRef<ActionType>();
  const { projectId } = useContext(ProjectContext);
  const columns: ProColumns[] = [
    {
      title: "分期月份",
      dataIndex: "monthDate",
    },
    {
      title: "合同收入",
      dataIndex: "sumPrice",
    },
    {
      title: "目标成本",
      dataIndex: "incomeSumPrice",
    },
    {
      title: "实际成本",
      dataIndex: "actualIncome",
    },
  ];
  return (
    <ProTable
      actionRef={actionRef}
      search={false}
      rowKey={"monthDate"}
      bordered
      scroll={{ x: "max-content", y: 500 }}
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
      size="small"
      rowSelection={{
        hideSelectAll: true,
        type: "radio",
        selectedRowKeys: date ? [date] : [],
        onChange(selectedRowKeys) {
          if (selectedRowKeys.length > 0) {
            onChange(selectedRowKeys[0] as string);
          }
        },
      }}
      tableAlertRender={false}
      columns={columns}
      request={async ({ current: pageNum, pageSize }) => {
        const res = await InstallmentApi.getDateList({
          projectId: projectId,
          pageNum,
          pageSize,
        });
        if (res.data?.length > 0) onChange(res.data[0].monthDate);
        return {
          data: res.data || [],
          success: true,
          total: res.totalRow,
        };
      }}
      onRow={(record) => {
        return {
          onClick: () => {
            if (record.monthDate) {
              onChange(record.monthDate);
            }
          },
        };
      }}
      headerTitle="分期列表"
      toolbar={{
        actions: [
          <AddDateModal
            onSuccess={() => {
              actionRef.current?.reload();
            }}
          />,
        ],
      }}
    />
  );
};

export default DateTable;
