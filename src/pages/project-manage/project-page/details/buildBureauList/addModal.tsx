import BuildApi from "@/apis/buildApi";
import {
  ActionType,
  ModalForm,
  ProCard,
  ProColumns,
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormGroup,
  ProFormInstance,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";
import { Button, Radio, message } from "antd";
import { Key, useContext, useEffect, useRef, useState } from "react";
import { ProjectContext } from "..";
import BuildChildTable from "../buildList/buildChildTable";

const AddModal = ({
  stageType,
  priceType,
  onCreate,
  groupBillCode,
  groupBillUuid,
}: {
  stageType: string;
  priceType: number;
  onCreate: VoidFunction;
  groupBillCode: string;
  groupBillUuid: string;
}) => {
  const { projectId } = useContext(ProjectContext);
  const [selectType, setSelectType] = useState(1);
  const formRef = useRef<ProFormInstance>();
  return (
    <ModalForm
      formRef={formRef}
      trigger={<Button type="primary">新增</Button>}
      title="新增构件"
      width={1000}
      onFinish={async (values) => {
        try {
          await BuildApi.addGjAndRebar({
            ...values,
            projectId,
            stageType,
            priceType,
            groupBillCode,
            groupBillUuid,
          });
          formRef.current?.resetFields();
          message.success("新建成功");
          onCreate();
          return true;
        } catch (error) {
          return false;
        }
      }}
    >
      <ProFormGroup>
        <ProFormSelect
          label="选择单位工程"
          name="unitProjectUuid"
          width={"md"}
          request={async () => {
            const res = await BuildApi.getBuildProject({ id: projectId });
            const opts =
              res.data?.map((e) => ({
                value: e.uuid,
                label: e.unitProject,
              })) ?? [];
            return opts;
          }}
          rules={[{ required: true }]}
        />
        <ProFormRadio.Group
          label="构件类型"
          name="type"
          options={[
            { label: "构件", value: 1 },
            { label: "钢筋", value: 2 },
          ]}
          width={"md"}
          initialValue={1}
          rules={[{ required: true }]}
          fieldProps={{
            onChange() {
              formRef.current?.resetFields(["id"]);
            },
          }}
        />
        <ProFormDependency name={["unitProjectUuid", "type"]}>
          {({ unitProjectUuid, type }) => {
            return (
              <ProFormSelect
                params={{ unitProjectUuid, type }}
                width={"md"}
                request={async ({ unitProjectUuid, type }) => {
                  if (!unitProjectUuid || !type) return [];
                  const res = await BuildApi.getLcList({
                    unitProjectUuid,
                    type,
                  });
                  const opts =
                    res.data?.map((e) => ({
                      value: e.name,
                      label: e.name,
                    })) ?? [];
                  return opts;
                }}
                label="选择楼层"
                name="storeyName"
                rules={[{ required: true }]}
              />
            );
          }}
        </ProFormDependency>

        <ProFormText label="单位" name="unit" width={"md"} />
        <ProFormText label="计算项目" name="computeProject" width={"md"} />
        <ProFormDigit label="工程量" name="computeValue" width={"md"} />
        <ProCard title="清单" bodyStyle={{ padding: 10 }} bordered>
          <ProForm.Item>
            <Radio.Group
              options={[
                { label: "从列表导入", value: 1 },
                { label: "手填", value: 2 },
              ]}
              value={selectType}
              onChange={(e) => setSelectType(e.target.value)}
            />
          </ProForm.Item>
          {selectType === 1 ? (
            <ProFormDependency name={["type", "unitProjectUuid", "storeyName"]}>
              {({ type, unitProjectUuid, storeyName }) => {
                if (type === 1) {
                  return (
                    <ProForm.Item name="id">
                      <GJTable unitUUid={unitProjectUuid} />
                    </ProForm.Item>
                  );
                } else {
                  return (
                    <ProForm.Item name="id">
                      <RebarTable
                        unitUUid={unitProjectUuid}
                        type={type}
                        storeyName={storeyName}
                      />
                    </ProForm.Item>
                  );
                }
              }}
            </ProFormDependency>
          ) : (
            <ProFormGroup>
              <ProFormText
                label="清单名称-编号"
                name="memberCode"
                width={"md"}
              />
              <ProFormText
                label="清单名称-类型"
                name="memberType"
                width={"md"}
              />
            </ProFormGroup>
          )}
        </ProCard>
      </ProFormGroup>
    </ModalForm>
  );
};
type ITableProps = {
  unitUUid?: string;
  value?: Key[];
  onChange?: (value: Key[]) => void;
  childValue?: Key;
  childOnChange?: (value: Key) => void;
};
const GJTable = ({
  unitUUid,
  onChange,
  value,
  childOnChange,
  childValue,
}: ITableProps) => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: "层数",
      dataIndex: "storeyName",
      search: false,
    },
    {
      title: "构件类型",
      dataIndex: "memberType",
      search: false,
    },
    {
      title: "构件编号",
      dataIndex: "memberCode",
      search: false,
    },
    {
      title: "构件位置",
      dataIndex: "memberPosition",
      search: false,
    },
    {
      title: "砼等级",
      dataIndex: "concreteLevel",
      search: false,
    },
  ];
  useEffect(() => {
    if (unitUUid) {
      actionRef.current?.reloadAndRest?.();
    }
  }, [unitUUid]);

  return (
    <ProTable
      search={false}
      rowKey={"id"}
      actionRef={actionRef}
      scroll={{ x: "max-content", y: 500 }}
      bordered
      size="small"
      cardProps={{
        bodyStyle: {
          padding: 0,
        },
      }}
      columns={[...columns]}
      request={async ({ pageSize, current: pageNum }) => {
        if (!unitUUid) return { data: [] };
        const res = await BuildApi.getBuildList({
          unitProjectUuid: unitUUid,
          pageSize,
          pageNum,
        });
        return {
          data: res.data || [],
          success: true,
          total: res.totalRow,
        };
      }}
      toolbar={{
        title: "构件列表",
      }}
      tableAlertRender={false}
      expandable={{
        expandedRowRender: (record) => {
          return (
            <BuildChildTable
              id={record.id}
              value={childValue}
              onChange={childOnChange}
            />
          );
        },
      }}
      rowSelection={{
        type: "checkbox",
        selectedRowKeys: value,
        onChange: (selectedRowKeys) => {
          onChange?.(selectedRowKeys);
        },
      }}
    />
  );
};
type IRebarTableProps = {
  unitUUid?: string;
  value?: Key;
  onChange?: (value: Key) => void;
  storeyName?: string;
  type?: number;
};
const RebarTable = ({
  unitUUid,
  onChange,
  value,
  type,
  storeyName,
}: IRebarTableProps) => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns[] = [
    {
      title: "楼层",
      dataIndex: "storeyName",
    },
    {
      title: "钢筋型号",
      dataIndex: "rebarCode",
    },
    {
      title: "直径",
      dataIndex: "rebarType",
    },
    {
      title: "单位",
      dataIndex: "unit",
    },
    {
      title: "重量",
      dataIndex: "rebarAmount",
    },
    {
      title: "匹配状态",
      dataIndex: "mateStatus",
    },
  ];
  useEffect(() => {
    if (unitUUid && type && storeyName) {
      actionRef.current?.reloadAndRest?.();
    }
  }, [unitUUid, type, storeyName]);

  return (
    <ProTable
      search={false}
      rowKey={"id"}
      actionRef={actionRef}
      scroll={{ x: "max-content", y: 500 }}
      bordered
      size="small"
      cardProps={{
        bodyStyle: {
          padding: 0,
        },
      }}
      columns={[...columns]}
      request={async () => {
        if (!unitUUid || !type || !storeyName) return { data: [] };
        const res = await BuildApi.getLcRebarList({
          unitProjectUuid: unitUUid,
          type,
          storeyName,
        });
        return {
          data: res.data || [],
          success: true,
          total: res.totalRow,
        };
      }}
      toolbar={{
        title: "钢筋列表",
      }}
      tableAlertRender={false}
      rowSelection={{
        type: "radio",
        selectedRowKeys: value ? [value] : void 0,
        onChange: (_, selectedRows) => {
          if (selectedRows.length > 0) {
            onChange?.(_[0]);
          }
        },
      }}
    />
  );
};
export default AddModal;
