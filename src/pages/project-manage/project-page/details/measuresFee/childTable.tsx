import { ContractImportApi } from "@/apis/projectApi";
import { EditOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Space, Typography } from "antd";
import { useContext, useRef, useState } from "react";
import AdModal, { IAdModalRef } from "../components/AdModal";
import { ProjectContext } from "../detailContext";
import UnitPriceModal, {
  IUnitPriceModalRef,
} from "../unitProject/modal/unitPriceModal";
import EditNumModal from "./editNumModal";

const ChildTable = ({
  record,
  type,
  onReload,
}: {
  record: any;
  type?: number;
  onReload?: VoidFunction;
}) => {
  const { projectInfo } = useContext(ProjectContext);
  const actionRef = useRef<ActionType>();
  const [selectKeys, setSelectKeys] = useState<number[]>();
  const priceRef = useRef<IUnitPriceModalRef>(null);
  const adRef = useRef<IAdModalRef>(null);
  const columns: ProColumns[] = [
    {
      title: "项目名称",
      dataIndex: "name",
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
      title: "项目来源",
      render(_, record) {
        return (
          <div>
            {record.unitProjectName} / {record.unitSectionName}
          </div>
        );
      },
    },
    {
      title: "定额编号",
      dataIndex: "number",
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
      title: "清单工程量",
      dataIndex: "num",
    },
    {
      title: "局清单编码",
      dataIndex: "groupBillCode",
    },

    {
      title: "企业定额",
      dataIndex: "corpQuotaCode",
    },
    {
      title: "单位",
      dataIndex: "unit",
    },
    {
      title: "合同收入",
      children: [
        {
          title: "工程量",
          dataIndex: "num",
        },
        {
          title: "单价",
          dataIndex: "incomePrice",
        },
        {
          title: "合价",
          dataIndex: "incomeSumPrice",
        },
      ],
    },
    {
      title: "目标成本",
      children: [
        {
          title: "工程量",
          dataIndex: "groupBillEngineeringNum",
          render(dom, record) {
            return (
              <Space>
                {dom ?? "-"}
                <EditNumModal
                  id={record.id}
                  onSuccess={() => {
                    actionRef.current?.reload();
                    onReload?.();
                  }}
                ></EditNumModal>
              </Space>
            );
          },
        },
        {
          title: "单价",
          dataIndex: "price",
          render(dom, record) {
            return (
              <Space>
                {dom ?? "-"}
                <Typography.Link
                  disabled={projectInfo?.confirmStatus === 1}
                  onClick={() =>
                    priceRef.current?.open({
                      ids: [record.id],
                      type: 1,
                      code: record.corpQuotaCode,
                    })
                  }
                >
                  <EditOutlined />
                </Typography.Link>
              </Space>
            );
          },
        },
        {
          title: "合价",
          dataIndex: "sumPrice",
        },
        {
          title: "使用时长(月)",
          dataIndex: "duration",
          hideInTable: type !== 1,
          render(dom) {
            return <Space>{dom}</Space>;
          },
        },
        {
          title: "周转次数",
          dataIndex: "frequency",
          hideInTable: type !== 2,
          render(dom) {
            return <Space>{dom}</Space>;
          },
        },
      ],
    },
  ];
  return (
    <>
      <ProTable
        search={false}
        rowKey={"id"}
        scroll={{ x: "max-content" }}
        bordered
        size="small"
        actionRef={actionRef}
        columns={[
          ...columns,
          {
            title: "操作",
            width: "auto",
            fixed: "right",
            align: "center",
            render: (_, val) => {
              return (
                <Typography.Link
                  disabled={projectInfo?.confirmStatus === 1}
                  onClick={() => {
                    adRef.current?.show([val.id]);
                  }}
                >
                  调整分类
                </Typography.Link>
              );
            },
          },
        ]}
        request={async () => {
          const res = await ContractImportApi.getUnitChildList({
            id: record.id,
            groupBillCode: record.groupBillCode,
          });
          return {
            data: res.data || [],
            success: true,
          };
        }}
        toolbar={{
          settings: [],
        }}
        rowSelection={
          projectInfo?.confirmStatus === 1
            ? false
            : {
                selectedRowKeys: selectKeys,
                onChange(selectedRowKeys) {
                  setSelectKeys(selectedRowKeys as number[]);
                },
              }
        }
        tableAlertOptionRender={({ onCleanSelected }) => {
          return (
            <Space size={16}>
              <Typography.Link
                onClick={() => {
                  if (!selectKeys) return;
                  priceRef.current?.open({
                    ids: selectKeys,
                    type: 1,
                    code: record.corpQuotaCode,
                  });
                }}
              >
                批量修改单价
              </Typography.Link>
              <Typography.Link
                onClick={() => {
                  if (!selectKeys) return;
                  adRef.current?.show(selectKeys);
                }}
              >
                批量调整分类
              </Typography.Link>
              <Typography.Link onClick={onCleanSelected}>
                取消选择
              </Typography.Link>
            </Space>
          );
        }}
        pagination={false}
      />
      <UnitPriceModal
        ref={priceRef}
        onSuccess={() => {
          actionRef.current?.reload();
        }}
      />
      <AdModal
        ref={adRef}
        onSuccess={() => {
          actionRef.current?.reload();
        }}
      />
    </>
  );
};

export default ChildTable;
