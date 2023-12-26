import BureauApi from "@/apis/bureauApi";
import { ProColumns, ProFormTreeSelect } from "@ant-design/pro-components";
import { Typography } from "antd";

const BureauColumns: ProColumns<IBureauItemModel>[] = [
  {
    title: "分类",
    dataIndex: "sectionCode",
    hideInTable: true,
    // initialValue: "0-分包",
    formItemProps: {
      lightProps: {},
    },
    renderFormItem: () => (
      <ProFormTreeSelect
        width={400}
        fieldProps={{
          popupMatchSelectWidth: false,
        }}
        request={async () => {
          const res = await BureauApi.getType();
          const arr2tree = (arr?: IBureauTreeModel[], parent?: string) => {
            if (!arr || arr.length === 0) return [];
            return arr.reduce((pre: any[], cur) => {
              const val = `${cur.level}-${cur.name}`;
              pre.push({
                label: cur.name,
                value: parent ? `${parent},${val}` : val,
                children: arr2tree(
                  cur.childList,
                  parent ? `${parent},${val}` : val,
                ),
              });
              return pre;
            }, []);
          };
          const opts = arr2tree(res.data);
          return opts;
        }}
      />
    ),
  },
  {
    title: "编号",
    dataIndex: "code",
    search: false,
  },
  {
    title: "名称",
    dataIndex: "name",
    search: false,
  },
  {
    title: "计量单位",
    dataIndex: "unit",
    search: false,
    width: 80,
  },
  {
    title: "项目特征",
    dataIndex: "feature",
    search: false,
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
    title: "工作内容",
    dataIndex: "content",
    search: false,
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
    title: "计量规则",
    dataIndex: "calcRule",
    search: false,
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
    title: "路径",
    dataIndex: "classPath",
    search: false,
  },
  {
    title: "匹配企业定额",
    dataIndex: "corpQuotaMate",
    search: false,
    valueEnum: {
      0: { text: "未匹配", status: "Warning" },
      1: { text: "已匹配", status: "Success" },
    },
  },
  {
    title: "匹配国标清单",
    dataIndex: "nationalStandardMate",
    search: false,
    valueEnum: {
      0: { text: "未匹配", status: "Warning" },
      1: { text: "已匹配", status: "Success" },
    },
  },
];
export default BureauColumns;
