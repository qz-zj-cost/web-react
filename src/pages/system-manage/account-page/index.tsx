/**
 * @author Destin
 * @description 项目管理
 * @date 2023/10/07
 */

import AccountApi from "@/apis/accountApi";
import { FPage } from "@/components";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Popconfirm, Space, Typography, message } from "antd";
import { useRef } from "react";
import AccountDarwer, { IAccountDarwerRef } from "./accountDrawer";

const AccountPage = () => {
  const actionRef = useRef<ActionType>();
  const drawerRef = useRef<IAccountDarwerRef>(null);

  const columns: ProColumns[] = [
    {
      title: "账号",
      dataIndex: "userNo",
    },

    {
      title: "姓名",
      dataIndex: "name",
    },
    // {
    //   title: "专业",
    //   dataIndex: "speciality",
    // },
    // {
    //   title: "是否专家",
    //   dataIndex: "expert",
    //   render(_, entity) {
    //     return entity["expert"] === 0 ? "不是" : "是";
    //   },
    // },
    // {
    //   title: "算量工程师",
    //   dataIndex: "engineer",
    //   render(_, entity) {
    //     return entity["engineer"] === 0 ? "不是" : "是";
    //   },
    // },
    // {
    //   title: "角色",
    //   dataIndex: "name",
    // },
    {
      title: "操作",
      align: "center",
      width: "auto",
      render: (_, entity) => {
        return (
          <Space>
            <Typography.Link
              onClick={() => {
                drawerRef.current?.onEdit(entity);
              }}
            >
              编辑
            </Typography.Link>
            <Popconfirm
              title="确认删除此账号吗？"
              onConfirm={() => {
                return AccountApi.delete({ ...entity }).then(() => {
                  actionRef.current?.reload();
                  message.success("操作成功");
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
        actionRef={actionRef}
        search={false}
        rowKey={"userNo"}
        scroll={{ x: "max-content" }}
        request={async ({ current: pageNum, pageSize }) => {
          const res = await AccountApi.getList({ pageNum, pageSize });
          return {
            data: res.data,
            success: true,
            total: res.totalRow,
          };
        }}
        bordered
        columns={columns}
        toolbar={{
          actions: [
            <AccountDarwer
              ref={drawerRef}
              onCreate={() => {
                actionRef.current?.reload();
              }}
            />,
          ],
        }}
      />
    </FPage>
  );
};

export default AccountPage;
