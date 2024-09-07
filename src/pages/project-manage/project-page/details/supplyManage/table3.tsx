import InstallmentApi from "@/apis/installmentApi";
import {
  ActionType,
  ProColumns,
  ProFormDigit,
  ProTable,
} from "@ant-design/pro-components";
import { Select, Space } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import EditItemModal from "../components/EditItemMoal";
import { ProjectContext } from "../detailContext";
//劳务管理
const Table3 = () => {
  const actionRef = useRef<ActionType>();
  const { projectId } = useContext(ProjectContext);
  const [fqOptions, setfqOptions] =
    useState<{ label: string; value: number }[]>();
  const [fqValue, setFqValue] = useState<number>();
  useEffect(() => {
    InstallmentApi.getDateList({
      projectId: projectId,
      pageNum: 1,
      pageSize: 1000,
    }).then((e) => {
      const arr = e.data.map((e) => ({ label: e.name, value: e.id }));
      setfqOptions(arr);
      if (arr.length > 0) {
        setFqValue(arr[0].value);
      }
    });
  }, [projectId]);

  useEffect(() => {
    actionRef.current?.reload();
  }, [fqValue]);

  const columns: ProColumns[] = [
    { title: "序号", dataIndex: "id" },
    { title: "物料名称", dataIndex: "materialName" },
    { title: "物料规格型号", dataIndex: "materialModel" },
    { title: "单位", dataIndex: "materialUnit" },
    { title: "单价", dataIndex: "materialPrice" },
    { title: "匹配局清单", dataIndex: "groupBillCode" },
    {
      title: "合同收入",
      children: [
        {
          title: "工程量",
          dataIndex: "num",
          render(dom, record) {
            return (
              <Space>
                {dom ?? "-"}
                <EditItemModal
                  title="合同收入工程量"
                  api={(val) => {
                    return InstallmentApi.editSupplyGclNum({
                      ...val,
                      id: record.id,
                    });
                  }}
                  onSuccess={() => {
                    actionRef.current?.reload();
                  }}
                >
                  <ProFormDigit
                    name={"num"}
                    label={"合同收入工程量"}
                    rules={[{ required: true }]}
                  />
                </EditItemModal>
              </Space>
            );
          },
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
                <EditItemModal
                  title="目标成本工程量"
                  api={(val) => {
                    return InstallmentApi.editSupplyGclNum({
                      ...val,
                      id: record.id,
                    });
                  }}
                  onSuccess={() => {
                    actionRef.current?.reload();
                  }}
                >
                  <ProFormDigit
                    name={"groupBillEngineeringNum"}
                    label={"目标成本工程量"}
                    rules={[{ required: true }]}
                  />
                </EditItemModal>
              </Space>
            );
          },
        },
        {
          title: "单价",
          dataIndex: "price",
        },
        {
          title: "合价",
          dataIndex: "sumPrice",
        },
      ],
    },
    {
      title: "实际成本",
      children: [
        // {
        //   title: "结算工程量",
        //   dataIndex: "",
        // },
        // {
        //   title: "盘点工程量",
        //   dataIndex: "",
        // },
        {
          title: "实际工程量",
          dataIndex: "mortgageValue",
          render(dom, record) {
            return (
              <Space>
                {dom ?? "-"}
                <EditItemModal
                  title="实际工程量"
                  api={(val) => {
                    return InstallmentApi.editSupplyGclNum({
                      ...val,
                      id: record.id,
                    });
                  }}
                  onSuccess={() => {
                    actionRef.current?.reload();
                  }}
                >
                  <ProFormDigit
                    name={"mortgageValue"}
                    label={"实际工程量"}
                    rules={[{ required: true }]}
                  />
                </EditItemModal>
              </Space>
            );
          },
        },
        {
          title: "单价",
          dataIndex: "actualPrice",
        },
        {
          title: "合价",
          dataIndex: "actualSumPrice",
        },
      ],
    },
    // { title: "已支付", dataIndex: "name" },
    // { title: "对比预警", dataIndex: "name" },
  ];
  return (
    <ProTable
      actionRef={actionRef}
      search={false}
      scroll={{ x: "max-content" }}
      rowKey={"id"}
      bordered
      columns={columns}
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
      request={async ({ current: pageNum, pageSize }) => {
        if (!fqValue) return { data: [] };
        const res = await InstallmentApi.getSupplyList({
          type: 3,
          pageNum,
          pageSize,
          dateQuantitiesId: fqValue,
        });
        return {
          data: res.data || [],
          success: true,
          total: res.totalRow,
        };
      }}
      toolbar={{
        actions: [
          <Select
            value={fqValue}
            options={fqOptions}
            onChange={(e) => {
              setFqValue(e);
            }}
            popupMatchSelectWidth={false}
          />,
        ],
      }}
    />
  );
};

export default Table3;
