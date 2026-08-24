import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import {
  deleteRoutine,
  getExercises,
  getRoutineNumber,
  updateRoutine,
} from "../services/routineService";
import { Link } from "react-router-dom";
import ExerciseCard from "../components/ExerciseCard";
import TrashIcon from "../components/icons/TrashIcon";
import EditIcon from "../components/icons/EditIcon";
import AddExerciseCard from "../components/AddExerciseCard";
import SelectableExerciseCard from "../components/SelectableExerciseCard";
import { useExerciseSelection } from "../hooks/useExerciseSelection";
import PlayIcon from "../components/icons/PlayIcon";

export default function RoutineDetailPage() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [routine, setRoutine] = useState([]);
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [showExercises, setShowExercises] = useState(false);
  //borrador con los ejercicios para modificar sobre este
  const [draftExercises, setDraftExercises] = useState([]);
  const [draftRoutine, setDraftRoutine] = useState({
    name: "",
    description: "",
  });
  const {
    selectedExercises,
    handleToogleExercise,
    handleExerciseChange,
    isSelected,
  } = useExerciseSelection();
  ///si no está autenticado, lo enviamos al login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    //en caso contrario, recupero las rutinas y las guardo
    getRoutineNumber(id).then((routine) => setRoutine(routine));
  }, [isAuthenticated, navigate, id]);

  const onDelete = async (numberRoutine) => {
    const response = await deleteRoutine(numberRoutine);
    navigate("/dashboard");
    return response;
  };

  const onAdd = () => {
    getExercises().then((exercises) => setExercises(exercises));
    setShowExercises(true);
  };

  const handleSave = async () => {
    try {
      //mapeo de los ejercicios que ya habia en la rutina
      const existingExercises = draftExercises.map((exercise) => ({
        exercise_id: exercise.id,
        target_sets: Number(exercise.pivot?.target_sets || 0),
        target_reps: String(exercise.pivot?.target_reps || ""),
      }));

      //mapeo de los nuevos ejercicios seleccionados
      const newExercises = selectedExercises.map((exercise) => ({
        exercise_id: exercise.exercise_id,
        target_sets: Number(exercise.target_sets || 0),
        target_reps: String(exercise.target_reps || ""),
      }));

      //union de ambas listas de ejercicios y payload final
      const payload = {
        name: draftRoutine.name,
        description: draftRoutine.description,
        exercises: [...existingExercises, ...newExercises],
      };

      const response = await updateRoutine(routine.id, payload);

      //actualizo el estado principal para que se muestre correctamente
      setRoutine(response.routine);
      setIsEditing(false);
      setShowExercises(false);
    } catch (error) {
      console.log("Error al actualizar la rutina", error);
    }
  };

  const handleExerciseFieldChange = (exerciseId, field, value) => {
    setDraftExercises((prev) =>
      prev.map((item) => {
        if (item.id === exerciseId) {
          return {
            ...item,
            pivot: {
              ...item.pivot,
              [field]: value === "" ? "" : value,
            },
          };
        }
        return item;
      }),
    );
  };

  const handleRoutineFieldChange = (field, value) => {
    setDraftRoutine((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeleteExercise = (exerciseId) => {
    setDraftExercises((prev) => prev.filter((item) => item.id !== exerciseId));
  };

  return (
    <div className="routine-detail-container">
      <div style={{ display: "flex" }}>
        <Link
          to="/dashboard"
          className="btn-back"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          ← Volver a mis rutinas
        </Link>

        <div style={{ display: "flex", marginLeft: "auto", gap: "20px" }}>
          <button
            type="button"
            onClick={() => {
              navigate(`/routines/${id}/workout`);
            }}
            className="start-button"
            aria-label={`Comenzar ${routine.name}`}
            title="Comenzar rutina"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <PlayIcon></PlayIcon>Iniciar entrenamiento
          </button>

          <button
            type="button"
            onClick={() => {
              setDraftRoutine({
                name: routine.name,
                description: routine.description || "",
              });
              setIsEditing(!isEditing);
              setDraftExercises(routine.exercises);
            }}
            className="edit-button"
            aria-label="Editar rutina"
            title="Editar"
          >
            <EditIcon></EditIcon>
          </button>

          <button
            type="button"
            onClick={() => onDelete(routine.id)}
            className="delete-button"
            aria-label={`Eliminar ${routine.name}`}
            title="Eliminar"
          >
            <TrashIcon></TrashIcon>
          </button>
        </div>
      </div>

      <div className="routine-header">
        {!isEditing ? (
          <>
            <h1>{routine.name}</h1>
            <p>{routine.description}</p>
          </>
        ) : (
          <div>
            <input
              type="text"
              name="name"
              value={draftRoutine.name}
              placeholder="Nombre de la rutina"
              onChange={(e) => handleRoutineFieldChange("name", e.target.value)}
            />

            <textarea
              name="description"
              value={draftRoutine.description}
              placeholder="Descripción (opcional)"
              onChange={(e) =>
                handleRoutineFieldChange("description", e.target.value)
              }
            />
          </div>
        )}
      </div>

      <div className="exercise-list">
        {(isEditing ? draftExercises : routine.exercises)?.map((exercise) => {
          return (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              edit={isEditing}
              onDelete={() => handleDeleteExercise(exercise.id)}
              onChange={handleExerciseFieldChange}
            ></ExerciseCard>
          );
        })}
        {isEditing && !showExercises && <AddExerciseCard onAdd={onAdd} />}
        {isEditing && showExercises && (
          <div className="exercise-list">
            {exercises
              ?.filter((exercise) => {
                //busco si el ejercicio ya está en la rutina, si es cierto lo descarto
                return !routine.exercises.some(
                  (item) => item.id === exercise.id,
                );
              })
              .map((exercise) => {
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
        )}
      </div>
      {isEditing && <button onClick={handleSave}>Guardar cambios</button>}
    </div>
  );
}
