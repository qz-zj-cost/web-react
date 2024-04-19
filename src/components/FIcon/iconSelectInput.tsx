import { SettingOutlined } from "@ant-design/icons";
import { ProFormText } from "@ant-design/pro-components";
import { useState } from "react";
import IconSelectModel, { Icon } from "./iconSelectModel";

const IconSelectInput = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (v: string) => void;
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <ProFormText
        width={"md"}
        // allowClear
        fieldProps={{
          value: value,
          readOnly: true,
          prefix: value ? <Icon name={value} /> : <></>,
          addonAfter: <SettingOutlined onClick={() => setVisible(true)} />,
        }}
        placeholder={"请选择图标"}
      />
      <IconSelectModel
        visible={visible}
        onChange={onChange}
        value={value}
        onCancel={() => setVisible(false)}
      />
    </div>
  );
};

export default IconSelectInput;
