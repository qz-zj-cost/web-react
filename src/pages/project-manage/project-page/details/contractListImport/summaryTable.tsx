/**
 * @author Destin
 * @description 合同清单导入-汇总表
 * @date 2023/12/25
 */

import { ContractImportApi } from "@/apis/projectApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { useContext, useEffect, useRef } from "react";
import useSelect from "../components/useSelect";
import { ProjectContext } from "../detailContext";

const SummaryTable = ({ num }: { num: number }) => {
  const { projectId } = useContext(ProjectContext);
  const actionRef = useRef<ActionType>();
  const { selectProject, types, getTypeList } = useSelect({
    actionRef: actionRef.current,
    type: 1,
  });
  const columns: ProColumns[] = [
    {
      title: "序号",
      dataIndex: "sort",
    },
    {
      title: "汇总内容",
      dataIndex: "content",
    },
    {
      title: "计算公式",
      dataIndex: "formula",
    },
    {
      title: "金额",
      dataIndex: "amount",
    },
  ];
  useEffect(() => {
    getTypeList();
  }, [getTypeList, num]);

  return (
    <ProTable
      actionRef={actionRef}
      search={false}
      scroll={{ x: "max-content" }}
      rowKey={"id"}
      request={async () => {
        if (!types?.typeId1) return { data: [] };
        const res = await ContractImportApi.getSummaryList({
          projectId: projectId,
          unitProjectUuid: types?.typeId1,
        });
        return {
          data: res.data || [],
          success: true,
        };
      }}
      bordered
      columns={columns}
      toolbar={{
        settings: [],
        actions: [
          selectProject(() => {
            actionRef.current?.reload();
          }),
        ],
      }}
      pagination={false}
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
    />
  );
};

export default SummaryTable;
