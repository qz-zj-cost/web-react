/**
 * @author Destin
 * @description 合同清单导入-施工技术措施清单表
 * @date 2023/12/25
 */

import { ContractImportApi } from "@/apis/projectApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, Space, Typography } from "antd";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import MatchModal, { IMatchModalRef } from "../components/matchModal";
import useSelect from "../components/useSelect";
import { ProjectContext } from "../detailContext";
import ChildTable from "./childTable";
import ExportBtn from "./exportBtn";

const SgTable = ({ num }: { num: number }) => {
  const actionRef = useRef<ActionType>();
  const { projectId } = useContext(ProjectContext);
  const { selectProject, selectProjectType, types, getTypeList } = useSelect({
    actionRef: actionRef.current,
    type: 2,
  });
  const pageRef = useRef<{ pageSize?: number; pageNum?: number }>();
  const [selectKeys, setSelectKeys] = useState<Record<string, string[]>>();
  const matchRef = useRef<IMatchModalRef>(null);

  const getSelectKeys = useMemo(() => {
    if (!selectKeys) return [];
    const keys = Object.entries(selectKeys).reduce((pre: string[], cur) => {
      const value = cur[1];
      if (value.length) {
        pre = pre.concat(value);
      }
      return pre;
    }, []);
    return keys;
  }, [selectKeys]);
  const columns: ProColumns[] = [
    {
      title: "项目编码",
      dataIndex: "number",
    },
    {
      title: "项目名称",
      dataIndex: "name",
    },
    // {
    //   title: "项目特征",
    //   dataIndex: "feature",
    //   render(dom) {
    //     return (
    //       <Typography.Paragraph
    //         style={{ width: 300, margin: 0 }}
    //         ellipsis={{ rows: 2, expandable: true }}
    //       >
    //         {dom}
    //       </Typography.Paragraph>
    //     );
    //   },
    // },
    {
      title: "单位",
      dataIndex: "unit",
      render(dom, entity) {
        return (
          <Typography.Text
            type={entity.unitStatus === 0 ? "danger" : "success"}
          >
            {dom}
          </Typography.Text>
        );
      },
    },
    {
      title: "数量",
      dataIndex: "num",
    },
    {
      title: "人工费",
      dataIndex: "laborCosts",
    },
    {
      title: "材料费",
      dataIndex: "materialCosts",
    },
    {
      title: "机械费",
      dataIndex: "machineryCosts",
    },
    {
      title: "综合单价",
      dataIndex: "subtotal",
    },
    {
      title: "合价",
      dataIndex: "totalAmount",
    },
    {
      title: "匹配的局清单",
      dataIndex: "groupBillCodeList",
      render(_, entity) {
        return (
          <Typography.Paragraph
            style={{ maxWidth: 200, margin: 0 }}
            ellipsis={{ rows: 2, expandable: true }}
          >
            {entity["groupBillCodeList"]?.join(",") ?? "-"}
          </Typography.Paragraph>
        );
      },
    },
  ];

  useEffect(() => {
    getTypeList();
  }, [getTypeList, num]);

  return (
    <>
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
          if (!types?.typeId1) return { data: [] };
          const res = await ContractImportApi.getFbList({
            projectId: projectId,
            unitProjectUuid: types.typeId1,
            unitSectionUuid: types.typeId2,
            type: 2,
            pageNum,
            pageSize,
          });
          pageRef.current = { pageSize, pageNum };
          return {
            data: res.data || [],
            success: true,
            total: res.totalRow,
          };
        }}
        toolbar={{
          title: (
            <Space>
              {selectProject()}
              {selectProjectType}
              <ExportBtn
                type={1}
                fileName="施工技术清单"
                pageNum={pageRef.current?.pageNum}
                pageSize={pageRef.current?.pageSize}
                unitProjectUuid={types?.typeId1}
                unitSectionUuid={types?.typeId2}
              />
            </Space>
          ),
          actions: [
            <Button
              type="primary"
              disabled={getSelectKeys.length === 0}
              onClick={() => {
                if (!selectKeys) return;
                matchRef.current?.show(getSelectKeys);
              }}
            >
              批量匹配局清单
            </Button>,
            getSelectKeys.length > 0 && (
              <Typography.Link onClick={() => setSelectKeys(void 0)}>
                取消选择
              </Typography.Link>
            ),
          ],
        }}
        expandable={{
          expandedRowRender: (record) => {
            return (
              <ChildTable
                unitProjectUuid={types?.typeId1}
                uuid={record.uuid}
                selectKeys={selectKeys?.[record.uuid] ?? []}
                setSelectKeys={(keys) => {
                  setSelectKeys((prev) => {
                    return { ...prev, [record.uuid]: keys };
                  });
                }}
              />
            );
          },
        }}
      />
      <MatchModal
        ref={matchRef}
        api={(data) => {
          return ContractImportApi.match(data);
        }}
        onSuccess={() => {
          actionRef.current?.reload?.();
          setSelectKeys(void 0);
        }}
      />
    </>
  );
};

export default SgTable;
