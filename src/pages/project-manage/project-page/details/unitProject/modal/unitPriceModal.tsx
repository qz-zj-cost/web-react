import ExterpriseApi from "@/apis/exterpriseApi";
import ProjectApi from "@/apis/projectApi";
import {
  ActionType,
  ModalForm,
  ProForm,
  ProFormInstance,
  ProTable,
} from "@ant-design/pro-components";
import { InputNumber, Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import {
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ProjectContext } from "../..";

type IUnitPriceModalProps = {
  onSuccess: VoidFunction;
};
type IRecord = {
  ids: number[];
  code: string;
  type: number; // 1.修改列表企业定额价格 2.修改子集企业定额价格
};
export type IUnitPriceModalRef = {
  open: (v: IRecord) => void;
};
const UnitPriceModal = forwardRef<IUnitPriceModalRef, IUnitPriceModalProps>(
  ({ onSuccess }, ref) => {
    const [areaData, setAreaData] = useState<DefaultOptionType[]>();
    const actionRef = useRef<ActionType>();
    const [area, setArea] = useState<string>();
    const { projectId } = useContext(ProjectContext);
    const formRef = useRef<ProFormInstance>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [record, setRecord] = useState<IRecord>();

    const getAreaList = useCallback((code: string) => {
      ExterpriseApi.getArea({ code: code }).then((res) => {
        const arr = res.data.map((e) => ({ label: e.area, value: e.area }));
        setAreaData(arr);
        setArea(arr?.[0]?.value);
        actionRef.current?.reload();
      });
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        open: (v) => {
          // 打开弹窗
          setIsOpen(true);
          setRecord(v);
          getAreaList(v.code);
          // 设置id
          formRef.current?.setFieldsValue({ price: "" });
        },
      }),
      [getAreaList],
    );

    return (
      <ModalForm<{ price: string }>
        modalProps={{ destroyOnClose: true }}
        formRef={formRef}
        open={isOpen}
        onOpenChange={(e) => {
          if (!e) setIsOpen(false);
        }}
        onFinish={async (val) => {
          try {
            if (!val.price || !record) return;
            await ProjectApi.updateUnitPrice({
              ids: record.ids,
              projectId,
              price: val.price,
              sourceType: record.type,
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
            if (!area || !record) return { data: [] };
            const res = await ExterpriseApi.getPrice({
              code: record?.code,
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
  },
);

export default UnitPriceModal;
