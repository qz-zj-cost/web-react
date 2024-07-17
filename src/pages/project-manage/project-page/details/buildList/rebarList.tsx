/**
 * @author Destin
 * @description 钢筋表
 * @date 2023/12/25
 */

import BuildApi from "@/apis/buildApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Select, Space } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ProjectContext } from "../detailContext";
import ImportRebarBtn from "./importRebarBtn";

const RebarList = () => {
  const { projectId } = useContext(ProjectContext);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: "楼层",
      dataIndex: "storeyName",
    },
    {
      title: "钢筋型号",
      dataIndex: "rebarCode",
    },
    {
      title: "直径",
      dataIndex: "rebarType",
    },
    {
      title: "单位",
      dataIndex: "unit",
    },
    {
      title: "重量",
      dataIndex: "rebarAmount",
    },
    {
      title: "匹配状态",
      dataIndex: "mateStatus",
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
        const res = await BuildApi.getRebarList({
          unitProjectUuid: unitUUid,
          pageSize,
          pageNum,
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
            <ImportRebarBtn
              onSuccess={() => {
                getOpts();
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
      // expandable={{
      //   expandedRowRender: (record) => {
      //     return <BuildChildTable id={record.id} />;
      //   },
      // }}
    />
  );
};

export default RebarList;
