import { ContractImportApi } from "@/apis/projectApi";
import { Table } from "antd";
import { useContext, useEffect, useState } from "react";
import { ProjectContext } from "../detailContext";

const AmountView = ({
  colSpan = [1, 4, 4, 4, 1],
  priceType,
  stageType,
}: {
  priceType: number;
  stageType: string;
  colSpan?: Array<number | false>;
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
      priceType,
      stageType,
    }).then((e) => {
      setData(e.data);
    });
  }, [priceType, projectId, stageType]);

  return (
    <Table.Summary fixed>
      <Table.Summary.Row>
        {colSpan[0] && <Table.Summary.Cell index={0}>总计</Table.Summary.Cell>}
        {colSpan[1] && (
          <Table.Summary.Cell
            index={1}
            colSpan={colSpan[1]}
          ></Table.Summary.Cell>
        )}
        {colSpan[2] && (
          <Table.Summary.Cell index={2} colSpan={colSpan[2]}>
            <strong> 合同收入总计：</strong>
            {data?.incomeSumPrice ?? "-"}
          </Table.Summary.Cell>
        )}
        {colSpan[3] && (
          <Table.Summary.Cell index={3} colSpan={colSpan[3]}>
            <strong>目标成本总计：</strong>
            {data?.sumPrice ?? "-"}
          </Table.Summary.Cell>
        )}
        {colSpan[4] && <Table.Summary.Cell index={4}></Table.Summary.Cell>}
      </Table.Summary.Row>
    </Table.Summary>
  );
};

export default AmountView;
