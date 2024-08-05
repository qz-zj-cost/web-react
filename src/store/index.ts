import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import ProjectReducer from "./project";
import UserReducer from "./user";

const persistConfig = {
  key: "qz-lb-project",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, UserReducer);
const store = configureStore({
  reducer: {
    user: persistedReducer,
    project: ProjectReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export type RootState = ReturnType<typeof store.getState>;

export default store;
