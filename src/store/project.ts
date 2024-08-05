import { IProjectModel } from "@/models/projectModel";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type IProjectReducer = {
  currentProject: IProjectModel | null;
};
const initProject: IProjectReducer = {
  currentProject: null,
};
const projectSlice = createSlice({
  name: "project",
  initialState: initProject,
  reducers: {
    setProject: (state, action: PayloadAction<IProjectReducer>) => {
      const { currentProject } = action.payload;
      Object.assign(state, {
        currentProject,
      });
    },
    resetProject: (state) => {
      Object.assign(state, initProject);
    },
  },
});
export const { setProject, resetProject } = projectSlice.actions;
export default projectSlice.reducer;
