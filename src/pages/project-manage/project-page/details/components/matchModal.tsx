import ProjectApi from "@/apis/projectApi";
import { IMatchItemModel } from "@/models/projectModel";
import {
  ActionType,
  ProDescriptions,
  ProTable,
} from "@ant-design/pro-components";
import { Modal, Typography, message } from "antd";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

export type IMatchModalRef = {
  show: (val: IMatchItemModel) => void;
};
type IMatchModalProps = {
  onCreate: VoidFunction;
};
const MatchModal = forwardRef<IMatchModalRef, IMatchModalProps>(
  ({ onCreate }, ref) => {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState<IMatchItemModel>();
    const [selectKeys, setSelectKeys] = useState<number[]>();
    const actionRef = useRef<ActionType>();
    useImperativeHandle(
      ref,
      () => ({
        show: (val) => {
          setData(val);
          setVisible(true);
          actionRef.current?.reloadAndRest?.();
        },
      }),
      [],
    );
    return (
      <Modal
        title="匹配"
        open={visible}
        width={800}
        onCancel={() => setVisible(false)}
        onOk={() => {
          if (!selectKeys?.[0] || !data?.originalInventoryId)
            return message.warning("请选择匹配项目");
          ProjectApi.match
            .match({
              operandInventoryId: selectKeys![0],
              originalInventoryId: data?.originalInventoryId,
            })
            .then(() => {
              message.success("操作成功");
              setVisible(false);
              onCreate();
            });
        }}
      >
        <ProDescriptions column={2}>
          <ProDescriptions.Item label="清单编号">
            {data?.orgCode}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="项目名称">
            {data?.orgName}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="单位">
            {data?.orgUnit}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="工程量">
            {data?.orgQuantity}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="项目特征" span={2}>
            {data?.orgFeature}
          </ProDescriptions.Item>
        </ProDescriptions>
        <ProTable
          actionRef={actionRef}
          scroll={{ x: "max-content", y: 400 }}
          columns={[
            {
              title: "项目编码",
              dataIndex: "calcCode",
            },
            {
              title: "项目名称",
              dataIndex: "calcName",
            },
            {
              title: "项目特征",
              dataIndex: "calcFeature",
              render(_) {
                return (
                  <Typography.Paragraph
                    style={{ width: 300, margin: 0 }}
                    ellipsis={{ rows: 4, expandable: true }}
                  >
                    {_}
                  </Typography.Paragraph>
                );
              },
            },
            {
              title: "单位",
              dataIndex: "calcUnit",
              align: "center",
              width: 80,
            },
            {
              title: "计算工程量",
              dataIndex: "approvedQuantity",
              align: "center",
              width: 90,
            },
          ]}
          tableAlertRender={false}
          rowSelection={{
            type: "radio",
            onChange(selectedRowKeys) {
              setSelectKeys(selectedRowKeys as number[]);
            },
          }}
          rowKey={"id"}
          size="small"
          search={false}
          toolbar={{
            settings: [],
          }}
          bordered
          cardProps={{
            bodyStyle: { padding: 0 },
          }}
          request={async () => {
            if (!data) return { data: [] };
            const res = await ProjectApi.match.getMatchList(
              data?.unitProjectId,
            );
            return {
              data: res.data,
              success: true,
            };
          }}
          pagination={false}
        />
      </Modal>
    );
  },
);
export default MatchModal;
