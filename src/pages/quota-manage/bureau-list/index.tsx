/**
 * @author Destin
 * @description 局清单
 * @date 2023/12/24
 */

import BureauApi from "@/apis/bureauApi";
import { FPage } from "@/components";
import { ActionType, ProTable } from "@ant-design/pro-components";
import { Space, Typography } from "antd";
import { useRef } from "react";
import BureauColumns from "./columns";

const BureauListPage = () => {
  const actionRef = useRef<ActionType>();

  return (
    <FPage>
      <ProTable
        actionRef={actionRef}
        scroll={{ x: "max-content" }}
        rowKey={"code"}
        request={async ({ current: pageNum, pageSize, ...val }) => {
          const res = await BureauApi.getList({
            pageNum,
            pageSize,
            ...val,
          });
          return {
            data: res.data || [],
            success: true,
            total: res.totalRow,
          };
        }}
        search={{
          layout: "vertical",
        }}
        bordered
        columns={[
          ...BureauColumns,
          {
            title: "操作",
            width: "auto",
            fixed: "right",
            align: "center",
            search: false,
            render: () => {
              return (
                <Space>
                  <Typography.Link onClick={() => {}}>详情</Typography.Link>
                </Space>
              );
            },
          },
        ]}
        toolbar={{
          actions: [],
          multipleLine: true,
        }}
      />
    </FPage>
  );
};

export default BureauListPage;
