import { useContext, useEffect, useState } from "react";
import { createRoutine, getExercises } from "../services/routineService";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import SelectableExerciseCard from "../components/SelectableExerciseCard";
import { useExerciseSelection } from "../hooks/useExerciseSelection";

const initialFormState = {
  name: "",
  description: "",
  exercises: [
    {
      exercise_id: "",
      target_sets: "",
      target_reps: "",
    },
  ],
};

export default function RoutineCreatePage() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [exercises, setExercises] = useState();
  const {
    selectedExercises,
    setSelectedExercises,
    isSelected,
    handleToogleExercise,
    handleExerciseChange,
  } = useExerciseSelection();
  const handleCreateRoutine = async (formData) => {
    const payload = {
      ...formData, //name y description
      exercises: selectedExercises,
    };

    const response = await createRoutine(payload);
    setSelectedExercises([]);
    return response;
  };
  const { formData, handleChange, handleSubmit, result } = useForm(
    { name: "", description: "" },
    handleCreateRoutine,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    //en caso contrario, recupero los ejercicios y los guardo
    getExercises().then((exercises) => setExercises(exercises));
  }, [isAuthenticated, navigate]);

  //esta funcion servia para guardar ids, ahora que guardo objetos al pasar las reps ya no sirve
  /*const handleToogleExercise = (id) => {
    setSelectedExerciseIds((prev) =>
      //compruebo si en el prev (el valor mas reciente del estado) se encuentra el id.
      //en caso de encontrarse como esto se ejecuta al seleccionar la tarjeta,
      // crea un nuevo array conservando todos los elementos excepto este (es decir, lo elimina)
      //en caso contrario, hace una copia del anterior y le añade este nuevo id
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };*/

  return (
    <>
      {result && <p>{result.message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Routine name"
        ></input>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Routine description"
        ></textarea>

        <div className="exercise-list">
          {exercises?.map((exercise) => {
            return (
              <SelectableExerciseCard
                key={exercise.id}
                exercise={exercise}
                isSelected={isSelected(exercise.id)}
                currentData={selectedExercises.find(
                  (item) => item.exercise_id === exercise.id,
                )}
                onToogle={() => handleToogleExercise(exercise.id)}
                onChange={handleExerciseChange}
              ></SelectableExerciseCard>
            );
          })}
        </div>
        <button type="submit">Guardar rutina</button>
      </form>
    </>
  );
}
