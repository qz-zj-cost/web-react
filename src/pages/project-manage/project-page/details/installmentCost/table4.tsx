import InstallmentApi from "@/apis/installmentApi";
import { ActionType, ProFormDigit, ProTable } from "@ant-design/pro-components";
import { Space } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { ProjectContext } from "../detailContext";
import EditModal from "./editModal";
import ExportBtn from "./exportBtn";
//总包服务费
const Table4 = ({ monthDate }: { monthDate?: string }) => {
  const actionRef = useRef<ActionType>();
  const { projectId } = useContext(ProjectContext);
  const [tabKey, settabKey] = useState("1");
  const pageRef = useRef<{ pageSize?: number; pageNum?: number }>();
  useEffect(() => {
    if (monthDate) {
      actionRef.current?.reload();
    }
  }, [monthDate]);
  return (
    <ProTable
      actionRef={actionRef}
      search={false}
      scroll={{ x: "max-content" }}
      rowKey={"id"}
      bordered
      columns={[
        {
          title: "序号",
          dataIndex: "id",
        },
        {
          title: "分包名称",
          dataIndex: "name",
        },
        {
          title: "管理费收入",
          dataIndex: "mortgageSumPrice",
        },
        {
          title: "往期完成",
          dataIndex: "previousRatio",
        },
        {
          title: "本期完成比例",
          dataIndex: "mortgageRatio",
          render: (dom, record) => {
            return (
              <Space>
                {`${dom}%`}
                <EditModal
                  title="本期完成比例"
                  id={record.id}
                  type={1}
                  onSuccess={() => {
                    actionRef.current?.reload();
                  }}
                >
                  <ProFormDigit
                    name={"mortgageRatio"}
                    label={"本期完成比例"}
                    rules={[{ required: true }]}
                    fieldProps={{
                      suffix: "%",
                    }}
                  />
                </EditModal>
              </Space>
            );
          },
        },
        {
          title: "本期完成",
          dataIndex: "mortgageRatio",
        },
        {
          title: "累计完成",
          dataIndex: "sumMortgage",
        },
      ]}
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
      request={async ({ current: pageNum, pageSize }) => {
        if (!monthDate) return { data: [] };
        const res = await InstallmentApi.getOtherCostList({
          projectId: projectId,
          priceType: 1,
          stageType: tabKey,
          pageNum,
          pageSize,
          dateQuantitiesId: monthDate,
          type: 1,
        });
        pageRef.current = { pageSize, pageNum };
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
        actions: [
          <ExportBtn
            priceType={1}
            type={1}
            fileName="总包服务费"
            pageNum={pageRef.current?.pageNum}
            pageSize={pageRef.current?.pageSize}
            stageType={Number(tabKey)}
            dateQuantitiesId={monthDate}
          />,
        ],
      }}
    />
  );
};

export default Table4;
