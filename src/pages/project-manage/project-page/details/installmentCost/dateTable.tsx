import InstallmentApi from "@/apis/installmentApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Popconfirm, Space, Typography, message } from "antd";
import { useContext, useRef } from "react";
import { ProjectContext } from "../detailContext";
import AddDateModal from "./addDateModal";
import EditDateDrawer, { IEditDateDrawerRef } from "./editDateDrawer";
import ExportActualCost from "./exportActualCost";

const DateTable = ({
  onChange,
  date,
}: {
  onChange: (date: string) => void;
  date?: string;
}) => {
  const actionRef = useRef<ActionType>();
  const { projectId } = useContext(ProjectContext);
  const editRef = useRef<IEditDateDrawerRef>(null);
  const columns: ProColumns[] = [
    {
      title: "序号",
      dataIndex: "id",
      width: 60,
    },
    {
      title: "分期时间",
      width: 200,
      dataIndex: "monthDate",
    },
    {
      title: "当前合同收入(元)",
      dataIndex: "sumPrice",
      width: 200,
    },
    {
      title: "当前目标成本(元)",
      dataIndex: "incomeSumPrice",
      width: 200,
    },
    {
      title: "当前实际成本(元)",
      dataIndex: "actualIncome",
      width: 200,
    },
    {
      title: "创建时间",
      dataIndex: "gmtCreated",
      width: 200,
    },
    {
      title: "操作",
      width: "auto",
      fixed: "right",
      align: "center",
      render: (_, val) => {
        return (
          <Space>
            <Popconfirm
              title="确认提交此审批？"
              onConfirm={() => {
                return InstallmentApi.approval({ id: val.id }).then(() => {
                  actionRef.current?.reload();
                  message.success("操作成功");
                });
              }}
            >
              <Typography.Link disabled>提交审批</Typography.Link>
            </Popconfirm>
            <Typography.Link
              onClick={() => {
                editRef.current?.show(val);
              }}
            >
              编辑
            </Typography.Link>
            <Popconfirm
              title="确认删除此项目？"
              onConfirm={() => {
                return InstallmentApi.deleteInstallMent({ id: val.id }).then(
                  () => {
                    actionRef.current?.reload();
                    message.success("操作成功");
                  },
                );
              }}
            >
              <Typography.Link type="danger">删除</Typography.Link>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  return (
    <>
      <ProTable
        actionRef={actionRef}
        search={false}
        rowKey={"id"}
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
          if (res.data?.length > 0) onChange(res.data[0].id);
          return {
            data: res.data || [],
            success: true,
            total: res.totalRow,
          };
        }}
        // onRow={(record) => {
        //   return {
        //     onClick: () => {
        //       if (record.monthDate) {
        //         onChange(record.monthDate);
        //       }
        //     },
        //   };
        // }}
        headerTitle="分期列表"
        toolbar={{
          actions: [
            <AddDateModal
              onSuccess={() => {
                actionRef.current?.reload();
              }}
            />,
            <ExportActualCost monthDate={date} />,
          ],
        }}
      />
      <EditDateDrawer ref={editRef} />
    </>
  );
};

export default DateTable;
