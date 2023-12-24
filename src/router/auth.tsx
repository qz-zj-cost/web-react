import store from "@/store";
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * @description
 * 封装拦截组件,如果已登录，返回包括的children组件；
 * 未登录，返回 <Navigate to="/login" /> 组件跳转到登录页面。
 *
 * @example
 * <RequireAuth>
 *   <ComponentNeedAuth />
 * </RequireAuth>
 */
export function RequireAuth({
  children,
  auth = true,
}: {
  children: React.ReactElement;
  auth?: boolean;
}) {
  if (!auth) return children;
  const { isLogin } = store.getState().user;
  return isLogin ? children : <Navigate to={"/login"} replace />;
}
