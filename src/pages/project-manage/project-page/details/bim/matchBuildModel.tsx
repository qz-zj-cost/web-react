import BimApi from "@/apis/bimApi";
import { ITreeItem } from "@/models/bimModel";
import { ActionType, ProTable } from "@ant-design/pro-components";
import { Drawer, Tag, Typography } from "antd";
import { uniqueId } from "lodash";
import { useRef, useState } from "react";
import AutoMatchBtn from "./autoMatchBtn";
import BimTreeModal, { IBimTreeModalRef } from "./bimTreeModal";

const MatchBuildModel = ({
  uuid,
  motor3dId,
}: {
  uuid: string;
  motor3dId: string;
}) => {
  const [visible, setVisible] = useState(false);
  const modalRef = useRef<IBimTreeModalRef>(null);
  const actionRef = useRef<ActionType>();

  return (
    <>
      <Typography.Link disabled={!motor3dId} onClick={() => setVisible(true)}>
        匹配构件树
      </Typography.Link>
      <Drawer
        open={visible}
        width={900}
        title="匹配构件树"
        onClose={() => setVisible(false)}
      >
        <ProTable<any>
          search={false}
          actionRef={actionRef}
          scroll={{ x: "max-content" }}
          rowKey={"id"}
          request={async () => {
            const res = await BimApi.getMatchTree({
              uuid,
            });
            const treeAddId = (arr: ITreeItem[]): any => {
              const opts = arr?.map((e) => {
                return {
                  ...e,
                  id: uniqueId("tree_"),
                  children: treeAddId(e.children),
                };
              });
              return opts;
            };
            return {
              data: treeAddId(res.data?.children) || [],
              success: true,
            };
          }}
          tableAlertRender={false}
          bordered
          pagination={false}
          toolbar={{
            actions: [
              <AutoMatchBtn
                unitProjectUuid={uuid}
                onSuccess={() => {
                  actionRef.current?.reload();
                }}
              />,
            ],
          }}
          columns={[
            {
              title: "构件名称",
              dataIndex: "name",
              width: 300,
            },
            // {
            //   title: "构件位置",
            //   dataIndex: "memberPosition",
            //   width: 200,
            // },
            {
              title: "匹配构件路径",
              dataIndex: "modelPathList",
              width: 200,
              render(_, entity) {
                return (
                  entity["modelPathList"]?.map((e: string, i: number) => (
                    <Tag key={i}>{e}</Tag>
                  )) ?? "-"
                );
              },
            },
            {
              title: "操作",
              width: "auto",
              fixed: "right",
              align: "center",
              render(_, record) {
                return record.children ? null : (
                  <Typography.Link
                    onClick={() => {
                      modalRef.current?.show(record.uuid);
                    }}
                  >
                    匹配
                  </Typography.Link>
                );
              },
            },
          ]}
        />
      </Drawer>
      <BimTreeModal
        ref={modalRef}
        motor3dId={motor3dId}
        unitProjectUuid={uuid}
        onSuccess={() => {
          actionRef.current?.reload();
        }}
      />
    </>
  );
};

export default MatchBuildModel;
