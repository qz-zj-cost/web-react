import BuildApi from "@/apis/buildApi";
import { Button, Tabs } from "antd";
import { useCallback, useContext, useState } from "react";
import { ProjectContext } from "..";
import Table1 from "./table1";
import Table2 from "./table2";
import Table3 from "./table3";

/**
 * @author Destin
 * @description 构件匹配局清单
 * @date 2023/12/25
 */
const BuildBureauList = () => {
  const { projectId } = useContext(ProjectContext);
  const [loading, setLoading] = useState(false);
  const handleMatch = useCallback(() => {
    setLoading(true);
    BuildApi.match({ id: projectId }).finally(() => {
      setLoading(false);
    });
  }, [projectId]);

  return (
    <div>
      <Button onClick={handleMatch} loading={loading} type="primary">
        智能匹配构件
      </Button>
      <Tabs
        type="card"
        style={{ marginTop: 15 }}
        items={[
          {
            label: "人工费",
            key: "0",
            children: <Table1 />,
          },
          {
            label: "直接材料费",
            key: "1",
            children: <Table2 />,
          },
          {
            label: "专业分包工程费",
            key: "2",
            children: <Table3 />,
          },
        ]}
      ></Tabs>
    </div>
  );
};

export default BuildBureauList;
