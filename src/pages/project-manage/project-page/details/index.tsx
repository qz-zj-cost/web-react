import ProjectApi from "@/apis/projectApi";
import { FPage } from "@/components";
import { IProjectModel } from "@/models/projectModel";
import { RootState } from "@/store";
import { resetProject, setProject } from "@/store/project";
import { Spin, Tabs } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import BaseInfo from "./baseInfo";
import Bim from "./bim";
import BuildBureauList from "./buildBureauList";
import BuildList from "./buildList";
import ContractListImport from "./contractListImport";
import Dashboard from "./dashboard";
import { ProjectContext } from "./detailContext";
import InstallmentCost from "./installmentCost";
import MeasuresFee from "./measuresFee";
import Overhead from "./overhead";
import SuppleyManage from "./supplyManage";
import TargetCost from "./targetCost";
import UnitProject from "./unitProject";

const ProjectDetails = () => {
  const [info, setInfo] = useState<IProjectModel>();
  const [searchParams] = useSearchParams();
  const projectIdRef = useRef<string>("");
  const [loading, setLoading] = useState(false);
  const { auths } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const getProjectInfo = useCallback(() => {
    setLoading(true);
    dispatch(resetProject());
    ProjectApi.getDetails<IProjectModel>({ id: projectIdRef.current })
      .then((res) => {
        setInfo(res.data);
        dispatch(setProject({ currentProject: res.data }));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      projectIdRef.current = id;
      getProjectInfo();
    }
  }, [getProjectInfo, searchParams]);
  const tabView = useMemo(() => {
    const arr = [
      {
        label: "简报看板",
        key: "PROJECT_DETAIL_13",
        children: <Dashboard />,
      },
      {
        label: "项目信息",
        key: "PROJECT_DETAIL_0",
        children: (
          <BaseInfo
          // disabled={info?.createUserId !== userInfo?.id}
          />
        ),
      },
      {
        label: "合同清单导入",
        key: "PROJECT_DETAIL_1",
        children: <ContractListImport />,
      },
      // {
      //   label: "合同清单统计",
      //   key: "PROJECT_DETAIL_2",
      //   children: <StatisticsList />,
      // },
      {
        label: "项目成本拆分",
        key: "PROJECT_DETAIL_3",
        children: <UnitProject />,
      },
      {
        label: "项目间接费测算",
        key: "PROJECT_DETAIL_4",
        children: <Overhead />,
      },
      {
        label: "项目措施费测算",
        key: "PROJECT_DETAIL_5",
        children: <MeasuresFee />,
      },
      // {
      //   label: "未归类局清单",
      //   key: "PROJECT_DETAIL_6",
      //   children: <UnBureau />,
      // },
      {
        label: "目标成本归集",
        key: "PROJECT_DETAIL_7",
        children: <TargetCost />,
      },
      {
        label: "导入构件清单",
        key: "PROJECT_DETAIL_8",
        children: <BuildList />,
      },
      {
        label: "构件匹配局清单",
        key: "PROJECT_DETAIL_9",
        children: <BuildBureauList />,
      },
      {
        label: "分期成本",
        key: "PROJECT_DETAIL_10",
        children: <InstallmentCost />,
      },
      {
        label: "供应链管理",
        key: "PROJECT_DETAIL_12",
        children: <SuppleyManage />,
      },
      {
        label: "BIM模型",
        key: "PROJECT_DETAIL_11",
        children: <Bim />,
      },
    ];
    const codes = auths.map((e) => e.code);
    const newArr = arr.filter((item) => {
      return codes.includes(item.key);
    });
    return newArr;
  }, [auths]);
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
          <Tabs type="card" items={tabView}></Tabs>
        </FPage>
      </Spin>
    </ProjectContext.Provider>
  );
};

export default ProjectDetails;
