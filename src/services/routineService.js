import {
    apiFetch
} from "./apiClient";

export const getRoutines = () => apiFetch('/routines');

export const getRoutineNumber = (number) => apiFetch(`/routines/${number}`)