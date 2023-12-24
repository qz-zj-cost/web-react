import { FBreadcrumb, FHeader, FSider } from "@/components";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import styles from "./index.module.scss";

const { Content } = Layout;

const PREFIX = "basic-layout";

const BasicLayout = () => {
  // const { info } = useSelector((state: RootState) => state.user);
  // const [loading, setLoading] = useState(false);
  // const dispatch = useDispatch();

  // const getUserInfo = useCallback(async () => {
  //   try {
  //     // const userInfo = await UserApi.getUserInfo();
  //     // const menu = await UserApi.getMenu();
  //     // dispatch(
  //     //   setUserInfo({
  //     //     info: {
  //     //       name: "xxx",
  //     //     },
  //     //     menus: staticRoutes,
  //     //   }),
  //     // );
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // }, [dispatch]);

  // useEffect(() => {
  //   if (info?.firstStatus === 0) {

  //   }
  // }, [info?.firstStatus]);

  return (
    // <Spin spinning={loading}>
    <Layout className={styles[PREFIX]}>
      <FHeader />
      <Layout>
        <FSider />
        <Content className={styles[`${PREFIX}-content`]}>
          <FBreadcrumb />
          <div className={styles[`${PREFIX}-content-main`]}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
    // </Spin>
  );
};

export default BasicLayout;
