import ProjectApi from "@/apis/projectApi";
import { FPage } from "@/components";
import { IProjectModel } from "@/models/projectModel";
import { Tabs } from "antd";
import { createContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BaseInfo from "./baseInfo";
import ContractListImport from "./contractListImport";
import MeasuresFee from "./measuresFee";
import Overhead from "./overhead";
import TargetCost from "./targetCost";
import UnBureau from "./unBureau";
import UnitProject from "./unitProject";

interface IContextProps {
  projectId: string;
  projectInfo?: IProjectModel;
}
export const ProjectContext = createContext<IContextProps>(null as any);
const ProjectDetails = () => {
  const [info, setInfo] = useState<IProjectModel>();
  const [searchParams] = useSearchParams();
  const [projectId, setProjectId] = useState<string>("");
  // const { info: userInfo } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setProjectId(id);
      ProjectApi.getDetails<IProjectModel>({ id }).then((res) => {
        setInfo(res.data);
      });
    }
  }, [searchParams]);

  return (
    <ProjectContext.Provider value={{ projectInfo: info, projectId }}>
      <FPage style={{ padding: "15px" }}>
        <Tabs
          type="card"
          items={[
            {
              label: "项目信息",
              key: "0",
              children: (
                <BaseInfo
                  info={info}
                  // disabled={info?.createUserId !== userInfo?.id}
                />
              ),
            },
            {
              label: "合同清单导入",
              key: "1",
              children: <ContractListImport />,
            },
            {
              label: "项目成本拆分",
              key: "2",
              children: <UnitProject />,
            },
            {
              label: "项目间接费测算",
              key: "3",
              children: <Overhead />,
            },
            {
              label: "项目措施费测算",
              key: "4",
              children: <MeasuresFee />,
            },
            {
              label: "未归类局清单",
              key: "5",
              children: <UnBureau />,
            },
            {
              label: "目标成本归集",
              key: "7",
              children: <TargetCost />,
            },
          ]}
        ></Tabs>
      </FPage>
    </ProjectContext.Provider>
  );
};

export default ProjectDetails;
