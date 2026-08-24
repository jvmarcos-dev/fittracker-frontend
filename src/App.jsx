import "./styles/App.css";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RoutineDetailPage from "./pages/RoutineDetailPage";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import RoutineCreatePage from "./pages/RoutineCreatePage";
import WorkoutPage from "./pages/WorkoutPage";

function App() {
  const { logout, isAuthenticated } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Link
          to="/dashboard"
          style={{
            textDecoration: "none",
            color: "inherit",
            marginBlock: "0.83rem",
            fontSize: "1.50em",
            fontWeight: "bold",
          }}
        >
          Fittracker
        </Link>
        {isAuthenticated ? (
          <div
            style={{
              display: "flex",
              height: "50px",
              marginBottom: "0",
              marginTop: "auto",
              gap: "20px",
            }}
          >
            <Link
              to="/routines/new"
              className="btn-primary"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Registrar rutina
            </Link>
            <button className="btn-secondary" onClick={() => logout()}>
              Cerrar sesión
            </button>
          </div>
        ) : (
          ""
        )}
      </header>
      <Routes>
        {/*Ruta para el formulario de login/registro*/}
        <Route
          //path dice cuando se activa esta regla, en este caso se activa cuando estas en login
          path="/login"
          element={<LoginPage></LoginPage>}
        ></Route>

        {/* Ruta para el dashboard principal */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage></DashboardPage>
            </ProtectedRoute>
          }
        ></Route>

        {/*Ruta para la vista de detalle de cada rutina*/}
        <Route path="/routines/:id" element={<RoutineDetailPage />} />
        <Route
          path="/routines/new"
          element={<RoutineCreatePage></RoutineCreatePage>}
        ></Route>
        <Route path="/routines/:id/workout" element={<WorkoutPage />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
