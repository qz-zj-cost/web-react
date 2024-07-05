import BuildApi from "@/apis/buildApi";
import InstallmentApi from "@/apis/installmentApi";
import {
  EditableProTable,
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormGroup,
  ProFormText,
} from "@ant-design/pro-components";
import { Button, message } from "antd";
import { useContext, useState } from "react";
import { ProjectContext } from "..";

const AddDateModal = ({ onSuccess }: { onSuccess: VoidFunction }) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>();

  const { projectId } = useContext(ProjectContext);
  return (
    <ModalForm
      trigger={<Button type="primary">新建分期</Button>}
      title="新建分期"
      width={900}
      onFinish={async (val) => {
        try {
          await InstallmentApi.addInstallment({ ...val, projectId });
          message.success("新建成功");
          onSuccess();
          return true;
        } catch (error) {
          return false;
        }
      }}
      modalProps={{
        destroyOnClose: true,
      }}
    >
      <ProFormGroup>
        <ProFormText
          label="分期名称"
          name="name"
          width={"md"}
          rules={[{ required: true }]}
        />
        <ProFormDateRangePicker
          label="分期时间"
          name="monthDate"
          width={"md"}
          rules={[{ required: true }]}
        />
      </ProFormGroup>
      <ProForm.Item
        label="分期工程量"
        name="quantitiesQueries"
        trigger="onValuesChange"
        rules={[{ required: true }]}
      >
        <EditableProTable<{
          id: number;
          unitProjectUuid?: string;
          storeyRegionList?: string;
          completionDegree?: string;
        }>
          rowKey="id"
          toolBarRender={false}
          bordered
          size="small"
          columns={[
            {
              title: "单位工程",
              dataIndex: "unitProjectUuid",
              fieldProps: {
                popupMatchSelectWidth: false,
              },
              request: async ({ unitProjectUuid }) => {
                if (unitProjectUuid) return [];
                const res = await BuildApi.getBuildProject({
                  id: projectId,
                });
                return res.data.map((e) => ({
                  label: e.unitProject,
                  value: e.uuid,
                }));
              },
            },
            {
              title: "楼层区域",
              dataIndex: "storeyRegionList",
              width: 250,
              dependencies: ["unitProjectUuid"],
              fieldProps: {
                mode: "multiple",
              },
              request: async ({ unitProjectUuid }) => {
                if (!unitProjectUuid) return [];
                const res = await BuildApi.getBuildstorey({
                  uuid: unitProjectUuid,
                });
                return res.data.map((e) => ({
                  label: e.name,
                  value: e.name,
                }));
              },
            },
            {
              title: "构件类型",
              dataIndex: "memberTypeList",
              valueType: "select",
              fieldProps: {
                mode: "multiple",
              },
              dependencies: ["unitProjectUuid"],
              request: async ({ unitProjectUuid }) => {
                if (!unitProjectUuid) return [];
                const res = await BuildApi.getMemberType({
                  id: projectId,
                  uuid: unitProjectUuid,
                });
                return res.data.map((e) => ({
                  label: e.memberType,
                  value: e.memberType,
                }));
              },
            },
            {
              title: "完成度",
              dataIndex: "completionDegree",
              valueType: "digit",
              fieldProps: {
                addonAfter: "%",
              },
            },
            {
              title: "操作",
              valueType: "option",
              fixed: "right",
              width: "auto",
            },
          ]}
          recordCreatorProps={{
            newRecordType: "dataSource",
            position: "bottom",
            record: () => ({
              id: Date.now(),
            }),
          }}
          editable={{
            type: "multiple",
            editableKeys,
            onChange: setEditableRowKeys,
            actionRender: (_, _r, dom) => {
              return [dom.delete];
            },
          }}
        />
      </ProForm.Item>
    </ModalForm>
  );
};

export default AddDateModal;
