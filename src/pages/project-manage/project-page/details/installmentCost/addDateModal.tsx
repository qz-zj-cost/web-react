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
import { Button, Select, message } from "antd";
import { useContext, useEffect, useState } from "react";
import { ProjectContext } from "../detailContext";

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
          type: number;
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
              request: async () => {
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
              title: "类型",
              dataIndex: "type",
              request: async () => {
                return [
                  {
                    label: "构件",
                    value: 1,
                  },
                  {
                    label: "钢筋",
                    value: 2,
                  },
                ];
              },
            },
            {
              title: "楼层",
              dataIndex: "storeyRegionList",
              renderFormItem(_, config) {
                const { record } = config;
                return (
                  <LcSelect
                    uuid={record?.unitProjectUuid}
                    type={record?.type}
                  />
                );
              },
            },
            {
              title: "施工段",
              dataIndex: "constructionSectionList",
              renderFormItem(_, config) {
                const { record } = config;
                return (
                  <SgSelect
                    uuid={record?.unitProjectUuid}
                    type={record?.type}
                  />
                );
              },
            },
            {
              title: "构件类型",
              dataIndex: "memberTypeList",
              renderFormItem(_, config) {
                const { record } = config;
                return (
                  <GjSelect
                    uuid={record?.unitProjectUuid}
                    type={record?.type}
                  />
                );
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
              type: 1,
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

type LcSelectProps = {
  value?: string;
  onChange?: (e: string) => void;
  uuid?: string;
  type?: number;
};
const LcSelect = ({ value, onChange, uuid, type }: LcSelectProps) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>();
  useEffect(() => {
    if (!uuid || !type) return;
    BuildApi.getBuildstorey({
      uuid: uuid,
      type,
    }).then((res) => {
      const arr = res.data.map((e) => ({ label: e.name, value: e.name }));
      setOptions(arr);
    });
  }, [type, uuid]);

  return (
    <Select
      value={value}
      options={options}
      mode="multiple"
      onChange={(v) => {
        onChange?.(v);
      }}
    />
  );
};

type GjSelectProps = {
  value?: string;
  onChange?: (e: string) => void;
  uuid?: string;
  type?: number;
};
const GjSelect = ({ value, onChange, uuid, type }: GjSelectProps) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>();
  const { projectId } = useContext(ProjectContext);
  useEffect(() => {
    if (!uuid || !type) return;
    BuildApi.getMemberType({
      id: projectId,
      uuid: uuid,
      type,
    }).then((res) => {
      const arr = res.data.map((e) => ({
        label: e.memberType,
        value: e.memberType,
      }));
      setOptions(arr);
    });
  }, [projectId, type, uuid]);

  return (
    <Select
      value={value}
      mode="multiple"
      options={options}
      onChange={(v) => {
        onChange?.(v);
      }}
    />
  );
};
type SgSelectProps = {
  value?: string;
  onChange?: (e: string) => void;
  uuid?: string;
  type?: number;
};
const SgSelect = ({ value, onChange, uuid, type }: SgSelectProps) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>();
  useEffect(() => {
    if (!uuid || !type) return;
    BuildApi.getSectionList({
      unitProjectUuid: uuid,
      type,
    }).then((res) => {
      const arr = res.data.map((e) => ({
        label: e.name,
        value: e.name,
      }));
      setOptions(arr);
    });
  }, [type, uuid]);

  return (
    <Select
      value={value}
      options={options}
      mode="multiple"
      onChange={(v) => {
        onChange?.(v);
      }}
    />
  );
};
export default AddDateModal;
