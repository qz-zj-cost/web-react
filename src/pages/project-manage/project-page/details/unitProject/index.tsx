import { ContractImportApi } from "@/apis/projectApi";
import { Tabs } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { useCallback, useContext, useEffect, useState } from "react";
import { ProjectContext } from "..";
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
  const { projectId } = useContext(ProjectContext);
  const [typeList, setTypeList] = useState<DefaultOptionType[]>([]);
  const getTypeList = useCallback(() => {
    return ContractImportApi.getProjectTypeList({ id: projectId }).then(
      (res) => {
        const opts = res.data.map((v) => ({
          label: v.unitProject,
          value: v.uuid,
          children: v.unitSectionDtoList?.map((e) => ({
            label: e.name,
            value: e.uuid,
          })),
        }));
        setTypeList(opts);
      },
    );
  }, [projectId]);

  useEffect(() => {
    getTypeList();
  }, [getTypeList]);
  return (
    <Tabs
      type="card"
      items={[
        {
          label: "人工费",
          key: "0",
          children: <LaborCost options={typeList} />,
        },
        {
          label: "直接材料费",
          key: "1",
          children: <MaterialFee options={typeList} />,
        },
        {
          label: "专业分包工程费",
          key: "2",
          children: <ProjectCost options={typeList} />,
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
