import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RoutineDetailPage from "./pages/RoutineDetailPage";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";

function App() {
  const { logout, isAuthenticated } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <header>
        <h1>Fittracker</h1>
        {isAuthenticated ? (
          <button onClick={() => logout()}>Cerrar sesión</button>
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

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
