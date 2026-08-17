import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth";
import { Link, useNavigate } from "react-router-dom";
import { getRoutines } from "../services/routineService";

export default function DashboardPage() {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const [routines, setRoutines] = useState([]);
  const navigate = useNavigate();

  //si no está autenticado, lo enviamos al login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    //en caso contrario, recupero las rutinas y las guardo
    getRoutines().then((routines) => setRoutines(routines));
  }, [isAuthenticated, navigate]);

  return (
    <main>
      <header>
        <button onClick={() => logout()}>Cerrar sesión</button>
      </header>

      <h2>Rutinas de {user?.name}</h2>

      <div className="routines">
        {routines.map((routine) => {
          return (
            <Link
              to={`/routines/${routine.id}`}
              key={routine.id}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div>
                <h3>{routine.name}</h3>
                <p>{routine.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
