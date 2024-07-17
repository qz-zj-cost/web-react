import { IProjectModel } from "@/models/projectModel";
import { createContext } from "react";

export interface IContextProps {
  projectId: string;
  projectInfo?: IProjectModel;
  getProjectInfo: () => void;
}
export const ProjectContext = createContext<IContextProps>(null as any);
