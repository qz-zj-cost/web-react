/**
 * @author Destin
 * @description 原始工程量
 * @date 2023/10/11
 */

import ProjectApi from "@/apis/projectApi";
import { IProjectModel } from "@/models/projectModel";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Typography } from "antd";
import { isNil } from "lodash";
import { useEffect, useRef } from "react";
import SubBtn from "./components/subBtn";
import UploadButton from "./components/uploadButton";
import useUnitSelect from "./components/useUnitSelect";

type IEngineeringQuantityProps = {
  info?: IProjectModel;
};
const EngineeringQuantity = ({ info }: IEngineeringQuantityProps) => {
  const actionRef = useRef<ActionType>();
  const { selectView, searchData, getData } = useUnitSelect(0, info?.id);
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
      dataIndex: "orgUnit",
    },
    {
      title: "清单工程量",
      dataIndex: "orgQuantity",
    },
  ];

  return (
    <ProTable
      actionRef={actionRef}
      search={false}
      scroll={{ x: "max-content" }}
      rowKey={"id"}
      request={async ({ current: pageNum, pageSize }) => {
        if (
          !info ||
          isNil(searchData.sectionId) ||
          isNil(searchData.unitProjectId)
        )
          return { data: [] };
        const res = await ProjectApi.eq.getList({
          pageNum: pageNum as number,
          pageSize: pageSize as number,
          projectId: info.id,
          unitProjectId: searchData.unitProjectId,
          sectionId: searchData.sectionId,
        });
        return {
          data: res.data,
          success: true,
          total: res.totalRow,
        };
      }}
      bordered
      columns={columns}
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
      toolBarRender={() => [
        selectView,
        <UploadButton
          id={info?.id}
          onSuccess={() => {
            getData();
            actionRef.current?.reload();
          }}
        />,
        <SubBtn
          id={info?.id}
          callback={() => {
            actionRef.current?.reset?.();
          }}
        />,
      ]}
      toolbar={{
        settings: [],
      }}
    />
  );
};

export default EngineeringQuantity;
