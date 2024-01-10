import { Space, Tabs } from "antd";
import { useState } from "react";
import FbTable from "./fbTable";
import ImportBtn from "./importBtn";
import MatchBtn from "./matchBtn";
import SgTable from "./sgTable";
import SummaryTable from "./summaryTable";

/**
 * @author Destin
 * @description 合同清单导入
 * @date 2023/12/25
 */

const ContractListImport = () => {
  const [num, setNum] = useState(0);

  return (
    <div>
      <Space style={{ marginBottom: 15 }}>
        <ImportBtn
          onSuccess={() => {
            setNum(num + 1);
          }}
        />
        <MatchBtn />
      </Space>
      <Tabs
        type="card"
        items={[
          {
            label: "汇总表",
            key: "0",
            children: <SummaryTable num={num} />,
          },
          {
            label: "分部分项清单表",
            key: "1",
            children: <FbTable num={num} />,
          },
          {
            label: "施工技术措施清单表",
            key: "2",
            children: <SgTable num={num} />,
          },
        ]}
      ></Tabs>
    </div>
  );
};

export default ContractListImport;
