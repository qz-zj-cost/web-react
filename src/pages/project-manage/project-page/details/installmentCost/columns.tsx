import { ProColumns } from "@ant-design/pro-components";

export const columns: ProColumns[] = [
  {
    title: "局清单编码",
    dataIndex: "groupBillCode",
  },
  {
    title: "局清单名称",
    dataIndex: "name",
  },
  {
    title: "单位",
    dataIndex: "unit",
  },
  {
    title: "节超率",
    dataIndex: "overshootRate",
  },
  {
    title: "局清单量",
    dataIndex: "groupBillEngineeringNum",
  },
  {
    title: "构件工程量",
    dataIndex: "memberNum",
  },
  {
    title: "往期完成",
    dataIndex: "previousValue",
  },
  {
    title: "本期完成",
    dataIndex: "mortgageValue",
  },
  {
    title: "累计完成",
    dataIndex: "sumMortgage",
  },
  {
    title: "实际价格",
    dataIndex: "actualPrice",
  },
  {
    title: "实际成本",
    dataIndex: "actualIncome",
  },
  {
    title: "目标成本",
    dataIndex: "sumPrice",
  },
  {
    title: "合同收入",
    dataIndex: "incomeSumPrice",
  },
];
