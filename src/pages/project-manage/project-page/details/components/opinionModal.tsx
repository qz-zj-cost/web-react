import ProjectApi from "@/apis/projectApi";
import { ActionType, ProTable } from "@ant-design/pro-components";
import { Modal, Typography } from "antd";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

/**
 * @author Destin
 * @description 意见
 * @date 2023/10/12
 */

export type IOpinionModalRef = {
  show: (id: string) => void;
};
const OpinionModal = forwardRef<IOpinionModalRef>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const actionRef = useRef<ActionType>();
  const idRef = useRef<string>();
  useImperativeHandle(
    ref,
    () => ({
      show: (id) => {
        idRef.current = id;
        setVisible(true);
        actionRef.current?.reloadAndRest?.();
      },
    }),
    [],
  );
  return (
    <Modal
      open={visible}
      title="意见"
      width={500}
      onCancel={() => setVisible(false)}
      footer={false}
    >
      <ProTable
        actionRef={actionRef}
        scroll={{ x: "max-content" }}
        columns={[
          {
            title: "序号",
            dataIndex: "id",
            render(_, _dom, index) {
              return index + 1;
            },
          },
          {
            title: "时间",
            dataIndex: "gmtCreated",
          },
          {
            title: "意见内容",
            dataIndex: "opinion",
            render(_) {
              return (
                <Typography.Paragraph
                  style={{ width: 250, margin: 0 }}
                  ellipsis={{ rows: 3, expandable: true }}
                >
                  {_}
                </Typography.Paragraph>
              );
            },
          },
        ]}
        tableAlertRender={false}
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
          if (!idRef.current) return { data: [] };
          const res = await ProjectApi.match.opinion({
            originalInventoryId: idRef.current,
          });
          return {
            data: res.data,
            success: true,
          };
        }}
        pagination={false}
      />
    </Modal>
  );
});

export default OpinionModal;
