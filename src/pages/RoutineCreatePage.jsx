import { useContext, useEffect, useState } from "react";
import { getExercises } from "../services/routineService";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
export default function RoutineCreatePage() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [exercises, setExercises] = useState();
  const [selectedExerciseIds, setSelectedExerciseIds] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    //en caso contrario, recupero los ejercicios y los guardo
    getExercises().then((exercises) => setExercises(exercises));
  }, [isAuthenticated, navigate]);

  const isSelected = (id) => {
    return selectedExerciseIds.includes(id);
  };

  const handleToogleExercise = (id) => {
    setSelectedExerciseIds((prev) =>
      //compruebo si en el prev (el valor mas reciente del estado) se encuentra el id.
      //en caso de encontrarse como esto se ejecuta al seleccionar la tarjeta,
      // crea un nuevo array conservando todos los elementos excepto este (es decir, lo elimina)
      //en caso contrario, hace una copia del anterior y le añade este nuevo id
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="exercise-list">
      {exercises?.map((exercise) => {
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
                <p>{exercise.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
