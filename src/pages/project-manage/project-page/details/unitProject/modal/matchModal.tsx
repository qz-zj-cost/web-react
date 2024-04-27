import ExterpriseApi from "@/apis/exterpriseApi";
import ProjectApi from "@/apis/projectApi";
import { IExterpriseTypeModel } from "@/models/exterpriseModel";
import { ProFormTreeSelect, ProTable } from "@ant-design/pro-components";
import { Modal, Typography, message } from "antd";
import {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ProjectContext } from "../..";

// type IRecord = { uuid: string; groupBillCode: string }[];
//匹配企业定额
export type IMatchModalRef = {
  show: (v: string[]) => void;
};
const MatchModal = forwardRef<IMatchModalRef, { onSuccess?: VoidFunction }>(
  ({ onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const record = useRef<string[]>();
    const [selectKeys, setSelectKeys] = useState<string[]>();

    const { projectId } = useContext(ProjectContext);

    useImperativeHandle(
      ref,
      () => ({
        show: (e) => {
          setVisible(true);
          record.current = e;
        },
      }),
      [],
    );
    return (
      <Modal
        open={visible}
        onCancel={() => {
          setVisible(false);
        }}
        centered
        width={900}
        onOk={() => {
          if (!selectKeys || selectKeys.length === 0 || !record.current) return;
          ProjectApi.updateQuota({
            corpQuotaCode: selectKeys[0],
            uuidGroupBillCode: record.current,
          }).then(() => {
            message.success("操作成功");
            setSelectKeys([]);
            setVisible(false);
            onSuccess?.();
          });
        }}
      >
        <ProTable
          scroll={{ y: 500, x: "max-content" }}
          rowKey={"code"}
          size="small"
          cardProps={{
            bodyStyle: { padding: 0 },
          }}
          rowSelection={{
            selectedRowKeys: selectKeys,
            type: "radio",
            onChange: (keys) => {
              setSelectKeys(keys as string[]);
            },
          }}
          request={async ({ current: pageNum, pageSize, ...val }) => {
            const res = await ExterpriseApi.getList({
              pageNum,
              pageSize,
              projectId: projectId,
              ...val,
            });
            return {
              data: res.data || [],
              success: true,
              total: res.totalRow,
            };
          }}
          search={{
            filterType: "light",
          }}
          bordered
          columns={[
            {
              title: "分类",
              dataIndex: "code",
              hideInTable: true,
              initialValue: "ALL",
              renderFormItem: () => (
                <ProFormTreeSelect
                  width={400}
                  fieldProps={{
                    popupMatchSelectWidth: false,
                  }}
                  request={async () => {
                    const res = await ExterpriseApi.getType();
                    const arr2tree = (arr?: IExterpriseTypeModel[]) => {
                      if (!arr || arr.length === 0) return [];
                      return arr.reduce((pre: any[], cur) => {
                        pre.push({
                          label: cur.name,
                          value: cur.code ?? "ALL",
                          children: arr2tree(cur.childList),
                        });
                        return pre;
                      }, []);
                    };
                    const opts = arr2tree(res.data);
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
              dataIndex: "status",
              search: false,
              valueEnum: {
                0: { text: "未匹配", status: "Warning" },
                1: { text: "已匹配", status: "Success" },
                2: { text: "已确认", status: "Success" },
              },
            },
            {
              title: "计量单位",
              dataIndex: "unit",
              width: 80,
              search: false,
            },
            {
              title: "价格",
              dataIndex: "price",
              width: 80,
              search: false,
            },
            // {
            //   title: "项目特征",
            //   dataIndex: "feature",
            //   search: false,
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
          ]}
        />
      </Modal>
    );
  },
);

export default MatchModal;
