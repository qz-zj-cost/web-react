import ProjectApi from "@/apis/projectApi";
import { IProjectModel } from "@/models/projectModel";
import { EditOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Space, Typography } from "antd";
import { isNil } from "lodash";
import { useEffect, useRef, useState } from "react";
import ApplyBtn from "./components/applyBtn";
import MatchChildTable from "./components/matchChildTable";
import ModifyAmountModal, {
  IModifyAmountModalRef,
} from "./components/modifyAmountModal";
import OpinionModal, { IOpinionModalRef } from "./components/opinionModal";
import ReviewModal, { IReviewModalRef } from "./components/reviewModal";
import useUnitSelect from "./components/useUnitSelect";

/**
 * @author Destin
 * @description 项目审核
 * @date 2023/10/11
 */

type IReviewProps = {
  info?: IProjectModel;
};
const Review = ({ info }: IReviewProps) => {
  const actionRef = useRef<ActionType>();
  const modalRef = useRef<IReviewModalRef>(null);
  const opinionRef = useRef<IOpinionModalRef>(null);
  const [selectKeys, setSelectKeys] = useState<number[]>();
  const modifyModalRef = useRef<IModifyAmountModalRef>(null);
  const { selectView, searchData, disabled, getData } = useUnitSelect(
    2,
    info?.id,
  );

  useEffect(() => {
    if (!isNil(searchData.sectionId) && searchData.unitProjectId) {
      actionRef.current?.reset?.();
    }
  }, [searchData.sectionId, searchData.unitProjectId]);

  const columns: ProColumns[] = [
    {
      title: "项目编码",
      dataIndex: "orgCode",
    },
    {
      title: "项目名称",
      dataIndex: "orgName",
    },
    {
      title: "项目特征",
      dataIndex: "orgFeature",
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
      dataIndex: "orgUnit",
      align: "center",
    },
    {
      title: "清单工程量",
      dataIndex: "orgQuantity",
      align: "center",
    },
    {
      title: "核定工程量",
      dataIndex: "approvedQuantity",
      align: "center",
      render(dom, record) {
        return (
          <Space>
            {dom}
            <Typography.Link
              disabled={disabled}
              onClick={() => {
                modifyModalRef.current?.show(record.originalInventoryId);
              }}
            >
              <EditOutlined />
            </Typography.Link>
          </Space>
        );
      },
    },
    {
      title: "核增减值",
      align: "right",
      render: (_, record) => {
        const num = record.approvedQuantity - record.orgQuantity;
        return (
          <Typography.Text type={num < 0 ? "success" : "danger"}>
            {num.toFixed(2)}
          </Typography.Text>
        );
      },
    },
    {
      title: "增减占比",
      align: "right",
      render: (_, record) => {
        return (
          (
            ((record.approvedQuantity - record.orgQuantity) /
              record.orgQuantity) *
            100
          ).toFixed(2) + "%"
        );
      },
    },
    {
      title: "审核状态",
      dataIndex: "expertStatus",
      valueType: "select",
      valueEnum: {
        0: { text: "未审核", status: "Default" },
        1: { text: "不通过", status: "Error" },
        2: { text: "通过", status: "Success" },
        3: { text: "已修改", status: "Warning" },
      },
    },
    {
      title: "操作",
      fixed: "right",
      width: "auto",
      render: (_, val) => {
        return (
          <Space>
            <Typography.Link
              disabled={disabled || val.expertStatus === 2}
              onClick={() => {
                modalRef.current?.show(val.originalInventoryId);
              }}
            >
              审核
            </Typography.Link>
            <Typography.Link
              onClick={() => {
                opinionRef.current?.show(val.originalInventoryId);
              }}
            >
              意见
            </Typography.Link>
          </Space>
        );
      },
    },
    //算量
    // {
    //   title: "项目编码",
    //   dataIndex: "calcQuantity",
    // },
    // {
    //   title: "项目名称",
    //   dataIndex: "orgQuantity",
    // },
    // {
    //   title: "项目特征",
    //   dataIndex: "orgQuantity",
    // },
    // {
    //   title: "单位",
    //   dataIndex: "orgQuantity",
    // },
  ];

  return (
    <div>
      <ProTable
        actionRef={actionRef}
        search={false}
        scroll={{ x: "max-content" }}
        rowKey={"originalInventoryId"}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <Typography.Link
                disabled={disabled}
                onClick={() => {
                  if (selectKeys && selectKeys.length > 0) {
                    modalRef.current?.show(selectKeys, 1);
                  }
                }}
              >
                批量审核
              </Typography.Link>
            </Space>
          );
        }}
        rowSelection={{
          fixed: "left",
          selectedRowKeys: selectKeys,
          onChange(selectedRowKeys) {
            setSelectKeys(selectedRowKeys as number[]);
          },
          getCheckboxProps(record) {
            return { disabled: record.expertStatus > 0 };
          },
        }}
        request={async ({ current: pageNum, pageSize }) => {
          if (
            !info ||
            isNil(searchData.sectionId) ||
            isNil(searchData.unitProjectId)
          )
            return { data: [] };
          const res = await ProjectApi.match.getList({
            pageNum: pageNum as number,
            pageSize: pageSize as number,
            projectId: info.id,
            unitProjectId: searchData.unitProjectId!,
            sectionId: searchData.sectionId!,
            type: 1,
          });
          return {
            data: res.data,
            success: true,
            total: res.totalRow,
          };
        }}
        expandable={{
          fixed: "left",
          expandedRowRender: (record) => {
            return (
              <MatchChildTable
                code={record.orgCode}
                id={record.originalInventoryId}
              />
            );
          },
        }}
        bordered
        columns={columns}
        cardProps={{
          bodyStyle: { padding: 0 },
        }}
        toolBarRender={() => [
          selectView,
          <ApplyBtn
            projectId={info?.id}
            unitProjectId={searchData.unitProjectId}
            type={1}
            disabled={disabled}
            callback={getData}
          />,
        ]}
        toolbar={{
          settings: [],
        }}
      />
      <ReviewModal
        ref={modalRef}
        onCreate={() => {
          actionRef.current?.reload();
          setSelectKeys(void 0);
        }}
      />
      <OpinionModal ref={opinionRef} />
      <ModifyAmountModal
        ref={modifyModalRef}
        onCreate={() => {
          actionRef.current?.reload();
        }}
      />
    </div>
  );
};

export default Review;
