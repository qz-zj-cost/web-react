import BureauApi from "@/apis/bureauApi";
import ExterpriseApi from "@/apis/exterpriseApi";
import {
  ActionType,
  ProDescriptions,
  ProTable,
} from "@ant-design/pro-components";
import { Modal, Space, Typography, message } from "antd";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import BureauColumns from "../bureau-list/columns";

export type IExterpriseMatchModalRef = {
  show: (e: IExterpriseItemModel) => void;
};
type IExterpriseMatchModalProps = {
  onCreate: VoidFunction;
};
const ExterpriseMatchModal = forwardRef<
  IExterpriseMatchModalRef,
  IExterpriseMatchModalProps
>(({ onCreate }, ref) => {
  const [visible, setVisible] = useState(false);
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<IExterpriseItemModel>();
  const [data, setData] = useState<IBureauItemModel[]>();

  const getData = useCallback((code: string) => {
    setData([]);
    return ExterpriseApi.getBillList({ code }).then((res) => {
      setData(res.data ?? []);
    });
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      show: (e) => {
        setInfo(e);
        getData(e.code);
        setVisible(true);
      },
    }),
    [getData],
  );

  return (
    <Modal
      title="匹配"
      width={1200}
      open={visible}
      okText="确认"
      onCancel={() => {
        setVisible(false);
      }}
      okButtonProps={{
        disabled: data?.length === 0,
        loading: loading,
      }}
      centered
      onOk={() => {
        setLoading(true);
        ExterpriseApi.match({
          code: info?.code,
          groupBillUuidList: data?.map((e) => e.uuid),
        })
          .then(() => {
            setVisible(false);
            onCreate();
            message.success("匹配成功");
          })
          .finally(() => {
            setLoading(false);
          });
      }}
    >
      <div style={{ overflow: "auto", maxHeight: "95vh" }}>
        <ProDescriptions column={3}>
          <ProDescriptions.Item label="企业定额编号">
            {info?.code}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="项目名称">
            {info?.name}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="单位">{info?.unit}</ProDescriptions.Item>
          <ProDescriptions.Item label="项目特征" span={3}>
            {info?.feature}
          </ProDescriptions.Item>
        </ProDescriptions>
        <ProTable
          actionRef={actionRef}
          search={false}
          size="small"
          scroll={{ x: "max-content", y: 300 }}
          toolBarRender={false}
          columns={[
            {
              title: "项目编码",
              dataIndex: "code",
            },
            {
              title: "项目名称",
              dataIndex: "name",
            },
            {
              title: "单位",
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
              title: "路径",
              dataIndex: "classPath",
              search: false,
            },
            {
              title: "操作",
              width: "auto",
              fixed: "right",
              align: "center",
              search: false,
              render: (_, _val, index) => {
                return (
                  <Space>
                    <Typography.Link
                      type="danger"
                      onClick={() => {
                        setData((e) => {
                          const arr = [...(e ?? [])];
                          arr?.splice(index, 1);
                          return arr;
                        });
                      }}
                    >
                      删除
                    </Typography.Link>
                  </Space>
                );
              },
            },
          ]}
          rowKey={"uuid"}
          dataSource={data}
          cardProps={{
            bodyStyle: { padding: 0 },
          }}
          pagination={{ pageSize: 10 }}
          bordered
        />
        <ProTable
          scroll={{ y: 500, x: "max-content" }}
          rowKey={"code"}
          size="small"
          cardProps={{
            bodyStyle: { padding: 0 },
          }}
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
          pagination={{
            pageSize: 10,
          }}
          search={{
            filterType: "light",
          }}
          bordered
          columns={[
            ...BureauColumns.slice(0, 7),
            {
              title: "操作",
              width: "auto",
              fixed: "right",
              align: "center",
              search: false,
              render: (_, val) => {
                return (
                  <Space>
                    <Typography.Link
                      onClick={() => {
                        if (data?.some((e) => e.uuid === val.uuid)) {
                          return message.warning("列表已存在此数据");
                        } else {
                          setData((e) => {
                            const arr = [...(e ?? []), val];
                            return arr;
                          });
                        }
                      }}
                    >
                      添加
                    </Typography.Link>
                  </Space>
                );
              },
            },
          ]}
        />
      </div>
    </Modal>
  );
});

export default ExterpriseMatchModal;
