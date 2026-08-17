import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

function Dashboard({ routines }) {
  const { user } = useContext(AuthContext);
  return (
    <main>
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
