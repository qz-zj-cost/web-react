import { Tabs, Typography } from "antd";
import { useState } from "react";
import DateTable from "./dateTable";
import ImportPriceBtn from "./importPriceBtn";
import Table1 from "./table1";
import Table2 from "./table2";
import Table3 from "./table3";
/**
 * @author Destin
 * @description 分期成本
 * @date 2024/01/22
 */

const InstallmentCost = () => {
  const [date, setDate] = useState<string>();

  return (
    <div style={{ display: "flex", width: "100%", overflow: "auto" }}>
      <div
        style={{
          width: 400,
          minWidth: 400,
          marginRight: 15,
          padding: 15,
          borderRadius: 4,
          border: "1px solid rgba(5, 5, 5, 0.06)",
        }}
      >
        <DateTable onChange={(e) => setDate(e)} date={date} />
      </div>
      <div
        style={{
          width: "calc(100% - 420px)",
          border: "1px solid rgba(5, 5, 5, 0.06)",
          marginRight: 15,
          padding: 15,
          borderRadius: 4,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>日期：{date}</Typography>
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
          ]}
        />
      </div>
    </div>
  );
};

export default InstallmentCost;
