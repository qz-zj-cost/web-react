/**
 * @author Destin
 * @description 构件计算书
 * @date 2023/12/25
 */

import BuildApi from "@/apis/buildApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Select, Space } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ProjectContext } from "../detailContext";
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
      title: "匹配状态",
      dataIndex: "mateStatus",
      valueType: "select",
      valueEnum: {
        0: { text: "未匹配", status: "Error" },
        1: { text: "部分匹配", status: "Warning" },
        2: { text: "已匹配", status: "Success" },
      },
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
      search={{
        filterType: "light",
      }}
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
      request={async ({ pageSize, current: pageNum, ...params }) => {
        if (!unitUUid) return { data: [] };
        const res = await BuildApi.getBuildList({
          unitProjectUuid: unitUUid,
          pageSize,
          pageNum,
          ...params,
        });
        return {
          data: res.data || [],
          success: true,
          total: res.totalRow,
        };
      }}
      columns={columns}
      toolbar={{
        // settings: [],
        title: (
          <Space>
            <ImportBuildBtn
              onSuccess={() => {
                actionRef.current?.reload();
              }}
            />
            <ImportQuanBtn
              onSuccess={() => {
                actionRef.current?.reload();
              }}
            />
            <Select
              popupMatchSelectWidth={false}
              value={unitUUid}
              placeholder="请选择单位工程"
              onChange={(v) => {
                setUnitUUid(v);
                actionRef.current?.reload();
              }}
              options={options}
            />
          </Space>
        ),
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
