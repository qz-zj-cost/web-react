/**
 * @author Destin
 * @description 项目间接费测算-现场经费
 * @date 2023/12/25
 */

import ProjectApi, { OverheadApi } from "@/apis/projectApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Popconfirm, Space, Typography, message } from "antd";
import { useContext, useRef, useState } from "react";
import { ProjectContext } from "..";
import AddModal from "./addModal";
import EditModal from "./editModal";

const OnSite = () => {
  const { projectId } = useContext(ProjectContext);
  const [tabKey, settabKey] = useState("1");
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: "费用名称",
      dataIndex: "feeName",
    },
    // {
    //   title: "单位",
    //   dataIndex: "unit",
    // },
    {
      title: "合同收入",
      children: [
        {
          title: "工程量",
          dataIndex: "incomeNum",
        },
        {
          title: "单价",
          dataIndex: "incomePrice",
        },
        {
          title: "合价",
          dataIndex: "incomeSumPrice",
        },
        {
          title: "单位",
          dataIndex: "groupBillUnit",
        },
      ],
    },
    {
      title: "目标成本",
      children: [
        {
          title: "工程量",
          dataIndex: "num",
        },
        {
          title: "单价",
          dataIndex: "notIncludedPrice",
        },
        {
          title: "总价",
          dataIndex: "fee",
        },
        {
          title: "单位",
          dataIndex: "groupBillUnit",
        },
      ],
    },
    {
      title: "局清单编码",
      dataIndex: "groupBillCode",
    },
    {
      title: "局清单名称",
      dataIndex: "groupBillName",
    },
    {
      title: "局清单单位",
      dataIndex: "groupBillUnit",
    },
    {
      title: "局清单特征",
      dataIndex: "groupBillFeature",
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
      title: "操作",
      width: "auto",
      fixed: "right",
      align: "center",
      render: (_, val) => {
        if (!val.id) return;
        return (
          <Space>
            <EditModal
              feeType={1}
              onSuccess={() => {
                actionRef.current?.reload();
              }}
              record={val}
            />
            <Popconfirm
              title="确认删除此项目？"
              onConfirm={() => {
                return ProjectApi.deleteOverHeadCost({ id: val.id }).then(
                  () => {
                    actionRef.current?.reload();
                    message.success("操作成功");
                  },
                );
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
      search={false}
      scroll={{ x: "max-content" }}
      rowKey={"id"}
      bordered
      actionRef={actionRef}
      request={async () => {
        const res = await OverheadApi.getProjectPayList({
          projectId: projectId,
          feeType: 1,
          stageType: tabKey,
        });
        return {
          data: res.data || [],
          success: true,
        };
      }}
      toolbar={{
        multipleLine: true,
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
            actionRef.current?.reload();
          },
        },
        actions: [
          <AddModal
            feeType={1}
            onSuccess={() => {
              actionRef.current?.reload();
            }}
          />,
        ],
      }}
      columns={columns}
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
    />
  );
};

export default OnSite;
