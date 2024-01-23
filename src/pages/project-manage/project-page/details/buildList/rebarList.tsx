/**
 * @author Destin
 * @description 钢筋表
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

const RebarList = () => {
  const { projectId } = useContext(ProjectContext);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: "楼层",
      dataIndex: "storeyName",
      search: false,
    },
    {
      title: "钢筋型号",
      dataIndex: "memberType",
      search: false,
    },
    {
      title: "直径",
      dataIndex: "memberCode",
      search: false,
    },
    {
      title: "单位",
      dataIndex: "memberPosition",
      search: false,
    },
    {
      title: "重量",
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
        settings: [],
        actions: [
          <ImportBuildBtn
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

export default RebarList;
