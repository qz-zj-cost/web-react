import { ContractImportApi } from "@/apis/projectApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Space } from "antd";
import { useRef } from "react";
import AdModal from "../components/AdModal";
import UnitPriceModal from "./modal/unitPriceModal";

const ChildTable = ({ record }: { record: any }) => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: "项目名称",
      dataIndex: "name",
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
      title: "单位",
      dataIndex: "unit",
    },
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
      ],
    },
  ];
  return (
    <ProTable
      search={false}
      rowKey={"id"}
      cardBordered
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
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
