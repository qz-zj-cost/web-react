import { App as AntdApp, ConfigProvider, Spin } from "antd";
import zhCN from "antd/locale/zh_CN";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import UserApi from "./apis/userApi";
import BasicLayout from "./layouts/basic-layout";
import LoginPage from "./pages/login";
import NotFound from "./pages/not-found";
import { RequireAuth } from "./router/auth";
import menuConfigs from "./router/menu-config";
import { generatorDynamicRouter } from "./router/route-tool";
import { RootState } from "./store";
import { setUserInfo } from "./store/user";

function App() {
  const { menus } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const getQueryVariable = useCallback((variable: string) => {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  }, []);

  useEffect(() => {
    const code = getQueryVariable("code");
    if (code) {
      UserApi.dopLogin({ code })
        .then((res) => {
          dispatch(
            setUserInfo({
              info: res.data,
              menus: menuConfigs,
            }),
          );
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [dispatch, getQueryVariable]);

  const routes = useMemo(() => {
    return generatorDynamicRouter(menus);
  }, [menus]);
  if (loading)
    return (
      <Spin spinning={loading}>
        <div style={{ width: "100vw", height: "100vh" }}></div>
      </Spin>
    );

  return (
    <ConfigProvider
      locale={zhCN}
      theme={
        {
          // token: {
          //   colorPrimary: "#89b91d",
          //   colorInfo: "#89b91d",
          //   colorInfoText: "#89b91d",
          //   colorPrimaryText: "#89b91d",
          // },
        }
      }
    >
      <AntdApp>
        <div className="app" id="app">
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route
                path="/"
                element={
                  <RequireAuth>
                    <BasicLayout />
                  </RequireAuth>
                }
              >
                {routes}
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
