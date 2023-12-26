/**
 * @author Destin
 * @description 合同清单导入-施工技术措施清单表
 * @date 2023/12/25
 */

import { ContractImportApi } from "@/apis/projectApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Select, Typography } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { useContext, useEffect, useRef, useState } from "react";
import { ProjectContext } from "..";

const SgTable = ({ options }: { options?: DefaultOptionType[] }) => {
  const actionRef = useRef<ActionType>();
  const { projectId } = useContext(ProjectContext);
  const [types, setTypes] = useState<{ typeId1?: string; typeId2?: string }>();
  const columns: ProColumns[] = [
    {
      title: "项目编码",
      dataIndex: "number",
    },
    {
      title: "项目名称",
      dataIndex: "name",
    },
    {
      title: "项目特征",
      dataIndex: "feature",
      render(dom) {
        return (
          <Typography.Paragraph
            style={{ width: 300, margin: 0 }}
            ellipsis={{ rows: 2, expandable: true }}
          >
            {dom}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: "单位",
      dataIndex: "unit",
    },
    {
      title: "清单工程量",
      dataIndex: "num",
    },
    {
      title: "综合单价",
      dataIndex: "subtotal",
    },
    {
      title: "合价",
      dataIndex: "totalAmount",
    },
  ];

  useEffect(() => {
    if (!types && options && options?.length > 0) {
      setTypes({
        typeId1: options[0].value?.toString(),
        typeId2: options[0]?.children?.[0].value,
      });
      actionRef.current?.reloadAndRest?.();
    }
  }, [options, types]);

  return (
    <ProTable
      actionRef={actionRef}
      search={false}
      scroll={{ x: "max-content" }}
      rowKey={"id"}
      bordered
      columns={columns}
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
      request={async ({ current: pageNum, pageSize }) => {
        if (!types?.typeId1 || !types?.typeId2) return { data: [] };
        const res = await ContractImportApi.getFbList({
          projectId: projectId,
          unitProjectUuid: types.typeId1,
          unitSectionUuid: types.typeId2,
          type: 2,
          pageNum,
          pageSize,
        });
        return {
          data: res.data || [],
          success: true,
        };
      }}
      toolbar={{
        settings: [],
        actions: [
          <Select
            style={{ width: 300 }}
            placeholder="请选择单位工程"
            options={options?.map((e) => ({ label: e.label, value: e.value }))}
            value={types?.typeId1}
            onChange={(v) => {
              setTypes({ typeId1: v, typeId2: void 0 });
            }}
            allowClear
          />,
          <Select
            style={{ width: 300 }}
            placeholder="请选择分部分项工程"
            options={options
              ?.find((v) => v.value === types?.typeId1)
              ?.children?.map((e) => ({ label: e.label, value: e.value }))}
            value={types?.typeId2}
            onChange={(v) => {
              setTypes({ ...types, typeId2: v });
              actionRef.current?.reloadAndRest?.();
            }}
            allowClear
          />,
        ],
      }}
    />
  );
};

export default SgTable;
