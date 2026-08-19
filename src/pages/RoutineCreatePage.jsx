import { useContext, useEffect, useState } from "react";
import { createRoutine, getExercises } from "../services/routineService";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";

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
  const [selectedExercises, setSelectedExercises] = useState([]);
  const handleCreateRoutine = async (formData) => {
    const payload = {
      ...formData, //name y description
      exercises: selectedExercises,
    };

    return await createRoutine(payload);
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

  const isSelected = (id) => {
    //includes se usa cuando hay un array, some para objetos
    //return selectedExercises.includes(id);

    return selectedExercises.some((item) => item.exercise_id === id);
  };

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

  const handleToogleExercise = (id) => {
    setSelectedExercises((prev) => {
      //comprobamos si ya existe algun objeto con ese ID
      const exists = prev.some((item) => item.exercise_id === id);

      if (exists) {
        //si ya estaba, lo quitamos
        return prev.filter((item) => item.exercise_id !== id);
      } else {
        //si no estaba, lo añadimos
        return [...prev, { exercise_id: id, target_sets: "", target_reps: "" }];
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
            [field]:
              field === "target_sets"
                ? value === ""
                  ? ""
                  : Number(value)
                : String(value),
          };
        }
        return item;
      }),
    );
  };

  return (
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
          const currentExercise = selectedExercises.find(
            (item) => item.exercise_id === exercise.id,
          );
          return (
            <div
              key={exercise.id}
              onClick={() => handleToogleExercise(exercise.id)}
              style={{ cursor: "pointer" }}
              className={`exercise-card-selectable ${isSelected(exercise.id) ? "selected" : ""}`}
            >
              <div className="exercise-card-header">
                <h4>{exercise.name}</h4>
                <input
                  type="checkbox"
                  checked={isSelected(exercise.id)}
                  onChange={() => {}}
                ></input>
                <div>
                  <h5>{exercise.muscle_group}</h5>
                  {isSelected(exercise.id) && (
                    //este onClick sirve para que al pulsar sobre el campo no se deseleccione
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <input
                        name="target_sets"
                        placeholder="Sets"
                        type="text"
                        value={currentExercise?.target_sets ?? ""}
                        onChange={(e) =>
                          handleExerciseChange(
                            exercise.id,
                            "target_sets",
                            e.target.value,
                          )
                        }
                      ></input>
                      <input
                        name="target_reps"
                        placeholder="Reps"
                        type="text"
                        value={currentExercise?.target_reps ?? ""}
                        onChange={(e) =>
                          handleExerciseChange(
                            exercise.id,
                            "target_reps",
                            e.target.value,
                          )
                        }
                      ></input>
                    </div>
                  )}
                  <p>{exercise.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button type="submit">Guardar rutina</button>
    </form>
  );
}
