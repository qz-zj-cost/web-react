import UserApi, { IUserData } from "@/apis/userApi";
import { IMenuModel, MenuListModal } from "@/models/menuModel";
import { IUserModel } from "@/models/userModel";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Key } from "react";

type IUserReducer = {
  info: IUserModel | null;
  token: string | null;
  isLogin: boolean;
  infoNum: number;
  menus: IMenuModel[];
  attributes: string[];
  auths: { code: string; eventId?: Key }[];
  corpId: string | null;
};
export const data2MenuModal = (data: MenuListModal[]): IMenuModel[] => {
  return data.map((e) => {
    return {
      id: e.authorityId,
      icon: e.icon,
      name: e.authorityName,
      path: e.url,
      component: e.frontComponents,
      children: e.children ? data2MenuModal(e.children) : void 0,
      menuShow: !!e.showStatus,
      type: e.menuType,
      authCode: e.buttonCode || "",
    };
  });
};
function filterFeatures(arr: IMenuModel[]) {
  let features: { code: string; eventId?: Key }[] = [];
  const attributes: string[] = [];
  const menus = arr.reduce((pre: IMenuModel[], cur) => {
    if (cur.children && cur.children.length > 0) {
      const obj = filterFeatures(cur.children);
      cur.children = obj.menus || [];
      features = [...features, ...obj.features];
    }
    if (cur.type === 2) {
      features.push({ code: cur.authCode, eventId: cur.eventId });
    } else if (cur.type === 3) {
      attributes.push(cur.authCode);
    } else {
      pre.push(cur);
    }
    return pre;
  }, []);
  return { menus, features, attributes };
}
export const getUserInfo = createAsyncThunk(
  "users/getInfo",
  async ({ val }: { val: IUserData }) => {
    try {
      const user = await UserApi.login(val);
      const menu = await UserApi.getMenu(user.data.token);
      return { userInfo: user.data, menus: data2MenuModal(menu.data) };
    } catch (error) {
      return Promise.reject(error);
    }
  },
);
export const getDopUserInfo = createAsyncThunk(
  "users/dopGetInfo",
  async ({ code }: { code: string }) => {
    try {
      const user = await UserApi.dopLogin({ code });
      const menu = await UserApi.getMenu(user.data.token);
      return { userInfo: user.data, menus: data2MenuModal(menu.data) };
    } catch (error) {
      return Promise.reject(error);
    }
  },
);
const initState: IUserReducer = {
  info: null,
  token: null,
  menus: [],
  auths: [],
  attributes: [],
  infoNum: 0,
  isLogin: false,
  corpId: null,
};
const userSlice = createSlice({
  name: "user",
  initialState: initState,
  reducers: {
    setUserInfo: (
      state,
      action: PayloadAction<Pick<IUserReducer, "info" | "menus">>,
    ) => {
      const { info, menus } = action.payload;
      const obj = filterFeatures(menus);
      Object.assign(state, {
        info,
        token: info?.token,
        menus: obj.menus,
        auths: obj.features,
        attributes: obj.attributes,
        isLogin: true,
      });
    },
    setToken: (state, action: PayloadAction<{ token: string }>) => {
      Object.assign(state, { token: action.payload.token, isLogin: true });
    },
    setInfoNum: (state, action: PayloadAction<{ num: number }>) => {
      state.infoNum = action.payload.num;
    },
    signOut: (state) => {
      Object.assign(state, { isLogin: false });
    },
    setCorpId: (state, action: PayloadAction<{ corpId: string }>) => {
      state.corpId = action.payload.corpId;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      const { userInfo, menus } = action.payload;
      const obj = filterFeatures(menus);
      Object.assign(state, {
        info: userInfo,
        token: userInfo?.token,
        menus: obj.menus,
        auths: obj.features,
        attributes: obj.attributes,
        isLogin: true,
      });
    });
  },
});
export const { setUserInfo, signOut, setInfoNum, setToken, setCorpId } =
  userSlice.actions;
export default userSlice.reducer;
