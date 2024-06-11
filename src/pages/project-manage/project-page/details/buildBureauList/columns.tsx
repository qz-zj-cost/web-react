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
    title: "目标成本工程量",
    dataIndex: "groupBillEngineeringNum",
  },
  {
    title: "构件工程量",
    dataIndex: "memberNum",
  },
  {
    title: "量差",
    dataIndex: "quantityDifference",
  },
  {
    title: "价差",
    dataIndex: "priceDifference",
  },
  {
    title: "目标成本单价",
    dataIndex: "price",
  },
];
