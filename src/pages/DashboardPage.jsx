import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { getRoutines } from "../services/routineService";
import Dashboard from "../components/Dashboard";

export default function DashboardPage() {
  const { isAuthenticated } = useContext(AuthContext);
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

  return <Dashboard routines={routines}></Dashboard>;
}
