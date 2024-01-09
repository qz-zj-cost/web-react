import ProjectApi, { ContractImportApi } from "@/apis/projectApi";
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProFormRadio,
  ProTable,
} from "@ant-design/pro-components";
import { Typography } from "antd";
import { useRef } from "react";

const ChildTable = ({ record }: { record: any }) => {
  const actionRef = useRef<ActionType>();
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

const AdModal = ({
  id,
  onSuccess,
}: {
  id: number;
  onSuccess: VoidFunction;
}) => {
  return (
    <ModalForm<{ priceType: number; stageType: number }>
      modalProps={{ destroyOnClose: true }}
      trigger={<Typography.Link>调整</Typography.Link>}
      title="调整分类和阶段"
      width={600}
      onFinish={async (val) => {
        try {
          await ProjectApi.updateStage({ ...val, id });
          onSuccess();
          return true;
        } catch (error) {
          return false;
        }
      }}
    >
      <ProFormRadio.Group
        name="priceType"
        label="分类"
        options={[
          { value: 1, label: "直接人工费" },
          { value: 2, label: "直接材料费" },
          { value: 3, label: "分包工程支出" },
          { value: 4, label: "机械使用费" },
          { value: 5, label: "周转材料费（采购类" },
          { value: 6, label: "周转材料费（租赁类）" },
          { value: 7, label: "安全文明施工费" },
          { value: 8, label: "其他措施费" },
        ]}
      />
      <ProFormRadio.Group
        name="stageType"
        label="阶段"
        options={[
          { value: 1, label: "地下室" },
          { value: 2, label: "主体" },
          { value: 3, label: "装修装饰" },
        ]}
      />
    </ModalForm>
  );
};
export default ChildTable;
