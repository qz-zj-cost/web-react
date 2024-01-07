import ProjectApi from "@/apis/projectApi";
import {
  ModalForm,
  ProFormInstance,
  ProFormSelect,
} from "@ant-design/pro-components";
import { Button } from "antd";
import { useCallback, useRef, useState } from "react";

const PriceModal = () => {
  const [timeOpt, setTimeOpt] = useState<any[]>();
  const formRef = useRef<ProFormInstance>(null);
  const getTimeData = useCallback((area: string) => {
    ProjectApi.getAllAreaTime({ area }).then((e) => {
      const opt = e.data.map((e) => ({
        label: e.monthDate,
        value: e.monthDate,
      }));
      setTimeOpt(opt);
    });
  }, []);
  return (
    <ModalForm
      title="选择价格包"
      formRef={formRef}
      width={500}
      trigger={<Button type="primary">载入企业定额价格</Button>}
    >
      <ProFormSelect
        label="地区"
        name="area"
        width={"md"}
        request={async () => {
          const res = await ProjectApi.getAllArea();
          return res.data.map((e) => ({ label: e.area, value: e.area }));
        }}
        onChange={(v: string) => {
          if (v) {
            getTimeData(v);
            formRef.current?.resetFields(["monthDate"]);
          }
        }}
      />
      <ProFormSelect
        label="时间"
        name="monthDate"
        width={"md"}
        options={timeOpt}
      />
    </ModalForm>
  );
};

export default PriceModal;
