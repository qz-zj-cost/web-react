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
import { Button, Modal, Radio, Space, Typography, message } from "antd";
import { Key, useContext, useEffect, useRef, useState } from "react";
import BuildChildTable from "../buildList/buildChildTable";
import { ProjectContext } from "../detailContext";

const AddModal = ({
  stageType,
  priceType,
  onCreate,
  groupBillCode,
  groupBillUuid,
  parentId,
}: {
  stageType: string;
  priceType: number;
  onCreate: VoidFunction;
  groupBillCode: string;
  groupBillUuid: string;
  parentId: number;
}) => {
  const { projectId } = useContext(ProjectContext);
  const [selectType, setSelectType] = useState(1);
  const formRef = useRef<ProFormInstance>();
  const uuidRef = useRef<Key[]>();
  return (
    <ModalForm
      formRef={formRef}
      trigger={<Button type="primary">新增</Button>}
      title="新增构件"
      width={1000}
      onFinish={async ({ ...values }) => {
        try {
          await BuildApi.addGjAndRebar({
            ...values,
            uuidList: uuidRef.current,
            projectId,
            stageType,
            priceType,
            groupBillCode,
            groupBillUuid,
            parentId,
          });
          formRef.current?.resetFields();
          message.success("新建成功");
          uuidRef.current = void 0;
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
        <ProFormText
          label="计算项目"
          name="computeProject"
          width={"md"}
          rules={[{ required: true }]}
        />
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
                      <GJTable
                        unitUUid={unitProjectUuid}
                        onSelect={(uuids, s) => {
                          uuidRef.current = uuids;
                          formRef.current?.setFieldValue("computeProject", s);
                        }}
                        onChildSelect={(v) => {
                          formRef.current?.setFieldValue("computeProject", v);
                        }}
                      />
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
  value?: Key;
  onChange?: (value: Key) => void;
  onSelect?: (uuids: Key[], v: string) => void;
  onChildSelect?: (value: string) => void;
};
const GJTable = ({
  unitUUid,
  onChange,
  value,
  onSelect,
  onChildSelect,
}: ITableProps) => {
  const actionRef = useRef<ActionType>();
  const [selectKeys, setSelectKeys] = useState<Key[]>();
  const { projectId } = useContext(ProjectContext);
  const columns: ProColumns[] = [
    {
      title: "层数",
      dataIndex: "storeyName",
      search: false,
    },
    {
      title: "构件类型",
      dataIndex: "memberType",
      valueType: "select",
      initialValue: void 0,
      request: async () => {
        if (!unitUUid) return [];
        const res = await BuildApi.getMemberType({
          id: projectId,
          uuid: unitUUid,
        });
        return res.data.map((e) => ({
          label: e.memberType,
          value: e.memberType,
        }));
      },
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
    },
  ];
  useEffect(() => {
    if (unitUUid) {
      actionRef.current?.reloadAndRest?.();
    }
  }, [unitUUid]);

  return (
    <ProTable
      search={{
        filterType: "light",
      }}
      rowKey={"uuid"}
      actionRef={actionRef}
      scroll={{ x: "max-content", y: 300 }}
      bordered
      size="small"
      cardProps={{
        bodyStyle: {
          padding: 0,
        },
      }}
      columns={[...columns]}
      request={async ({ pageSize, current: pageNum, ...params }) => {
        if (!unitUUid) return { data: [] };
        const res = await BuildApi.getBuildList({
          unitProjectUuid: unitUUid,
          ...params,
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
      expandable={{
        expandedRowRender: (record) => {
          return (
            <BuildChildTable
              id={record.id}
              value={value}
              onChange={(e, l) => {
                onChange?.(e);
                onChildSelect?.(l);
              }}
            />
          );
        },
      }}
      rowSelection={{
        type: "checkbox",
        selectedRowKeys: selectKeys,
        onChange: (selectedRowKeys) => {
          setSelectKeys(selectedRowKeys);
        },
      }}
      tableAlertOptionRender={({ onCleanSelected }) => {
        return (
          <Space size={16}>
            <GroupModal
              ids={selectKeys}
              onSuccess={(e) => {
                onSelect?.(selectKeys!, e);
              }}
            />
            <Typography.Link onClick={onCleanSelected}>
              取消选择
            </Typography.Link>
          </Space>
        );
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
const GroupModal = ({
  ids,
  onSuccess,
}: {
  ids?: Key[];
  onSuccess: (e: string) => void;
}) => {
  const [visible, setVisible] = useState(false);
  const [opt, setopt] = useState<{ computeProject: string; id: number }[]>();
  const [value, setValue] = useState<string>();
  const handleShow = () => {
    setVisible(true);
    if (ids) {
      BuildApi.getGjGroup({ uuidList: ids as number[] }).then((res) => {
        setopt(res.data);
      });
    }
  };

  return (
    <>
      <Button onClick={handleShow} type="primary">
        选择计算项目
      </Button>
      <Modal
        title="选择计算项目"
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={() => {
          if (value) onSuccess(value);
          setVisible(false);
        }}
      >
        <Radio.Group
          value={value}
          onChange={(v) => {
            setValue(v.target.value);
          }}
          options={opt?.map((v) => ({
            label: v.computeProject,
            value: v.computeProject,
          }))}
        ></Radio.Group>
      </Modal>
    </>
  );
};
export default AddModal;
