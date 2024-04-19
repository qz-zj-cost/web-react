import ProjectApi from "@/apis/projectApi";
import { FPage } from "@/components";
import { IProjectModel } from "@/models/projectModel";
import { Spin, Tabs } from "antd";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BaseInfo from "./baseInfo";
import Bim from "./bim";
import BuildBureauList from "./buildBureauList";
import BuildList from "./buildList";
import ContractListImport from "./contractListImport";
import StatisticsList from "./contractListImport/statisticsList";
import InstallmentCost from "./installmentCost";
import MeasuresFee from "./measuresFee";
import Overhead from "./overhead";
import TargetCost from "./targetCost";
import UnBureau from "./unBureau";
import UnitProject from "./unitProject";

interface IContextProps {
  projectId: string;
  projectInfo?: IProjectModel;
  getProjectInfo: () => void;
}
export const ProjectContext = createContext<IContextProps>(null as any);
const ProjectDetails = () => {
  const [info, setInfo] = useState<IProjectModel>();
  const [searchParams] = useSearchParams();
  const projectIdRef = useRef<string>("");
  const [loading, setLoading] = useState(false);
  // const { info: userInfo } = useSelector((state: RootState) => state.user);
  const getProjectInfo = useCallback(() => {
    setLoading(true);
    ProjectApi.getDetails<IProjectModel>({ id: projectIdRef.current })
      .then((res) => {
        setInfo(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      projectIdRef.current = id;
      getProjectInfo();
    }
  }, [getProjectInfo, searchParams]);

  return (
    <ProjectContext.Provider
      value={{
        projectInfo: info,
        projectId: projectIdRef.current,
        getProjectInfo,
      }}
    >
      <Spin spinning={loading}>
        <FPage style={{ padding: "15px" }}>
          <h4 style={{ margin: "0 0 10px 0" }}>{info?.projectName}</h4>
          <Tabs
            type="card"
            items={[
              {
                label: "项目信息",
                key: "0",
                children: (
                  <BaseInfo
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
                label: "合同清单统计",
                key: "1.1",
                children: <StatisticsList />,
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
              {
                label: "导入构件清单",
                key: "8",
                children: <BuildList />,
              },
              {
                label: "构件匹配局清单",
                key: "9",
                children: <BuildBureauList />,
              },
              {
                label: "分期成本",
                key: "10",
                children: <InstallmentCost />,
              },
              {
                label: "BIM模型",
                key: "11",
                children: <Bim />,
              },
            ]}
          ></Tabs>
        </FPage>
      </Spin>
    </ProjectContext.Provider>
  );
};

export default ProjectDetails;
