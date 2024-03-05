import { ContractImportApi } from "@/apis/projectApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Space, Typography } from "antd";
import { useRef } from "react";
import AdModal from "../components/AdModal";
import UnitPriceModal from "../unitProject/modal/unitPriceModal";
import EditNumModal from "./editNumModal";

const ChildTable = ({
  record,
  type,
  onReload,
}: {
  record: any;
  type?: number;
  onReload?: VoidFunction;
}) => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: "项目名称",
      dataIndex: "name",
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
    // {
    //   title: "项目特征",
    //   dataIndex: "feature",
    //   render(dom) {
    //     return (
    //       <Typography.Paragraph
    //         style={{ width: 300, margin: 0 }}
    //         ellipsis={{ rows: 2, expandable: true }}
    //       >
    //         {dom}
    //       </Typography.Paragraph>
    //     );
    //   },
    // },

    {
      title: "清单工程量",
      dataIndex: "num",
    },
    {
      title: "局清单编码",
      dataIndex: "groupBillCode",
    },

    {
      title: "企业定额",
      dataIndex: "corpQuotaCode",
    },
    {
      title: "单位",
      dataIndex: "unit",
    },
    {
      title: "合同收入",
      children: [
        {
          title: "工程量",
          dataIndex: "num",
        },
        {
          title: "单价",
          dataIndex: "incomePrice",
        },
        {
          title: "合价",
          dataIndex: "incomeSumPrice",
        },
      ],
    },
    {
      title: "目标成本",
      children: [
        {
          title: "工程量",
          dataIndex: "groupBillEngineeringNum",
          render(dom, record) {
            return (
              <Space>
                {dom ?? "-"}
                <EditNumModal
                  id={record.id}
                  onSuccess={() => {
                    actionRef.current?.reload();
                    onReload?.();
                  }}
                ></EditNumModal>
              </Space>
            );
          },
        },
        {
          title: "单价",
          dataIndex: "price",
          render(dom, record) {
            return (
              <Space>
                {dom ?? "-"}
                <UnitPriceModal
                  type={1}
                  code={record.corpQuotaCode}
                  id={record.id}
                  onSuccess={() => {
                    actionRef.current?.reload();
                    onReload?.();
                  }}
                />
              </Space>
            );
          },
        },
        {
          title: "合价",
          dataIndex: "sumPrice",
        },
        {
          title: "使用时长(月)",
          dataIndex: "duration",
          hideInTable: type !== 1,
          render(dom) {
            return <Space>{dom}</Space>;
          },
        },
        {
          title: "周转次数",
          dataIndex: "frequency",
          hideInTable: type !== 2,
          render(dom) {
            return <Space>{dom}</Space>;
          },
        },
      ],
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
      columns={[
        ...columns,
        {
          title: "操作",
          width: "auto",
          fixed: "right",
          align: "center",
          render: (_, val) => {
            return (
              <AdModal
                id={val.id}
                onSuccess={() => {
                  actionRef.current?.reload();
                }}
              />
            );
          },
        },
      ]}
      request={async () => {
        const res = await ContractImportApi.getUnitChildList({
          id: record.id,
          groupBillCode: record.groupBillCode,
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
  );
};

export default ChildTable;
