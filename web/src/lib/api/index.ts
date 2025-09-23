import { missionariesApi } from "./missionaries";
import { ProjectsApi  } from "./projects";
import { strategiesApi } from "./strategies";


export const api: {
    missionaries: typeof missionariesApi;
    strategies: typeof strategiesApi;
    projects: typeof ProjectsApi;
}={
    missionaries: missionariesApi,
    strategies: strategiesApi,
    projects: ProjectsApi,
};

export * from './';