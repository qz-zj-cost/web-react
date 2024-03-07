import { Tabs, Typography } from "antd";
import { useState } from "react";
import DateTable from "./dateTable";
import ImportPriceBtn from "./importPriceBtn";
import Table1 from "./table1";
import Table10 from "./table10";
import Table11 from "./table11";
import Table12 from "./table12";
import Table13 from "./table13";
import Table2 from "./table2";
import Table3 from "./table3";
import Table4 from "./table4";
import Table5 from "./table5";
import Table6 from "./table6";
import Table7 from "./table7";
import Table8 from "./table8";
import Table9 from "./table9";
/**
 * @author Destin
 * @description 分期成本
 * @date 2024/01/22
 */

const InstallmentCost = () => {
  const [date, setDate] = useState<string>();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflow: "auto",
      }}
    >
      <div
        style={{
          // width: 400,
          // minWidth: 400,
          // marginRight: 15,
          marginBottom: 15,
          padding: 15,
          paddingTop: 0,
          borderRadius: 4,
          border: "1px solid rgba(5, 5, 5, 0.06)",
        }}
      >
        <DateTable onChange={(e) => setDate(e)} date={date} />
      </div>
      <div
        style={{
          // width: "calc(100% - 420px)",
          border: "1px solid rgba(5, 5, 5, 0.06)",
          // marginRight: 15,
          padding: 15,
          borderRadius: 4,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography.Text strong>日期：{date}</Typography.Text>
          <ImportPriceBtn date={date} />
        </div>
        <Tabs
          type="card"
          style={{ marginTop: 15 }}
          items={[
            {
              label: "人工费",
              key: "0",
              children: <Table1 monthDate={date} />,
            },
            {
              label: "直接材料费",
              key: "1",
              children: <Table2 monthDate={date} />,
            },
            {
              label: "专业分包工程费",
              key: "2",
              children: <Table3 monthDate={date} />,
            },
            {
              label: "总包服务费",
              key: "3",
              children: <Table4 monthDate={date} />,
            },
            {
              label: "现场经费",
              key: "4",
              children: <Table5 monthDate={date} />,
            },
            {
              label: "规费及其他应用费",
              key: "5",
              children: <Table6 monthDate={date} />,
            },
            {
              label: "税金及附加",
              key: "6",
              children: <Table7 monthDate={date} />,
            },
            {
              label: "资金占用费",
              key: "7",
              children: <Table8 monthDate={date} />,
            },
            {
              label: "机械使用费",
              key: "8",
              children: <Table9 monthDate={date} />,
            },
            {
              label: "周转材料费(采购类)",
              key: "9",
              children: <Table10 monthDate={date} />,
            },
            {
              label: "周转材料费(租赁类)",
              key: "10",
              children: <Table11 monthDate={date} />,
            },
            {
              label: "安全文明施工费",
              key: "11",
              children: <Table12 monthDate={date} />,
            },
            {
              label: "其他措施费",
              key: "12",
              children: <Table13 monthDate={date} />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default InstallmentCost;
