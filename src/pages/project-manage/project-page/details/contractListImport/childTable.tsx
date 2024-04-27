import { ContractImportApi } from "@/apis/projectApi";
import { DeleteOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Space, Tag, Typography } from "antd";
import { useRef, useState } from "react";
import MatchModal, { IMatchModalRef } from "./matchModal";

type IChildTableProp = {
  unitProjectUuid?: string;
  uuid?: string;
};
const ChildTable = ({ unitProjectUuid, uuid }: IChildTableProp) => {
  const matchRef = useRef<IMatchModalRef>(null);
  const actionRef = useRef<ActionType>();
  const [selectKeys, setSelectKeys] = useState<string[]>();
  const columns: ProColumns[] = [
    {
      title: "项目编码",
      dataIndex: "number",
    },
    {
      title: "项目名称",
      dataIndex: "name",
    },
    // {
    //   title: "项目特征",
    //   dataIndex: "feature",
    //   render(dom) {
    //     return (
    //       <Typography.Paragraph
    //         style={{ width: 300, margin: 0 }}
    //         ellipsis={{ rows: 2, expandable: true }}
    //       >
    //         {dom}
    //       </Typography.Paragraph>
    //     );
    //   },
    // },
    {
      title: "单位",
      dataIndex: "unit",
    },
    {
      title: "清单工程量",
      dataIndex: "num",
    },
    {
      title: "综合单价",
      dataIndex: "subtotal",
    },
    {
      title: "合价",
      dataIndex: "totalAmount",
    },

    {
      title: "匹配的局清单",
      dataIndex: "groupBillDtos",
      width: 200,
      render: (_, entity) => {
        return (
          <Space direction="vertical">
            {entity["groupBillDtos"]?.map((item: any) => (
              <div
                key={item.groupBillCode}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Tag color="processing">
                  名称：{item?.groupBillName ?? "-"}
                  <br />
                  编码：{item?.groupBillCode ?? "-"}
                  <br />
                  路径：{item?.groupBillStage ?? "-"}
                </Tag>
                <Typography.Link
                  type="danger"
                  onClick={() => {
                    ContractImportApi.delChildBureau({
                      groupBillUuid: item.groupBillUuid,
                      uuid: entity.uuid,
                    }).then(() => {
                      actionRef.current?.reload();
                    });
                  }}
                >
                  <DeleteOutlined />
                </Typography.Link>
              </div>
            )) ?? "-"}
          </Space>
        );
      },
    },
  ];
  return (
    <>
      <ProTable
        search={false}
        scroll={{ x: "max-content" }}
        rowKey={"id"}
        bordered
        cardProps={
          {
            // bodyStyle: { padding: 0 },
          }
        }
        size="small"
        actionRef={actionRef}
        columns={[
          ...columns,
          {
            title: "操作",
            width: "auto",
            fixed: "right",
            align: "center",
            render: (_, record) => {
              return (
                <Typography.Link
                  onClick={() => {
                    matchRef.current?.show([record.id]);
                  }}
                >
                  手动匹配
                </Typography.Link>
              );
            },
          },
        ]}
        request={async () => {
          if (!unitProjectUuid) return { data: [], success: true };
          const res = await ContractImportApi.getChildList({
            unitProjectUuid,
            uuid: uuid,
          });
          return {
            data: res.data || [],
            success: true,
          };
        }}
        toolbar={{
          settings: [],
        }}
        pagination={false}
        rowSelection={{
          selectedRowKeys: selectKeys,
          onChange(selectedRowKeys) {
            setSelectKeys(selectedRowKeys as string[]);
          },
        }}
        tableAlertOptionRender={({ onCleanSelected }) => {
          return (
            <Space size={16}>
              <Typography.Link
                onClick={() => {
                  if (!selectKeys) return;
                  matchRef.current?.show(selectKeys);
                }}
              >
                批量匹配局清单
              </Typography.Link>
              <Typography.Link onClick={onCleanSelected}>
                取消选择
              </Typography.Link>
            </Space>
          );
        }}
      />
      <MatchModal
        ref={matchRef}
        api={(data) => {
          return ContractImportApi.match(data);
        }}
        onSuccess={() => {
          actionRef.current?.reload?.();
          setSelectKeys(void 0);
        }}
      />
    </>
  );
};
export default ChildTable;
