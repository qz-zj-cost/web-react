import { Space, Tabs } from "antd";
import { useState } from "react";
import UnBureau from "../unBureau";
import FbTable from "./fbTable";
import GfTable from "./gfTable";
import ImportProjectBtn from "./importProjectBtn";
import SgTable from "./sgTable";
import ZjTable from "./zjTable";

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
        {/* <ImportBtn
          onSuccess={() => {
            setNum(num + 1);
          }}
        /> */}
        <ImportProjectBtn
          onSuccess={() => {
            setNum(num + 1);
          }}
        />
        {/* <MatchBtn /> */}
      </Space>
      <Tabs
        type="card"
        items={[
          // {
          //   label: "汇总表",
          //   key: "0",
          //   children: <SummaryTable num={num} />,
          // },
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
          {
            label: "总价措施项目",
            key: "3",
            children: <ZjTable />,
          },
          {
            label: "规费、税金项目",
            key: "4",
            children: <GfTable />,
          },
          {
            label: "未归类局清单",
            key: "PROJECT_DETAIL_6",
            children: <UnBureau />,
          },
        ]}
      ></Tabs>
    </div>
  );
};

export default ContractListImport;
