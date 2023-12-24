import NationalApi from "@/apis/nationalApi";
import { FPage } from "@/components";
import {
  ActionType,
  ProColumns,
  ProFormTreeSelect,
  ProTable,
} from "@ant-design/pro-components";
import { Space, Typography } from "antd";
import { useRef } from "react";

const NationalListPage = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<INationalItemModel>[] = [
    {
      title: "定额类型",
      dataIndex: "detype",
      hideInTable: true,
      initialValue: "全部",
      renderFormItem: () => (
        <ProFormTreeSelect
          width={400}
          fieldProps={{
            popupMatchSelectWidth: false,
          }}
          request={async () => {
            const res = await NationalApi.getType();
            const opts = res.data.map((e) => ({
              label: e.detype,
              value: e.detype,
            }));
            return opts;
          }}
        />
      ),
    },
    {
      title: "编号",
      dataIndex: "code",
      search: false,
    },
    {
      title: "名称",
      dataIndex: "name",
      search: false,
    },
    {
      title: "计量单位",
      dataIndex: "unit",
      search: false,
    },
    {
      title: "项目特征",
      dataIndex: "feature",
      search: false,
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
      title: "工作内容",
      dataIndex: "content",
      search: false,
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
      title: "计量规则",
      dataIndex: "calcRule",
      search: false,
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
      title: "匹配局清单",
      dataIndex: "groupBillMate",
      search: false,
      valueEnum: {
        0: { text: "未匹配", status: "Warning" },
        1: { text: "已匹配", status: "Success" },
      },
    },
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
  ];

  return (
    <FPage>
      <ProTable
        actionRef={actionRef}
        scroll={{ x: "max-content" }}
        rowKey={"code"}
        request={async ({ current: pageNum, pageSize, ...val }) => {
          const res = await NationalApi.getList({
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
        columns={columns}
        toolbar={{
          actions: [],
          multipleLine: true,
        }}
      />
    </FPage>
  );
};

export default NationalListPage;
