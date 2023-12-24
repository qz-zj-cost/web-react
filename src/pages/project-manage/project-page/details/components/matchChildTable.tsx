import ProjectApi from "@/apis/projectApi";
import { ProTable } from "@ant-design/pro-components";

const MatchChildTable = ({ code, id }: { code: string; id: number }) => {
  return (
    <ProTable
      columns={[
        {
          title: "层数",
          dataIndex: "floorName",
        },
        {
          title: "名称",
          dataIndex: "component",
        },
        {
          title: "工程量",
          dataIndex: "quantity",
        },
        {
          title: "单位",
          dataIndex: "unit",
        },
      ]}
      size="small"
      search={false}
      toolbar={{
        settings: [],
      }}
      bordered
      cardProps={{
        bodyStyle: { padding: 0 },
      }}
      request={async () => {
        const res = await ProjectApi.match.getChildList({
          orgCode: code,
          originalInventoryId: id,
        });
        return {
          data: res.data,
          success: true,
          total: res.totalRow,
        };
      }}
      pagination={false}
    />
  );
};

export default MatchChildTable;
