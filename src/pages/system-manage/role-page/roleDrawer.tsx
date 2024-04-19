import MenuApi from "@/apis/menuApi";
import RoleApi from "@/apis/roleApi";
import { MenuListModal } from "@/models/menuModel";
import { PlusOutlined } from "@ant-design/icons";
import {
  DrawerForm,
  ProForm,
  ProFormRadio,
  ProFormText,
} from "@ant-design/pro-components";
import { Button, message } from "antd";
import { DataNode } from "antd/lib/tree";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import MyTreeSelect from "./treeSelect";

const menuTree2dataNode = (list: MenuListModal[]): DataNode[] => {
  return list.map((e) => {
    return {
      title: e.authorityName,
      value: e.authorityId,
      key: e.authorityId,
      children:
        e.children && e.children.length > 0
          ? menuTree2dataNode(e.children)
          : undefined,
    };
  });
};
export type IRoleDrawerRef = {
  onEdit: (e: any) => void;
};
const RoleDrawer = forwardRef<IRoleDrawerRef, { onSuccess: VoidFunction }>(
  ({ onSuccess }, ref) => {
    const [menuTee, setMenuTee] = useState<DataNode[]>();
    const [visible, setVisible] = useState(false);
    const [form] = ProForm.useForm();
    const [type, setType] = useState(0);
    const idRef = useRef<string>();
    useImperativeHandle(
      ref,
      () => ({
        onEdit: (e) => {
          setVisible(true);
          form.setFieldsValue(e);
          idRef.current = e.roleId;
          setType(1);
          // console.log(e);
        },
      }),
      [form],
    );
    useEffect(() => {
      MenuApi.getAllMenus().then((res) => {
        setMenuTee(menuTree2dataNode(res.data));
      });
    }, []);

    return (
      <DrawerForm
        title={type === 0 ? "新建角色" : "编辑角色"}
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
            新建角色
          </Button>
        }
        onFinish={async (values) => {
          try {
            if (type === 0) {
              await RoleApi.addRole(values);
            } else {
              await RoleApi.editRole({
                ...values,
                roleId: idRef.current,
              });
            }
            form.resetFields();
            onSuccess();
            message.success(type === 0 ? "新建角色成功" : "编辑角色成功");
            return true;
          } catch (error) {
            return false;
          }
        }}
      >
        <ProFormText
          width="md"
          name="roleName"
          label="角色名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
          rules={[{ required: true }]}
        />
        <ProForm.Item name="list" label="角色权限" rules={[{ required: true }]}>
          <MyTreeSelect options={menuTee} />
        </ProForm.Item>

        <ProFormText
          width="md"
          name="remark"
          label="备注"
          placeholder="请输入名称"
        />
        <ProFormRadio.Group
          width={"md"}
          name={"dataAuthority"}
          label="数据权限"
          initialValue={1}
          hidden
          rules={[{ required: true }]}
          options={[
            { label: "查看全部", value: 1 },
            { label: "只看本人", value: 2 },
          ]}
        />
      </DrawerForm>
    );
  },
);

export default RoleDrawer;
