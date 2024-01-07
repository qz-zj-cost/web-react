import { Tabs } from "antd";
import MTable1 from "./mTable1";
import MTable2 from "./mTable2";
import MTable3 from "./mTable3";
import MTable4 from "./mTable4";
import MTable5 from "./mTable5";

/**
 * @author Destin
 * @description 项目措施费测算
 * @date 2023/12/25
 */
const MeasuresFee = () => {
  return (
    <Tabs
      type="card"
      items={[
        {
          label: "现场经费",
          key: "0",
          children: <MTable1 />,
        },
        {
          label: "周转材料费(采购类)",
          key: "1",
          children: <MTable2 />,
        },
        {
          label: "周转材料费(租赁类)",
          key: "2",
          children: <MTable3 />,
        },
        {
          label: "安全文明施工费",
          key: "3",
          children: <MTable4 />,
        },
        {
          label: "其它措施费",
          key: "4",
          children: <MTable5 />,
        },
      ]}
    ></Tabs>
  );
};

export default MeasuresFee;
