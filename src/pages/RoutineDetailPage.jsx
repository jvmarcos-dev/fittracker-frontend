import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { deleteRoutine, getRoutineNumber } from "../services/routineService";
import { Link } from "react-router-dom";
import ExerciseCard from "../components/ExerciseCard";

export default function RoutineDetailPage() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [routine, setRoutine] = useState([]);
  const { id } = useParams();

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

  return (
    <div className="routine-detail-container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link
          to="/dashboard"
          className="btn-back"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          ← Volver a mis rutinas
        </Link>

        <button
          type="button"
          onClick={() => onDelete(routine.id)}
          className="delete-button"
          aria-label={`Eliminar ${routine.name}`}
          title="Eliminar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>

      <h2>{routine.name}</h2>
      <p>{routine.description}</p>

      <div className="exercise-list">
        {routine.exercises?.map((exercise) => {
          return (
            <ExerciseCard key={exercise.id} exercise={exercise}></ExerciseCard>
          );
        })}
      </div>
    </div>
  );
}
