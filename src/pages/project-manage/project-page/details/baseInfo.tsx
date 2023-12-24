import ProjectApi from "@/apis/projectApi";
import { IProjectModel } from "@/models/projectModel";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormInstance,
  ProFormText,
} from "@ant-design/pro-components";
import { Button, Form, message } from "antd";
import { useEffect, useRef } from "react";

type IBaseInfoProps = {
  info?: IProjectModel;
  disabled?: boolean;
};
const BaseInfo = ({ info, disabled }: IBaseInfoProps) => {
  const formRef = useRef<ProFormInstance>();
  useEffect(() => {
    if (info) {
      formRef.current?.setFieldsValue({
        ...info,
        // engineerList: info.engineerList?.map((e) => e.userId) ?? [],
        // expertList: info.expertList?.map((e) => e.userId) ?? [],
      });
    }
  }, [info]);

  return (
    <div>
      <ProForm
        formRef={formRef}
        disabled={disabled}
        onFinish={async (val) => {
          try {
            await ProjectApi.update({ ...val, id: info?.id });
            message.success("保存成功");
            return true;
          } catch (error) {
            return false;
          }
        }}
      >
        <ProForm.Group>
          <ProFormText
            width="md"
            name="projectName"
            label="项目名称"
            placeholder="请输入项目名称"
            rules={[{ required: true }]}
          />

          <ProFormText
            width="md"
            name="contractName"
            label="合同名称"
            placeholder="请输入合同名称"
            rules={[{ required: true }]}
          />

          <ProFormText
            width="md"
            name="contractNumber"
            label="合同编码"
            placeholder="请输入合同编码"
            rules={[{ required: true }]}
          />

          <ProFormDigit
            width="md"
            name="contractAmount"
            label="合同金额(含税)"
            placeholder="请输入合同金额"
            addonAfter="万元"
          />

          <ProFormDigit
            width="md"
            name="projectDuration"
            label="项目工期"
            placeholder="请输入项目工期"
          />
          <ProFormText
            width="md"
            name="projectLocation"
            label="项目地点"
            placeholder="请输入项目地点"
          />
          <ProFormText
            width="md"
            name="constructionUnit"
            label="建设单位"
            placeholder="请输入建设单位"
          />
          <ProFormDigit
            width="md"
            name="vatRate"
            label="增值税税率"
            placeholder="请输入增值税税率"
            addonAfter="%"
          />
          <ProFormDatePicker
            width="md"
            name="contractStartDate"
            label="合同开工时间"
          />
          <ProFormDatePicker
            width="md"
            name="contractEndDate"
            label="合同竣工时间"
          />
        </ProForm.Group>
        {/* <ProFormList label="算量工程师" name="d">
          <Input />
        </ProFormList> */}
        <ProForm.Item label="算量工程师">
          <Form.List name="engineerList">
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field) => (
                  <ProForm.Item required={false} key={field.key}>
                    {/* <ProFormSelect
                      {...field}
                      request={async () => {
                        const res = await AccountApi.getExpertList(2);
                        return res.data.map((item) => ({
                          value: item.id,
                          label: `${item.speciality}-${item.name}`,
                        }));
                      }}
                      placeholder={"请选择算量工程师"}
                      noStyle
                      width={"md"}
                    /> */}
                    <DeleteOutlined
                      disabled={disabled}
                      style={{
                        fontSize: 14,
                        cursor: "pointer",
                        marginLeft: 15,
                      }}
                      onClick={() => remove(field.name)}
                    />
                  </ProForm.Item>
                ))}
                <Form.Item noStyle>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: "61.5%" }}
                    icon={<PlusOutlined />}
                  >
                    新增算量工程师
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </ProForm.Item>

        <ProForm.Item label="专家">
          <Form.List name="expertList">
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field) => (
                  <ProForm.Item required={false} key={field.key}>
                    {/* <ProFormSelect
                      {...field}
                      request={async () => {
                        const res = await AccountApi.getExpertList(1);
                        return res.data.map((item) => ({
                          value: item.id,
                          label: `${item.speciality}-${item.name}`,
                        }));
                      }}
                      placeholder={"请选择算量工程师"}
                      noStyle
                      width={"md"}
                    /> */}
                    <DeleteOutlined
                      style={{
                        fontSize: 14,
                        cursor: "pointer",
                        marginLeft: 15,
                      }}
                      onClick={() => remove(field.name)}
                    />
                  </ProForm.Item>
                ))}
                <Form.Item noStyle>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: "61.5%" }}
                    icon={<PlusOutlined />}
                  >
                    新增专家人员
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </ProForm.Item>
      </ProForm>
    </div>
  );
};

export default BaseInfo;
