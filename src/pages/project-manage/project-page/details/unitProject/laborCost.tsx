/**
 * @author Destin
 * @description 项目成本差费-人工费
 * @date 2023/12/25
 */

import { ContractImportApi } from "@/apis/projectApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Select, Space, Typography } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { useContext, useEffect, useRef, useState } from "react";
import { ProjectContext } from "..";

const LaborCost = ({ options }: { options?: DefaultOptionType[] }) => {
  const actionRef = useRef<ActionType>();
  const [types, setTypes] = useState<{ typeId1?: string; typeId2?: string }>();
  const { projectId } = useContext(ProjectContext);

  useEffect(() => {
    if (!types && options && options?.length > 0) {
      setTypes({
        typeId1: options[0].value?.toString(),
        typeId2: options[0]?.children?.[0]?.value,
      });
      actionRef.current?.reloadAndRest?.();
    }
  }, [options, types]);
  const columns: ProColumns[] = [
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
      title: "局清单编码",
      dataIndex: "",
    },
    {
      title: "局清单量",
      dataIndex: "",
    },
    {
      title: "合约包价格",
      dataIndex: "",
    },
    {
      title: "合价",
      dataIndex: "totalAmount",
    },
    {
      title: "操作",
      width: "auto",
      fixed: "right",
      align: "center",
      render: () => {
        return (
          <Space>
            <Typography.Link onClick={() => {}}>匹配企业定额</Typography.Link>

            <Typography.Link type="danger">手动分类</Typography.Link>
          </Space>
        );
      },
    },
  ];

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
        const res = await ContractImportApi.getUnitProjectList({
          unitProjectUuid: types.typeId1,
          unitSectionUuid: types.typeId2,
          projectId: projectId,
          byFinance: "人工费",
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

export default LaborCost;
