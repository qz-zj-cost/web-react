import UserApi from "@/apis/userApi";
import { IUserModel } from "@/models/userModel";
import { RootState } from "@/store";
import { signOut } from "@/store/user";
import {
  ExclamationCircleOutlined,
  LogoutOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { Avatar, Col, Dropdown, Modal, Row } from "antd";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./index.module.scss";
import Password from "./password";

const PREFIX = "f-header";
const FHeader = () => {
  const dispatch = useDispatch();
  const { info } = useSelector((state: RootState) => state.user);

  const [modal, contextHolder] = Modal.useModal();
  const menus = useMemo(
    () => [
      // {
      //   key: 'user-center',
      //   icon: <UserOutlined className={style[`${PREFIX}-menu-item-icon`]} />,
      //   className: style[`${PREFIX}-menu-item`],
      //   label: <span>个人中心</span>,
      //   onClick: () => {},
      // },
      {
        key: "user-password",
        icon: <UnlockOutlined className={style[`${PREFIX}-menu-item-icon`]} />,
        className: style[`${PREFIX}-menu-item`],
        label: <Password />,
      },
      {
        key: "logout",
        icon: <LogoutOutlined className={style[`${PREFIX}-menu-item-icon`]} />,
        className: style[`${PREFIX}-menu-item`],
        label: <span>退出登录</span>,
        onClick: () => {
          modal.confirm({
            title: "注销",
            icon: <ExclamationCircleOutlined />,
            content: "确定退出此账号么",
            onOk() {
              return UserApi.logout()
                .then(() => {
                  dispatch(signOut());
                  // history.push('/login');
                })
                .catch(() => {
                  dispatch(signOut());
                });
            },
          });
        },
      },
    ],
    [dispatch, modal],
  );
  return (
    <div className={style[PREFIX]}>
      <Row justify="space-between">
        <Col span={16}>
          <div className={style[`${PREFIX}-logo`]}>
            华东公司BIM+成本管控系统
          </div>
        </Col>
        <Col span={8} style={{ textAlign: "right" }}>
          <div className={style[`${PREFIX}-account`]}>
            <span style={{ marginLeft: 30 }}>
              <Dropdown menu={{ items: menus }} arrow placement="bottomRight">
                <div className={style[`${PREFIX}-user`]}>
                  {/* <Avatar src={info.avatar && info.avatar[0] && info.avatar[0].fileUrl} /> */}
                  <AvatarView info={info} />
                  <span className={style[`${PREFIX}-name`]}>{info?.name}</span>
                </div>
              </Dropdown>
            </span>
          </div>
        </Col>
      </Row>
      {contextHolder}
    </div>
  );
};
export const AvatarView = ({ info }: { info: IUserModel | null }) => {
  // if (info && info.avatar)
  //   return (
  //     <Avatar src={<Image src={getUrl(info.avatar)} fallback={errorImage} />} />
  //   );
  return (
    <Avatar style={{ backgroundColor: "#00A3FF", verticalAlign: "middle" }}>
      {info?.name?.split("")[0]}
    </Avatar>
  );
};

export default FHeader;
