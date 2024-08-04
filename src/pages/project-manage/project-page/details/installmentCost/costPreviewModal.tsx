import InstallmentApi from "@/apis/installmentApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, Drawer } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { ProjectContext } from "../detailContext";

const CostPreviewModal = ({
  priceType,
  type,
  dateQuantitiesId,
  title,
}: {
  priceType: number;
  type: number;
  dateQuantitiesId: string;
  title: string;
}) => {
  const [visible, setVisible] = useState(false);
  const actionRef = useRef<ActionType>();
  const { projectId } = useContext(ProjectContext);
  const [tabKey, settabKey] = useState("1");
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
  useEffect(() => {
    if (!dateQuantitiesId) return;
    InstallmentApi.getCostPreviewMemberSum({
      dateQuantitiesId,
      priceType,
      stageType: tabKey,
      projectId,
      type,
    }).then((res) => {
      setData(res.data);
    });
  }, [dateQuantitiesId, priceType, projectId, tabKey, type]);
  const columns: ProColumns[] = [
    {
      title: `(开累)小计：合同收入：${
        data?.incomeSumPrice ?? "-"
      }元；目标成本：${data?.sumPrice ?? "-"}元；实际成本：${
        data?.sumActualIncome ?? "-"
      }元`,
      children: [
        {
          title: "合同收入",
          children: [
            {
              title: "工程量",
              dataIndex: "incomePreviousValue",
            },
            {
              title: "单价",
              dataIndex: "incomePrice",
            },
            {
              title: "合价",
              dataIndex: "previousIncomeSumPrice",
            },
          ],
        },
        {
          title: "目标成本",
          children: [
            {
              title: "工程量",
              dataIndex: "previousValue",
            },
            {
              title: "单价",
              dataIndex: "previousPrice",
            },
            {
              title: "合价",
              dataIndex: "previousSumPrice",
            },
          ],
        },
        {
          title: "实际成本",
          children: [
            {
              title: "工程量",
              dataIndex: "actualPreviousValue",
            },
            {
              title: "单价",
              dataIndex: "previousActualPrice",
            },
            {
              title: "合价",
              dataIndex: "previousActualIncome",
            },
          ],
        },
        {
          title: "目标成本节超率",
          dataIndex: "previousOvershootRate",
        },
        {
          title: "利润率",
          dataIndex: "previousProfitMargin",
        },
      ],
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
            },
            {
              title: "单价",
              dataIndex: "actualPrice",
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
  return (
    <>
      <Button onClick={() => setVisible(true)} type="primary">
        开票成本预览
      </Button>
      <Drawer
        open={visible}
        title={`开票成本预览-${title}`}
        width={1200}
        onClose={() => setVisible(false)}
      >
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
            if (!dateQuantitiesId) return { data: [] };
            const res = await InstallmentApi.getCostPreviewList({
              projectId: projectId,
              priceType,
              type,
              stageType: tabKey,
              pageNum,
              pageSize,
              dateQuantitiesId,
            });
            return {
              data: res.data || [],
              success: true,
              total: res.totalRow,
            };
          }}
          toolbar={{
            menu: {
              type: "tab",
              activeKey: tabKey,
              items: [
                { label: "地下室阶段", key: "1" },
                { label: "主体", key: "2" },
                { label: "装饰修饰", key: "3" },
              ],
              onChange: (v) => {
                settabKey(v as string);
                actionRef.current?.reset?.();
              },
            },
          }}
        />
      </Drawer>
    </>
  );
};

export default CostPreviewModal;
