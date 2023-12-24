import { PlusOutlined } from "@ant-design/icons";
import {
  DrawerForm,
  ProForm,
  ProFormRadio,
  ProFormText,
} from "@ant-design/pro-components";
import { Button } from "antd";

const RoleDrawer = () => {
  return (
    <DrawerForm
      title="新建角色"
      width={300}
      resize={{
        maxWidth: 300,
      }}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新建角色
        </Button>
      }
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          label="角色名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
        />

        <ProFormText
          width="md"
          name="company"
          label="备注"
          placeholder="请输入名称"
        />
      </ProForm.Group>
      <ProForm.Group>
        {/* <ProFormCheckbox.Group
          width="md"
          name="name"
          label="功能权限"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
        /> */}
        <ProFormRadio.Group
          width="md"
          name="name"
          label="项目权限"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
          options={["查看全部项目", "查看本人项目"]}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};

export default RoleDrawer;
