import { ContractImportApi } from "@/apis/projectApi";
import { Table } from "antd";
import { useContext, useEffect, useState } from "react";
import { ProjectContext } from "..";

const AmountView = ({
  colSpan = 4,
  ...props
}: {
  priceType: number;
  stageType: string;
  colSpan?: number;
}) => {
  const { projectId } = useContext(ProjectContext);
  const [data, setData] = useState<{
    incomeSumPrice: number;
    sumPrice: number;
  }>();
  useEffect(() => {
    if (!projectId) return;
    ContractImportApi.getUnitProjectAmount({
      projectId: projectId,
      ...props,
    }).then((e) => {
      setData(e.data);
    });
  }, [projectId, props]);

  return (
    <Table.Summary fixed>
      <Table.Summary.Row>
        <Table.Summary.Cell index={0}>总计</Table.Summary.Cell>
        <Table.Summary.Cell index={1} colSpan={4}></Table.Summary.Cell>
        <Table.Summary.Cell index={2} colSpan={4}>
          <strong> 合同收入总计：</strong>
          {data?.incomeSumPrice ?? "-"}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={3} colSpan={colSpan}>
          <strong>目标成本总计：</strong>
          {data?.sumPrice ?? "-"}
        </Table.Summary.Cell>
        <Table.Summary.Cell index={4}></Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );
};

export default AmountView;
