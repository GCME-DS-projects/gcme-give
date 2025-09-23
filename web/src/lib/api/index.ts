import { missionariesApi } from "./missionaries";
import { strategiesApi } from "./strategies";


export const api: {
    missionaries: typeof missionariesApi;
    strategies: typeof strategiesApi,
}={
    missionaries: missionariesApi,
    strategies: strategiesApi,
};

export * from './';