/**
 * @author Destin
 * @description 未归类局清单
 * @date 2023/12/25
 */

import { ContractImportApi } from "@/apis/projectApi";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Space, Typography } from "antd";
import { useContext, useRef, useState } from "react";
import AdModal, { IAdModalRef } from "../components/AdModal";
import AmountView from "../components/AmountView";
import { ProjectContext } from "../detailContext";
import ChildTable from "../unitProject/childTable";

const UnBureau = () => {
  const { projectId, projectInfo } = useContext(ProjectContext);
  const [tabKey, settabKey] = useState("1");
  const actionRef = useRef<ActionType>();
  const adRef = useRef<IAdModalRef>(null);
  const [reloadNum, setReloadNum] = useState(0);

  const [selectKeys, setSelectKeys] = useState<number[]>();
  const columns: ProColumns[] = [
    {
      title: "项目名称",
      dataIndex: "name",
    },
    {
      title: "局清单编码",
      dataIndex: "groupBillCode",
    },
    {
      title: "企业定额",
      dataIndex: "corpQuotaCode",
    },
    // {
    //   title: "单位",
    //   dataIndex: "unit",
    // },
    {
      title: "目标成本",
      children: [
        {
          title: "工程量",
          dataIndex: "groupBillEngineeringNum",
        },
        {
          title: "单价",
          dataIndex: "price",
        },
        {
          title: "合价",
          dataIndex: "sumPrice",
        },
        {
          title: "单位",
          dataIndex: "groupBillUnit",
        },
      ],
    },
    {
      title: "操作",
      width: "auto",
      fixed: "right",
      align: "center",
      render: (_, val) => {
        return (
          <Typography.Link
            onClick={() => {
              adRef.current?.show([val.id]);
            }}
            disabled={projectInfo?.confirmStatus === 1}
          >
            调整分类
          </Typography.Link>
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
        actionRef={actionRef}
        request={async ({ current: pageNum, pageSize }) => {
          const res = await ContractImportApi.getUnitProjectList({
            projectId: projectId,
            stageType: tabKey,
            priceType: 0,
            pageNum,
            pageSize,
          });
          setReloadNum((e) => e + 1);
          return {
            data: res.data || [],
            success: true,
            total: res.totalRow,
          };
        }}
        summary={() => (
          <AmountView
            priceType={0}
            stageType={tabKey}
            colSpan={[1, 4, false, 4, 1]}
          />
        )}
        toolbar={{
          multipleLine: true,
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
        expandable={{
          expandedRowRender: (record) => {
            return <ChildTable record={record} key={reloadNum} />;
          },
        }}
        columns={columns}
        cardProps={{
          bodyStyle: { padding: 0 },
        }}
        tableAlertOptionRender={({ onCleanSelected }) => {
          return (
            <Space size={16}>
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

export default UnBureau;
