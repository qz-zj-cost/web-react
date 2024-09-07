import InstallmentApi from "@/apis/installmentApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Drawer, Space, Tag, Typography } from "antd";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import EditTypeModal, { IEditTypeModalRef } from "./editTypeModal";
import UpdatePriceModal, { IUpdatePriceModalRef } from "./updatePriceModal";

export type IEditDateDrawerRef = {
  show: (e: any) => void;
};
const EditDateDrawer = forwardRef<IEditDateDrawerRef>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const actionRef = useRef<ActionType>();
  const action2Ref = useRef<ActionType>();
  const dataRef = useRef<any>();
  const matchRef = useRef<IUpdatePriceModalRef>(null);
  const typeModalRef = useRef<IEditTypeModalRef>(null);
  useImperativeHandle(
    ref,
    () => ({
      show: (e) => {
        dataRef.current = e;
        setVisible(true);
        actionRef.current?.reloadAndRest?.();
        action2Ref.current?.reload();
      },
    }),
    [],
  );
  const columns: ProColumns[] = [
    {
      title: "序号",
      dataIndex: "id",
      search: false,
    },
    {
      title: "物料名称",
      dataIndex: "materialName",
    },
    {
      title: "物料规格型号",
      dataIndex: "materialModel",
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
      title: "单位",
      dataIndex: "materialUnit",
      search: false,
    },
    {
      title: "单价（不含税）",
      dataIndex: "unitPriceNotax",
      search: false,
    },
    {
      title: "税率（%）",
      dataIndex: "taxRate",
      search: false,
    },
    {
      title: "税额",
      dataIndex: "totalTax",
      search: false,
    },
    {
      title: "总价（不含税）",
      dataIndex: "totalPriceNotax",
      search: false,
    },
    {
      title: "收料日期",
      dataIndex: "receivingDate",
      search: false,
    },
    {
      title: "结算数量",
      dataIndex: "settlementQuantity",
      search: false,
    },
    {
      title: "结算单类型",
      dataIndex: "type",
      search: false,
    },
    {
      title: "匹配局清单",
      dataIndex: "groupBillCode",
      search: false,
    },
    {
      title: "库存数量",
      dataIndex: "stockNum",
      search: false,
    },
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
                matchRef.current?.show({
                  parentId: dataRef.current.id,
                  id: val.id,
                  num: val.stockNum,
                });
              }}
            >
              修改局清单
            </Typography.Link>
            <Typography.Link
              onClick={() => {
                typeModalRef.current?.show({ id: val.id });
              }}
            >
              更改类型
            </Typography.Link>
          </Space>
        );
      },
    },
  ];
  return (
    <Drawer
      open={visible}
      onClose={() => setVisible(false)}
      title="编辑分期成本"
      width={1200}
    >
      <ProTable
        search={false}
        rowKey={"id"}
        scroll={{ x: "max-content" }}
        bordered
        cardProps={{
          bodyStyle: { padding: 0 },
        }}
        size="small"
        actionRef={action2Ref}
        columns={[
          {
            title: "单位工程",
            dataIndex: "unitProjectName",
          },
          {
            title: "类型",
            dataIndex: "type",
            render(_, entity: any) {
              return entity["type"] === 1 ? "构件" : "钢筋";
            },
          },
          {
            title: "楼层",
            dataIndex: "storeyRegion",
          },
          {
            title: "施工段",
            dataIndex: "constructionSectionName",
            render(_, entity: any) {
              return (
                <Space>
                  {entity["constructionSectionName"]?.map(
                    (e: string, i: number) => <Tag key={i}>{e}</Tag>,
                  )}
                </Space>
              );
            },
          },
          {
            title: "构件类型",
            dataIndex: "memberType",
            render(_, entity: any) {
              return (
                <Space>
                  {entity["memberType"]?.map((e: string, i: number) => (
                    <Tag key={i}>{e}</Tag>
                  ))}
                </Space>
              );
            },
          },
          {
            title: "完成度",
            dataIndex: "completionDegree",
          },
        ]}
        pagination={false}
        request={async () => {
          if (!dataRef.current.id) return { data: [] };
          const res = await InstallmentApi.getFqConfigList({
            id: dataRef.current.id,
          });
          return {
            data: res.data || [],
            success: true,
            total: res.totalRow,
          };
        }}
      />
      <ProTable
        actionRef={actionRef}
        scroll={{ x: "max-content" }}
        rowKey={"id"}
        bordered
        columns={columns}
        cardProps={{
          bodyStyle: { padding: 0 },
        }}
        search={{
          filterType: "light",
        }}
        request={async ({ current: pageNum, pageSize, ...params }) => {
          const res = await InstallmentApi.getPricePage({
            ...params,
            pageNum,
            pageSize,
            dateQuantitiesId: dataRef.current.id,
          });
          return {
            data: res.data || [],
            success: true,
            total: res.totalRow,
          };
        }}
      />
      <UpdatePriceModal
        ref={matchRef}
        onSuccess={() => {
          actionRef.current?.reload?.();
        }}
      />
      <EditTypeModal
        ref={typeModalRef}
        onSuccess={() => {
          actionRef.current?.reload?.();
        }}
      />
    </Drawer>
  );
});

export default EditDateDrawer;
