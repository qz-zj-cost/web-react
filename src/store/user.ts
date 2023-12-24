import { IMenuModel } from "@/models/menuModel";
import { IUserModel } from "@/models/userModel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
function filterFeatures(arr: IMenuModel[]) {
  let features: { code: string; eventId?: Key }[] = [];
  const attributes: string[] = [];
  const menus = arr.reduce((pre: IMenuModel[], cur) => {
    if (cur.children && cur.children.length > 0) {
      const obj = filterFeatures(cur.children);
      cur.children = obj.menus;
      features = [...features, ...obj.features];
    }
    if (cur.type === 3) {
      features.push({ code: cur.authCode, eventId: cur.eventId });
    } else if (cur.type === 4) {
      attributes.push(cur.authCode);
    } else {
      pre.push(cur);
    }
    return pre;
  }, []);
  return { menus, features, attributes };
}
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
      const obj = filterFeatures(JSON.parse(JSON.stringify(menus)));
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
});
export const { setUserInfo, signOut, setInfoNum, setToken, setCorpId } =
  userSlice.actions;
export default userSlice.reducer;
