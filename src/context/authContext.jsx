import { createContext, useEffect, useState } from "react";
import { userData } from "../services/authService";

//1. Crear el contexto
//este es el contexto que tenemos que consumir
export const AuthContext = createContext();

//2. Crear el Provider, para proveer el contexto. Es un componente de react que envuelve el children
//este es el que nos provee de acceso al contexto
export function AuthProvider({ children }) {
  //almacena el objeto con los datos del usuario devueltos por el backend
  const [user, setUser] = useState(null);
  //almacena el access_token.
  // Se inicializa con localstorage para que la sesión no se pierda si el usuario pulsa F5 o recarga la página
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null,
  );

  const [loading, setLoading] = useState(true);
  //indica si hay una sesión activa
  const isAuthenticated = Boolean(token);
  function login(newToken, newUser) {
    if (!newToken) {
      console.error(
        "Intento de login fallido: no se proporcionó un token válido.",
      );
      return;
    }
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);
    console.log(newUser);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    userData()
      .then((user) => {
        setUser(user);
      })
      .catch((error) => {
        console.log("Token invalido o expirado", error);
        //en caso de producirse algun error con el token, cierro sesion
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
