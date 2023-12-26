import ProjectApi from "@/apis/projectApi";
import { PlusOutlined } from "@ant-design/icons";
import {
  DrawerForm,
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormInstance,
  ProFormText,
} from "@ant-design/pro-components";
import { Button, message } from "antd";
import { useRef } from "react";

type IProjectDrawerProps = {
  onCreate: VoidFunction;
};
const ProjectDrawer = ({ onCreate }: IProjectDrawerProps) => {
  const formRef = useRef<ProFormInstance>();
  return (
    <DrawerForm
      title="新建项目"
      width={900}
      formRef={formRef}
      resize={{
        maxWidth: 900,
        minWidth: 900,
      }}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新建项目
        </Button>
      }
      onFinish={async (val) => {
        try {
          await ProjectApi.add(val);
          formRef.current?.resetFields();
          message.success("新建成功");
          onCreate();
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
        />

        <ProFormText
          width="md"
          name="contractNumber"
          label="合同编码"
          placeholder="请输入合同编码"
        />

        <ProFormDigit
          width="md"
          name="contractAmount"
          label="合同金额(含税)"
          placeholder="请输入合同金额"
          fieldProps={{
            suffix: "万元",
          }}
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
          fieldProps={{
            suffix: "%",
          }}
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
    </DrawerForm>
  );
};

export default ProjectDrawer;
