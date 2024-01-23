import { Button, Drawer, Tabs } from "antd";
import { useState } from "react";
import BuildTable from "./buildTable";
import SummaryTable from "./summaryTable";

const CalculateModal = ({ pathList }: { pathList?: string[] }) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        重新计算
      </Button>
      <Drawer
        width={1000}
        open={visible}
        onClose={() => setVisible(false)}
        destroyOnClose
      >
        <Tabs
          type="card"
          items={[
            {
              label: "汇总",
              key: "0",
              children: <SummaryTable pathList={pathList} />,
            },
            {
              label: "构建明细",
              key: "1",
              children: <BuildTable pathList={pathList} />,
            },
          ]}
        ></Tabs>
      </Drawer>
    </>
  );
};

export default CalculateModal;
