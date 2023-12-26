import { ContractImportApi } from "@/apis/projectApi";
import { Space, Tabs } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { useCallback, useContext, useEffect, useState } from "react";
import { ProjectContext } from "..";
import FbTable from "./fbTable";
import ImportBtn from "./importBtn";
import SgTable from "./sgTable";
import SummaryTable from "./summaryTable";

/**
 * @author Destin
 * @description 合同清单导入
 * @date 2023/12/25
 */

const ContractListImport = () => {
  const { projectId } = useContext(ProjectContext);
  const [typeList, setTypeList] = useState<DefaultOptionType[]>([]);
  const getTypeList = useCallback(() => {
    return ContractImportApi.getProjectTypeList({ id: projectId }).then(
      (res) => {
        const opts = res.data.map((v) => ({
          label: v.unitProject,
          value: v.uuid,
          children: v.unitSectionDtoList.map((e) => ({
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
    <div>
      <Space style={{ marginBottom: 15 }}>
        <ImportBtn
          onSuccess={() => {
            getTypeList();
          }}
        />
      </Space>
      <Tabs
        type="card"
        items={[
          {
            label: "汇总表",
            key: "0",
            children: <SummaryTable options={typeList} />,
          },
          {
            label: "分部分项清单表",
            key: "1",
            children: <FbTable options={typeList} />,
          },
          {
            label: "施工技术措施清单表",
            key: "2",
            children: <SgTable options={typeList} />,
          },
        ]}
      ></Tabs>
    </div>
  );
};

export default ContractListImport;
