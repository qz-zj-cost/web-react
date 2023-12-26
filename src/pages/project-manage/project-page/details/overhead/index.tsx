import { Tabs } from "antd";
import Funds from "./funds";
import OnSite from "./onSite";
import OtherCost from "./otherCost";
import Taxes from "./taxes";

/**
 * @author Destin
 * @description 项目间接费测算
 * @date 2023/12/25
 */
const Overhead = () => {
  return (
    <Tabs
      type="card"
      items={[
        {
          label: "现场经费",
          key: "0",
          children: <OnSite />,
        },
        {
          label: "规费及其他费用",
          key: "1",
          children: <OtherCost />,
        },
        {
          label: "税金及附加",
          key: "2",
          children: <Taxes />,
        },
        {
          label: "资金占用费",
          key: "3",
          children: <Funds />,
        },
      ]}
    ></Tabs>
  );
};

export default Overhead;
