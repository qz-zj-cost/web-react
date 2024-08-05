import { IMenuModel } from "@/models/menuModel";
import { RootState } from "@/store";
import { Breadcrumb } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import style from "./index.module.scss";

type IPathItemProps = {
  path?: string;
  name: string;
};

const PREFIX = "f-breadcrumb";

const FBreadcrumb = () => {
  const location = useLocation();
  const { menus } = useSelector((state: RootState) => state.user);
  const { currentProject } = useSelector((state: RootState) => state.project);
  const routerArr = useMemo(() => flattenRoutes(menus), [menus]);
  const breadcrumbs = getBreadcrumbs(routerArr, location.pathname);

  return (
    <div className={style[PREFIX]}>
      <Breadcrumb
        separator={<span>&gt;</span>}
        items={breadcrumbs?.map((e) => {
          return {
            title: e.path ? (
              e.path === location.pathname ? (
                <Link to={location.pathname + location.search}>{e.name}</Link>
              ) : (
                <Link to={e.path}>{e.name}</Link>
              )
            ) : (
              <span>{e.name}</span>
            ),
          };
        })}
      ></Breadcrumb>
      {currentProject &&
        location.pathname === "/project-manage/project/detail" && (
          <div className={style[PREFIX + "-other"]}>
            {/* <span className={style[PREFIX + "-other-gt"]}>/</span> */}
            <span>{`(${currentProject.projectName})`}</span>
          </div>
        )}
    </div>
  );
};
// 将menu列表转成path对应的一维数组
const flattenRoutes = (arr: IMenuModel[]): IPathItemProps[] =>
  arr.reduce(function (prev: IPathItemProps[], item) {
    prev.push({ name: item.name, path: item.path || "/" });
    return prev.concat(
      Array.isArray(item.children) ? flattenRoutes(item.children) : [],
    );
  }, []);
const staticPath = [
  { path: "/", name: "首页" },
  { path: "/info", name: "消息" },
];
const getBreadcrumb = (
  flattenRoutes: IPathItemProps[],
  curSection: string,
  pathSection: string,
) => {
  const matchRoute = flattenRoutes.find((ele) => {
    const { path } = ele;
    return pathSection === path;
  });
  // 返回breadcrumb的值，没有就返回原匹配子路径名
  if (matchRoute) {
    return matchRoute;
  } else {
    return {
      name: staticPath.find((e) => e.path === pathSection)?.name || curSection,
      path: pathSection,
    };
  }
};
const getBreadcrumbs = (flattenRoutes: IPathItemProps[], pathname: string) => {
  // 初始化匹配数组match
  const matches: { name: string; path?: string }[] = [];
  pathname.split("/").reduce((prev, curSection) => {
    // 将最后一个路由部分与当前部分合并，比如当路径为 `/x/xx/xxx` 时，pathSection分别检查 `/x` `/x/xx` `/x/xx/xxx` 的匹配，并分别生成面包屑
    const pathSection = `${prev}/${curSection}`;
    if (curSection) {
      const breadcrumb = getBreadcrumb(flattenRoutes, curSection, pathSection);
      matches.push(breadcrumb);
    }

    return pathSection;
  });
  return matches;
};
export default FBreadcrumb;
