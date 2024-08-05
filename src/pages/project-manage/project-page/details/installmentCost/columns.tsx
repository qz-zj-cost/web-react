import InstallmentApi from "@/apis/installmentApi";
import {
  ActionType,
  ProColumns,
  ProFormDigit,
} from "@ant-design/pro-components";
import { Space } from "antd";
import { useCallback, useEffect, useState } from "react";
import EditItemModal from "../components/EditItemMoal";
import EditModal from "./editModal";

const useColumns = ({
  monthDate,
  priceType,
  stageType,
  projectId,
  type,
  actionRef,
}: {
  monthDate: string;
  priceType: number;
  stageType: string;
  projectId: string;
  type: number;
  actionRef?: ActionType;
}) => {
  const [data, setData] = useState<{
    actualIncome: number;
    incomeSumPrice: number;
    mortgageIncomeSumPrice: number;
    mortgageSumPrice: number;
    overshootRate: number;
    profitMargin: number;
    sumActualIncome: number;
    sumPrice: number;
  }>();

  const getData = useCallback(() => {
    if (!monthDate) return;
    InstallmentApi.getMemberSum({
      dateQuantitiesId: monthDate,
      priceType,
      stageType,
      projectId,
      type,
    }).then((res) => {
      setData(res.data);
    });
  }, [monthDate, priceType, projectId, stageType, type]);

  useEffect(() => {
    getData();
  }, [getData]);

  const columns: ProColumns[] = [
    {
      title: "费用名称",
      dataIndex: "name",
    },
    {
      title: "局清单编码",
      dataIndex: "groupBillCode",
    },
    {
      title: "上期开累完成比例",
      dataIndex: "previousRatio",
    },
    {
      title: "本期完成比例",
      dataIndex: "mortgageRatio",
      render: (dom, record) => {
        return (
          <Space>
            {`${dom}%`}
            <EditModal
              title="本期完成比例"
              disabled={type === 0}
              id={record.id}
              type={type}
              onSuccess={() => {
                actionRef?.reload();
                getData();
              }}
            >
              <ProFormDigit
                name={"mortgageRatio"}
                label={"本期完成比例"}
                rules={[{ required: true }]}
                fieldProps={{
                  suffix: "%",
                }}
              />
            </EditModal>
          </Space>
        );
      },
    },
    {
      title: `(本期)小计：合同收入：${
        data?.mortgageIncomeSumPrice ?? "-"
      }元；目标成本：${data?.mortgageSumPrice ?? "-"}元；实际成本：${
        data?.actualIncome ?? "-"
      }元`,
      children: [
        {
          title: "合同收入",
          children: [
            {
              title: "工程量",
              dataIndex: "incomeMortgageValue",
            },
            {
              title: "单价",
              dataIndex: "incomePrice",
            },
            {
              title: "合价",
              dataIndex: "mortgageIncomeSumPrice",
            },
          ],
        },
        {
          title: "目标成本",
          children: [
            {
              title: "工程量",
              dataIndex: "mortgageValue",
            },
            {
              title: "单价",
              dataIndex: "price",
            },
            {
              title: "合价",
              dataIndex: "mortgageSumPrice",
            },
          ],
        },
        {
          title: "实际成本",
          children: [
            {
              title: "工程量",
              dataIndex: "actualMortgageValue",
              render(dom, record) {
                return (
                  <Space>
                    {dom ?? "-"}
                    <EditItemModal
                      title="工程量"
                      api={(val) => {
                        return InstallmentApi.updatePriceAndNum({
                          ...val,
                          id: record.id,
                          type: type,
                        });
                      }}
                      onSuccess={() => {
                        actionRef?.reload();
                        getData();
                      }}
                    >
                      <ProFormDigit
                        name={"actualNum"}
                        label={"实际成本工程量"}
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
              render(dom, record) {
                return (
                  <Space>
                    {dom ?? "-"}
                    <EditItemModal
                      title="工程量"
                      api={(val) => {
                        return InstallmentApi.updatePriceAndNum({
                          ...val,
                          id: record.id,
                          type: type,
                        });
                      }}
                      onSuccess={() => {
                        actionRef?.reload();
                        getData();
                      }}
                    >
                      <ProFormDigit
                        name={"actualPrice"}
                        label={"实际成本单价"}
                        rules={[{ required: true }]}
                      />
                    </EditItemModal>
                  </Space>
                );
              },
            },
            {
              title: "合价",
              dataIndex: "actualIncome",
            },
          ],
        },
        {
          title: "目标成本节超率",
          dataIndex: "overshootRate",
        },
        {
          title: "利润率",
          dataIndex: "profitMargin",
        },
      ],
    },
  ];
  return {
    columns,
  };
};
export default useColumns;
