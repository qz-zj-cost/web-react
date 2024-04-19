import ExterpriseApi from "@/apis/exterpriseApi";
import ProjectApi from "@/apis/projectApi";
import { EditOutlined } from "@ant-design/icons";
import {
  ActionType,
  ModalForm,
  ProForm,
  ProFormInstance,
  ProTable,
} from "@ant-design/pro-components";
import { InputNumber, Select, Typography } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ProjectContext } from "../..";

const UnitPriceModal = ({
  code,
  type,
  id,
  onSuccess,
}: {
  code: string;
  type: number;
  id: number;
  onSuccess: VoidFunction;
}) => {
  const [areaData, setAreaData] = useState<DefaultOptionType[]>();
  const actionRef = useRef<ActionType>();
  const [area, setArea] = useState<string>();
  const { projectId } = useContext(ProjectContext);
  const formRef = useRef<ProFormInstance>(null);

  const getAreaList = useCallback((code: string) => {
    ExterpriseApi.getArea({ code: code }).then((res) => {
      const arr = res.data.map((e) => ({ label: e.area, value: e.area }));
      setAreaData(arr);
      setArea(arr?.[0]?.value);
      actionRef.current?.reload();
    });
  }, []);

  useEffect(() => {
    if (code) {
      getAreaList(code);
    }
  }, [code, getAreaList]);

  return (
    <ModalForm<{ price: string }>
      modalProps={{ destroyOnClose: true }}
      formRef={formRef}
      trigger={
        <Typography.Link>
          <EditOutlined />
        </Typography.Link>
      }
      onFinish={async (val) => {
        try {
          if (!val.price) return;
          await ProjectApi.updateUnitPrice({
            extendId: id,
            projectId,
            price: val.price,
            sourceType: type,
          });
          onSuccess();
          return true;
        } catch (error) {
          return false;
        }
      }}
    >
      <ProForm.Item label="价格" name="price">
        <InputNumber style={{ width: "100%" }} />
      </ProForm.Item>
      <ProTable
        scroll={{ y: 500, x: "max-content" }}
        rowKey={"price"}
        size="small"
        actionRef={actionRef}
        cardProps={{
          bodyStyle: { padding: 0 },
        }}
        request={async () => {
          if (!area) return { data: [] };
          const res = await ExterpriseApi.getPrice({
            code: code,
            area: area,
          });
          return {
            data: res.data || [],
            success: true,
          };
        }}
        rowSelection={{
          type: "radio",
          onChange: (_, rows: any) => {
            formRef.current?.setFieldValue("price", rows[0]?.price);
          },
        }}
        tableAlertRender={false}
        pagination={false}
        search={false}
        bordered
        toolbar={{
          title: "从列表选择价格",
          search: (
            <Select
              options={areaData}
              style={{ width: 200 }}
              value={area}
              placeholder="请选择地址"
              allowClear
              onChange={(e) => {
                setArea(e);
                actionRef.current?.reload();
              }}
            />
          ),
        }}
        columns={[
          {
            title: "日期",
            dataIndex: "monthDate",
            hideInSearch: true,
          },
          {
            title: "不含税单价",
            dataIndex: "price",
            hideInSearch: true,
          },
        ]}
      />
    </ModalForm>
  );
};

export default UnitPriceModal;
