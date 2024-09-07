import { Tabs } from "antd";
import Table1 from "./table1";
import Table2 from "./table2";
import Table3 from "./table3";
import Table4 from "./table4";

const SuppleyManage = () => {
  return (
    <Tabs
      type="card"
      style={{ marginTop: 15 }}
      items={[
        {
          label: "设备管理",
          key: "0",
          children: <Table1 />,
        },
        {
          label: "物资管理",
          key: "1",
          children: <Table2 />,
        },
        {
          label: "劳务管理",
          key: "2",
          children: <Table3 />,
        },
        {
          label: "财务管理",
          key: "3",
          children: <Table4 />,
        },
      ]}
    ></Tabs>
  );
};

export default SuppleyManage;
