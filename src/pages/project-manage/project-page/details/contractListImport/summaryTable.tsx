/**
 * @author Destin
 * @description 合同清单导入-汇总表
 * @date 2023/12/25
 */

import { ContractImportApi } from "@/apis/projectApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { useContext, useEffect, useRef, useState } from "react";
import { ProjectContext } from "..";

const SummaryTable = ({ options }: { options?: DefaultOptionType[] }) => {
  const { projectId } = useContext(ProjectContext);
  const [typeId, setTypeId] = useState<string>();
  const actionRef = useRef<ActionType>();

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
    if (!typeId && options && options?.length > 0) {
      const id = options[0].value;
      setTypeId(`${id}`);
      actionRef.current?.reloadAndRest?.();
    }
  }, [options, typeId]);

  return (
    <ProTable
      actionRef={actionRef}
      search={false}
      scroll={{ x: "max-content" }}
      rowKey={"id"}
      request={async () => {
        if (!typeId) return { data: [] };
        const res = await ContractImportApi.getSummaryList({
          projectId: projectId,
          unitProjectUuid: typeId,
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
          <Select
            style={{ width: 300 }}
            placeholder="请选择单位工程"
            options={options?.map((e) => ({ label: e.label, value: e.value }))}
            value={typeId}
            onChange={(v) => {
              setTypeId(v);
              actionRef.current?.reloadAndRest?.();
            }}
            allowClear
          />,
        ],
      }}
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
    />
  );
};

export default SummaryTable;
