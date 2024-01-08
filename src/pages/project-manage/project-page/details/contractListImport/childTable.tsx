import { ContractImportApi } from "@/apis/projectApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Typography } from "antd";
import { useRef } from "react";
import MatchModal, { IMatchModalRef } from "./matchModal";

type IChildTableProp = {
  unitProjectUuid?: string;
  uuid?: string;
};
const ChildTable = ({ unitProjectUuid, uuid }: IChildTableProp) => {
  const matchRef = useRef<IMatchModalRef>(null);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: "项目编码",
      dataIndex: "number",
    },
    {
      title: "项目名称",
      dataIndex: "name",
    },
    {
      title: "项目特征",
      dataIndex: "feature",
      render(dom) {
        return (
          <Typography.Paragraph
            style={{ width: 300, margin: 0 }}
            ellipsis={{ rows: 2, expandable: true }}
          >
            {dom}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: "单位",
      dataIndex: "unit",
    },
    {
      title: "清单工程量",
      dataIndex: "num",
    },
    {
      title: "综合单价",
      dataIndex: "subtotal",
    },
    {
      title: "合价",
      dataIndex: "totalAmount",
    },
    {
      title: "匹配的局清单",
      dataIndex: "groupBillCode",
      render(_, entity) {
        return (
          <Typography.Paragraph
            style={{ width: 200, margin: 0 }}
            ellipsis={{ rows: 2, expandable: true }}
          >
            {entity["groupBillCode"] ?? "-"}
          </Typography.Paragraph>
        );
      },
    },
  ];
  return (
    <>
      <ProTable
        search={false}
        scroll={{ x: "max-content" }}
        rowKey={"id"}
        bordered
        size="small"
        actionRef={actionRef}
        columns={[
          ...columns,
          {
            title: "操作",
            width: "auto",
            fixed: "right",
            align: "center",
            render: (_, entity) => {
              return (
                <Typography.Link
                  onClick={() => {
                    matchRef.current?.show(entity);
                  }}
                >
                  手动匹配
                </Typography.Link>
              );
            },
          },
        ]}
        request={async () => {
          if (!unitProjectUuid) return { data: [], success: true };
          const res = await ContractImportApi.getChildList({
            unitProjectUuid,
            uuid: uuid,
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
      <MatchModal
        ref={matchRef}
        onSuccess={() => {
          actionRef.current?.reload?.();
        }}
      />
    </>
  );
};
export default ChildTable;
