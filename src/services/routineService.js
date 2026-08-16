import {
    apiFetch
} from "./apiClient";

export const getRoutines = () => apiFetch('/routines');