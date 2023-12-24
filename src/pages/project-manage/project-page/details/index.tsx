import ProjectApi from "@/apis/projectApi";
import { FPage } from "@/components";
import { IProjectModel } from "@/models/projectModel";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BaseInfo from "./baseInfo";
import EngineeringQuantity from "./engineeringQuantity";
import FileList from "./fileList";
import ListMatch from "./listMatch";
import Review from "./review";

const ProjectDetails = () => {
  const [info, setInfo] = useState<IProjectModel>();
  const [searchParams] = useSearchParams();
  // const { info: userInfo } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      ProjectApi.getDetails<IProjectModel>({ id }).then((res) => {
        setInfo(res.data);
      });
    }
  }, [searchParams]);

  return (
    <FPage style={{ padding: "15px" }}>
      <Tabs
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
            label: "原始工程量",
            key: "1",
            // disabled: info?.createUserId !== userInfo?.id,
            children: <EngineeringQuantity info={info} />,
          },
          {
            label: "清单匹配和调整",
            key: "2",
            // disabled: userInfo?.engineer !== 1, //算量工程师可见
            children: <ListMatch info={info} />,
          },
          {
            label: "项目审核",
            key: "3",
            // disabled: userInfo?.expert !== 1, //专家可见
            children: <Review info={info} />,
          },
          {
            label: "项目资料",
            key: "4",
            // disabled: userInfo?.expert !== 1, //专家可见
            children: <FileList info={info} />,
          },
        ]}
      ></Tabs>
    </FPage>
  );
};

export default ProjectDetails;
