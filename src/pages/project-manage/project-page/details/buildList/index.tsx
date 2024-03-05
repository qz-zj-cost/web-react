import { Tabs } from "antd";
import BuildBook from "./buildBook";
import RebarList from "./rebarList";

/**
 * @author Destin
 * @description 导入构件清单
 * @date 2023/12/25
 */
const BuildList = () => {
  return (
    <Tabs
      type="card"
      items={[
        {
          label: "构件计算书",
          key: "0",
          children: <BuildBook />,
        },
        {
          label: "钢筋表",
          key: "1",
          children: <RebarList />,
        },
      ]}
    ></Tabs>
  );
};

export default BuildList;
