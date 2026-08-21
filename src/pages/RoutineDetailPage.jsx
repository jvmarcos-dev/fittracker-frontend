import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import {
  deleteRoutine,
  getExercises,
  getRoutineNumber,
} from "../services/routineService";
import { Link } from "react-router-dom";
import ExerciseCard from "../components/ExerciseCard";
import TrashIcon from "../components/icons/TrashIcon";
import EditIcon from "../components/icons/EditIcon";
import AddExerciseCard from "../components/AddExerciseCard";
import SelectableExerciseCard from "../components/SelectableExerciseCard";

export default function RoutineDetailPage() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [routine, setRoutine] = useState([]);
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [showExercises, setShowExercises] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState([]);

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
              setIsEditing(!isEditing);
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

      <h2>{routine.name}</h2>
      <p>{routine.description}</p>

      <div className="exercise-list">
        {routine.exercises?.map((exercise) => {
          return (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              edit={isEditing}
            ></ExerciseCard>
          );
        })}
        {isEditing && !showExercises && <AddExerciseCard onAdd={onAdd} />}
        {isEditing && showExercises && (
          <div className="exercise-list">
            {exercises?.map((exercise) => {
              return (
                <SelectableExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  isSelected={{}}
                  currentData={selectedExercises.find(
                    (item) => item.exercise_id === exercise.id,
                  )}
                  onToogle={() => {}}
                  onChange={{}}
                ></SelectableExerciseCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
