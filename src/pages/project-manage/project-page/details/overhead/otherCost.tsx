/**
 * @author Destin
 * @description 项目间接费测算-规费及其他费用
 * @date 2023/12/25
 */

import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { useRef } from "react";

const OtherCost = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns[] = [
    {
      title: "费用名称",
      dataIndex: "orgName",
    },
    {
      title: "单位",
      dataIndex: "d",
    },
    {
      title: "不含税价格",
      dataIndex: "orgUnit",
    },
    {
      title: "局清单编码",
      dataIndex: "orgUnit",
    },
    {
      title: "局清单名称",
      dataIndex: "orgUnit",
    },
    {
      title: "单位",
      dataIndex: "orgUnit",
    },
    {
      title: "局清单特征",
      dataIndex: "orgUnit",
    },
    {
      title: "费用",
      dataIndex: "orgUnit",
    },
  ];

  return (
    <ProTable
      actionRef={actionRef}
      search={false}
      scroll={{ x: "max-content" }}
      rowKey={"id"}
      bordered
      columns={columns}
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
    />
  );
};

export default OtherCost;
