import { ContractImportApi } from "@/apis/projectApi";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { Typography } from "antd";

const ChildTable = ({ record }: { record: any }) => {
  const columns: ProColumns[] = [
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
      title: "局清单编码",
      dataIndex: "groupBillCode",
    },
    {
      title: "局清单量",
      dataIndex: "groupBillEngineeringNum",
    },
    {
      title: "企业定额",
      dataIndex: "corpQuotaCode",
    },
    {
      title: "价格",
      dataIndex: "price",
    },
    {
      title: "合价",
      dataIndex: "totalAmount",
    },
  ];
  return (
    <ProTable
      search={false}
      scroll={{ x: "max-content" }}
      rowKey={"id"}
      bordered
      size="small"
      columns={[
        ...columns,
        {
          title: "操作",
          width: "auto",
          fixed: "right",
          align: "center",
          render: () => {
            return (
              <Typography.Link onClick={() => {}}>手动匹配</Typography.Link>
            );
          },
        },
      ]}
      request={async () => {
        const res = await ContractImportApi.getUnitChildList({
          id: record.id,
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
