import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import classNames from "classnames";
import React, { useState } from "react";
import FMenu from "../FMenu";
import styles from "./index.module.scss";

const PREFIX = "f-sider";
const { Sider } = Layout;

const FSider = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => {
    setCollapsed(!collapsed);
  };
  const breakPoint = (broken: boolean) => {
    setCollapsed(broken);
  };
  return (
    <Sider
      width={240}
      breakpoint="lg"
      className={styles[PREFIX]}
      trigger={null}
      collapsible
      collapsed={collapsed}
      onBreakpoint={breakPoint}
      theme="light"
    >
      <div className={styles[`${PREFIX}-main`]}>
        <FMenu />
        <TriggerBtn toggle={toggle} collapsed={collapsed} />
        {!collapsed && (
          <div className={styles[`${PREFIX}-footer`]}>
            {/* 版本：{process.env.VERSION} */}
            版本：1.0
          </div>
        )}
      </div>
    </Sider>
  );
};
type ITriggerBtnProp = {
  collapsed: boolean;
  toggle: () => void;
};
const TriggerBtn = ({ collapsed, toggle }: ITriggerBtnProp) => {
  return (
    <div
      className={classNames(styles[`${PREFIX}-trigger`], {
        [styles["collapse"]]: collapsed,
      })}
    >
      <div className={styles["icon-bg"]} onClick={toggle}>
        {React.createElement(
          collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
          {
            className: styles["icon"],
            onClick: toggle,
          },
        )}
      </div>
    </div>
  );
};
export default FSider;
