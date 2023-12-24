/**
 * @author Destin
 * @description 项目管理
 * @date 2023/10/07
 */

import { FPage } from "@/components";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { Space, Table, Typography } from "antd";

const InfoPage = () => {
  const columns: ProColumns[] = [
    {
      title: "标题",
      dataIndex: "name",
    },
    {
      title: "内容",
      dataIndex: "status",
    },
    {
      title: "创建日期",
      dataIndex: "name",
    },
    {
      title: "操作",
      render: () => {
        return (
          <Space>
            <Typography.Link>设为已读</Typography.Link>
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
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          defaultSelectedRowKeys: [],
        }}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <a>批量删除</a>
              <a>设为已读</a>
            </Space>
          );
        }}
      />
    </FPage>
  );
};

export default InfoPage;
