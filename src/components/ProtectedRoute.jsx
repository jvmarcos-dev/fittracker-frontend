import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <p>Cargando sesión...</p>; // Espera a verificar el token de localStorage

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
