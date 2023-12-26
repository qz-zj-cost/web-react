import { App as AntdApp, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import BasicLayout from "./layouts/basic-layout";
import LoginPage from "./pages/login";
import NotFound from "./pages/not-found";
import { RequireAuth } from "./router/auth";
import { generatorDynamicRouter } from "./router/route-tool";
import { RootState } from "./store";

function App() {
  const { menus } = useSelector((state: RootState) => state.user);

  const routes = useMemo(() => {
    return generatorDynamicRouter(menus);
  }, [menus]);

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
