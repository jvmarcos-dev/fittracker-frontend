import {
    apiFetch
} from "./apiClient";

export const getRoutines = () => apiFetch('/routines');

export const getRoutineNumber = (number) => apiFetch(`/routines/${number}`)

export const getExercises = () => apiFetch('/exercises')

export const createRoutine = (routineData) => apiFetch("/routines", {
    method: "POST",
    body: JSON.stringify(routineData)
})

export const deleteRoutine = (routine) => apiFetch(`/routines/${routine}`, {
    method: "DELETE"
})