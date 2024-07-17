import ProjectApi from "@/apis/projectApi";
import {
  ModalForm,
  ProFormDependency,
  ProFormRadio,
  ProFormSelect,
} from "@ant-design/pro-components";
import { Button, message } from "antd";
import fileDownload from "js-file-download";
import { useContext } from "react";
import { ProjectContext } from "../detailContext";

const typeOptions = [
  {
    label: "总包服务费",
    value: "1",
    children: [{ label: "总包服务费", value: "1" }],
  },
  {
    label: "间接费",
    value: "2",
    children: [
      {
        label: "现场经费",
        value: "1",
      },
      {
        label: "规费及其他应缴费",
        value: "2",
      },
      {
        label: "税金及附加",
        value: "3",
      },
      {
        label: "资金占用费",
        value: "4",
      },
    ],
  },
  {
    label: "直接费和措施费",
    value: "3",
    children: [
      {
        label: "人工费",
        value: "1",
      },
      {
        label: "直接材料费",
        value: "2",
      },
      {
        label: "专业分包费",
        value: "3",
      },
      {
        label: "机械使用费",
        value: "4",
      },
      {
        label: "周转材料费（采购类）",
        value: "5",
      },
      {
        label: "周转材料费（租赁类）",
        value: "6",
      },
      {
        label: "安全文明施工费",
        value: "7",
      },
      {
        label: "其他措施费",
        value: "8",
      },
    ],
  },
];

const ExportModal = () => {
  const { projectId } = useContext(ProjectContext);
  return (
    <ModalForm<{ priceType: string; type: string }>
      trigger={<Button type="primary">文件导出</Button>}
      width={600}
      title="文件导出"
      onFinish={async (value) => {
        try {
          const res = await ProjectApi.exportFile({ ...value, projectId });
          fileDownload(
            res.data,
            `${typeOptions
              .find((item) => item.value === value.type)
              ?.children.find((item) => item.value === value.priceType)
              ?.label}.xlsx`,
          );
          message.success("导出成功");
          return true;
        } catch (error) {
          return false;
        }
      }}
    >
      <ProFormRadio.Group
        name="type"
        label="导出类型"
        initialValue={"1"}
        rules={[{ required: true }]}
        options={typeOptions.map((item) => ({
          label: item.label,
          value: item.value,
        }))}
      />
      <ProFormDependency name={["type"]}>
        {({ type }) => (
          <ProFormSelect
            name="priceType"
            rules={[{ required: true }]}
            label={`${typeOptions.find((item) => item.value === type)
              ?.label}具体导出类型`}
            options={typeOptions
              .find((item) => item.value === type)
              ?.children?.map((item) => ({
                value: item.value,
                label: item.label,
              }))}
          />
        )}
      </ProFormDependency>
    </ModalForm>
  );
};

export default ExportModal;
