/**
 * @author Destin
 * @description 构件计算书
 * @date 2023/12/25
 */

import BuildApi from "@/apis/buildApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ProjectContext } from "..";
import BuildChildTable from "./buildChildTable";
import ImportBuildBtn from "./importBuildBtn";
import ImportQuanBtn from "./importQuanBtn";

const BuildBook = () => {
  const { projectId } = useContext(ProjectContext);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: "层数",
      dataIndex: "storeyName",
      search: false,
    },
    {
      title: "构件类型",
      dataIndex: "memberType",
      search: false,
    },
    {
      title: "构件编号",
      dataIndex: "memberCode",
      search: false,
    },
    {
      title: "构件位置",
      dataIndex: "memberPosition",
      search: false,
    },
    {
      title: "砼等级",
      dataIndex: "concreteLevel",
      search: false,
    },
  ];
  const [options, setOptions] = useState<DefaultOptionType[]>();
  const [unitUUid, setUnitUUid] = useState<string>();

  const getOpts = useCallback(async () => {
    const res = await BuildApi.getBuildProject({ id: projectId });
    const opts =
      res.data?.map((e) => ({
        value: e.uuid,
        label: e.unitProject,
      })) ?? [];
    setOptions(opts);
    if (!unitUUid && opts.length > 0) {
      setUnitUUid(opts?.[0].value);
      actionRef.current?.reload();
    }
  }, [projectId, unitUUid]);

  useEffect(() => {
    getOpts();
  }, [getOpts]);

  return (
    <ProTable
      scroll={{ x: "max-content" }}
      rowKey={"id"}
      bordered
      actionRef={actionRef}
      search={false}
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
      request={async ({ pageSize, current: pageNum }) => {
        if (!unitUUid) return { data: [] };
        const res = await BuildApi.getBuildList({
          unitProjectUuid: unitUUid,
          pageSize,
          pageNum,
        });
        return {
          data: res.data || [],
          success: true,
        };
      }}
      columns={columns}
      toolbar={{
        // settings: [],
        actions: [
          <ImportBuildBtn
            onSuccess={() => {
              getOpts();
            }}
          />,
          <ImportQuanBtn
            onSuccess={() => {
              getOpts();
            }}
          />,
          <Select
            popupMatchSelectWidth={false}
            value={unitUUid}
            placeholder="请选择单位工程"
            onChange={(v) => {
              setUnitUUid(v);
              actionRef.current?.reload();
            }}
            options={options}
          />,
        ],
      }}
      expandable={{
        expandedRowRender: (record) => {
          return <BuildChildTable id={record.id} />;
        },
      }}
    />
  );
};

export default BuildBook;
