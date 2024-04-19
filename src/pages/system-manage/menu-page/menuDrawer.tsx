import MenuApi from "@/apis/menuApi";
import IconSelectInput from "@/components/FIcon/iconSelectInput";
import { MenuListModal } from "@/models/menuModel";
import { PlusOutlined } from "@ant-design/icons";
import {
  DrawerForm,
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormInstance,
  ProFormRadio,
  ProFormText,
  ProFormTreeSelect,
} from "@ant-design/pro-components";
import { Button, message } from "antd";
import { DataNode } from "antd/lib/tree";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

const menuTree2dataNode = (list: MenuListModal[]): DataNode[] => {
  return list.map((e) => {
    return {
      label: e.authorityName,
      value: e.authorityId,
      key: e.authorityId,
      children:
        e.children && e.children.length > 0
          ? menuTree2dataNode(e.children)
          : undefined,
    };
  });
};
export type IMenuDrawerRef = {
  onEdit: (e: any) => void;
};
const MenuDrawer = forwardRef<IMenuDrawerRef, { onSuccess: VoidFunction }>(
  ({ onSuccess }, ref) => {
    const [visible, setVisible] = useState(false);
    const formRef = useRef<ProFormInstance>();
    const [form] = ProForm.useForm();
    const [type, setType] = useState(0);
    const idRef = useRef<string>();
    useImperativeHandle(
      ref,
      () => ({
        onEdit: (e) => {
          setVisible(true);
          form.setFieldsValue(e);
          idRef.current = e.authorityId;
          setType(1);
          // console.log(e);
        },
      }),
      [form],
    );
    return (
      <DrawerForm
        title={type === 0 ? "新建菜单" : "编辑菜单"}
        formRef={formRef}
        width={500}
        form={form}
        resize={{
          maxWidth: 500,
        }}
        open={visible}
        onOpenChange={(e) => {
          if (!e) {
            form.resetFields();
            setVisible(false);
            setType(0);
          }
        }}
        trigger={
          <Button type="primary">
            <PlusOutlined />
            新建菜单
          </Button>
        }
        onFinish={async (values) => {
          try {
            if (type === 0) {
              await MenuApi.addMenu(values);
            } else {
              await MenuApi.editMenu({
                ...values,
                authorityId: idRef.current,
              });
            }
            onSuccess();
            message.success(type === 0 ? "新建菜单成功" : "编辑菜单成功");
            return true;
          } catch (error) {
            return false;
          }
        }}
      >
        <ProFormText
          width="md"
          name="authorityName"
          label="菜单名称"
          tooltip="最长为 24 位"
          rules={[{ required: true }]}
        />
        <ProFormText
          width="md"
          name="authorityCode"
          label="菜单编号"
          tooltip="将作为菜单的ID，请保持唯一性"
          rules={[{ required: true }]}
        />
        <ProFormRadio.Group
          width={"md"}
          name={"menuType"}
          label="菜单类别"
          initialValue={1}
          rules={[{ required: true }]}
          options={[
            { label: "目录", value: 1 },
            { label: "菜单", value: 0 },
            { label: "按钮", value: 2 },
          ]}
        />
        <ProFormTreeSelect
          label="菜单层级"
          name="parentId"
          width={"md"}
          initialValue={0}
          rules={[{ required: true }]}
          fieldProps={{
            treeDefaultExpandAll: true,
          }}
          request={async () => {
            const res = await MenuApi.getAllMenus();
            return [
              {
                label: "顶级",
                value: 0,
                children: menuTree2dataNode(res.data),
              },
            ];
          }}
        />
        <ProFormDigit
          label="排序"
          name="sort"
          width={"md"}
          initialValue={0}
          rules={[{ required: true }]}
        />
        <ProFormDependency name={["menuType"]}>
          {({ menuType }) => {
            if (menuType === 1) {
              return (
                <>
                  <ProFormText
                    width="md"
                    name="url"
                    label="菜单路径"
                    rules={[{ required: true }]}
                  />
                  <ProForm.Item
                    name="icon"
                    label="菜单图标"
                    rules={[{ required: true }]}
                  >
                    <IconSelectInput />
                  </ProForm.Item>
                </>
              );
            } else if (menuType === 0) {
              return (
                <>
                  <ProFormText
                    width="md"
                    name="url"
                    label="菜单路径"
                    rules={[{ required: true }]}
                  />
                  <ProFormText
                    width="md"
                    name="frontComponents"
                    label="前端组件路径"
                    rules={[{ required: true }]}
                  />
                </>
              );
            } else {
              return (
                <ProFormText
                  width="md"
                  name="buttonCode"
                  label="按钮权限标识"
                  rules={[{ required: true }]}
                />
              );
            }
          }}
        </ProFormDependency>
        <ProFormRadio.Group
          options={[
            { value: 0, label: "隐藏" },
            { value: 1, label: "不隐藏" },
          ]}
          initialValue={1}
          width="md"
          name="showStatus"
          label="是否显示"
        />
      </DrawerForm>
    );
  },
);

export default MenuDrawer;
