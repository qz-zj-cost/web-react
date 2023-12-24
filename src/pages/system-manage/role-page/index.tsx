/**
 * @author Destin
 * @description 项目管理
 * @date 2023/10/07
 */

import { FPage } from "@/components";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { Space, Typography } from "antd";
import RoleDrawer from "./roleDrawer";

const RolePage = () => {
  const columns: ProColumns[] = [
    {
      title: "角色名称",
      dataIndex: "name",
    },

    {
      title: "备注",
      dataIndex: "name",
    },
    {
      title: "操作",
      render: () => {
        return (
          <Space>
            <Typography.Link>编辑</Typography.Link>
            <Typography.Link>删除</Typography.Link>
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
        toolbar={{
          actions: [<RoleDrawer />],
        }}
      />
    </FPage>
  );
};

export default RolePage;
