import ProjectApi from "@/apis/projectApi";
import { IMatchItemModel, IProjectModel } from "@/models/projectModel";
import { EditOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Popconfirm, Space, Tag, Typography, message } from "antd";
import { isNil } from "lodash";
import { useEffect, useRef, useState } from "react";
import ApplyBtn from "./components/applyBtn";
import DownloadButton from "./components/downloadButton";
import MatchChildTable from "./components/matchChildTable";
import MatchModal, { IMatchModalRef } from "./components/matchModal";
import ModifyAmountModal, {
  IModifyAmountModalRef,
} from "./components/modifyAmountModal";
import OpinionModal, { IOpinionModalRef } from "./components/opinionModal";
import UploadMatchButton from "./components/uploadMatchButton";
import useUnitSelect from "./components/useUnitSelect";

/**
 * @author Destin
 * @description 清单匹配
 * @date 2023/10/11
 */

type IListMatchProps = {
  info?: IProjectModel;
};
const ListMatch = ({ info }: IListMatchProps) => {
  const actionRef = useRef<ActionType>();
  const { selectView, searchData, disabled, getData, unitList } = useUnitSelect(
    1,
    info?.id,
  );
  const modalRef = useRef<IMatchModalRef>(null);
  const modifyModalRef = useRef<IModifyAmountModalRef>(null);
  const opinionRef = useRef<IOpinionModalRef>(null);
  const [childTableKey, setChildTableKey] = useState(0);

  useEffect(() => {
    if (!isNil(searchData.sectionId) && searchData.unitProjectId) {
      actionRef.current?.reset?.();
    }
  }, [searchData.sectionId, searchData.unitProjectId]);

  const columns: ProColumns<IMatchItemModel>[] = [
    {
      title: "项目编码",
      dataIndex: "orgCode",
      render(_, entity) {
        return (
          <div>
            <Typography.Text type="success">{_}</Typography.Text>
            <br />
            <Typography.Text type="danger">
              {entity.calcCode ?? "-"}
            </Typography.Text>
          </div>
        );
      },
    },
    {
      title: "项目名称",
      dataIndex: "orgName",
      render(_, entity) {
        return (
          <div>
            <Typography.Text type="success">{_}</Typography.Text>
            <br />
            <Typography.Text type="danger">
              {entity.calcName ?? "-"}
            </Typography.Text>
          </div>
        );
      },
    },
    {
      title: "项目特征",
      dataIndex: "orgFeature",
      render(_, entity) {
        return (
          <div>
            <Typography.Paragraph
              style={{ width: 300, margin: 0 }}
              ellipsis={{ rows: 4, expandable: true }}
              type="success"
            >
              {_}
            </Typography.Paragraph>
            <Typography.Paragraph
              style={{ width: 300, margin: 0 }}
              ellipsis={{ rows: 4, expandable: true }}
              type="danger"
            >
              {entity.calcFeature ?? "-"}
            </Typography.Paragraph>
          </div>
        );
      },
    },
    {
      title: "单位",
      dataIndex: "orgUnit",
      align: "center",
      render(_, entity) {
        return (
          <div>
            <Typography.Text type="success">{_}</Typography.Text>
            <br />
            <Typography.Text type="danger">
              {entity.calcUnit ?? "-"}
            </Typography.Text>
          </div>
        );
      },
    },
    {
      title: "清单工程量",
      dataIndex: "orgQuantity",
      align: "center",
      render(_, entity) {
        return (
          <div>
            <Typography.Text type="success">{_}</Typography.Text>
            <br />
            <Typography.Text type="danger">
              {entity.calcQuantity ?? "-"}
            </Typography.Text>
          </div>
        );
      },
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
      title: "匹配状态",
      dataIndex: "matchStatus",
      render(_, entity) {
        return entity.matchStatus === 0 ? (
          <Tag color="red">未匹配</Tag>
        ) : (
          <Tag color="green">已匹配</Tag>
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
            {val.matchStatus === 0 && (
              <Typography.Link
                disabled={disabled}
                onClick={() => {
                  modalRef.current?.show(val);
                }}
              >
                手动匹配
              </Typography.Link>
            )}
            {val.matchStatus === 1 && (
              <Popconfirm
                title="确认取消匹配？"
                onConfirm={() => {
                  return ProjectApi.match
                    .cancelMatch({
                      originalInventoryId: val.originalInventoryId,
                    })
                    .then(() => {
                      actionRef.current?.reload();
                      message.success("操作成功");
                    });
                }}
              >
                <Typography.Link disabled={disabled}>取消匹配</Typography.Link>
              </Popconfirm>
            )}
            {val.expertStatus === 1 && (
              <Typography.Link
                onClick={() => {
                  opinionRef.current?.show(`${val.originalInventoryId}`);
                }}
              >
                意见
              </Typography.Link>
            )}
          </Space>
        );
      },
    },
    //算量
    // {
    //   title: "项目编码",
    //   dataIndex: "orgQuantity",
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
        rowKey={"orgCode"}
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
            unitProjectId: searchData.unitProjectId,
            sectionId: searchData.sectionId,
            type: 2,
          });
          return {
            data: res.data,
            success: true,
            total: res.totalRow,
          };
        }}
        bordered
        columns={columns}
        expandable={{
          expandedRowRender: (record) => {
            return (
              <MatchChildTable
                key={childTableKey}
                code={record.orgCode}
                id={record.originalInventoryId}
              />
            );
          },
        }}
        cardProps={{
          bodyStyle: { padding: 0 },
        }}
        toolBarRender={() => [
          selectView,
          <ApplyBtn
            projectId={info?.id}
            disabled={disabled}
            unitProjectId={searchData.unitProjectId}
            type={2}
            callback={getData}
          />,
          <UploadMatchButton
            id={info?.id}
            unitProjectId={searchData.unitProjectId}
            disabled={disabled}
            onSuccess={() => {
              // getData();
              actionRef.current?.reload();
              setChildTableKey(childTableKey + 1);
            }}
          />,
          <DownloadButton
            id={searchData.unitProjectId}
            name={
              unitList.find((e) => e.value === searchData.unitProjectId)?.label
            }
          />,
        ]}
        toolbar={{
          settings: [],
        }}
      />
      <MatchModal
        ref={modalRef}
        onCreate={() => {
          setChildTableKey(childTableKey + 1);
          actionRef.current?.reload();
        }}
      />
      <ModifyAmountModal
        ref={modifyModalRef}
        onCreate={() => {
          actionRef.current?.reload();
        }}
      />
      <OpinionModal ref={opinionRef} />
    </div>
  );
};

export default ListMatch;
