import { missionariesApi } from "./missionaries";
import { ProjectsApi  } from "./projects";
import { strategiesApi } from "./strategies";
import { paymentApi } from './payment';


export const api: {
    missionaries: typeof missionariesApi;
    strategies: typeof strategiesApi;
    projects: typeof ProjectsApi;
    payment: typeof paymentApi;
}={
    missionaries: missionariesApi,
    strategies: strategiesApi,
    projects: ProjectsApi,
    payment: paymentApi,
};

export * from './';