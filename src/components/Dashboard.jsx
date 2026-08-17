import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { useContext } from "react";

function Dashboard({ routines }) {
  const { user, logout } = useContext(AuthContext);
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

export default Dashboard;
