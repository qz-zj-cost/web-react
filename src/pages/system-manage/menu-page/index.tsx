/**
 * @author Destin
 * @description 菜单管理
 */

import MenuApi from "@/apis/menuApi";
import { FPage } from "@/components";
import * as icons from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Popconfirm, Space, Typography } from "antd";
import React, { useRef } from "react";
import MenuDrawer, { IMenuDrawerRef } from "./menuDrawer";

const MenuPage = () => {
  const drawerRef = useRef<IMenuDrawerRef>(null);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: "排序",
      dataIndex: "sort",
    },
    {
      title: "菜单名称",
      dataIndex: "authorityName",
      width: "20%",
    },
    {
      title: "菜单类型",
      dataIndex: "menuType",
      render: (value) => {
        return value === 0 ? "菜单" : value === 1 ? "目录" : "按钮";
      },
    },
    {
      title: "图标",
      dataIndex: "icon",
      render: (_, record) => {
        return record.icon
          ? React.createElement((icons as any)[record.icon])
          : null;
      },
    },
    {
      title: "按钮Code",
      dataIndex: "buttonCode",
    },
    {
      title: "组件",
      dataIndex: "frontComponents",
    },
    {
      title: "路由地址",
      dataIndex: "url",
    },
    {
      title: "是否可见",
      dataIndex: "showStatus",
      render: (val) => (val === 1 ? "可见" : "隐藏"),
    },
    {
      title: "操作",
      width: "auto",
      fixed: "right",
      align: "center",
      render: (_, record) => {
        return (
          <Space>
            <Typography.Link
              onClick={() => {
                drawerRef.current?.onEdit(record);
              }}
            >
              编辑
            </Typography.Link>
            <Popconfirm
              title="删除菜单与下级？"
              onConfirm={() => {
                MenuApi.deleteMenu(record.authorityId).then(() => {
                  actionRef.current?.reload();
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
    <FPage>
      <ProTable
        search={false}
        bordered
        columns={columns}
        actionRef={actionRef}
        rowKey={"authorityCode"}
        toolbar={{
          actions: [
            <MenuDrawer
              ref={drawerRef}
              onSuccess={() => {
                actionRef.current?.reload();
              }}
            />,
          ],
        }}
        request={async ({ current: pageNum, pageSize }) => {
          const res = await MenuApi.getMenu({ pageNum, pageSize });
          return {
            data: res.data,
            success: true,
            total: res.totalPage,
          };
        }}
      />
    </FPage>
  );
};

export default MenuPage;
