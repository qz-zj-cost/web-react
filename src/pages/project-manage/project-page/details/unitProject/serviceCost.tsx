/**
 * @author Destin
 * @description 项目成本差费-总包服务费
 * @date 2023/12/25
 */

import ProjectApi from "@/apis/projectApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Popconfirm, Space, Typography, message } from "antd";
import _ from "lodash";
import { useContext, useRef, useState } from "react";
import { ProjectContext } from "../detailContext";
import AddCostModal, { IAddCostModalRef } from "./modal/addCostModal";

const ServiceCost = () => {
  const actionRef = useRef<ActionType>();
  const { projectId } = useContext(ProjectContext);
  const [tabKey, settabKey] = useState("1");
  const addCostRef = useRef<IAddCostModalRef>(null);
  const columns: ProColumns[] = [
    {
      title: "序号",
      dataIndex: "sort",
    },
    {
      title: "分包名称",
      dataIndex: "subpackageName",
    },
    {
      title: "分包金额",
      dataIndex: "subpackageAmount",
    },
    {
      title: "管理费比例",
      dataIndex: "managementFeeRatio",
      render(dom, record) {
        return record["managementFeeRatio"] ? dom + "%" : "-";
      },
    },
    {
      title: "管理费收入",
      dataIndex: "managementFee",
    },
    {
      title: "备注",
      dataIndex: "remark",
    },
    {
      title: "操作",
      width: "auto",
      fixed: "right",
      align: "center",
      render: (_, val) => {
        if (!val.id) return null;
        return (
          <Space>
            <Typography.Link
              onClick={() => {
                addCostRef.current?.onEdit(val);
              }}
            >
              编辑
            </Typography.Link>
            <Popconfirm
              title="确认删除此项目？"
              onConfirm={() => {
                return ProjectApi.deleteServiceCost({ id: val.id }).then(() => {
                  actionRef.current?.reload();
                  message.success("删除成功");
                });
              }}
            >
              <Typography.Link type="danger">删除</Typography.Link>
            </Popconfirm>
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
      rowKey={() => _.uniqueId()}
      bordered
      columns={columns}
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
      request={async () => {
        const res = await ProjectApi.getServiceCost({
          projectId: projectId,
          stageType: tabKey,
        });
        return {
          data: res.data || [],
          success: true,
        };
      }}
      toolbar={{
        actions: [
          <AddCostModal
            ref={addCostRef}
            onSuccess={() => {
              actionRef.current?.reload();
            }}
          />,
        ],
        // actions: [selectProject, selectProjectType],
        menu: {
          type: "tab",
          activeKey: tabKey,
          items: [
            { label: "地下室阶段", key: "1" },
            { label: "主体", key: "2" },
            { label: "装饰修饰", key: "3" },
          ],
          onChange: (v) => {
            settabKey(v as string);
            actionRef.current?.reset?.();
          },
        },
      }}
    />
  );
};

export default ServiceCost;
