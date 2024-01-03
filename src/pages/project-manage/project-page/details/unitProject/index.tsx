import { Tabs } from "antd";
import LaborCost from "./laborCost";
import MaterialFee from "./materialFee";
import ProjectCost from "./projectCost";
import ServiceCost from "./serviceCost";

/**
 * @author Destin
 * @description 项目成本拆分
 * @date 2023/12/25
 */
const UnitProject = () => {
  return (
    <Tabs
      type="card"
      items={[
        {
          label: "人工费",
          key: "0",
          children: <LaborCost />,
        },
        {
          label: "直接材料费",
          key: "1",
          children: <MaterialFee />,
        },
        {
          label: "专业分包工程费",
          key: "2",
          children: <ProjectCost />,
        },
        {
          label: "总包服务费",
          key: "3",
          children: <ServiceCost />,
        },
      ]}
    ></Tabs>
  );
};

export default UnitProject;
