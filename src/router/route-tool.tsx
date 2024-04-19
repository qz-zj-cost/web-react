import { IMenuModel } from "@/models/menuModel";

import { ReactNode, lazy } from "react";
import { Navigate, PathRouteProps, Route } from "react-router-dom";
import { RequireAuth } from "./auth";
import SuspenseView from "./suspense-view";

/**
 *
 * @author Leo
 * @desc 动态生成路由
 * @date 2021-03-30 14:30:23
 */
export const generatorDynamicRouter = (data: IMenuModel[]) => {
  if (!data) return [];
  const routes = buildRouteNode(data);
  return routes;
};
const modules = import.meta.glob([
  "../pages/**",
  "!../pages/login",
  "!../pages/not-found",
]);
const layoutModules = import.meta.glob([
  "../layouts/**",
  "!../layouts/basic-layout",
]);
// 生成路由组件
export const buildRouteNode = (config: Array<IMenuModel>): ReactNode[] => {
  const routes: ReactNode[] = [];
  if (config.length === 0) return [];
  config.forEach((e, sub) => {
    const { component, children, path } = e;
    const DyComponent = component
      ? lazy(
          modules[
            `../pages/${component.replace(/^\/|\/$/g, "")}/index.tsx`
          ] as any,
        )
      : lazy(layoutModules["../layouts/page-layout/index.tsx"] as any);
    const newPath = /^\/.*$/.test(path) ? path : `/${path}`;
    const attirbute: Partial<PathRouteProps> = {
      path: path === "#" ? "/" : newPath,
      element: (
        <RequireAuth>
          <SuspenseView>
            <DyComponent />
          </SuspenseView>
        </RequireAuth>
      ),
      children: children && buildRouteNode(children),
    };
    routes.push(<Route key={sub} {...attirbute} />);
    // } else {
    //   // 无组件url跳过这一层 直接生成子组件
    //   if (children) {
    //     const _node = buildRouteNode(children);
    //     routes = [...routes, ..._node];
    //   }
    // }
  });
  routes.push(
    <Route
      key="redirect"
      index
      element={<Navigate to={config[0].path} replace />}
    ></Route>,
  );
  return routes;
};
