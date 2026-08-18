import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { getRoutineNumber } from "../services/routineService";
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

  return (
    <div className="routine-detail-container">
      <Link
        to="/dashboard"
        className="btn-back"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        ← Volver a mis rutinas
      </Link>
      <h2>{routine.name}</h2>
      <p>{routine.description}</p>

      <div className="exercise-list">
        {routine.exercises?.map((exercise) => {
          return <ExerciseCard exercise={exercise}></ExerciseCard>;
        })}
      </div>
    </div>
  );
}
