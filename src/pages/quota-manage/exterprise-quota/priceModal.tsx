import ExterpriseApi from "@/apis/exterpriseApi";
import {
  ActionType,
  ProDescriptions,
  ProTable,
} from "@ant-design/pro-components";
import { Modal, Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type IPriceModalRef = {
  show: (e: IExterpriseItemModel) => void;
};
const PriceModal = forwardRef<IPriceModalRef>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState<IExterpriseItemModel>();
  const [areaData, setAreaData] = useState<DefaultOptionType[]>();
  const actionRef = useRef<ActionType>();
  const [area, setArea] = useState<string>();

  const getAreaList = useCallback((code: string) => {
    ExterpriseApi.getArea({ code: code }).then((res) => {
      const arr = res.data.map((e) => ({ label: e.area, vlaue: e.area }));
      setAreaData(arr);
      setArea(arr?.[0]?.vlaue);
      actionRef.current?.reloadAndRest?.();
    });
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      show: (e) => {
        setInfo(e);
        setVisible(true);
        getAreaList(e.code);
      },
    }),
    [getAreaList],
  );
  return (
    <Modal
      width={900}
      open={visible}
      onCancel={() => {
        setVisible(false);
      }}
    >
      <ProDescriptions column={3}>
        <ProDescriptions.Item label="企业定额编号">
          {info?.code}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="项目名称">
          {info?.name}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="单位">{info?.unit}</ProDescriptions.Item>
        <ProDescriptions.Item label="项目特征" span={3}>
          {info?.feature}
        </ProDescriptions.Item>
      </ProDescriptions>
      <ProTable
        scroll={{ y: 500, x: "max-content" }}
        rowKey={"code"}
        size="small"
        actionRef={actionRef}
        cardProps={{
          bodyStyle: { padding: 0 },
        }}
        request={async () => {
          if (!info || !area) return { data: [] };
          const res = await ExterpriseApi.getPrice({
            code: info!.code,
            area: area,
          });
          return {
            data: res.data || [],
            success: true,
          };
        }}
        pagination={false}
        search={false}
        bordered
        toolbar={{
          search: (
            <Select
              options={areaData}
              style={{ width: 200 }}
              value={area}
              placeholder="请选择地址"
              allowClear
              onChange={(e) => {
                setArea(e);
              }}
            />
          ),
        }}
        columns={[
          {
            title: "地区",
            hideInTable: true,
          },
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
          //   {
          //     title: "操作",
          //     width: "auto",
          //     fixed: "right",
          //     align: "center",
          //     search: false,
          //     render: () => {
          //       return (
          //         <Typography.Link type="danger" onClick={() => {}}>
          //           删除
          //         </Typography.Link>
          //       );
          //     },
          //   },
        ]}
      />
    </Modal>
  );
});

export default PriceModal;
