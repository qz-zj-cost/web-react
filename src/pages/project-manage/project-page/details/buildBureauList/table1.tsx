import BuildApi from "@/apis/buildApi";
import { ActionType, ProTable } from "@ant-design/pro-components";
import { Space, Typography } from "antd";
import { useContext, useRef, useState } from "react";
import { ProjectContext } from "../detailContext";
import ChildTable from "./childTable";
import { columns } from "./columns";
import MatchMemberModal, { IMatchMemberRef } from "./matchMemberModal";

const Table1 = () => {
  const actionRef = useRef<ActionType>();
  const { projectId } = useContext(ProjectContext);
  const [tabKey, settabKey] = useState("1");
  const matchRef = useRef<IMatchMemberRef>(null);

  return (
    <>
      <ProTable
        actionRef={actionRef}
        search={false}
        scroll={{ x: "max-content" }}
        rowKey={"id"}
        bordered
        columns={[
          ...columns,
          {
            title: "操作",
            width: "auto",
            fixed: "right",
            align: "center",
            render: (_, record) => {
              return (
                <Space>
                  <Typography.Link
                    onClick={() => matchRef.current?.show(record, 1)}
                  >
                    匹配构件
                  </Typography.Link>
                  <Typography.Link
                    onClick={() => matchRef.current?.show(record, 2)}
                  >
                    匹配钢筋
                  </Typography.Link>
                </Space>
              );
            },
          },
        ]}
        cardProps={{
          bodyStyle: { padding: 0 },
        }}
        request={async ({ current: pageNum, pageSize }) => {
          const res = await BuildApi.getBureauList({
            projectId: projectId,
            priceType: 1,
            stageType: tabKey,
            pageNum,
            pageSize,
          });
          return {
            data: res.data || [],
            success: true,
            total: res.totalRow,
          };
        }}
        toolbar={{
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
        expandable={{
          expandedRowRender: (record) => {
            return (
              <ChildTable
                id={record.id}
                priceType={1}
                stageType={tabKey}
                groupBillCode={record.groupBillCode}
                groupBillUuid={record.groupBillUuid}
                parentId={record.id}
              />
            );
          },
        }}
      />
      <MatchMemberModal
        ref={matchRef}
        onSuccess={() => actionRef.current?.reload()}
      />
    </>
  );
};

export default Table1;
