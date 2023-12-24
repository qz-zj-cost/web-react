import { ListApi } from "@/utils/https/service";

class ProjectServer extends ListApi {
  url = "/project";
}
const ProjectApi = new ProjectServer();
export default ProjectApi;
