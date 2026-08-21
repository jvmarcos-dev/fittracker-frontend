import {
    useState
} from "react";

export function useExerciseSelection() {
    const [selectedExercises, setSelectedExercises] = useState([]);

    const isSelected = (id) => {
        //includes se usa cuando hay un array, some para objetos
        //return selectedExercises.includes(id);

        return selectedExercises.some((item) => item.exercise_id === id);
    };

    const handleToogleExercise = (id) => {
        setSelectedExercises((prev) => {
            //comprobamos si ya existe algun objeto con ese ID
            const exists = prev.some((item) => item.exercise_id === id);

            if (exists) {
                //si ya estaba, lo quitamos
                return prev.filter((item) => item.exercise_id !== id);
            } else {
                //si no estaba, lo añadimos
                return [...prev, {
                    exercise_id: id,
                    target_sets: "",
                    target_reps: ""
                }];
            }
        });
    };

    const handleExerciseChange = (id, field, value) => {
        setSelectedExercises((prev) =>
            prev.map((item) => {
                //recorro los ejercicios
                if (item.exercise_id === id) {
                    //al ejercicio actual creo una copia exacta y le modifico un unico campo (field dinamico)
                    //el ternario interno hace que si el usuario borro todo, deja el valor vacio
                    //si hay un numero escrito lo convierte a numero mediante un cast
                    return {
                        ...item,
                        [field]: field === "target_sets" ?
                            value === "" ?
                            "" :
                            Number(value) : String(value),
                    };
                }
                return item;
            }),
        );
    };

    return ({
        selectedExercises,
        setSelectedExercises,
        isSelected,
        handleToogleExercise,
        handleExerciseChange
    })
}