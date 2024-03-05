import { IMenuModel } from "@/models/menuModel";
import { RootState } from "@/store";
import * as icons from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import { isArray } from "lodash";
import React, {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const PREFIX = "f-menu";

const FMenu = () => {
  const { menus } = useSelector((state: RootState) => state.user);
  const [selectKey, setSelectKey] = useState<Array<string>>([]);
  const [, setOpenKeys] = useState<Array<string>>([]); // openKeys
  const navitate = useNavigate();
  const location = useLocation();

  // 根据路由初始化展开菜单
  const initMenuKey = useCallback(
    (path: string) => {
      const arr: string[] = [];
      const findKeys = (menuList: IMenuModel[]) => {
        if (menuList.length === 0 || !path) {
          return;
        }
        for (let i = 0; i < menuList.length; i++) {
          arr.push(menuList[i].id.toString());
          if (menuList[i].path === path) {
            return true;
          }
          if (menuList[i] && menuList[i].children) {
            if (findKeys(menuList[i].children!)) {
              return true;
            } else {
              arr.pop();
            }
          } else {
            arr.pop();
          }
        }
      };

      findKeys(menus);
      if (arr.length > 0) {
        const key = arr.pop();
        setOpenKeys(arr);
        if (key) {
          setSelectKey([key]);
        }
      }
    },
    [menus],
  );

  useEffect(() => {
    initMenuKey(location.pathname);
  }, [location, initMenuKey]);

  const findMenuByKey = (key: string): IMenuModel | null => {
    let result: IMenuModel | null = null;
    const recursion = (items: IMenuModel[]) => {
      for (const item of items) {
        if (item.id.toString() === key) {
          result = item;
        }
        if (result === null && item.children) {
          recursion(item.children);
        }
      }
    };
    recursion(menus);
    return result;
  };
  const menuClick: MenuProps["onClick"] = (e) => {
    const menu = findMenuByKey(e.key);
    setSelectKey([e.key]);
    if (menu && menu.path) {
      const path = menu.path;
      navitate(path);
    }
  };
  const onOpenChange = (keys: Array<any>) => {
    setOpenKeys(keys);
  };
  return (
    <div className={styles[PREFIX]}>
      <Menu
        selectedKeys={selectKey}
        className={styles[`${PREFIX}-content`]}
        // openKeys={openKeys}
        onOpenChange={onOpenChange}
        onClick={menuClick}
        // theme="dark"
        mode="inline"
        items={BuildMenu(menus)}
        style={{ border: "none" }}
      ></Menu>
    </div>
  );
};
function BuildMenu(items?: IMenuModel[]) {
  if (!isArray(items) || items.length === 0) {
    return void 0;
  }
  const nodes: ItemType[] = [];
  for (const item of items) {
    if (item.menuShow === false) continue;
    nodes.push({
      label: BuildMenuTitle(item),
      key: item.id,
      children: BuildMenu(item.children),
    });
  }
  return nodes;
}
function BuildMenuTitle(menu: IMenuModel): ReactNode {
  let icon = null;
  if (menu.icon && (icons as any)[menu.icon]) {
    icon = React.createElement((icons as any)[menu.icon]);
  } else {
    icon = <span className={styles[`${PREFIX}-def__icon`]}>·</span>;
  }
  return (
    <Fragment>
      {icon}
      <span>{menu.name}</span>
    </Fragment>
  );
}
export default FMenu;
