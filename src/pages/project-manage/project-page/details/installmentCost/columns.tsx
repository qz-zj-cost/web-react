import InstallmentApi from "@/apis/installmentApi";
import { ProColumns } from "@ant-design/pro-components";
import { useEffect, useState } from "react";

const useColumns = ({
  monthDate,
  priceType,
  stageType,
  projectId,
}: {
  monthDate: string;
  priceType: number;
  stageType: string;
  projectId: string;
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
  useEffect(() => {
    InstallmentApi.getMemberSum({
      monthDate,
      priceType,
      stageType,
      projectId,
    }).then((res) => {
      setData(res.data);
    });
  }, [monthDate, priceType, projectId, stageType]);

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
              dataIndex: "sumMortgage",
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
              dataIndex: "sumMortgage",
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
            {
              title: "工程量",
              dataIndex: "sumMortgage",
            },
            {
              title: "单价",
              dataIndex: "sumActualPrice",
            },
            {
              title: "合价",
              dataIndex: "sumActualIncome",
            },
          ],
        },
        {
          title: "目标成本节超率",
          dataIndex: "sumOvershootRate",
        },
        {
          title: "利润率",
          dataIndex: "sumProfitMargin",
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
              dataIndex: "mortgageValue",
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
              dataIndex: "mortgageValue",
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
    // {
    //   title: "局清单编码",
    //   dataIndex: "groupBillCode",
    // },
    // {
    //   title: "局清单名称",
    //   dataIndex: "name",
    // },
    // {
    //   title: "单位",
    //   dataIndex: "unit",
    // },
    // {
    //   title: "节超率",
    //   dataIndex: "overshootRate",
    // },
    // {
    //   title: "局清单量",
    //   dataIndex: "groupBillEngineeringNum",
    // },
    // {
    //   title: "构件工程量",
    //   dataIndex: "memberNum",
    // },
    // {
    //   title: "往期完成",
    //   dataIndex: "previousValue",
    // },
    // {
    //   title: "本期完成",
    //   dataIndex: "mortgageValue",
    // },
    // {
    //   title: "累计完成",
    //   dataIndex: "sumMortgage",
    // },
    // {
    //   title: "实际价格",
    //   dataIndex: "actualPrice",
    // },
    // {
    //   title: "实际成本",
    //   dataIndex: "actualIncome",
    // },
    // {
    //   title: "目标成本",
    //   dataIndex: "sumPrice",
    // },
    // {
    //   title: "合同收入",
    //   dataIndex: "incomeSumPrice",
    // },
  ];
  return {
    columns,
  };
};
export default useColumns;
