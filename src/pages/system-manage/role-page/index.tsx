/**
 * @author Destin
 * @description 角色管理
 */

import RoleApi from "@/apis/roleApi";
import { FPage } from "@/components";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Popconfirm, Space, Typography } from "antd";
import { useRef } from "react";
import RoleDrawer, { IRoleDrawerRef } from "./roleDrawer";

const RolePage = () => {
  const drawerRef = useRef<IRoleDrawerRef>(null);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: "角色名称",
      dataIndex: "roleName",
    },
    {
      title: "备注",
      dataIndex: "remark",
    },
    {
      title: "创建日期",
      dataIndex: "createTime",
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
              title="确认删除此角色？"
              onConfirm={() => {
                RoleApi.deleteRole(record.roleId).then(() => {
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
        rowKey={"roleId"}
        actionRef={actionRef}
        columns={columns}
        request={async ({ current: pageNum, pageSize }) => {
          const res = await RoleApi.getRole({ pageNum, pageSize });
          return {
            data: res.data,
            success: true,
            total: res.totalPage,
          };
        }}
        toolbar={{
          actions: [
            <RoleDrawer
              ref={drawerRef}
              onSuccess={() => {
                actionRef.current?.reload();
              }}
            />,
          ],
        }}
      />
    </FPage>
  );
};

export default RolePage;
