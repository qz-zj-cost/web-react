import BuildApi from "@/apis/buildApi";
import InstallmentApi from "@/apis/installmentApi";
import {
  EditableProTable,
  ModalForm,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
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
      <ProFormDatePicker.Month
        label="分期月份"
        name="monthDate"
        rules={[{ required: true }]}
      />
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
              renderFormItem: () => (
                <ProFormSelect
                  noStyle
                  request={async () => {
                    const res = await BuildApi.getBuildProject({
                      id: projectId,
                    });
                    return res.data.map((e) => ({
                      label: e.unitProject,
                      value: e.uuid,
                    }));
                  }}
                  placeholder={"请选择单位工程"}
                />
              ),
            },
            {
              title: "楼层区域",
              dataIndex: "storeyRegionList",
              width: 250,
              renderFormItem: (_, config) => {
                if (!config.record?.unitProjectUuid)
                  return <ProFormSelect noStyle placeholder={"请选择"} />;
                return (
                  <ProFormSelect
                    noStyle
                    mode="multiple"
                    request={async () => {
                      const res = await BuildApi.getBuildstorey({
                        uuid: config.record!.unitProjectUuid!,
                      });
                      return res.data.map((e) => ({
                        label: e.name,
                        value: e.name,
                      }));
                    }}
                    placeholder={"请选择"}
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
