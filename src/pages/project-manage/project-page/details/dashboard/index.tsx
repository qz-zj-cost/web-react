import ProjectApi from "@/apis/projectApi";
import { FPage } from "@/components";
import { ISummaryModal } from "@/models/projectModel";
import { Column, Tiny } from "@ant-design/charts";
import { Card, Col, Progress, Row, Statistic, Typography } from "antd";
import { useContext, useEffect, useMemo, useState } from "react";
import { ProjectContext } from "../detailContext";

const Dashboard = () => {
  const [data, setData] = useState<ISummaryModal>();
  const { projectId } = useContext(ProjectContext);

  useEffect(() => {
    if (projectId) {
      ProjectApi.getSummary({ projectId }).then((res) => {
        setData(res.data);
      });
    }
  }, [projectId]);

  const columnData = useMemo(
    () =>
      data?.priceDtos.reduce((pre: any[], cur) => {
        const { actualSumPrice, endDate, incomeSumPrice, sumPrice } = cur;
        pre = [
          ...pre,
          { time: endDate, value: actualSumPrice, name: "实际收入" },
          { time: endDate, value: incomeSumPrice, name: "合同收入" },
          { time: endDate, value: sumPrice, name: "目标成本" },
        ];
        return pre;
      }, []),
    [data?.priceDtos],
  );
  console.log(columnData);

  return (
    <FPage>
      <Row gutter={[16, 16]}>
        <Col md={12} xl={6}>
          <Card size="small">
            <Typography.Text type="secondary">实际成本开累金额</Typography.Text>
            <Tiny.Area
              xField={"endDate"}
              yField={"actualSumPrice"}
              data={data?.actualPriceDtos}
              padding={0}
              height={65}
              shapeField="smooth"
              responsives
              style={{ fill: "#1677ff", fillOpacity: 0.6 }}
            />
          </Card>
        </Col>
        <Col md={12} xl={6}>
          <Card size="small">
            <Statistic
              title="节超率（目标-实际）"
              value={data?.overshootRate}
              precision={2}
              valueStyle={{
                color:
                  data?.overshootRate && data.overshootRate < 0
                    ? "#3f8600"
                    : "#cf1322",
              }}
              //   prefix={<ArrowUpOutlined />}
              suffix="%"
            />
            <Progress
              percent={data?.overshootRate}
              strokeColor="#1677ff"
              showInfo={false}
            />
          </Card>
        </Col>
        <Col md={12} xl={6}>
          <Card size="small">
            <Statistic
              title="盈利率（收入-实际）"
              value={data?.profitMargin}
              precision={2}
              valueStyle={{
                color:
                  data?.profitMargin && data.profitMargin < 0
                    ? "#3f8600"
                    : "#cf1322",
              }}
              //   prefix={<ArrowUpOutlined />}
              suffix="%"
            />
            <Progress
              percent={data?.profitMargin}
              strokeColor="#1677ff"
              showInfo={false}
            />
          </Card>
        </Col>
        <Col md={12} xl={6}>
          <Card size="small">
            <Statistic
              title="项目进度"
              value={data?.schedule ?? 0}
              precision={2}
              valueStyle={{
                color:
                  data?.schedule && data.schedule < 0 ? "#3f8600" : "#cf1322",
              }}
              //   prefix={<ArrowUpOutlined />}
              suffix="%"
            />
            <Progress
              percent={data?.schedule ?? 0}
              strokeColor="#1677ff"
              showInfo={false}
            />
          </Card>
        </Col>
      </Row>
      <Card title="分期成本" size="small" style={{ marginTop: 15 }}>
        <Column
          title={"三算对比"}
          data={columnData}
          xField={"time"}
          yField={"value"}
          colorField="name"
          group={true}
          scale={{
            color: {
              palette: "paired",
            },
          }}
        />
      </Card>
    </FPage>
  );
};

export default Dashboard;
