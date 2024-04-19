import * as icons from "@ant-design/icons";
import { Button, Modal, Row, Tabs } from "antd";
import { Tab } from "rc-tabs/lib/interface";
import React, { CSSProperties, useEffect, useState } from "react";
import { iconData } from "./icons";

const IconSelectModel: React.FC<{
  value?: string;
  onChange?: (val: string) => void;
  visible: boolean;
  onCancel: () => void;
}> = ({ value = "", onChange, visible, onCancel }) => {
  const [currentIcon, setCurrentIcon] = useState<string>(value);
  const [viewData, setViewData] = useState<Tab[]>([]);

  useEffect(() => {
    // 定义风格分类数据
    const styleData: Tab[] = [];
    iconData.forEach((styleItem) => {
      // 定义图标分类数据
      const typeData: Tab[] = [];
      // 遍历展示各个图标分类
      const typeIcons = styleItem.icons;
      typeIcons.filter((typeItem) => {
        // 将各分类下的图标遍历到页面
        const childData = typeItem.icons;
        typeData.push({
          key: typeItem.key,
          label: typeItem.title,
          children: (
            <>
              {childData.map((item) => {
                return (
                  <Button key={item} onClick={() => change(item)} type="text">
                    <Icon name={item} style={{ fontSize: 20 }} />
                  </Button>
                );
              })}
            </>
          ),
        });
      });

      styleData.push({
        key: styleItem.key,
        label: styleItem.title,
        children: <Tabs items={typeData} />,
      });
    });
    setViewData(styleData);
  }, []);

  const change = (value: string) => {
    setCurrentIcon(value);
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={() => {
        onChange?.(currentIcon);
        onCancel();
      }}
      closable={false}
      width={"50vw"}
      title="图标选择"
      destroyOnClose
    >
      <Tabs items={viewData} />
      <Row style={{ paddingTop: "30px" }}>
        当前选择图标：
        {currentIcon ? (
          <>
            <Icon name={currentIcon} /> {currentIcon}
          </>
        ) : (
          ""
        )}
      </Row>
    </Modal>
  );
};

export const Icon = (props: { name: string; style?: CSSProperties }) => {
  const { name, style } = props;
  const antIcon: { [key: string]: any } = icons;
  return React.createElement(antIcon[name], { style });
};

export default IconSelectModel;
